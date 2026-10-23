#!/usr/bin/env node
// check-referent.mjs: the reality gate's check of spec R6 and R6a (documentary items
// checked against their referent): stale pointers and omissions of one document against
// its referent's listing (list-referent.mjs, spec R5). Node, no dependency; spawns no
// process. Also the --selftest suite of both scripts.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { listReferent, main as listMain, byteCompare, isMainModule, STDIO } from './list-referent.mjs';

export const HELP = `Usage: node check-referent.mjs --document <file> (--referent <folder> | --listing <file>) [--allow <path>]...
       node check-referent.mjs --selftest
       node check-referent.mjs --help

Checks one document against its referent (spec R6, R6a). The document's fenced
code blocks are stripped first; then every backticked span is taken and two
things are decided:

  stale  A span is a candidate pointer when its first path segment is the
         referent's name or a top-level member of the listing; a span holding
         whitespace, <, > or *, or starting with -, / or ., is not one. The
         referent's name in front and trailing slashes are stripped; a candidate
         that names no listed folder or file prints "stale <span>".
  omits  Every member of the referent's top level, and of every folder the
         document names by its full path from the referent's root (in the
         text, bounded by characters that are not part of a path, backticked
         or not, a trailing slash or none), must be named. A member is named
         when its path appears in the text so bounded, or when its last
         segment is a backticked span (a trailing slash ignored); a
         last-segment span names that member but makes no folder's members
         tested. An unnamed member prints "omits <path>", a folder with a
         trailing slash.

  --document <file>    the document to check
  --referent <folder>  list the folder in-process, as list-referent.mjs does;
                       the referent's name is the folder's last segment
  --listing <file>     a listing of any provenance in list-referent.mjs's line
                       form; the referent's name is <name> when the file is
                       named referent-<name>.txt, else there is none
  --allow <path>       repeatable; removes one member, a path relative to the
                       referent's root with or without a trailing slash, from
                       the omission test
  --selftest           build a fixture under the system temporary folder (kept),
                       run the controls and mutants, one line each, then
                       OK selftest
  --help               print this text

Output: "OK referent" and exit 0 when nothing is found; otherwise the omits
lines, then the stale lines, each sorted bytewise, then "FAIL referent", exit 1.
A usage or read error: a message on stderr, exit 2. Reads the document and the
listing, or the folder as list-referent.mjs reads it; opens no connection; reads
no credential; writes nothing.
`;

const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
const lastSegment = (p) => p.slice(p.lastIndexOf('/') + 1);
const parentOf = (p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '');

// The listing's folders and files, each path without a trailing slash.
export function parseListing(text) {
  const entries = [];
  text.split('\n').forEach((line, i) => {
    if (line === '' || line.startsWith('  ')) return;
    let m = /^dir (.+)\/$/.exec(line);
    if (m) { entries.push({ p: m[1], dir: true }); return; }
    m = /^file (.+)$/.exec(line);
    if (m) { entries.push({ p: m[1], dir: false }); return; }
    throw new Error(`listing line ${i + 1} is not "dir <path>/", "file <path>" or an indented first line: ${line}`);
  });
  return entries;
}

// The text with every fenced code block (``` or ~~~) blanked, line count kept.
export function stripFences(text) {
  const out = [];
  let fence = null;
  for (const line of text.split('\n')) {
    const m = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence === null) {
      if (m && !(m[1][0] === '`' && m[2].includes('`'))) { fence = { ch: m[1][0], len: m[1].length }; out.push(''); }
      else out.push(line);
    } else {
      if (m && m[1][0] === fence.ch && m[1].length >= fence.len && m[2].trim() === '') fence = null;
      out.push('');
    }
  }
  return out.join('\n');
}

// Every backticked span, its content trimmed; a span never crosses a blank line.
export function backtickSpans(text) {
  const spans = [];
  const n = text.length;
  let i = 0;
  while (i < n) {
    if (text[i] !== '`') { i++; continue; }
    let j = i;
    while (j < n && text[j] === '`') j++;
    const len = j - i;
    let k = j;
    let close = -1;
    while (k < n) {
      if (text[k] !== '`') { k++; continue; }
      let m = k;
      while (m < n && text[m] === '`') m++;
      if (m - k === len) { close = k; break; }
      k = m;
    }
    const body = close < 0 ? '' : text.slice(j, close);
    if (close < 0 || /\n[ \t]*\n/.test(body)) { i = j; continue; }
    spans.push(body.replace(/\n/g, ' ').trim());
    i = close + len;
  }
  return spans;
}

// The findings of one document against one listing, sorted: omits first, then stale.
export function check({ documentText, listingText, name = null, allow = [] }) {
  const entries = parseListing(listingText);
  const listed = new Set(entries.map((e) => e.p));
  const children = new Map();
  for (const e of entries) {
    const parent = parentOf(e.p);
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(e);
  }
  const topLevel = new Set((children.get('') || []).map((e) => e.p));
  const doc = stripFences(documentText.replace(/\r\n?/g, '\n'));
  const spans = [...new Set(backtickSpans(doc))];
  const spanNames = new Set(spans.map((s) => s.replace(/\/+$/, '')));
  const occurs = (p) => new RegExp('(?<![A-Za-z0-9_.\\-])' + reEscape(p) + '(?![A-Za-z0-9_\\-]|\\.[A-Za-z0-9])').test(doc);
  const named = (p) => spanNames.has(lastSegment(p)) || occurs(p);
  const allowed = new Set(allow.map((a) => a.replace(/^\.\//, '').replace(/\/+$/, '')));

  const omits = [];
  // A folder's members are tested only when the document names that folder by its full path.
  const folders = [''].concat(entries.filter((e) => e.dir && occurs(e.p)).map((e) => e.p));
  for (const f of folders) {
    for (const e of children.get(f) || []) {
      if (allowed.has(e.p) || named(e.p)) continue;
      omits.push(e.dir ? e.p + '/' : e.p);
    }
  }

  const stale = [];
  for (const s of spans) {
    if (s === '' || /\s/.test(s) || /[<>*]/.test(s) || /^[-/.]/.test(s)) continue;
    const bare = s.replace(/\/+$/, '');
    const segs = bare.split('/');
    const tries = [];
    if (name !== null && segs[0] === name) tries.push(segs.slice(1).join('/'));
    if (topLevel.has(segs[0])) tries.push(bare);
    if (tries.length === 0) continue;
    if (!tries.some((t) => t === '' || listed.has(t))) stale.push(s);
  }

  omits.sort(byteCompare);
  stale.sort(byteCompare);
  return [...omits.map((p) => 'omits ' + p), ...stale.map((s) => 'stale ' + s)];
}

export const render = (findings) => (findings.length ? findings.join('\n') + '\nFAIL referent\n' : 'OK referent\n');

export async function main(argv, io = STDIO) {
  const usage = (msg) => { io.err(`check-referent: ${msg}\nRun with --help for usage.\n`); return 2; };
  let document = null;
  let referent = null;
  let listing = null;
  const allow = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { io.out(HELP); return 0; }
    if (a === '--selftest') return selftest(io);
    if (!['--document', '--referent', '--listing', '--allow'].includes(a)) return usage(`unknown argument ${a}`);
    if (i + 1 >= argv.length) return usage(`${a} takes a value`);
    const v = argv[++i];
    if (a === '--allow') { allow.push(v); continue; }
    if (a === '--document') { if (document !== null) return usage('one --document only'); document = v; }
    if (a === '--referent') { if (referent !== null) return usage('one --referent only'); referent = v; }
    if (a === '--listing') { if (listing !== null) return usage('one --listing only'); listing = v; }
  }
  if (document === null) return usage('--document <file> is required');
  if ((referent === null) === (listing === null)) return usage('give one of --referent <folder> or --listing <file>');
  let findings;
  try {
    const documentText = fs.readFileSync(document, 'utf8');
    let listingText;
    let name;
    if (referent !== null) { listingText = listReferent(referent); name = path.basename(path.resolve(referent)); }
    else {
      listingText = fs.readFileSync(listing, 'utf8');
      const m = /^referent-(.+)\.txt$/.exec(path.basename(listing));
      name = m ? m[1] : null;
    }
    findings = check({ documentText, listingText, name, allow });
  } catch (e) { io.err(`check-referent: ${e.message}\n`); return 2; }
  io.out(render(findings));
  return findings.length ? 1 : 0;
}

// ---- the selftest of both scripts: one fixture under mkdtemp, kept, never removed ----

function buildFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'referent-'));
  const ref = path.join(dir, 'register');
  const plain = path.join(dir, 'plain');
  const put = (base, rel, body) => {
    const p = path.join(base, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  };
  put(ref, '.git/HEAD', 'ref: refs/heads/main\n');
  put(ref, '.gitignore', '# kept out of the listing\nscratch/\n*.log\n!keep.log\n');
  put(ref, 'CLAUDE.md', 'The fixture register: one folder per item.\nA second line the listing does not carry.\n');
  put(ref, 'README.md', '# Fixture register\n');
  put(ref, 'keep.log', 'kept by the negation\n');
  put(ref, 'build.log', 'ignored by *.log\n');
  put(ref, 'scratch/notes.txt', 'ignored by scratch/\n');
  put(ref, 'docs/.gitignore', '/draft.md\n');
  put(ref, 'docs/terms.md', '# Terms\n');
  put(ref, 'docs/draft.md', 'ignored by docs/.gitignore\n');
  put(ref, 'todo/CLAUDE.md', 'The todo sub-register.\n');
  put(ref, 'todo/first-item/todo.md', '# First item\n');
  put(ref, 'todo/archive/old-item/todo.md', '# Old item\n');
  fs.mkdirSync(path.join(ref, 'empty'));
  put(plain, '.gitignore', 'scratch/\n');
  put(plain, 'scratch/notes.txt', 'listed: no repository here\n');
  fs.mkdirSync(path.join(plain, 'empty'));
  const full = [
    '# The fixture register',
    '',
    'The register at `register/` keeps its law in `CLAUDE.md` and its overview in `README.md`; its `.gitignore` keeps `scratch/` and the logs out, except `keep.log`.',
    '',
    '- `docs/` holds `docs/terms.md` and its own `docs/.gitignore`.',
    '- `todo/` holds `todo/CLAUDE.md`, the open item `todo/first-item/` with its `todo/first-item/todo.md`, and `todo/archive/`, where `todo/archive/old-item/` keeps `todo/archive/old-item/todo.md`.',
    '',
    '```text',
    '`todo/ghost-in-fence/` sits inside a fence and is not read.',
    '```',
    '',
  ].join('\n');
  const docs = {
    full,
    missing: full.replace(' and its overview in `README.md`', ''),
    stale: full + '- `todo/missing-item/` was never filed; `register/docs/gone.md` was never written.\n',
  };
  for (const [k, body] of Object.entries(docs)) fs.writeFileSync(path.join(dir, `doc-${k}.md`), body);
  return { dir, ref, plain, doc: (k) => path.join(dir, `doc-${k}.md`) };
}

const EXPECTED_LISTING = [
  'file .gitignore',
  'file CLAUDE.md',
  '  The fixture register: one folder per item.',
  'file README.md',
  'dir docs/',
  'file docs/.gitignore',
  'file docs/terms.md',
  'file keep.log',
  'dir todo/',
  'file todo/CLAUDE.md',
  '  The todo sub-register.',
  'dir todo/archive/',
  'dir todo/archive/old-item/',
  'file todo/archive/old-item/todo.md',
  'dir todo/first-item/',
  'file todo/first-item/todo.md',
  '',
].join('\n');

function snapshot(dir) {
  const m = new Map();
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const a = path.join(d, e.name);
      if (e.isDirectory()) { m.set(a + '/', 'dir'); walk(a); }
      else { const s = fs.lstatSync(a); m.set(a, `${s.size}:${s.mtimeMs}`); }
    }
  };
  walk(dir);
  return m;
}

const pathsOf = (listing) => listing.split('\n').filter((l) => l !== '' && !l.startsWith('  ')).map((l) => l.replace(/^(dir|file) /, ''));
const isSorted = (listing) => { const p = pathsOf(listing); return p.every((x, i) => i === 0 || byteCompare(p[i - 1], x) < 0); };

async function run(fn, argv) {
  let out = '';
  let err = '';
  const code = await fn(argv, { out: (s) => { out += s; }, err: (s) => { err += s; } });
  return { code, out, err };
}

export async function selftest(io = STDIO) {
  let failed = 0;
  const line = (ok, kind, name, detail) => {
    if (!ok) failed++;
    const word = kind === 'control' ? (ok ? 'pass' : 'FAIL') : (ok ? 'caught' : 'MISSED');
    io.out(`${kind} ${word}: ${name}${ok || !detail ? '' : ' -- ' + detail}\n`);
  };
  const guard = async (kind, name, body) => {
    try { const r = await body(); line(r === true, kind, name, r === true ? '' : String(r)); }
    catch (e) { line(false, kind, name, e.message); }
  };
  const fx = buildFixture();
  io.out(`fixture ${fx.dir}\n`);
  const show = (r) => JSON.stringify(r.out + r.err) + ' exit ' + r.code;
  const viaReferent = (doc, extra = []) => run(main, ['--document', fx.doc(doc), '--referent', fx.ref, ...extra]);

  await guard('control', 'the listing equals the expected lines (bytewise order, CLAUDE.md first lines, .git, empty folder and ignored files out)', () =>
    listReferent(fx.ref) === EXPECTED_LISTING || JSON.stringify(listReferent(fx.ref)));
  await guard('control', 'a document naming every member passes (a pointer inside a fenced block is not read)', async () => {
    const r = await viaReferent('full');
    return (r.code === 0 && r.out === 'OK referent\n') || show(r);
  });
  await guard('control', '--allow on one unnamed member passes', async () => {
    const r = await viaReferent('missing', ['--allow', 'README.md']);
    return (r.code === 0 && r.out === 'OK referent\n') || show(r);
  });
  await guard('control', 'a --listing input gives the same result as the --referent run (all three documents)', async () => {
    const file = path.join(fx.dir, 'referent-register.txt');
    fs.writeFileSync(file, listReferent(fx.ref));
    for (const doc of ['full', 'missing', 'stale']) {
      const a = await viaReferent(doc);
      const b = await run(main, ['--document', fx.doc(doc), '--listing', file]);
      if (a.code !== b.code || a.out !== b.out) return `${doc}: ${show(a)} vs ${show(b)}`;
    }
    return true;
  });
  await guard('control', 'two listing runs byte-equal', () => {
    const a = Buffer.from(listReferent(fx.ref), 'utf8');
    const b = Buffer.from(listReferent(fx.ref), 'utf8');
    return Buffer.compare(a, b) === 0 || 'the two runs differ';
  });
  await guard('control', 'the listing is sorted bytewise by path', () => isSorted(listReferent(fx.ref)) || 'not sorted');
  await guard('control', '--out the only file written', async () => {
    const outFile = path.join(fx.dir, 'out-listing.txt');
    const before = snapshot(fx.dir);
    const r = await run(listMain, [fx.ref, '--out', outFile]);
    const after = snapshot(fx.dir);
    const added = [...after.keys()].filter((k) => !before.has(k));
    const changed = [...before.keys()].filter((k) => after.get(k) !== before.get(k));
    if (r.code !== 0 || r.out !== '' || r.err !== '') return show(r);
    if (added.length !== 1 || added[0] !== outFile || changed.length) return `added ${added.join(', ')}; changed or removed ${changed.join(', ')}`;
    return fs.readFileSync(outFile, 'utf8') === listReferent(fx.ref) || 'the --out file differs from the listing';
  });
  await guard('control', 'outside a git repository every entry is listed (ignored and empty folders in)', () => {
    const l = listReferent(fx.plain);
    return (l.includes('dir scratch/\n') && l.includes('file scratch/notes.txt\n') && l.includes('dir empty/\n')) || JSON.stringify(l);
  });

  await guard('mutant', 'a member unnamed -> omits README.md', async () => {
    const r = await viaReferent('missing');
    return (r.code === 1 && r.out === 'omits README.md\nFAIL referent\n') || show(r);
  });
  await guard('mutant', 'a span naming a missing member -> stale register/docs/gone.md, stale todo/missing-item/', async () => {
    const r = await viaReferent('stale');
    return (r.code === 1 && r.out === 'stale register/docs/gone.md\nstale todo/missing-item/\nFAIL referent\n') || show(r);
  });
  await guard('mutant', 'a git-ignored file present in the folder is absent from the listing (scratch/, build.log, docs/draft.md)', () => {
    const l = listReferent(fx.ref);
    for (const rel of ['scratch/notes.txt', 'build.log', 'docs/draft.md']) {
      if (!fs.existsSync(path.join(fx.ref, rel))) return `${rel} missing from the fixture`;
      if (l.includes(`file ${rel}\n`)) return `${rel} listed`;
    }
    return (!l.includes('dir scratch/\n') && l.includes('file keep.log\n')) || 'scratch/ listed or keep.log (negated) not listed';
  });
  await guard('mutant', 'a listing line reordered -> the determinism control fails', () => {
    const fresh = listReferent(fx.ref);
    const lines = fresh.split('\n');
    const i = lines.indexOf('file README.md');
    [lines[i], lines[i + 1]] = [lines[i + 1], lines[i]];
    const reordered = lines.join('\n');
    return (Buffer.compare(Buffer.from(reordered), Buffer.from(fresh)) !== 0 && !isSorted(reordered)) || 'the reordered listing passed';
  });

  io.out(failed ? 'FAIL selftest\n' : 'OK selftest\n');
  return failed ? 1 : 0;
}

if (isMainModule(import.meta.url)) main(process.argv.slice(2)).then((code) => { process.exitCode = code; });

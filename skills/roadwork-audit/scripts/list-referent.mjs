#!/usr/bin/env node
// list-referent.mjs: the referent listing of spec R5 (documentary items checked against
// their referent). Prints a deterministic listing of one folder, reading only. Node, no
// dependency; spawns no process. The --selftest suite lives in check-referent.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const HELP = `Usage: node list-referent.mjs <folder> [--out <file>]
       node list-referent.mjs --selftest
       node list-referent.mjs --help

Prints a deterministic listing of <folder> (spec R5): one line per member,
"dir <path>/" or "file <path>", paths relative to <folder>, sorted bytewise
(UTF-8) by the path as printed; every file named CLAUDE.md is followed by its
first line, indented two spaces. Two runs over an unchanged folder print
identical bytes. The folder itself is not listed.

Inside a git repository (a .git found in <folder> or a folder above it) the
members are the files git does not ignore and the folders holding them; a folder
with no listed member is left out. The .gitignore files from the repository's
root down are honoured: blank and # lines, ! negation, trailing-slash folder
patterns, leading-slash anchoring, patterns without a slash matching at any
depth, *, ?, [...] and **. This is a subset of git's ignore rules: no
.git/info/exclude, no global excludes file, no core.ignorecase, no index, so a
tracked file that a .gitignore pattern matches is left out. A nested repository
is listed as its folder alone. Outside a git repository every entry is listed,
empty folders included. In both cases .git is skipped, and a symbolic link is
listed as a file and never followed.

Reads folder names, file names, the .gitignore files and the first line of each
CLAUDE.md, nothing else; opens no connection; writes nothing except, with --out,
the listing.

  --out <file>   write the listing to <file>; stdout then stays empty
  --selftest     build a fixture under the system temporary folder (kept), run
                 the controls and mutants, one line each, then OK selftest
  --help         print this text

Exit: 0 done; 1 selftest failed; 2 usage or read error.
`;

export const byteCompare = (a, b) => Buffer.compare(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));

const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

// One gitignore glob, already anchored to its .gitignore's folder, as a regular expression.
function globToRegex(glob) {
  let re = '';
  const n = glob.length;
  let i = 0;
  while (i < n) {
    const c = glob[i];
    if (c === '*') {
      let j = i;
      while (j < n && glob[j] === '*') j++;
      const startsSegment = i === 0 || glob[i - 1] === '/';
      const endsSegment = j === n || glob[j] === '/';
      if (j - i >= 2 && startsSegment && endsSegment) {
        if (j === n) { re += '.*'; i = j; continue; }      // trailing ** : everything inside
        re += '(?:.*/)?'; i = j + 1; continue;              // **/ : zero or more folders
      }
      re += '[^/]*'; i = j; continue;
    }
    if (c === '?') { re += '[^/]'; i++; continue; }
    if (c === '\\' && i + 1 < n) { re += reEscape(glob[i + 1]); i += 2; continue; }
    if (c === '[') {
      let j = i + 1;
      let negate = false;
      if (glob[j] === '!' || glob[j] === '^') { negate = true; j++; }
      let body = '';
      let first = true;
      while (j < n && (glob[j] !== ']' || first)) {
        const ch = glob[j];
        if (ch === '\\' && j + 1 < n) { body += /[A-Za-z0-9]/.test(glob[j + 1]) ? glob[j + 1] : '\\' + glob[j + 1]; j += 2; }
        else if (ch === ']' || ch === '[' || ch === '\\' || ch === '^') { body += '\\' + ch; j++; }
        else { body += ch; j++; }
        first = false;
      }
      if (j >= n) { re += '\\['; i++; continue; }           // no closing bracket: a literal [
      re += '(?!/)[' + (negate ? '^' : '') + body + ']';
      i = j + 1; continue;
    }
    re += reEscape(c); i++;
  }
  return new RegExp('^' + re + '$');
}

// The patterns of one .gitignore file, in file order.
export function parseIgnore(text) {
  const out = [];
  for (let line of text.split('\n')) {
    line = line.replace(/\r$/, '');
    if (line === '' || line.startsWith('#')) continue;
    while (line.endsWith(' ') && !line.endsWith('\\ ')) line = line.slice(0, -1);
    if (line === '') continue;
    let negate = false;
    if (line.startsWith('!')) { negate = true; line = line.slice(1); }
    else if (line.startsWith('\\!') || line.startsWith('\\#')) line = line.slice(1);
    let dirOnly = false;
    if (line.endsWith('/')) { dirOnly = true; line = line.replace(/\/+$/, ''); }
    if (line === '') continue;
    const anchored = line.includes('/');
    if (line.startsWith('/')) line = line.slice(1);
    out.push({ negate, dirOnly, re: globToRegex(anchored ? line : '**/' + line) });
  }
  return out;
}

const exists = (p) => { try { fs.lstatSync(p); return true; } catch { return false; } };

// Deeper .gitignore files take precedence; within one file the last matching pattern decides.
function isIgnored(abs, isDir, rules) {
  for (let k = rules.length - 1; k >= 0; k--) {
    const rel = path.relative(rules[k].base, abs).split(path.sep).join('/');
    const pats = rules[k].pats;
    for (let m = pats.length - 1; m >= 0; m--) {
      if (pats[m].dirOnly && !isDir) continue;
      if (pats[m].re.test(rel)) return !pats[m].negate;
    }
  }
  return false;
}

function withIgnoreFile(dir, rules) {
  const f = path.join(dir, '.gitignore');
  let st;
  try { st = fs.lstatSync(f); } catch { return rules; }
  if (!st.isFile()) return rules;
  return [...rules, { base: dir, pats: parseIgnore(fs.readFileSync(f, 'utf8')) }];
}

function findRepoRoot(abs) {
  for (let d = abs; ; d = path.dirname(d)) {
    if (exists(path.join(d, '.git'))) return d;
    if (path.dirname(d) === d) return null;
  }
}

function firstLine(file) {
  const t = fs.readFileSync(file, 'utf8');
  const i = t.indexOf('\n');
  return (i < 0 ? t : t.slice(0, i)).replace(/\r$/, '');
}

// Appends the members of abs to out; true when anything was listed under it.
function walk(abs, rel, rules, git, out) {
  const entries = fs.readdirSync(abs, { withFileTypes: true });
  if (git) rules = withIgnoreFile(abs, rules);
  let any = false;
  for (const e of entries) {
    if (e.name === '.git') continue;
    const a = path.join(abs, e.name);
    const r = rel ? rel + '/' + e.name : e.name;
    const isDir = e.isDirectory();
    if (git && isIgnored(a, isDir, rules)) continue;
    if (isDir) {
      if (git && exists(path.join(a, '.git'))) { out.push({ p: r + '/' }); any = true; continue; }
      const mark = out.length;
      out.push({ p: r + '/' });
      const inner = walk(a, r, rules, git, out);
      if (git && !inner) out.length = mark;
      else any = true;
    } else if (e.isFile() || e.isSymbolicLink()) {
      const item = { p: r };
      if (e.name === 'CLAUDE.md' && e.isFile()) item.anchor = firstLine(a);
      out.push(item);
      any = true;
    }
  }
  return any;
}

// The listing of one folder, as text.
export function listReferent(folder) {
  const root = path.resolve(folder);
  if (!fs.statSync(root).isDirectory()) throw new Error(`not a folder: ${folder}`);
  const repo = findRepoRoot(root);
  let rules = [];
  if (repo) {
    const chain = [];
    for (let d = root; ; d = path.dirname(d)) { chain.unshift(d); if (d === repo) break; }
    for (let k = 0; k < chain.length - 1; k++) {
      rules = withIgnoreFile(chain[k], rules);
      if (isIgnored(chain[k + 1], true, rules)) return '';
    }
  }
  const entries = [];
  walk(root, '', rules, repo !== null, entries);
  entries.sort((x, y) => byteCompare(x.p, y.p));
  const lines = [];
  for (const e of entries) {
    lines.push((e.p.endsWith('/') ? 'dir ' : 'file ') + e.p);
    if ('anchor' in e) lines.push('  ' + e.anchor);
  }
  return lines.length ? lines.join('\n') + '\n' : '';
}

export const STDIO = { out: (s) => process.stdout.write(s), err: (s) => process.stderr.write(s) };

export async function main(argv, io = STDIO) {
  const usage = (msg) => { io.err(`list-referent: ${msg}\nRun with --help for usage.\n`); return 2; };
  let folder = null;
  let out = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { io.out(HELP); return 0; }
    if (a === '--selftest') { const m = await import('./check-referent.mjs'); return m.selftest(io); }
    if (a === '--out') { if (i + 1 >= argv.length) return usage('--out takes a file'); out = argv[++i]; continue; }
    if (a.startsWith('-')) return usage(`unknown option ${a}`);
    if (folder !== null) return usage('one folder only');
    folder = a;
  }
  if (folder === null) return usage('a folder is required');
  let text;
  try { text = listReferent(folder); } catch (e) { io.err(`list-referent: ${e.message}\n`); return 2; }
  if (out === null) { io.out(text); return 0; }
  try { fs.writeFileSync(out, text); } catch (e) { io.err(`list-referent: ${e.message}\n`); return 2; }
  return 0;
}

export const isMainModule = (metaUrl) => {
  try { return Boolean(process.argv[1]) && pathToFileURL(fs.realpathSync(process.argv[1])).href === metaUrl; }
  catch { return false; }
};

if (isMainModule(import.meta.url)) main(process.argv.slice(2)).then((code) => { process.exitCode = code; });

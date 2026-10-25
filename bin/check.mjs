#!/usr/bin/env node
// check — the Roadwork repository's own checks, the ones CI runs. Node only, no dependencies.
// Usage: node bin/check.mjs [anchors | skills | terms | selftests | words | all]   (default: all)
// Prints "OK <mode>" for each passing mode and one "FAIL <mode> <what>" line per failure; exit 0 only when all pass,
// 1 when any fails, 2 on a usage error. Reads the Roadwork repository's files wherever it is run from; writes only into folders it
// makes under the system's temporary folder (the self-tests' working folder and the compiled Python files), never
// into the Roadwork repository.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HOME = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const at = (...p) => path.join(HOME, ...p);
const rel = (p) => path.relative(HOME, p).split(path.sep).join('/');
const read = (p) => { try { return fs.readFileSync(p, 'utf8').replace(/\r\n?/g, '\n'); } catch { return null; } };
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
const subdirs = (p) => (isDir(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort() : []);
function walk(dir, out = []) {
  if (!isDir(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}
const lastLine = (s) => String(s || '').trim().split('\n').pop() || '';
const CONSTITUTION = at('rules', 'roadwork-constitution.md');

// (1) anchors — every anchor of the scaffold present: the register's own files and docs, the anchors the
// constitution's Folders bullet lists below the top, and spark/archive/CLAUDE.md, which its rule "every archive/
// under one carries an anchor" requires though the list omits it.
function anchors(fail) {
  const own = ['CLAUDE.md', '.gitignore', 'ordering.md', 'working.md', 'docs/teachme.md', 'docs/facts.md'];
  const c = read(CONSTITUTION);
  if (c === null) { fail('rules/roadwork-constitution.md missing, so its anchor list cannot be read'); return; }
  const line = c.split('\n').find((l) => l.includes('The anchors below the top are'));
  const listed = line ? [...line.matchAll(/`([^`\s]+\/CLAUDE\.md)`/g)].map((m) => m[1]) : [];
  if (!listed.length) { fail('the constitution\'s anchor list ("The anchors below the top are …") not found'); return; }
  for (const p of [...new Set([...own, ...listed, 'spark/archive/CLAUDE.md'])]) if (!isFile(at('scaffold', p))) fail(`scaffold/${p} missing`);
}

// (2) skills — every skill folder has a SKILL.md whose frontmatter holds name and description, and whose text has
// the "## Prerequisites" and "## Sub-agents" sections; unlazy, shipped unchanged from its own project, is held to the
// frontmatter only.
function skills(fail) {
  const names = subdirs(at('skills'));
  if (!names.length) { fail('no skill folder under skills/'); return; }
  for (const name of names) {
    const f = at('skills', name, 'SKILL.md');
    const t = read(f);
    if (t === null) { fail(`skills/${name}/SKILL.md missing`); continue; }
    const fm = t.match(/^---\n([\s\S]*?)\n---(\n|$)/);
    if (!fm) fail(`skills/${name}/SKILL.md opens with no YAML frontmatter`);
    else for (const k of ['name', 'description']) if (!new RegExp(`^${k}:[ \\t]*\\S`, 'm').test(fm[1])) fail(`skills/${name}/SKILL.md: the frontmatter has no ${k}`);
    if (name === 'unlazy') continue;
    const lines = t.split('\n').map((l) => l.trimEnd());
    for (const h of ['## Prerequisites', '## Sub-agents']) if (!lines.includes(h)) fail(`skills/${name}/SKILL.md has no "${h}" section`);
  }
}

// (3) terms — every glossary entry of the constitution (a line "- **Term** — …" under "## Glossary") has a row in
// the table under "# Terms": the term appears in the row's second column, the agent's word, compared without case or
// backticks and as whole words, so a column holding it with more words ("Ledger / `GATES.md`", "Operator (user)")
// counts.
const TERMS_ALLOW = [
  'Easteregg', // the one glossary entry with no row, by design
];
function terms(fail) {
  const c = read(CONSTITUTION);
  if (c === null) { fail('rules/roadwork-constitution.md missing'); return; }
  const L = c.split('\n');
  const ti = L.findIndex((l) => /^# Terms\b/.test(l));
  const gi = L.findIndex((l) => /^## Glossary\s*$/.test(l));
  if (ti < 0) { fail('the constitution has no "# Terms" section'); return; }
  if (gi < 0) { fail('the constitution has no "## Glossary" section'); return; }
  const norm = (s) => s.replace(/`/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const tableEnd = gi > ti ? gi : L.length;
  const rows = L.slice(ti + 1, tableEnd).filter((l) => /^\|/.test(l) && !/^\|[\s:|-]*$/.test(l)).map((l) => l.split('|'));
  const agentWords = rows.slice(1).map((cells) => norm(cells[2] || '')); // rows[0] is the header row
  if (!agentWords.length) { fail('the terms table has no rows'); return; }
  const next = L.findIndex((l, k) => k > gi && /^#/.test(l));
  const entries = L.slice(gi + 1, next < 0 ? L.length : next).map((l) => l.match(/^- \*\*(.+?)\*\*\s+—/)).filter(Boolean).map((m) => m[1]);
  if (!entries.length) { fail('the glossary has no "- **Term** —" entries'); return; }
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const term of entries) {
    if (TERMS_ALLOW.includes(term)) continue;
    const re = new RegExp(`(^|[^a-z0-9])${esc(norm(term))}($|[^a-z0-9])`);
    if (!agentWords.some((w) => re.test(w))) fail(`the glossary term "${term}" has no row in the terms table`);
  }
}

// (4) selftests — every shipped script with a --selftest runs it to exit 0, and every shipped Python script compiles.
// The scripts are those directly in a scripts/ folder under skills/.
function selftests(fail) {
  const scripts = walk(at('skills')).filter((p) => path.basename(path.dirname(p)) === 'scripts');
  const withSelftest = scripts.filter((p) => p.endsWith('.mjs') && (read(p) || '').includes('--selftest'));
  const python = scripts.filter((p) => p.endsWith('.py'));
  if (!withSelftest.length) fail('no shipped script carries a --selftest');
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'roadwork-check-')); // kept; the bytecode goes here, not beside the source
  for (const p of withSelftest) {
    const r = spawnSync(process.execPath, [p, '--selftest'], { cwd: work, encoding: 'utf8', timeout: 600000 });
    const error = String(r.stderr || '').match(/^\w*Error\b.*$/m);
    if (r.status !== 0) fail(`${rel(p)} --selftest exited ${r.status ?? r.signal ?? r.error?.code}: ${error ? error[0] : lastLine(r.stdout) || lastLine(r.stderr)}`);
  }
  for (const p of python) {
    const r = spawnSync('python3', ['-I', '-X', `pycache_prefix=${work}`, '-m', 'py_compile', p], { cwd: work, encoding: 'utf8', timeout: 120000 });
    if (r.error && r.error.code === 'ENOENT') { fail(`python3 not found, so ${rel(p)} was not compiled`); continue; }
    if (r.status !== 0) fail(`${rel(p)} does not compile: ${lastLine(r.stderr) || lastLine(r.stdout)}`);
  }
}

// (5) words — no file under rules/, skills/ or scaffold/ carries a word that means something only inside the project
// that first built Roadwork (case-insensitive, whole words). Each word is spelled with a one-letter class, a [ ] for
// the space or a repetition, so that the words themselves appear nowhere in the tree, this file included.
const WORDS = /\b(nethu[b]|buz[z]|rela[y]|nexu[s]|cchb[a]|repo[ ]man|standup[ ]guy|ba{2})\b/i;
function words(fail) {
  for (const top of ['rules', 'skills', 'scaffold']) {
    for (const p of walk(at(top))) {
      const t = read(p);
      if (t === null || t.includes('\0')) continue;
      t.split('\n').forEach((line, k) => {
        const m = line.match(WORDS);
        if (m) fail(`${rel(p)}:${k + 1}: "${m[0]}"`);
      });
    }
  }
}

const MODES = { anchors, skills, terms, selftests, words };
const arg = process.argv.slice(2);
if (arg.includes('--help') || arg.includes('-h')) {
  process.stdout.write(`Usage: node bin/check.mjs [${Object.keys(MODES).join(' | ')} | all]   (default: all)\n`);
  process.exit(0);
}
if (arg.length > 1 || (arg.length === 1 && arg[0] !== 'all' && !MODES[arg[0]])) {
  process.stderr.write(`check: unknown mode ${arg.join(' ')}; the modes: ${Object.keys(MODES).join(', ')}, all\n`);
  process.exit(2);
}
const run = arg.length === 0 || arg[0] === 'all' ? Object.keys(MODES) : [arg[0]];
let failed = 0;
for (const mode of run) {
  let n = 0;
  MODES[mode]((what) => { n++; process.stdout.write(`FAIL ${mode} ${what}\n`); });
  if (n === 0) process.stdout.write(`OK ${mode}\n`);
  failed += n;
}
process.exit(failed ? 1 : 0);

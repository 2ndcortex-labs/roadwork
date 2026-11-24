#!/usr/bin/env node
// roadwork-guidebook templates — lists the guidebook templates of the store the setting guidebook-templates names, and
// copies one, verbatim under a header line, as the project's guidebooks/<guidebook-slug>.source.md.
// Usage: node templates.mjs [--config-file PATH] list | copy <template-name> <guidebook-slug> | --selftest
// The setting is read only through the config skill's config.mjs, never from config.json. A value starting with `/` is a
// folder store, its top-level regular `.md` files read, no symlink followed; any other value is a repository address, read at
// its default branch by a shallow, tagless, blobless, no-checkout clone into a folder from mkdtemp, left to the system's
// temporary-files cleanup. Git runs with every prompt off, ssh in batch mode, https, ssh and file transports alone, the
// address after `--`, 60 seconds per git process. Nothing is kept between calls; nothing is ever written to the store.
// Exit 0; a refusal: one line, exit 1; an unreadable store: one line `store unreadable: <reason>`, exit 3.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdtempSync, mkdirSync, openSync, closeSync, lstatSync, readlinkSync, symlinkSync, chmodSync, appendFileSync, constants } from 'node:fs';
import { join, dirname, resolve, delimiter } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const CONFIG = join(dirname(SELF), '..', '..', 'roadwork-config', 'scripts', 'config.mjs');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LIMIT_MS = 60000; // the spec's proposed limit per git process; a timeout is "store unreadable"
const SAFE = ['-c', 'protocol.allow=never', '-c', 'protocol.https.allow=always', '-c', 'protocol.ssh.allow=always', '-c', 'protocol.file.allow=always'];
const FORM = ['Standards', 'Vendors', 'Judgements', 'Sources', 'Changelog'];
const USAGE = 'usage: templates.mjs [--config-file <path>] list | copy <template-name> <guidebook-slug> | --selftest';

const say = (line, code) => { process.stdout.write(line + '\n'); process.exit(code); };
const refuse = (line) => say(line, 1);
const unreadable = (reason) => say(`store unreadable: ${reason}`, 3);
const lastLine = (b) => String(b || '').trim().split('\n').pop().trim();
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

let args = process.argv.slice(2);
let cfgFile = null;
if (args[0] === '--config-file') {
  if (!args[1]) refuse('--config-file needs a path');
  cfgFile = args[1];
  args = args.slice(2);
}

// The value of guidebook-templates, '' when empty, by the config script alone.
function storeValue() {
  const r = spawnSync(process.execPath, [CONFIG, ...(cfgFile ? ['--config-file', cfgFile] : []), 'get', 'guidebook-templates'], { encoding: 'utf8' });
  if (r.status !== 0) refuse(`the config script failed: ${lastLine(r.stderr) || `exit ${r.status}`}`);
  const v = r.stdout.replace(/\n$/, '');
  return v === 'empty' ? '' : v;
}

// The roadwork folder: the folder holding the settings file.
// shortcut: repeats config.mjs's findConfig walk when no --config-file is given; change both together if that walk changes.
function registerFolder() {
  if (cfgFile) return dirname(resolve(cfgFile));
  for (let d = resolve(process.cwd()); ; d = dirname(d)) {
    if (existsSync(join(d, 'roadwork', 'ordering.md'))) return join(d, 'roadwork');
    if (existsSync(join(d, 'ordering.md'))) return d;
    if (dirname(d) === d) refuse(`no register found above ${process.cwd()}`);
  }
}

// A store file's template name: the stem of a top-level `.md` file, never a `.source.md`, kebab-case; else null.
function templateName(file) {
  if (!file.endsWith('.md') || file.endsWith('.source.md')) return null;
  const stem = file.slice(0, -3);
  return KEBAB.test(stem) ? stem : null;
}

// The lines after a leading header block (a first line `---` up to the next `---`), or all lines when none; null when unclosed.
function bodyLines(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return lines;
  const end = lines.indexOf('---', 1);
  return end < 0 ? null : lines.slice(end + 1);
}

// The form test: headings alone, no content judged. Returns the first failing line, or null.
function formFault(text) {
  const lines = bodyLines(text);
  if (!lines) return 'the header block has no closing "---" line';
  if (!(lines[0] || '').startsWith('# Guidebook: ')) return 'the first line does not start with "# Guidebook: "';
  const h = lines.filter((l) => l.startsWith('## ')).map((l) => l.slice(3).trim());
  const core = h.filter((x) => FORM.includes(x) || x === 'Stack');
  if (core.filter((x) => x !== 'Stack').join('\n') !== FORM.join('\n')) return 'the headings are not ## Standards, ## Vendors, ## Judgements, ## Sources and ## Changelog, in that order';
  const ji = h.indexOf('Judgements');
  const si = h.indexOf('Sources');
  const stray = h.findIndex((x, i) => !core.includes(x) && (i < ji || i > si));
  if (stray >= 0) return `the heading ## ${h[stray]} does not stand between ## Judgements and ## Sources`;
  if (core.includes('Stack') && (core.length !== 6 || h[1] !== 'Stack')) return '## Stack does not stand once between ## Standards and ## Vendors';
  return null;
}

function readFolder(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch (e) { unreadable(`${dir}: ${e.code || e.message}`); }
  const out = new Map();
  for (const e of entries) {
    const name = e.isFile() ? templateName(e.name) : null;
    if (!name) continue;
    let fd;
    try { fd = openSync(join(dir, e.name), constants.O_RDONLY | constants.O_NOFOLLOW); out.set(name, readFileSync(fd)); }
    catch (err) { unreadable(`${e.name}: ${err.code || err.message}`); }
    finally { if (fd !== undefined) closeSync(fd); }
  }
  return out;
}

// Every git process: the transport allow-list, prompts off, the time limit; a failure is "store unreadable".
function git(argv, env, what) {
  const r = spawnSync('git', [...SAFE, ...argv], { env, timeout: LIMIT_MS, maxBuffer: 64 * 1024 * 1024 });
  if (r.error?.code === 'ETIMEDOUT') unreadable(`git ${what} timed out after ${LIMIT_MS / 1000} seconds`);
  if (r.error) unreadable(`git ${what}: ${r.error.code || r.error.message}`);
  if (r.status !== 0) unreadable(`git ${what}: ${lastLine(r.stderr) || `exit ${r.status ?? r.signal}`}`);
  return r.stdout;
}

function readRepo(address) {
  const dir = mkdtempSync(join(tmpdir(), 'roadwork-templates-')); // never deleted: the system's cleanup takes it
  // GIT_ASKPASS=true: a password program that answers nothing, so no window asks either; a credential helper the machine holds is still asked first.
  const env = { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_ASKPASS: 'true' };
  // ssh in batch mode (no password, passphrase or host-key prompt), on the machine's own ssh command; a key in an agent still serves.
  // shortcut: a GIT_SSH program set by the machine is left as it is, unbatched; upgrade if a store is read through one.
  if (!env.GIT_SSH) {
    const own = spawnSync('git', ['config', '--get', 'core.sshCommand'], { cwd: tmpdir(), env, encoding: 'utf8', timeout: LIMIT_MS });
    env.GIT_SSH_COMMAND = `${env.GIT_SSH_COMMAND || String(own.stdout || '').trim() || 'ssh'} -o BatchMode=yes`;
  }
  git(['clone', '--quiet', '--depth', '1', '--no-tags', '--filter=blob:none', '--no-checkout', '--', address, dir], env, 'clone');
  const gd = join(dir, '.git');
  const out = new Map();
  for (const entry of git(['--git-dir', gd, 'ls-tree', '-z', 'HEAD'], env, 'ls-tree').toString('utf8').split('\0')) {
    const m = entry.match(/^(?:100644|100755) blob ([0-9a-f]+)\t([\s\S]+)$/);
    const name = m ? templateName(m[2]) : null;
    if (name) out.set(name, git(['--git-dir', gd, 'cat-file', 'blob', m[1]], env, 'cat-file'));
  }
  return out;
}

const readStore = (value) => (value.startsWith('/') ? readFolder(value) : readRepo(value));
const listed = (files) => [...files].filter(([, b]) => !formFault(b.toString('utf8')))
  .map(([name, b]) => ({ name, title: bodyLines(b.toString('utf8'))[0].slice('# Guidebook: '.length).trim() }))
  .sort((a, b) => (a.name < b.name ? -1 : 1));

function list() {
  const value = storeValue();
  if (!value) return;
  const t = listed(readStore(value));
  process.stdout.write([`templates: ${t.length}`, ...t.map((x) => `${x.name} — ${x.title} — template`)].join('\n') + '\n');
}

function copy(name, slug) {
  if (!KEBAB.test(name)) refuse(`copy refused: the template name ${JSON.stringify(name)} is not kebab-case`);
  if (!KEBAB.test(slug)) refuse(`copy refused: the guidebook slug ${JSON.stringify(slug)} is not kebab-case`);
  const value = storeValue();
  if (!value) refuse('copy refused: no store is set; set one with /roadwork-config guidebook-templates <folder or address>');
  const gb = join(registerFolder(), 'guidebooks');
  const taken = [`${slug}.md`, `${slug}.source.md`, `archive/${slug}.md`, `archive/${slug}.source.md`].find((p) => existsSync(join(gb, p)));
  if (taken) refuse(`copy refused: the project already carries guidebooks/${taken}; pick another slug, or update the existing guidebook`);
  const files = readStore(value);
  if (!files.has(name)) refuse(`copy refused: the store holds no template ${name}; it holds: ${listed(files).map((x) => x.name).join(', ') || 'none'}`);
  const fault = formFault(files.get(name).toString('utf8'));
  if (fault) refuse(`copy refused: ${name} is not in the guidebook's fixed form: ${fault}`);
  const header = `_Source of ${slug}, from the template ${name} of the store ${value}, copied ${today()}; verbatim._`;
  try { writeFileSync(join(gb, `${slug}.source.md`), Buffer.concat([Buffer.from(`${header}\n\n`), files.get(name)]), { flag: 'wx' }); }
  catch (e) { refuse(`copy refused: cannot write guidebooks/${slug}.source.md: ${e.code || e.message}`); }
  process.stdout.write(`copied: guidebooks/${slug}.source.md\n`);
}

// --- selftest: the cases of A3, and the setting's shapes, under one folder from mkdtemp, never removed ---------
function selftest() {
  const ok = (cond, what) => { if (!cond) say(`FAIL selftest: ${what}`, 1); };
  const base = mkdtempSync(join(tmpdir(), 'roadwork-templates-selftest-'));
  const reg = join(base, 'reg');
  const gb = join(reg, 'guidebooks');
  mkdirSync(join(gb, 'archive'), { recursive: true });
  writeFileSync(join(reg, 'ordering.md'), '');
  const cfg = join(reg, 'config.json');
  writeFileSync(cfg, '{}\n');
  const config = (...a) => spawnSync(process.execPath, [CONFIG, '--config-file', cfg, ...a], { encoding: 'utf8' });
  const setKey = (v) => { const r = config('set', 'guidebook-templates', v); ok(r.status === 0, `config set ${v}: ${r.stderr}`); };
  const author = ['-c', 'user.name=Roadwork Selftest', '-c', 'user.email=selftest@example.invalid', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null'];
  const G = (dir, ...a) => { const r = spawnSync('git', ['-C', dir, ...author, ...a], { encoding: 'utf8' }); ok(r.status === 0, `git ${a.join(' ')}: ${r.stderr}`); return r.stdout; };
  const stores = [];
  const snap = (dir) => {
    const parts = [];
    const walkS = (d) => {
      for (const n of readdirSync(d).sort()) {
        if (n === '.git') continue;
        const p = join(d, n);
        const st = lstatSync(p);
        if (st.isSymbolicLink()) parts.push(`L ${p} ${readlinkSync(p)}`);
        else if (st.isDirectory()) { parts.push(`D ${p}`); walkS(p); }
        else parts.push(`F ${p} ${st.mode} ${readFileSync(p).toString('base64')}`);
      }
    };
    if (existsSync(dir)) walkS(dir);
    if (existsSync(join(dir, '.git'))) parts.push(G(dir, 'for-each-ref'), G(dir, 'rev-parse', 'HEAD'));
    return parts.join('\n');
  };
  // Every child run: each store byte-equal before and after, its refs included (A4).
  const run = (a, env = process.env) => {
    const before = stores.map(snap);
    const r = spawnSync(process.execPath, [SELF, '--config-file', cfg, ...a], { encoding: 'utf8', env, timeout: 300000 });
    stores.forEach((s, i) => ok(snap(s) === before[i], `the store ${s} changed during ${a.join(' ')}`));
    return r;
  };
  const oneLine = (r, code, re, what) => ok(r.status === code && r.stdout.split('\n').length === 2 && re.test(r.stdout), `${what}: exit ${r.status}, ${JSON.stringify(r.stdout + r.stderr)}`);
  const gbFiles = () => readdirSync(gb).filter((n) => n !== 'archive').sort().join(',') + '|' + readdirSync(join(gb, 'archive')).sort().join(',');
  // head: a leading header block; parts: item parts after ## Judgements; early: an item part before ## Vendors, out of its place.
  const tpl = (title, stack, { head = false, parts = false, early = false } = {}) => `${head ? '---\nkind: template\natlas: ""\ndestination: ""\n---\n' : ''}# Guidebook: ${title}\n_Guidebook, made 2026-01-01 by /roadwork-guidebook; open until retired._\n\n**Architectures:** none\n\nWhat it covers.\n\n## Standards\n- s\n\n${stack ? '## Stack\n- k\n\n' : ''}${early ? '## Hosts\n- h\n\n' : ''}## Vendors\n- v\n\n## Judgements\n- j\n\n${parts ? '## Hosts\n- h\n\n## Coding standards: Python\n- four spaces\n\n' : ''}## Sources\n- o\n\n## Changelog\n- 2026-01-01: made.\n`;
  const checkCopy = (slug, name, store, bytes) => {
    const got = readFileSync(join(gb, `${slug}.source.md`));
    const head = `_Source of ${slug}, from the template ${name} of the store ${store}, copied ${today()}; verbatim._\n\n`;
    ok(got.equals(Buffer.concat([Buffer.from(head), bytes])), `${slug}.source.md is not the header line, a blank line and the template's bytes`);
    return got;
  };

  // The setting's shapes (A2): admitted and refused, nothing looked for.
  for (const v of ['/no/such/folder', 'https://git.example.invalid/org/t.git', 'ssh://git@git.example.invalid/org/t.git', 'ssh://git.example.invalid:2222/t.git', 'git@git.example.invalid:org/t.git', 'file:///no/such/repo.git']) {
    setKey(v);
    ok(config('get', 'guidebook-templates').stdout === `${v}\n`, `config get after set ${v}`);
  }
  for (const v of ['rel/path', './x', '-x', '--upload-pack=touch', '/a,/b', '/a\n/b', 'https://user@h.example.invalid/x', 'https://user:tok@h.example.invalid/x', 'https://:tok@h.example.invalid/x', 'ssh://user:pw@h.example.invalid/x', 'http://h.example.invalid/x', 'ext::sh -c x', 'git@-h:x']) {
    ok(config('set', 'guidebook-templates', v).status === 1, `config set refused ${JSON.stringify(v)}`);
  }
  ok(config('unset', 'guidebook-templates').status === 0, 'config unset');
  ok(config().stdout.split('\n').includes('guidebook-templates: empty'), 'the bare call lists the key');
  ok(!config('empty').stdout.includes('guidebook-templates'), 'the empty-keys prompt does not ask the key');
  ok(config('get', 'guidebook-templates').stdout === 'empty\n', 'config get prints empty');

  // A folder store: two templates, one with Stack; a file not in the form, a .source.md, a stem not kebab-case,
  // a file in a subfolder and a symlink, none listed.
  const fs1 = join(base, 'store-folder');
  mkdirSync(join(fs1, 'sub'), { recursive: true });
  writeFileSync(join(fs1, 'alpha.md'), tpl('Alpha book', true));
  writeFileSync(join(fs1, 'beta.md'), tpl('Beta book'));
  writeFileSync(join(fs1, 'broken.md'), '# Guidebook: Broken\n\n## Standards\n\n## Changelog\n');
  writeFileSync(join(fs1, 'headed.md'), tpl('Headed book', true, { head: true, parts: true }));
  writeFileSync(join(fs1, 'misplaced.md'), tpl('Misplaced book', false, { head: true, early: true }));
  writeFileSync(join(fs1, 'alpha.source.md'), tpl('Source'));
  writeFileSync(join(fs1, 'Not_Kebab.md'), tpl('Not kebab'));
  writeFileSync(join(fs1, 'sub', 'inner.md'), tpl('Inner'));
  symlinkSync('alpha.md', join(fs1, 'linked.md'));
  stores.push(fs1);

  // Case 1: the key empty.
  let r = run(['list']);
  ok(r.status === 0 && r.stdout === '', `case 1 list: ${JSON.stringify(r.stdout + r.stderr)}`);
  oneLine(run(['copy', 'alpha', 'one']), 1, /no store is set/, 'case 1 copy');
  ok(gbFiles() === '|', 'case 1 wrote a file');

  // Case 2: a folder store.
  setKey(fs1);
  r = run(['list']);
  ok(r.status === 0 && r.stdout === 'templates: 3\nalpha — Alpha book — template\nbeta — Beta book — template\nheaded — Headed book — template\n', `case 2 list: ${JSON.stringify(r.stdout + r.stderr)}`);

  // Case 4: the file not in the form, named, refused with the failing line; other names refused.
  oneLine(run(['copy', 'broken', 'one']), 1, /broken is not in the guidebook's fixed form: the headings are not/, 'case 4 form');
  oneLine(run(['copy', 'misplaced', 'one']), 1, /misplaced is not in the guidebook's fixed form: the heading ## Hosts does not stand between ## Judgements and ## Sources$/m, 'case 4 item part out of place');
  oneLine(run(['copy', 'missing', 'one']), 1, /holds no template missing; it holds: alpha, beta, headed$/m, 'case 4 missing');
  oneLine(run(['copy', 'Not_Kebab', 'one']), 1, /not kebab-case/, 'case 4 kebab name');
  oneLine(run(['copy', 'alpha.source', 'one']), 1, /not kebab-case/, 'case 4 source name');
  oneLine(run(['copy', 'alpha', '../one']), 1, /not kebab-case/, 'case 4 kebab slug');
  ok(gbFiles() === '|', 'case 4 wrote a file');

  // Case 5: a slug carried in guidebooks/ and one in guidebooks/archive/.
  writeFileSync(join(gb, 'taken.md'), 'x\n');
  writeFileSync(join(gb, 'archive', 'old.source.md'), 'x\n');
  const before5 = gbFiles();
  oneLine(run(['copy', 'alpha', 'taken']), 1, /already carries guidebooks\/taken\.md; pick another slug, or update the existing guidebook/, 'case 5 guidebooks');
  oneLine(run(['copy', 'alpha', 'old']), 1, /already carries guidebooks\/archive\/old\.source\.md/, 'case 5 archive');
  ok(gbFiles() === before5, 'case 5 wrote a file');

  // Case 6: a copy, one file, byte-equal to the template under its header line.
  oneLine(run(['copy', 'alpha', 'mine']), 0, /^copied: guidebooks\/mine\.source\.md$/m, 'case 6 copy');
  ok(gbFiles() === 'mine.source.md,taken.md|old.source.md', `case 6 files: ${gbFiles()}`);
  const copied = checkCopy('mine', 'alpha', fs1, readFileSync(join(fs1, 'alpha.md')));
  oneLine(run(['copy', 'beta', 'mine']), 1, /already carries guidebooks\/mine\.source\.md/, 'case 6 second copy');
  // A template with a header block and item parts: copied byte-equal, its header block kept.
  oneLine(run(['copy', 'headed', 'head']), 0, /^copied: guidebooks\/head\.source\.md$/m, 'case 6 headed copy');
  checkCopy('head', 'headed', fs1, readFileSync(join(fs1, 'headed.md')));

  // Case 9: the template changed in its store after the copy; the project's source file stays as copied.
  appendFileSync(join(fs1, 'alpha.md'), '- changed in the store\n');
  ok(run(['list']).status === 0, 'case 9 list');
  ok(readFileSync(join(gb, 'mine.source.md')).equals(copied), 'case 9 the source file changed');

  // Case 3: a repository store by a file:// address, its default branch not named main; then a new commit there.
  const rs = join(base, 'store-repo');
  G(base, '-c', 'init.defaultBranch=trunk', 'init', '-q', rs);
  writeFileSync(join(rs, 'alpha.md'), tpl('Alpha book', true));
  writeFileSync(join(rs, 'gamma.md'), tpl('Gamma book'));
  chmodSync(join(rs, 'gamma.md'), 0o755);
  writeFileSync(join(rs, 'broken.md'), '# Not a guidebook\n');
  writeFileSync(join(rs, 'gamma.source.md'), tpl('Source'));
  mkdirSync(join(rs, 'sub'));
  writeFileSync(join(rs, 'sub', 'inner.md'), tpl('Inner'));
  symlinkSync('alpha.md', join(rs, 'linked.md'));
  G(rs, 'add', '-A');
  G(rs, 'commit', '-q', '-m', 'templates');
  stores.push(rs);
  setKey(`file://${rs}`);
  r = run(['list']);
  ok(r.status === 0 && r.stdout === 'templates: 2\nalpha — Alpha book — template\ngamma — Gamma book — template\n', `case 3 list: ${JSON.stringify(r.stdout + r.stderr)}`);
  writeFileSync(join(rs, 'delta.md'), tpl('Delta book'));
  G(rs, 'add', 'delta.md');
  G(rs, 'commit', '-q', '-m', 'delta');
  r = run(['list']);
  ok(r.status === 0 && r.stdout === 'templates: 3\nalpha — Alpha book — template\ndelta — Delta book — template\ngamma — Gamma book — template\n', `case 3 new state: ${JSON.stringify(r.stdout + r.stderr)}`);
  oneLine(run(['copy', 'broken', 'two']), 1, /broken is not in the guidebook's fixed form: the first line does not start/, 'case 3 form');
  oneLine(run(['copy', 'gamma', 'two']), 0, /^copied: guidebooks\/two\.source\.md$/m, 'case 3 copy');
  checkCopy('two', 'gamma', `file://${rs}`, readFileSync(join(rs, 'gamma.md')));

  // Case 7: a missing folder and a repository that does not answer.
  setKey(join(base, 'no-such-folder'));
  oneLine(run(['list']), 3, /^store unreadable: /, 'case 7 folder list');
  oneLine(run(['copy', 'alpha', 'three']), 3, /^store unreadable: /, 'case 7 folder copy');
  setKey(`file://${join(base, 'no-such-repo')}`);
  oneLine(run(['list']), 3, /^store unreadable: git clone: /, 'case 7 repository');

  // Case 8: a stand-in git on the path records its argument vector and environment.
  const bin = join(base, 'bin');
  const log = join(base, 'git-calls.jsonl');
  mkdirSync(bin);
  writeFileSync(join(bin, 'git'), `#!${process.execPath}\nrequire('node:fs').appendFileSync(${JSON.stringify(log)}, JSON.stringify({ argv: process.argv.slice(2), prompt: process.env.GIT_TERMINAL_PROMPT, ssh: process.env.GIT_SSH_COMMAND }) + '\\n');\nprocess.stderr.write('fatal: stand-in git\\n');\nprocess.exit(128);\n`);
  chmodSync(join(bin, 'git'), 0o755);
  const address = 'https://git.example.invalid/org/templates.git';
  setKey(address);
  const env = { ...process.env, PATH: `${bin}${delimiter}${process.env.PATH}` };
  delete env.GIT_SSH;
  delete env.GIT_SSH_COMMAND;
  oneLine(run(['list'], env), 3, /^store unreadable: git clone: fatal: stand-in git$/m, 'case 8 list');
  const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [];
  const clone = calls.find((c) => c.argv.includes('clone'));
  ok(clone, 'case 8 no clone recorded');
  ok(clone.prompt === '0', `case 8 GIT_TERMINAL_PROMPT is ${clone.prompt}`);
  ok(clone.ssh === 'ssh -o BatchMode=yes', `case 8 GIT_SSH_COMMAND is ${clone.ssh}`);
  const dd = clone.argv.indexOf('--');
  ok(dd > clone.argv.indexOf('clone') && clone.argv[dd + 1] === address, `case 8 the address does not follow --: ${clone.argv.join(' ')}`);
  for (const c of ['protocol.allow=never', 'protocol.https.allow=always', 'protocol.ssh.allow=always', 'protocol.file.allow=always']) ok(clone.argv.includes(c), `case 8 ${c} missing`);

  say('OK selftest', 0);
}

const [cmd, ...rest] = args;
if (cmd === '--selftest' && !cfgFile && rest.length === 0) selftest();
else if (cmd === 'list' && rest.length === 0) list();
else if (cmd === 'copy' && rest.length === 2) copy(rest[0], rest[1]);
else refuse(USAGE);

#!/usr/bin/env node
// roadwork-guidebook guidebooks — lists the project's guidebooks and outgoing files, prints the guidebooks that reach a
// destination or a work item, checks one guidebook's form and place, and scans a draft for this project's names and values.
// Usage: node guidebooks.mjs [--config-file PATH] list | reach --destination <slug> | reach --item <item folder>
//        | check <file> [--as <register-relative path>] | scan <file> | --selftest
// The roadwork folder is the --config-file's folder, else found by a walk up from the working directory. Settings are read
// only through the config skill's config.mjs `get <key>`, never a secret key. Whether the store holds a template is read
// from the sibling templates.mjs `list`. It writes nothing.
// Exit 0; a refusal: one line, exit 1; `check` with a broken rule and `scan` with a hit: exit 1; a usage error: exit 2.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdtempSync, mkdirSync, statSync, realpathSync, lstatSync, symlinkSync } from 'node:fs';
import { join, dirname, resolve, relative, isAbsolute, basename, sep, posix } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const CONFIG = join(dirname(SELF), '..', '..', 'roadwork-config', 'scripts', 'config.mjs');
const TEMPLATES = join(dirname(SELF), 'templates.mjs');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const KEYS = ['kind', 'atlas', 'destination'];
const KINDS = ['atlas', 'destination', 'template'];
const SIX = ['Standards', 'Stack', 'Vendors', 'Judgements', 'Sources', 'Changelog'];
const VALUE_KEYS = ['notify-url', 'status-url', '3rdparty-notice-url', 'guidebook-templates', 'standards-folders'];
const USAGE = 'usage: guidebooks.mjs [--config-file <path>] list | reach --destination <slug> | reach --item <item folder> | check <file> [--as <register-relative path>] | scan <file> | --selftest';

const say = (line, code) => { process.stdout.write(line + '\n'); process.exit(code); };
const refuse = (line) => say(line, 1);
const usage = () => say(USAGE, 2);
const lastLine = (b) => String(b || '').trim().split('\n').pop().trim();
const readText = (p, what) => { try { return readFileSync(p, 'utf8'); } catch (e) { return refuse(`${what} refused: cannot read ${p}: ${e.code || e.message}`); } };
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };
const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };
const ls = (d) => { try { return readdirSync(d, { withFileTypes: true }); } catch { return []; } };
const bySlug = (a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);

let args = process.argv.slice(2);
let cfgFile = null;
if (args[0] === '--config-file') {
  if (!args[1]) usage();
  cfgFile = args[1];
  args = args.slice(2);
}

// One setting, by the config script alone: a list key as its entries, any other as its value; '' or [] when empty.
function setting(key) {
  const r = spawnSync(process.execPath, [CONFIG, ...(cfgFile ? ['--config-file', cfgFile] : []), 'get', key], { encoding: 'utf8' });
  if (r.status !== 0) refuse(`the config script failed on ${key}: ${lastLine(r.stderr) || `exit ${r.status}`}`);
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

// The header block: the lines between a first line `---` and the next `---`, each `key: value`, bare or in double quotes.
// Returns { head: null | { keys: Map, faults: [] }, body: [lines after the block] }.
function parse(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { head: null, body: lines };
  const end = lines.indexOf('---', 1);
  if (end < 0) return { head: { keys: new Map(), faults: ['the header block has no closing ---'] }, body: [] };
  const keys = new Map();
  const faults = [];
  for (const l of lines.slice(1, end)) {
    const m = l.match(/^([A-Za-z0-9_-]+):[ \t]*(.*?)[ \t]*$/);
    if (!m) { faults.push(`the header block line ${JSON.stringify(l)} is not "key: value"`); continue; }
    if (keys.has(m[1])) faults.push(`the header block repeats the key ${m[1]}`);
    const q = m[2].match(/^"(.*)"$/);
    keys.set(m[1], q ? q[1] : m[2]);
  }
  return { head: { keys, faults }, body: lines.slice(end + 1) };
}

const titleOf = (body) => (body.find((l) => l.startsWith('# Guidebook: ')) || '').slice('# Guidebook: '.length).trim() || '(no title)';
const openAtlas = (reg, slug) => KEBAB.test(slug) && isFile(join(reg, 'atlases', slug, 'atlas.md'));
const openDestination = (reg, slug) => KEBAB.test(slug) && isFile(join(reg, 'destinations', `${slug}.prd.md`));

// The guidebooks at guidebooks/<slug>.md (no CLAUDE.md, no .source.md), by slug, each parsed.
function guidebooks(reg) {
  return ls(join(reg, 'guidebooks')).filter((e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'CLAUDE.md' && !e.name.endsWith('.source.md'))
    .map((e) => ({ slug: e.name.slice(0, -3), ...parse(readText(join(reg, 'guidebooks', e.name), 'list')) })).sort(bySlug);
}

function list() {
  const reg = registerFolder();
  const out = [];
  const gbs = guidebooks(reg);
  out.push(`guidebooks: ${gbs.length}`);
  for (const g of gbs) {
    const k = g.head?.keys;
    let scope;
    if (!g.head) scope = 'unscoped';
    else if (k.get('kind') === 'atlas') scope = `atlas: ${k.get('atlas') || ''}`;
    else if (k.get('kind') === 'destination') scope = `destination: ${k.get('destination') || ''}`;
    else scope = 'not in form: run check';
    out.push(`${g.slug} — ${titleOf(g.body)} — ${scope}`);
  }
  const outgoing = ls(join(reg, 'guidebooks', 'outgoing')).filter((e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'CLAUDE.md')
    .map((e) => ({ slug: e.name.slice(0, -3), ...parse(readText(join(reg, 'guidebooks', 'outgoing', e.name), 'list')) })).sort(bySlug);
  if (outgoing.length) {
    out.push(`outgoing: ${outgoing.length}`);
    let store; // read once, on the first template: null no store set, 'unreadable', or the Set of names templates.mjs lists
    const storeState = () => {
      if (store !== undefined) return store;
      if (!setting('guidebook-templates')) return (store = null);
      const r = spawnSync(process.execPath, [TEMPLATES, ...(cfgFile ? ['--config-file', cfgFile] : []), 'list'], { encoding: 'utf8', timeout: 600000 });
      if (r.status !== 0) return (store = 'unreadable');
      return (store = new Set(r.stdout.split('\n').map((l) => l.match(/^(\S+) — .* — template$/)).filter(Boolean).map((m) => m[1])));
    };
    for (const o of outgoing) {
      let state;
      const kind = o.head?.keys.get('kind');
      if (!KINDS.includes(kind)) state = 'not in form: run check';
      else if (kind === 'template') {
        const s = storeState();
        state = s === null ? 'template: no store set' : s === 'unreadable' ? 'template: store unreadable' : s.has(o.slug) ? 'template: in the store' : 'template: not yet in the store';
      } else state = 'for another project';
      out.push(`${o.slug} — ${titleOf(o.body)} — ${state}`);
    }
  }
  process.stdout.write(out.join('\n') + '\n');
}

// The guidebooks reaching one open destination: its own, by slug, then its atlas's, by slug.
function reachDestination(reg, slug) {
  if (!openDestination(reg, slug)) refuse(`reach refused: no open destination ${slug}`);
  const { head } = parse(readText(join(reg, 'destinations', `${slug}.prd.md`), 'reach'));
  const atlas = head?.keys.get('atlas') || '';
  const gbs = guidebooks(reg).filter((g) => g.head && !g.head.faults.length);
  const own = gbs.filter((g) => g.head.keys.get('kind') === 'destination' && g.head.keys.get('destination') === slug);
  const ofAtlas = atlas ? gbs.filter((g) => g.head.keys.get('kind') === 'atlas' && g.head.keys.get('atlas') === atlas) : [];
  const out = [...own, ...ofAtlas].map((g) => `${g.slug} — ${g.head.keys.get('kind')} — guidebooks/${g.slug}.md`);
  process.stdout.write((out.length ? out.join('\n') : 'none') + '\n');
}

function reachItem(reg, folder) {
  // The folder as given (absolute, or from the working directory), else from the roadwork folder; the first holding an item file.
  const dirs = isAbsolute(folder) ? [folder] : [resolve(folder), resolve(reg, folder)];
  const file = dirs.flatMap((d) => ['todo.md', 'feature.md'].map((n) => join(d, n))).find(isFile);
  if (!file) refuse(`reach refused: ${folder} holds no todo.md or feature.md`);
  const line = readText(file, 'reach').split(/\r?\n/).find((l) => l.startsWith('**Destination:**'));
  const m = line && line.match(/`([^`]+)`/);
  if (!m) return void process.stdout.write('none\n');
  reachDestination(reg, m[1]);
}

// The rules of form, for both places; returns the broken rules as lines.
function formFaults(text) {
  const { head, body } = parse(text);
  if (!head) return ['no header block: the first line is not ---'];
  const f = [...head.faults];
  const keys = [...head.keys.keys()];
  if (keys.length !== 3 || !KEYS.every((k) => head.keys.has(k))) f.push(`the header block's keys are ${keys.join(', ') || 'none'}, not exactly kind, atlas, destination`);
  if (head.keys.has('kind') && !KINDS.includes(head.keys.get('kind'))) f.push(`the kind ${JSON.stringify(head.keys.get('kind'))} is not atlas, destination or template`);
  if (!(body[0] || '').startsWith('# Guidebook: ')) f.push('the first line after the header block does not start with "# Guidebook: "');
  const h = body.filter((l) => l.startsWith('## ')).map((l) => l.slice(3).trim());
  let i = 0;
  const take = (name) => (h[i] === name ? (i++, true) : false);
  let partsOk = take('Standards');
  take('Stack');
  partsOk = partsOk && take('Vendors') && take('Judgements');
  const tail = h.slice(-2);
  const middle = h.slice(i, h.length - 2);
  partsOk = partsOk && h.length - i >= 2 && tail[0] === 'Sources' && tail[1] === 'Changelog' && middle.every((x) => !SIX.includes(x));
  if (!partsOk) f.push('the parts are not ## Standards, an optional ## Stack, ## Vendors, ## Judgements, any other parts, ## Sources and ## Changelog, in that order');
  return f;
}

function check(file, as) {
  const reg = registerFolder();
  const text = readText(file, 'check');
  let rel;
  if (as !== undefined) {
    if (isAbsolute(as) || posix.normalize(as).startsWith('..')) refuse(`check refused: --as ${as} is not a path inside the roadwork folder`);
    rel = posix.normalize(as);
  } else {
    // Real paths on both sides, so a symlinked temporary folder (/var and /private/var) does not refuse.
    const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
    rel = relative(real(reg), real(file)).split(sep).join('/');
    if (rel.startsWith('..') || isAbsolute(rel)) refuse(`check refused: ${file} is not in the roadwork folder ${reg}; give --as <register-relative path>`);
  }
  const atGuidebooks = rel.match(/^guidebooks\/([^/]+)\.md$/);
  const atOutgoing = rel.match(/^guidebooks\/outgoing\/([^/]+)\.md$/);
  if ((!atGuidebooks && !atOutgoing) || /^(CLAUDE|.*\.source)$/.test((atGuidebooks || atOutgoing)[1])) refuse(`check refused: ${rel} is neither guidebooks/<slug>.md nor guidebooks/outgoing/<name>.md`);
  const f = formFaults(text);
  const k = parse(text).head?.keys || new Map();
  const kind = k.get('kind');
  const atlas = k.get('atlas') || '';
  const destination = k.get('destination') || '';
  if (atGuidebooks) {
    // An update that keeps its scope (the file already at the place names the same kind and the same atlas or
    // destination) may keep an archived scope (R53); a new guidebook, a first scope or a changed scope needs an open one.
    const prior = isFile(join(reg, rel)) ? parse(readText(join(reg, rel), 'check')).head?.keys : null;
    if (!isFile(join(reg, rel)) && existsSync(join(reg, 'guidebooks', 'outgoing', `${atGuidebooks[1]}.md`))) f.push(`the slug ${atGuidebooks[1]} is the name of guidebooks/outgoing/${atGuidebooks[1]}.md`);
    const keeps = !!prior && prior.get('kind') === kind && (prior.get('atlas') || '') === atlas && (prior.get('destination') || '') === destination;
    const archivedAtlas = keeps && KEBAB.test(atlas) && isDir(join(reg, 'atlases', 'archive', atlas));
    const archivedDestination = keeps && KEBAB.test(destination) && isFile(join(reg, 'destinations', 'archive', `${destination}.prd.md`));
    if (kind === 'atlas') {
      if (!openAtlas(reg, atlas) && !archivedAtlas) f.push(`kind atlas names no open atlas: ${JSON.stringify(atlas)}`);
      if (destination) f.push('kind atlas leaves destination empty');
    } else if (kind === 'destination') {
      if (!openDestination(reg, destination) && !archivedDestination) f.push(`kind destination names no open destination: ${JSON.stringify(destination)}`);
      if (atlas) f.push('kind destination leaves atlas empty');
    } else if (kind === 'template') f.push('a template belongs under guidebooks/outgoing/');
  } else {
    const name = atOutgoing[1];
    if (!KEBAB.test(name)) f.push(`the outgoing name ${JSON.stringify(name)} is not kebab-case`);
    const taken = [`guidebooks/${name}.md`, `guidebooks/archive/${name}.md`].find((p) => existsSync(join(reg, p)));
    if (taken) f.push(`the outgoing name ${name} is the slug of ${taken}`);
    // R28: with --as, another outgoing file already at the intended place takes the name.
    const there = join(reg, rel);
    if (as !== undefined && existsSync(there) && realpathSync(there) !== realpathSync(file)) f.push(`the outgoing name ${name} is taken by ${rel}`);
    if (kind === 'template' && (atlas || destination)) f.push('kind template leaves atlas and destination empty');
    if (kind === 'atlas' && (!atlas || destination)) f.push('kind atlas names its atlas and leaves destination empty');
    if (kind === 'destination' && (!destination || atlas)) f.push('kind destination names its destination and leaves atlas empty');
  }
  if (f.length) say(f.map((x) => `FAULT ${x}`).join('\n'), 1);
  say('OK check', 0);
}

// The names of this project (whole words, `-` part of a word, no case) and its values (substrings, with case).
function scan(file) {
  const reg = registerFolder();
  const text = readText(file, 'scan');
  const names = new Set();
  const stems = (dir, suffix) => ls(join(reg, dir)).filter((e) => e.isFile() && e.name.endsWith(suffix) && !e.name.endsWith('.source.md')).map((e) => e.name.slice(0, -suffix.length));
  // Open and archived alike: a guidebook outlives its destination and may be converted after the name is archived.
  for (const dir of ['atlases', 'atlases/archive']) for (const e of ls(join(reg, dir))) if (e.isDirectory() && e.name !== 'archive') names.add(e.name);
  for (const dir of ['destinations', 'destinations/archive']) for (const s of stems(dir, '.prd.md')) names.add(s);
  for (const dir of ['maps', 'maps/archive', 'guidebooks', 'guidebooks/archive']) for (const s of stems(dir, '.md')) if (s !== 'CLAUDE') names.add(s);
  const walk = (d) => {
    for (const e of ls(d)) {
      if (!e.isDirectory()) continue;
      const p = join(d, e.name);
      if (isFile(join(p, 'todo.md')) || isFile(join(p, 'feature.md'))) names.add(e.name);
      walk(p);
    }
  };
  walk(join(reg, 'todo'));
  walk(join(reg, 'feature'));
  const root = setting('project-root');
  const rootName = basename(resolve(reg, root || '..'));
  if (rootName) names.add(rootName);
  const values = new Set();
  for (const key of VALUE_KEYS) for (const v of setting(key).split('\n')) if (v) values.add(v);
  if (root) values.add(root);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // A value with no `/` is a bare folder name: it matches only where a `/` follows it.
  const matchers = [
    ...[...names].sort().map((n) => ({ what: n, re: new RegExp(`(?<![A-Za-z0-9_-])${esc(n)}(?![A-Za-z0-9_-])`, 'i') })),
    ...[...values].sort().map((v) => ({ what: v, test: (l) => l.includes(v.includes('/') ? v : `${v}/`) })),
  ];
  // The leading header block is not scanned: its keys are the Operator's answer and may name another project's scope.
  const all = text.split(/\r?\n/);
  const end = all[0] === '---' ? all.indexOf('---', 1) : -1;
  const out = [];
  all.forEach((l, i) => {
    if (i <= end) return;
    const hits = matchers.filter((m) => (m.re ? m.re.test(l) : m.test(l))).map((m) => m.what);
    if (hits.length) out.push(`${i + 1}: ${hits.join(', ')} — ${l}`);
  });
  if (out.length) say(out.join('\n'), 1);
  say('OK scan', 0);
}

// --- selftest: every mode, under one folder from mkdtemp, never removed; the roadwork folder byte-equal after ---------
function selftest() {
  const ok = (cond, what) => { if (!cond) say(`FAIL selftest: ${what}`, 1); };
  const base = mkdtempSync(join(tmpdir(), 'roadwork-guidebooks-selftest-'));
  const proj = join(base, 'proj');
  const reg = join(proj, 'roadwork');
  const w = (rel, text) => { const p = join(reg, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, text); return p; };
  w('ordering.md', '');
  const cfg = w('config.json', '{}\n');
  const head = (kind, atlas, destination) => `---\nkind: ${kind}\natlas: "${atlas}"\ndestination: ${destination}\n---\n`;
  const body = (title, parts = '') => `# Guidebook: ${title}\n\nWhat it covers.\n\n## Standards\n- s\n\n## Vendors\n- v\n\n## Judgements\n- j\n\n${parts}## Sources\n- o\n\n## Changelog\n- 2026-01-01: made.\n`;
  w('atlases/north/atlas.md', '# Atlas: north\n');
  w('atlases/archive/old-atlas/atlas.md', '# Atlas\n');
  w('destinations/route-one.prd.md', '---\nbucket-list-priority: 5\natlas: "north"\n---\n# Destination\n');
  w('destinations/route-bare.prd.md', '---\nbucket-list-priority: 5\natlas: ""\n---\n# Destination\n');
  w('maps/route-one.md', '# Map\n');
  w('guidebooks/CLAUDE.md', 'anchor\n');
  w('guidebooks/g-own.md', head('destination', '', 'route-one') + body('Own', '## Hosts\n- h\n\n'));
  w('guidebooks/g-own.source.md', 'source\n');
  w('guidebooks/g-north.md', head('atlas', 'north', '') + body('North'));
  w('guidebooks/g-early.md', body('Early'));
  w('guidebooks/archive/g-gone.md', head('destination', '', 'route-one') + body('Gone'));
  w('destinations/archive/route-old.prd.md', '---\nbucket-list-priority: 5\natlas: ""\n---\n# Destination\n');
  w('guidebooks/g-old.md', head('destination', '', 'route-old') + body('Old'));
  w('guidebooks/g-past.md', head('atlas', 'old-atlas', '') + body('Past'));
  w('guidebooks/outgoing/CLAUDE.md', 'anchor\n');
  w('guidebooks/outgoing/t-one.md', head('template', '', '') + body('T one'));
  w('guidebooks/outgoing/away.md', head('atlas', 'theirs', '') + body('Away'));
  w('guidebooks/outgoing/bare.md', body('Bare'));
  w('guidebooks/outgoing/odd.md', head('project', '', '') + body('Odd'));
  w('maps/archive/way-old.md', '# Map\n');
  w('maps/archive/CLAUDE.md', 'anchor\n');
  const fm = '---\nblocker: no\n---\n';
  w('feature/route-one/item-on/feature.md', `${fm}# On\n\n**Destination:** \`route-one\` — read.\n`);
  w('todo/unnavigated/archive/item-off/todo.md', `${fm}# Off\n`);
  const snap = () => {
    const parts = [];
    const walkS = (d) => { for (const n of readdirSync(d).sort()) { const p = join(d, n); if (lstatSync(p).isDirectory()) { parts.push(`D ${p}`); walkS(p); } else parts.push(`F ${p} ${readFileSync(p).toString('base64')}`); } };
    walkS(reg);
    return parts.join('\n');
  };
  const before = snap();
  const run = (...a) => spawnSync(process.execPath, [SELF, '--config-file', cfg, ...a], { encoding: 'utf8', cwd: proj, timeout: 600000 });
  const is = (r, code, out, what) => ok(r.status === code && r.stdout === out, `${what}: exit ${r.status}, ${JSON.stringify(r.stdout + r.stderr)}`);
  const config = (...a) => { const r = spawnSync(process.execPath, [CONFIG, '--config-file', cfg, ...a], { encoding: 'utf8' }); ok(r.status === 0, `config ${a.join(' ')}: ${r.stderr}`); };

  // list: guidebooks by slug, unscoped, outgoing in its states (no store, an empty store, an unreadable store).
  const gbLines = 'guidebooks: 5\ng-early — Early — unscoped\ng-north — North — atlas: north\ng-old — Old — destination: route-old\ng-own — Own — destination: route-one\ng-past — Past — atlas: old-atlas\noutgoing: 4\naway — Away — for another project\nbare — Bare — not in form: run check\nodd — Odd — not in form: run check\n';
  is(run('list'), 0, `${gbLines}t-one — T one — template: no store set\n`, 'list, no store');
  const store = join(base, 'store');
  mkdirSync(store);
  config('set', 'guidebook-templates', store);
  is(run('list'), 0, `${gbLines}t-one — T one — template: not yet in the store\n`, 'list, an empty store');
  config('set', 'guidebook-templates', join(base, 'no-such-store'));
  is(run('list'), 0, `${gbLines}t-one — T one — template: store unreadable\n`, 'list, an unreadable store');
  config('unset', 'guidebook-templates');

  // reach: own first, then the atlas's; by item; none; refusals.
  const reached = 'g-own — destination — guidebooks/g-own.md\ng-north — atlas — guidebooks/g-north.md\n';
  is(run('reach', '--destination', 'route-one'), 0, reached, 'reach --destination');
  is(run('reach', '--item', join(reg, 'feature/route-one/item-on')), 0, reached, 'reach --item');
  is(run('reach', '--item', 'roadwork/feature/route-one/item-on'), 0, reached, 'reach --item, a path from the working directory');
  is(run('reach', '--item', 'feature/route-one/item-on'), 0, reached, 'reach --item, a path from the roadwork folder');
  ok(run('reach', '--item', 'feature/route-one/no-item').status === 1, 'reach --item refused when no reading holds an item file');
  is(run('reach', '--item', join(reg, 'todo/unnavigated/archive/item-off')), 0, 'none\n', 'reach --item, no Destination line');
  is(run('reach', '--destination', 'route-bare'), 0, 'none\n', 'reach, a destination with no atlas and no guidebook');
  is(run('reach', '--destination', 'route-nine'), 1, 'reach refused: no open destination route-nine\n', 'reach, an unknown destination');
  is(run('reach', '--destination', '../x'), 1, 'reach refused: no open destination ../x\n', 'reach, a slug with a path');
  ok(run('reach', '--item', reg).status === 1, 'reach --item of a folder with no item file');

  // check: passes and faults, at both places and by --as.
  const draft = (name, text) => { const p = join(base, name); writeFileSync(p, text); return p; };
  is(run('check', join(reg, 'guidebooks/g-own.md')), 0, 'OK check\n', 'check, kind destination with an item part');
  is(run('check', join(reg, 'guidebooks/g-north.md')), 0, 'OK check\n', 'check, kind atlas');
  is(run('check', join(reg, 'guidebooks/outgoing/t-one.md')), 0, 'OK check\n', 'check, kind template outgoing');
  is(run('check', join(reg, 'guidebooks/outgoing/away.md')), 0, 'OK check\n', 'check, outgoing for another project');
  is(run('check', draft('d1.md', head('atlas', 'north', '') + body('D').replace('## Vendors', '## Stack\n- k\n\n## Vendors')), '--as', 'guidebooks/new-one.md'), 0, 'OK check\n', 'check --as, with Stack after Standards');
  const faults = (text, as, re, what) => { const r = run('check', draft('f.md', text), '--as', as); ok(r.status === 1 && re.test(r.stdout) && r.stdout.split('\n').filter(Boolean).every((l) => l.startsWith('FAULT ')), `${what}: exit ${r.status}, ${JSON.stringify(r.stdout + r.stderr)}`); };
  faults(body('x'), 'guidebooks/x.md', /^FAULT no header block/m, 'no header block');
  faults('---\nkind: atlas\natlas: north\n---\n' + body('x'), 'guidebooks/x.md', /^FAULT the header block's keys/m, 'a missing key');
  faults('---\nkind: atlas\natlas: north\ndestination:\nextra: 1\n---\n' + body('x'), 'guidebooks/x.md', /^FAULT the header block's keys/m, 'an extra key');
  faults(head('project', '', '') + body('x'), 'guidebooks/x.md', /^FAULT the kind "project"/m, 'an unknown kind');
  faults(head('atlas', 'north', '') + '\n' + body('x'), 'guidebooks/x.md', /^FAULT the first line after/m, 'a blank line before the title');
  faults(head('atlas', '', '') + body('x'), 'guidebooks/x.md', /^FAULT kind atlas names no open atlas/m, 'kind atlas, empty');
  faults(head('atlas', 'old-atlas', '') + body('x'), 'guidebooks/x.md', /^FAULT kind atlas names no open atlas/m, 'kind atlas, archived atlas');
  faults(head('destination', '', 'route-nine') + body('x'), 'guidebooks/x.md', /^FAULT kind destination names no open destination/m, 'kind destination, unknown');
  // An archived scope: an update (a file already at the place) passes; a new guidebook does not.
  is(run('check', join(reg, 'guidebooks/g-old.md')), 0, 'OK check\n', 'check, an existing guidebook of an archived destination');
  is(run('check', join(reg, 'guidebooks/g-past.md')), 0, 'OK check\n', 'check, an existing guidebook of an archived atlas');
  is(run('check', draft('u.md', head('destination', '', 'route-old') + body('U')), '--as', 'guidebooks/g-old.md'), 0, 'OK check\n', 'check --as, an update of a guidebook of an archived destination');
  faults(head('destination', '', 'route-old') + body('x'), 'guidebooks/x.md', /^FAULT kind destination names no open destination/m, 'a new guidebook of an archived destination');
  faults(head('destination', '', 'route-old') + body('x'), 'guidebooks/g-early.md', /^FAULT kind destination names no open destination/m, 'an unscoped guidebook taking an archived scope first');
  faults(head('atlas', 'old-atlas', '') + body('x'), 'guidebooks/g-old.md', /^FAULT kind atlas names no open atlas/m, 'a guidebook changing to an archived scope');
  faults(head('destination', '', 'route-old') + body('x'), 'guidebooks/g-past.md', /^FAULT kind destination names no open destination/m, 'a guidebook changing kind to an archived destination');
  faults(head('atlas', 'north', '') + body('x'), 'guidebooks/t-one.md', /^FAULT the slug t-one is the name of guidebooks\/outgoing\/t-one\.md/m, 'a new guidebook whose slug is an outgoing name');
  // A symlinked path to the roadwork folder: the place is worked out on real paths.
  const link = join(base, 'link');
  symlinkSync(proj, link);
  is(run('check', join(link, 'roadwork', 'guidebooks', 'g-north.md')), 0, 'OK check\n', 'check through a symlinked folder');
  faults(head('destination', 'north', 'route-one') + body('x'), 'guidebooks/x.md', /^FAULT kind destination leaves atlas empty/m, 'kind destination naming an atlas');
  faults(head('template', '', '') + body('x'), 'guidebooks/x.md', /^FAULT a template belongs under guidebooks\/outgoing\//m, 'a template among the guidebooks');
  faults(head('template', 'north', '') + body('x'), 'guidebooks/outgoing/x.md', /^FAULT kind template leaves/m, 'a template naming a scope');
  faults(head('atlas', '', '') + body('x'), 'guidebooks/outgoing/x.md', /^FAULT kind atlas names its atlas/m, 'outgoing kind atlas with no atlas');
  faults(head('template', '', '') + body('x'), 'guidebooks/outgoing/Not_Kebab.md', /^FAULT the outgoing name "Not_Kebab" is not kebab-case/m, 'outgoing name not kebab-case');
  faults(head('template', '', '') + body('x'), 'guidebooks/outgoing/g-north.md', /^FAULT the outgoing name g-north is the slug of guidebooks\/g-north\.md/m, 'outgoing name a guidebook slug');
  faults(head('template', '', '') + body('x'), 'guidebooks/outgoing/g-gone.md', /^FAULT the outgoing name g-gone is the slug of guidebooks\/archive/m, 'outgoing name an archived slug');
  faults(head('template', '', '') + body('x'), 'guidebooks/outgoing/away.md', /^FAULT the outgoing name away is taken/m, 'outgoing name another outgoing file');
  faults(head('atlas', 'north', '') + body('x').replace('## Vendors', '## Hosts\n- h\n\n## Vendors'), 'guidebooks/x.md', /^FAULT the parts/m, 'an item part before Vendors');
  faults(head('atlas', 'north', '') + body('x').replace('## Sources\n- o\n\n## Changelog\n- 2026-01-01: made.\n', '## Changelog\n- c\n\n## Sources\n- o\n'), 'guidebooks/x.md', /^FAULT the parts/m, 'Sources and Changelog swapped');
  faults(head('atlas', 'north', '') + body('x').replace('## Judgements', '## Judgements\n- j\n\n## Stack'), 'guidebooks/x.md', /^FAULT the parts/m, 'Stack out of place');
  faults(head('atlas', 'north', '') + body('x', '## Vendors\n- again\n\n'), 'guidebooks/x.md', /^FAULT the parts/m, 'a part repeated');
  ok(run('check', draft('f.md', body('x')), '--as', 'maps/x.md').status === 1, 'check refused at a place that is no guidebook place');
  ok(run('check', draft('f.md', body('x')), '--as', '../x.md').status === 1, 'check refused --as outside the roadwork folder');
  ok(run('check', draft('f.md', body('x'))).status === 1, 'check refused for a file outside the roadwork folder with no --as');

  // scan: names as whole words without case; values with a `/` as substrings, bare folder names only before a `/`; clean.
  mkdirSync(join(proj, 'house-rules'));
  config('set', 'standards-folders', 'house-rules');
  config('set', 'notify-url', 'https://hooks.example.org/k9/notify');
  config('set', 'project-root', '..');
  const dirty = ['# Guidebook: draft', 'clean line', 'Built for Route-One first.', 'the atlas north', 'see item-off', 'in proj', 'post to https://hooks.example.org/k9/notify', 'rules in house-rules/', 'route-one-sanity and northern and g-own-x', 'old-atlas and archive', 'see ../x', 'Coding house-rules here, and so on...', 'the old route-old', 'by way-old', 'once g-gone', 'claude and Claude'];
  let r = run('scan', draft('s.md', dirty.join('\n') + '\n'));
  const hit = r.stdout.split('\n').filter(Boolean).map((l) => Number(l.split(':')[0]));
  ok(r.status === 1 && hit.join(',') === '3,4,5,6,7,8,10,11,13,14,15', `scan of a dirty file: exit ${r.status}, ${JSON.stringify(r.stdout)}`);
  config('unset', 'project-root');
  ok(/^3: route-one — Built for Route-One first\.$/m.test(r.stdout), `scan line form: ${JSON.stringify(r.stdout)}`);
  const headed = head('destination', '', 'route-one') + '# Guidebook: x\nclean\n';
  is(run('scan', draft('h1.md', headed)), 0, 'OK scan\n', 'scan skips the header block');
  is(run('scan', draft('h2.md', headed + 'for north\n')), 1, '8: north — for north\n', 'scan after the header block, the file\'s own line numbers');
  is(run('scan', draft('c.md', '# Guidebook: general\nNothing of one project here; northern routes.\n')), 0, 'OK scan\n', 'scan of a clean file');

  // usage and the bounds of the call.
  ok(run().status === 2 && run('reach').status === 2 && run('check').status === 2 && run('nonsense').status === 2 && run('scan', 'a', 'b').status === 2, 'usage errors exit 2');
  ok(spawnSync(process.execPath, [SELF, '--config-file'], { encoding: 'utf8' }).status === 2, '--config-file with no path exits 2');
  config('unset', 'standards-folders');
  config('unset', 'notify-url');
  ok(snap() === before, 'the roadwork folder changed during the runs');
  say('OK selftest', 0);
}

const [cmd, ...rest] = args;
if (cmd === '--selftest' && !cfgFile && rest.length === 0) selftest();
else if (cmd === 'list' && rest.length === 0) list();
else if (cmd === 'reach' && rest.length === 2 && rest[0] === '--destination') reachDestination(registerFolder(), rest[1]);
else if (cmd === 'reach' && rest.length === 2 && rest[0] === '--item') reachItem(registerFolder(), rest[1]);
else if (cmd === 'check' && rest.length === 1) check(rest[0]);
else if (cmd === 'check' && rest.length === 3 && rest[1] === '--as') check(rest[0], rest[2]);
else if (cmd === 'scan' && rest.length === 1) scan(rest[0]);
else usage();

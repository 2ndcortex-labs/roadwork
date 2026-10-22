#!/usr/bin/env node
// roadwork-inventory — prints the inventory page (the skill's §4 form) from the register's files.
// Usage: node inventory.mjs [--root <register>] [--date <YYYY-MM-DD>] [--unlanded-lines <file>] [--filtered-by "<words>" --kept "<reading>" --removed "<reading>" --only <token> [<token> …]]
// Reads the register only; writes nothing; fetches nothing; never opens config.json (unlanded.mjs reads `versioned` through the config script;
// the config skill's externality.mjs reads `status-url` for each item whose `external` is set, the page's one network call).
// A line in process at a gate the Operator approves (its GATES.md block's APPROVER: line naming the Operator, no CHECK: line)
// carries `G<n> accepted and <next step>`: from a ledger only gate ids and titles are printed, from base.json the branch alone read.
// Exit 0 with the page on stdout; exit 1 with the first fault on stderr.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const fail = (m) => { process.stderr.write(`inventory: ${m}\n`); process.exit(1); };

// --- options ---------------------------------------------------------------
const argv = process.argv.slice(2);
const opt = { only: null };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--root' || a === '--filtered-by' || a === '--kept' || a === '--removed' || a === '--date' || a === '--unlanded-lines') {
    if (i + 1 >= argv.length) fail(`${a} needs a value`);
    opt[a.slice(2)] = argv[++i];
  } else if (a === '--only') {
    opt.only = [];
    while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opt.only.push(argv[++i]);
  } else fail(`unknown option ${a}`);
}

// --- the register ------------------------------------------------------------
function findRoot() {
  if (opt.root) {
    const r = resolve(opt.root);
    if (!existsSync(join(r, 'ordering.md'))) fail(`no register at ${r} (no ordering.md)`);
    return r;
  }
  for (let d = process.cwd(); ; d = dirname(d)) {
    if (existsSync(join(d, 'ordering.md'))) return d;
    if (dirname(d) === d) fail('no register found above the working directory (no ordering.md)');
  }
}
const root = findRoot();
const read = (p) => { try { return readFileSync(p, 'utf8'); } catch (e) { fail(`cannot read ${p}: ${e.message}`); } };
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };
const dirs = (p) => (isDir(p) ? readdirSync(p).filter((n) => n !== 'archive' && !n.startsWith('.') && isDir(join(p, n))).sort() : []);

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const k = line.match(/^([a-z-]+):\s*(.*)$/);
    if (!k) continue;
    let v = k[2].trim();
    if (v.startsWith('[')) fm[k[1]] = v.slice(1, v.lastIndexOf(']')).split(',').map((s) => s.trim()).filter(Boolean);
    else fm[k[1]] = v.replace(/^"(.*)"$/, '$1');
  }
  return fm;
}
const heading = (text) => { const m = text.match(/^# (.*)$/m); return m ? m[1].trim() : ''; };
const firstLine = (text) => (text.split('\n').find((l) => l.trim() !== '') || '').trim();
const isAccepted = (text) => /Status:\s*accepted/.test(text);
const intentPlaceholder = (text) => firstLine(text).startsWith('_Not yet interviewed');
const specPlaceholder = (text) => /^_Not yet specified/m.test(text);

// --- atlases -----------------------------------------------------------------
function firstSentence(text) {
  const lines = text.split('\n');
  let i = lines.findIndex((l) => l.startsWith('_Description derived'));
  let para = '';
  if (i >= 0) {
    i++;
    while (i < lines.length && lines[i].trim() === '') i++;
    while (i < lines.length && lines[i].trim() !== '') para += (para ? ' ' : '') + lines[i].trim(), i++;
  } else {
    const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    para = paras.find((p) => !p.startsWith('#') && !p.startsWith('_') && !p.startsWith('**')) || '';
    para = para.replace(/\s*\n\s*/g, ' ');
  }
  const m = para.match(/^(.*?\.)(?:\s|$)/);
  return m ? m[1] : para;
}
const atlases = dirs(join(root, 'atlases')).filter((s) => existsSync(join(root, 'atlases', s, 'atlas.md'))).map((slug) => ({ slug, description: firstSentence(read(join(root, 'atlases', slug, 'atlas.md'))) }));
const atlasSlugs = new Set(atlases.map((a) => a.slug));

// --- ordering.md ---------------------------------------------------------------
const blocks = []; // { name, slug, struck, date, items: [ref], pos }
const topItems = []; // unnavigated positions: refs in order
{
  const lines = read(join(root, 'ordering.md')).split('\n');
  let cur = null;
  for (const line of lines) {
    if (/^- /.test(line)) {
      cur = null;
      const struck = /^- ~~/.test(line);
      const dm = line.match(/destination: ([a-z0-9-]+)/);
      if (dm) {
        const name = line.replace(/^- /, '').replace(/~~/g, '').split(' — ')[0].trim();
        const date = (name.match(/(\d{4}-\d{2}-\d{2})$/) || [])[1] || '';
        cur = { name, slug: dm[1], struck, date, items: [], pos: blocks.length };
        blocks.push(cur);
      } else if (!struck) {
        const rm = line.match(/^- ((?:todo|feature)\/[a-z0-9-]+)/);
        if (rm) topItems.push(rm[1]);
      }
    } else if (cur && /^\s+- /.test(line)) {
      if (/^\s+- ~~/.test(line)) continue;
      const rm = line.match(/^\s+- ((?:todo|feature)\/[a-z0-9-]+)/);
      if (rm) cur.items.push(rm[1]);
    }
  }
}

// --- destinations -------------------------------------------------------------
const destinations = [];
if (isDir(join(root, 'destinations'))) {
  for (const f of readdirSync(join(root, 'destinations')).filter((n) => n.endsWith('.prd.md')).sort()) {
    const text = read(join(root, 'destinations', f));
    const fm = frontmatter(text);
    const slug = f.slice(0, -'.prd.md'.length);
    const pr = fm['bucket-list-priority'];
    const priority = pr !== undefined && pr !== '' && !Number.isNaN(Number(pr)) ? Number(pr) : null;
    const atlas = fm.atlas && atlasSlugs.has(fm.atlas) ? fm.atlas : '';
    const title = heading(text).replace(/^(Goal|Destination): /, '');
    const unstruck = blocks.filter((b) => b.slug === slug && !b.struck);
    const struck = blocks.filter((b) => b.slug === slug && b.struck);
    const nav = unstruck.length ? `navigated ${unstruck[0].date}` : struck.length ? 'built, every item archived' : 'not yet navigated';
    const pos = (unstruck[0] || struck[0] || { pos: Infinity }).pos + (unstruck.length ? 0 : 0.5);
    destinations.push({ slug, priority, atlas, title, nav, block: unstruck[0] || null, pos });
  }
}
function destOrder(a, b) {
  if (a.priority !== b.priority) {
    if (a.priority === null) return 1;
    if (b.priority === null) return -1;
    return b.priority - a.priority;
  }
  if (a.priority === null) return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  if (a.pos !== b.pos) return a.pos - b.pos;
  return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
}
destinations.sort(destOrder);

// --- items --------------------------------------------------------------------
const items = []; // { ref, kind, name, folder, dir, fm, title, level }
const byName = { todo: new Map(), feature: new Map() };
for (const kind of ['todo', 'feature']) {
  for (const folder of dirs(join(root, kind))) {
    for (const name of dirs(join(root, kind, folder))) {
      const dir = join(root, kind, folder, name);
      const file = join(dir, `${kind}.md`);
      if (!existsSync(file)) continue;
      const text = read(file);
      const fm = frontmatter(text);
      if (fm.disposition) continue;
      const it = { ref: `${kind}/${name}`, kind, name, folder, dir, fm, title: heading(text), level: fm['road-level'] || '' };
      items.push(it);
      byName[kind].set(name, it);
    }
  }
}

const unlazy = join(dirname(here), '..', 'unlazy', 'scripts', 'gate-check.mjs');
function ledger(it) {
  const g = join(it.dir, 'GATES.md');
  if (!existsSync(g)) return null;
  const r = spawnSync(process.execPath, [unlazy, '--status', g], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stdout && r.stderr ? '\n' : '') + (r.stderr || '');
  if (/^ALL MET/m.test(out)) return { met: true };
  const m = out.match(/UNMET GATES:G(\d+) \([^)]*\): (.*)/);
  if (m) {
    let title = m[2].split(':')[0].replace(/^[A-Z]+ \([^)]*\) — /, '').trim();
    // Every unmet id, in the status output's order; each gate block's APPROVER: and CHECK: lines, read from the file (the
    // status output prints neither): a block runs from its `- [ ] G<n>:` or `- [x] G<n>:` line to the next such line, the
    // next `## ` heading or the end; a key counts at the start of a line after any indentation.
    const unmet = [...out.matchAll(/UNMET GATES:G(\d+) \(/g)].map((x) => x[1]);
    const gates = [];
    let cur = null;
    for (const line of read(g).split('\n')) {
      const h = line.match(/^- \[[ xX]\] G(\d+):/);
      if (h) { cur = { id: h[1], operator: false, check: false }; gates.push(cur); }
      else if (line.startsWith('## ')) cur = null;
      else if (cur) {
        const k = line.match(/^\s*(APPROVER|CHECK):(.*)$/);
        if (k && k[1] === 'CHECK') cur.check = true;
        else if (k && /operator/i.test(k[2])) cur.operator = true;
      }
    }
    return { met: false, gate: m[1], title, unmet, gates };
  }
  fail(`gate-check failed on ${g}${r.status ? ` (exit ${r.status})` : ''}`);
}
const ledgers = new Map();
const ledgerOf = (it) => { if (!ledgers.has(it.ref)) ledgers.set(it.ref, ledger(it)); return ledgers.get(it.ref); };

// The Operator's word at an unmet gate, the make hand-back's reading reused. The run: the first unmet gate and the gates
// directly after it in ledger order, while each is unmet and the Operator's (an APPROVER: line naming the Operator, no
// CHECK: line). The next step: `open the pull request for <repo> <branch>` where the item's base.json names a branch that
// exactly one unlanded line names as its second word (the lines block 4 prints, before the filter); else
// `/roadwork-verify-and-archive <ref>` where no unmet gate follows the run; else none, and the line carries no block.
function acceptance(it) {
  if (!it.state.startsWith('in process at G')) return null;
  const l = ledgerOf(it);
  const run = [];
  for (let k = l.gates.findIndex((x) => x.id === l.gate); k >= 0 && k < l.gates.length; k++) {
    const x = l.gates[k];
    if (!l.unmet.includes(x.id) || !x.operator || x.check) break;
    run.push(x.id);
  }
  if (!run.length) return null;
  let branch = '';
  try { const b = JSON.parse(readFileSync(join(it.dir, 'base.json'), 'utf8')).branch; if (typeof b === 'string') branch = b; } catch { branch = ''; }
  const named = branch ? unlanded.filter((line) => line.split(' ')[1] === branch) : [];
  const rest = l.unmet.filter((x) => !run.includes(x));
  const next = named.length === 1 ? `open the pull request for ${named[0].split(' ')[0]} ${branch}`
    : !rest.length ? `/roadwork-verify-and-archive ${it.ref}` : null;
  return { run, next };
}

function resolveRef(ref) {
  const m = ref.replace(/^(nexus|main)\//, '').match(/^(todo|feature)\/([a-z0-9-]+)$/);
  if (!m) return null;
  return byName[m[1]].get(m[2]) || null;
}
function blocksUs(entry) {
  const it = resolveRef(entry);
  if (!it) return null; // archived or absent: past
  const l = ledgerOf(it);
  if (l && l.met) return null; // built: cleared
  return it;
}
// The status read (the rule's externality standard), once per item whose `external` is set, through the config skill's
// calling script, which alone reads `status-url`. The answer is matched to the spec's Dependencies entries another party
// acts on by `what`, exact after trimming; an entry no element matches is open, an element no entry matches ignored.
// The item's state is the worst of its entries: unknown over all, then open, cleared only when every entry is.
const externality = join(here, '..', '..', 'roadwork-config', 'scripts', 'externality.mjs');
const externalStates = new Map();
function dependencyWhats(it) {
  const p = join(it.dir, 'spec.md');
  const lines = existsSync(p) ? read(p).split('\n') : [];
  const start = lines.findIndex((l) => l.trim() === '## Dependencies');
  if (start < 0) return [];
  const whats = [];
  for (const l of lines.slice(start + 1)) {
    if (l.startsWith('## ')) break;
    const m = l.match(/^D\d+\. (.*?) — who acts: (.*?) — observed by:/);
    if (m && !/^`?(?:todo|feature|nexus|main)\//.test(m[2].trim())) whats.push(m[1].trim());
  }
  return whats;
}
function externalState(it) {
  if (externalStates.has(it.ref)) return externalStates.get(it.ref);
  const r = spawnSync(process.execPath, [externality, '--config-file', join(root, 'config.json'), 'status', '--item', it.ref, '--wait-ms', '3000'], { encoding: 'utf8' });
  const lines = (r.stdout || '').split('\n').filter((l) => l.trim() !== '');
  let s;
  if (lines.some((l) => l.startsWith('no status URL'))) s = 'no status URL';
  else if (!lines.length || lines.some((l) => l.startsWith('unknown:'))) s = 'unknown';
  else {
    const got = new Map();
    for (const l of lines) { const m = l.match(/^(open|cleared): (.*)$/); if (m && got.get(m[2].trim()) !== 'open') got.set(m[2].trim(), m[1]); }
    const whats = dependencyWhats(it);
    s = whats.length && whats.every((w) => got.get(w) === 'cleared') ? 'cleared' : 'open';
  }
  externalStates.set(it.ref, s);
  return s;
}
function lifecycle(it) {
  const intent = read(join(it.dir, 'intent.md'));
  if (intentPlaceholder(intent)) return 'awaits interview';
  if (!isAccepted(intent)) return 'intent drafted, not accepted';
  const spec = read(join(it.dir, 'spec.md'));
  if (specPlaceholder(spec)) return 'intent accepted';
  if (!isAccepted(spec)) return 'spec drafted, not accepted';
  return 'awaits the go';
}
function state(it, depth = 0) {
  if (it.fm['in-process']) {
    const l = ledgerOf(it);
    if (!l) return 'in process, no ledger';
    if (l.met) return 'in process, all gates met';
    return `in process at G${l.gate} (${l.title})`;
  }
  if (it.fm.external) return `external: ${it.fm.external} — ${externalState(it)}`;
  for (const entry of it.fm['blocked-by'] || []) {
    const b = blocksUs(entry);
    if (b) return depth === 0 ? `${lifecycle(it)} · blocked by ${b.ref} (${state(b, 1)})` : `blocked by ${b.ref}`;
  }
  return lifecycle(it);
}
const NEXT = {
  'awaits interview': 'roadwork-intentify',
  'intent drafted, not accepted': 'roadwork-intentify',
  'intent accepted': 'roadwork-specplan',
  'awaits the go': 'roadwork-make',
  'in process, all gates met': 'roadwork-verify-and-archive',
};
// A blocked line: `<lifecycle state> · blocked by …`; lifeOf gives that prefix, any other state itself.
const lifeOf = (t) => (t.match(/^(awaits interview|intent drafted, not accepted|intent accepted|spec drafted, not accepted|awaits the go) · blocked by /) || [, t])[1];
const nextOf = (t) => { const s = lifeOf(t); return s !== t && s === 'awaits the go' ? undefined : NEXT[s]; };
const BUCKET = (t) => { const s = lifeOf(t); return s !== t && s === 'awaits the go' ? 'blocked'
  : (s === 'awaits interview' || s === 'intent drafted, not accepted') ? 'interview'
  : (s === 'intent accepted' || s === 'spec drafted, not accepted') ? 'accepted'
  : s === 'awaits the go' ? 'go' : s.startsWith('in process') ? 'process' : s.startsWith('external') ? 'external' : null; };

for (const it of items) it.state = state(it);
const counts = { interview: 0, accepted: 0, go: 0, process: 0, blocked: 0, external: 0 };
for (const it of items) { const b = BUCKET(it.state); if (b) counts[b]++; }

function orderedItems(folder, order) {
  const mine = items.filter((it) => it.folder === folder);
  const inOrder = order.map((ref) => mine.find((it) => it.ref === ref)).filter(Boolean);
  const rest = mine.filter((it) => !inOrder.includes(it)).sort((a, b) => (a.ref < b.ref ? -1 : 1));
  return [...inOrder.map((it) => ({ it, placed: true })), ...rest.map((it) => ({ it, placed: false }))];
}

// --- sparks ---------------------------------------------------------------------
const sparks = dirs(join(root, 'spark')).filter((n) => existsSync(join(root, 'spark', n, 'idea.md'))).map((name) => {
  const text = read(join(root, 'spark', name, 'idea.md'));
  const dl = text.split('\n').filter((l) => l.startsWith('**Destination')).pop();
  let assignment = 'pending assignment';
  if (dl) { const m = dl.match(/:\*\*\s*([^\s,.;]+)/); if (m) assignment = `assigned to ${m[1]}`; }
  return { ref: `spark/${name}`, title: heading(text), assignment };
});

// --- not yet landed ------------------------------------------------------------
let unlanded = [];
{
  const r = spawnSync(process.execPath, [join(here, 'unlanded.mjs'), '--config-file', join(root, 'config.json')], { encoding: 'utf8' });
  if (r.status === 1) fail(`unlanded.mjs failed: ${(r.stderr || '').trim()}`);
  unlanded = (r.stdout || '').split('\n').filter((l) => l.trim() !== '');
}

// --- the filter --------------------------------------------------------------------
const only = opt.only ? new Set(opt.only) : null;
const keepItem = (it) => !only || only.has(it.ref);
const keepSpark = (s) => !only || only.has(s.ref);
const keepUnlanded = (line) => { if (!only) return true; const m = line.match(/^(\S+) (\S+)/); return !!m && only.has(`unlanded:${m[1]}/${m[2]}`); };

// --- render ------------------------------------------------------------------------
// The skill's §4 form. Two options serve the item checkers' byte comparisons only: --date prints that date in the
// title in place of the machine's, --unlanded-lines prints a file's lines in place of unlanded.mjs's output.
const pad = (v) => String(v).padStart(2, '0');
const clock = new Date();
const date = opt.date ?? `${clock.getFullYear()}-${pad(clock.getMonth() + 1)}-${pad(clock.getDate())}`;
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`--date needs YYYY-MM-DD, got ${JSON.stringify(date)}`);
if (opt['unlanded-lines'] !== undefined) unlanded = read(resolve(opt['unlanded-lines'])).split('\n').filter((l) => l.trim() !== '');

const out = [];
let id = 0;
const count = (k, one, many) => `${k} ${k === 1 ? one : many}`;
const ready = (rows) => rows.filter(({ it }) => nextOf(it.state) || (acceptance(it) || {}).next).length;
const coded = (state) => (lifeOf(state) === state ? state : state.replace(/blocked by ((?:todo|feature)\/[a-z0-9-]+)/g, 'blocked by `$1`'));
function bullets(rows) {
  const kept = rows.filter(({ it }) => keepItem(it));
  if (!rows.length) { out.push('- no open items'); return; }
  if (!kept.length) { out.push('- no keyword-filtered items found'); return; }
  for (const { it, placed } of kept) {
    const next = nextOf(it.state);
    const a = next ? null : acceptance(it);
    const ids = a && a.next ? a.run.map((n) => `G${n}`) : [];
    const words = ids.length > 1 ? `${ids.slice(0, -1).join(', ')} and ${ids[ids.length - 1]}` : ids[0];
    const block = next ? `/${next} ${it.ref}` : ids.length ? `${words} accepted and ${a.next}` : null;
    const idTag = block ? `**O${++id}** ` : '';
    const level = it.level ? ` · ${it.level}` : '';
    const life = lifeOf(it.state);
    const state = block ? `**${life}**${coded(it.state).slice(life.length)}` : coded(it.state);
    const placement = placed ? '' : ' · not in the ordering';
    out.push(`- ${idTag}\`${it.ref}\`${level} · ${state}${placement}`, `  ${it.title}`);
    if (block) out.push('  ```', `  ${block}`, '  ```');
  }
}
const emptied = (rows) => rows.length > 0 && !rows.some(({ it }) => keepItem(it));
const destinationRows = (d) => (d.nav === 'not yet navigated' ? [] : orderedItems(d.slug, d.block ? d.block.items : []));
function destinationLines(d) {
  const rows = destinationRows(d);
  out.push(`### ${d.slug} — ${d.title}`, `${d.nav} · ${count(rows.length, 'open item', 'open items')} · ${ready(rows)} ready`, '');
  if (d.nav === 'not yet navigated') return;
  bullets(rows);
  out.push('');
}

out.push(`# Inventory — ${date}`, '');
if (opt.only) {
  const kept = opt.kept ? `kept ${opt.kept}` : '';
  const removed = opt.removed ? `removed ${opt.removed}` : '';
  out.push(`Filtered by ${opt['filtered-by'] || ''}: ${[kept, removed].filter(Boolean).join('; ')}.`, '');
}
out.push([count(items.length, 'open work item', 'open work items'), `${counts.interview} await interview`, `${counts.accepted} intent accepted`, `${counts.go} await the go`, `${counts.process} in process`, `${counts.blocked} blocked`, `${counts.external} external`].join(' · '), '');

const atlasRank = (a) => { const ps = destinations.filter((d) => d.atlas === a.slug && d.priority !== null).map((d) => d.priority); return ps.length ? Math.max(...ps) : null; };
atlases.sort((a, b) => { const ra = atlasRank(a), rb = atlasRank(b); if (ra !== rb) { if (ra === null) return 1; if (rb === null) return -1; return rb - ra; } return a.slug < b.slug ? -1 : 1; });
for (const a of atlases) {
  const ds = destinations.filter((d) => d.atlas === a.slug);
  const nav = ds.filter((d) => d.nav.startsWith('navigated')).length;
  const built = ds.filter((d) => d.nav.startsWith('built')).length;
  out.push(`## Atlas: ${a.slug}`, `_${a.description || '(no description)'}_`, '', `${count(ds.length, 'open destination', 'open destinations')} · ${nav} navigated${built ? ` · ${built} built` : ''}`);
  const withItems = ds.map(destinationRows).filter((rows) => rows.length);
  if (only && withItems.length && withItems.every(emptied)) out.push('- no keyword-filtered items found');
  out.push('');
  for (const d of ds) destinationLines(d);
}
const atlasless = destinations.filter((d) => !d.atlas);
if (atlasless.length) {
  out.push('## No atlas', '');
  for (const d of atlasless) destinationLines(d);
}
{
  const rows = orderedItems('unnavigated', topItems);
  out.push('## Not yet navigated', `${count(rows.length, 'open item', 'open items')} · ${ready(rows)} ready`, '');
  bullets(rows);
  out.push('');
}
out.push('## Ideas parked for later');
{
  const kept = sparks.filter(keepSpark);
  if (!sparks.length) out.push('- no open items');
  else if (!kept.length) out.push('- no keyword-filtered items found');
  else for (const s of kept) out.push(`- \`${s.ref}\` · ${s.title} · ${s.assignment}`);
}
{
  const kept = unlanded.filter(keepUnlanded);
  if (unlanded.length && (kept.length || !only)) { out.push('', '## Not yet landed'); for (const l of kept) out.push(`- ${l}`); }
  else if (unlanded.length && only) out.push('', '## Not yet landed', '- no keyword-filtered items found');
}
process.stdout.write(out.join('\n') + '\n');

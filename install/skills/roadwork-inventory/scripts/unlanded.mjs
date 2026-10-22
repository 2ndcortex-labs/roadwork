#!/usr/bin/env node
// unlanded.mjs — the branches of the project's repositories not yet landed on origin's default branch, from local refs only.
// Usage: node unlanded.mjs [--root <project root>] [--repo <name> --branch <branch>] [--config-file <config.json>]
// Prints nothing and exits 2 unless the register's config key `versioned` is `yes` (roadwork-config). Never fetches, pushes or writes.
// Line forms (the spec of todo/stale-branches-surfaced-as-offers, R3–R4):
//   <repo> <branch> — <n> commits, <d> days (tip <YYYY-MM-DD>); last fetch <YYYY-MM-DD HH:MM | never>[ — waits on <branch>]
//   <repo> <branch> — pushed, not landed; last fetch <time>
//   <repo> <default> — <n> commits ahead of origin, on the default branch; no pull request from here
// With --repo --branch: that branch's line alone, or `landed`.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) { opt[args[i].slice(2)] = args[i + 1]; i++; }
  else fail(`unexpected argument ${args[i]}`);
}
if ((opt.repo && !opt.branch) || (!opt.repo && opt.branch)) fail('--repo and --branch go together');
function fail(msg) { process.stderr.write(msg + '\n'); process.exit(1); }

const here = dirname(fileURLToPath(import.meta.url));
const CONFIG_MJS = resolve(here, '..', '..', 'roadwork-config', 'scripts', 'config.mjs');

// The project root: --root; else the nearest ancestor of this script holding nethub/; else the parent of the nearest register above the cwd.
function findRoot() {
  if (opt.root) return resolve(opt.root);
  for (let d = here; ; d = dirname(d)) {
    if (existsSync(join(d, 'nethub'))) return d;
    if (dirname(d) === d) break;
  }
  for (let d = process.cwd(); ; d = dirname(d)) {
    if (existsSync(join(d, 'roadwork', 'ordering.md'))) return d;
    if (existsSync(join(d, 'ordering.md'))) return dirname(d);
    if (dirname(d) === d) fail('no project root found');
  }
}
const root = findRoot();
const inWorkspace = existsSync(join(root, 'nethub'));
const configFile = opt['config-file'] || (inWorkspace ? join(root, 'nethub', 'nexus', 'roadwork', 'config.json') : join(root, 'roadwork', 'config.json'));

// The gate: config.mjs get versioned, read through --config-file as the config skill reads it.
let versioned = 'empty';
if (existsSync(configFile)) {
  try { versioned = execFileSync(process.execPath, [CONFIG_MJS, '--config-file', configFile, 'get', 'versioned'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { versioned = 'empty'; }
}
if (versioned !== 'yes') process.exit(2);

// The repositories: in a workspace, the statement of authority's names at the workspace pattern's paths; outside, the root's own repository.
function repositories() {
  if (!inWorkspace) return [{ name: basename(root), path: root }];
  const statement = join(root, 'nethub', 'nexus', 'CLAUDE.md');
  const text = existsSync(statement) ? readFileSync(statement, 'utf8') : '';
  const m = text.match(/holds the seat over: ([^.\n]+)/);
  const names = m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  return names.map((name) => ({
    name,
    path: name === 'nethub' ? join(root, 'nethub') : name === 'standup-guy' ? join(root, 'nethub', 'standup-guy') : join(root, name),
  }));
}

function git(path, a) {
  try { return execFileSync('git', ['-C', path, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\n$/, ''); } catch { return null; }
}
const isAncestor = (path, a, b) => { try { execFileSync('git', ['-C', path, 'merge-base', '--is-ancestor', a, b], { stdio: 'ignore' }); return true; } catch { return false; } };
const count = (path, range) => { const c = git(path, ['rev-list', '--count', range]); return c === null ? null : Number(c); };
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const ymdhm = (d) => `${ymd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

function readRepo(r) {
  if (!existsSync(join(r.path, '.git')) && git(r.path, ['rev-parse', '--git-dir']) === null) return { lines: [`${r.name} — no clone at ${r.path}`], rows: [] };
  const head = git(r.path, ['symbolic-ref', '-q', 'refs/remotes/origin/HEAD']);
  const def = head ? head.replace('refs/remotes/origin/', '') : 'main';
  const base = `origin/${def}`;
  const hasBase = git(r.path, ['rev-parse', '--verify', '-q', base]) !== null;
  const gitDir = git(r.path, ['rev-parse', '--absolute-git-dir']);
  const fetchHead = gitDir ? join(gitDir, 'FETCH_HEAD') : null;
  const lastFetch = fetchHead && existsSync(fetchHead) ? ymdhm(statSync(fetchHead).mtime) : 'never';
  const refs = (git(r.path, ['for-each-ref', 'refs/heads', '--format=%(refname:short)\t%(upstream:short)']) || '').split('\n').filter(Boolean);
  const rows = [];
  let defaultRow = null;
  for (const line of refs) {
    const [branch, upstream] = line.split('\t');
    if (branch === def) {
      if (hasBase) { const ahead = count(r.path, `${base}..${branch}`); if (ahead > 0) defaultRow = { kind: 'default', branch, n: ahead }; }
      continue;
    }
    const landed = hasBase && isAncestor(r.path, branch, base);
    if (landed) continue;
    const aheadOfUpstream = upstream ? count(r.path, `${upstream}..${branch}`) : null;
    const pushed = upstream && aheadOfUpstream === 0;
    const at = Number(git(r.path, ['log', '-1', '--format=%at', branch]));
    const n = hasBase ? count(r.path, `${base}..${branch}`) : count(r.path, branch);
    rows.push({ kind: pushed ? 'pushed' : 'unlanded', branch, n, at, tip: git(r.path, ['rev-parse', branch]) });
  }
  const unlanded = rows.filter((x) => x.kind === 'unlanded').sort((a, b) => a.at - b.at || a.branch.localeCompare(b.branch));
  for (const x of unlanded) {
    let best = null;
    for (const y of unlanded) {
      if (y === x || y.tip === x.tip) continue;
      if (!isAncestor(r.path, y.tip, x.tip)) continue;
      const dist = count(r.path, `${y.tip}..${x.tip}`);
      if (best === null || dist < best.dist) best = { branch: y.branch, dist };
    }
    x.waits = best ? best.branch : null;
  }
  const now = Date.now() / 1000;
  const fmt = (x) => {
    if (x.kind === 'pushed') return `${r.name} ${x.branch} — pushed, not landed; last fetch ${lastFetch}`;
    const days = Math.floor((now - x.at) / 86400);
    return `${r.name} ${x.branch} — ${x.n} commits, ${days} days (tip ${ymd(new Date(x.at * 1000))}); last fetch ${lastFetch}${x.waits ? ` — waits on ${x.waits}` : ''}`;
  };
  const all = [...unlanded, ...rows.filter((x) => x.kind === 'pushed').sort((a, b) => a.at - b.at)];
  const lines = all.map(fmt);
  if (defaultRow) lines.push(`${r.name} ${def} — ${defaultRow.n} commits ahead of origin, on the default branch; no pull request from here`);
  return { lines, rows: all.map((x) => ({ ...x, line: fmt(x) })) };
}

const repos = repositories();
if (opt.repo) {
  const r = repos.find((x) => x.name === opt.repo);
  if (!r) fail(`${opt.repo}: not a repository of this project`);
  const row = readRepo(r).rows.find((x) => x.branch === opt.branch);
  process.stdout.write((row ? row.line : 'landed') + '\n');
} else {
  const out = [];
  for (const r of repos) out.push(...readRepo(r).lines);
  if (out.length) process.stdout.write(out.join('\n') + '\n');
}

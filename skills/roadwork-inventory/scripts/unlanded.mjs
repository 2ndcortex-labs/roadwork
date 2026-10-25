#!/usr/bin/env node
// unlanded.mjs — the branches of the project's repositories not yet landed on origin's default branch, from local refs only.
// Usage: node unlanded.mjs [--root <project root>] [--repo <name> --branch <branch>] [--config-file <config.json>]
// Prints nothing and exits 2 unless the register's config key `versioned` is `yes` (roadwork-config). Never fetches, pushes or writes.
// Reads the keys `project-root` and `repos` through the config script as it reads `versioned`.
// Line forms (the spec of todo/stale-branches-surfaced-as-offers, R3–R4):
//   <repo> <branch> — <n> commits, <d> days (tip <YYYY-MM-DD>); last fetch <YYYY-MM-DD HH:MM | never>[ — waits on <branch>]
//   <repo> <branch> — pushed, not landed; last fetch <time>
//   <repo> <default> — <n> commits ahead of origin, on the default branch; no pull request from here
// With --repo --branch: that branch's line alone, or `landed`.
import { existsSync, statSync } from 'node:fs';
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

// The register: the folder of --config-file; else the nearest above the cwd holding roadwork/ordering.md (that roadwork/) or
// ordering.md itself, as the config script finds it; else, with --root, <root>/roadwork.
function findRegister() {
  if (opt['config-file']) return dirname(resolve(opt['config-file']));
  for (let d = process.cwd(); ; d = dirname(d)) {
    if (existsSync(join(d, 'roadwork', 'ordering.md'))) return join(d, 'roadwork');
    if (existsSync(join(d, 'ordering.md'))) return d;
    if (dirname(d) === d) break;
  }
  if (opt.root) return join(resolve(opt.root), 'roadwork');
  fail('no project root found');
}
const register = findRegister();
const configFile = opt['config-file'] ? resolve(opt['config-file']) : join(register, 'config.json');

// One key, read through --config-file as the config skill reads it: its value, its lines for a list key, or 'empty'.
function setting(key) {
  if (!existsSync(configFile)) return 'empty';
  try { return execFileSync(process.execPath, [CONFIG_MJS, '--config-file', configFile, 'get', key], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return 'empty'; }
}

// The gate: config.mjs get versioned.
const versioned = setting('versioned');
if (versioned !== 'yes') process.exit(2);

// The project root: --root; else the register's folder resolved through the setting project-root, unset `..`.
const projectRootSetting = setting('project-root');
const root = opt.root ? resolve(opt.root) : resolve(register, projectRootSetting === 'empty' ? '..' : projectRootSetting);

// The repositories: the setting repos, paths from the project root, in its order; unset, `.`, the root's own repository.
// Each is named by its folder's last segment.
function repositories() {
  const listed = setting('repos');
  const paths = listed === 'empty' ? ['.'] : listed.split('\n').map((s) => s.trim()).filter(Boolean);
  return paths.map((p) => { const path = join(root, p); return { name: basename(path), path }; });
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

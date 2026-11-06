#!/usr/bin/env node
// unlanded.mjs — one branch of one repository of the project, landed on origin's default branch or not, from local refs only.
// Usage: node unlanded.mjs --path <repository root> --branch <branch> [--root <project root>] [--config-file <config.json>]
// --path is the repository's folder as a path from the project's root, `.` the root itself, as an item's landing.json
// records it; the repository is named by that folder's last segment. Never fetches, pushes or writes. Reads the key
// `project-root` through the config script.
// Prints that branch's line, or `landed`. Line forms (the spec of todo/stale-branches-surfaced-as-offers, R3–R4):
//   <repo> <branch> — <n> commits, <d> days (tip <YYYY-MM-DD>); last fetch <YYYY-MM-DD HH:MM | never>[ — waits on <branch>]
//   <repo> <branch> — pushed, not landed; last fetch <time>
// A path that is no repository prints `<repo> — no clone at <path>` and exits 1.
import { existsSync, statSync, realpathSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i++) {
  if (!['--root', '--path', '--branch', '--config-file'].includes(args[i])) fail(`unexpected argument ${args[i]}`);
  if (i + 1 >= args.length) fail(`${args[i]} needs a value`);
  opt[args[i].slice(2)] = args[++i];
}
if (!opt.path || !opt.branch) fail('--path and --branch go together, both required');
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

// The project root: --root, as given; else the register's folder resolved through the setting project-root, unset `..`,
// through any link, as the root found from this script's own folder always was (node resolves the script's path).
const projectRootSetting = setting('project-root');
const physical = (p) => { try { return realpathSync(p); } catch { return p; } };
const root = opt.root ? resolve(opt.root) : physical(resolve(register, projectRootSetting === 'empty' ? '..' : projectRootSetting));

// The repository: --path from the project root, named by its folder's last segment.
const repository = (() => { const path = join(root, opt.path); return { name: basename(path), path }; })();

function git(path, a) {
  try { return execFileSync('git', ['-C', path, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\n$/, ''); } catch { return null; }
}
const isAncestor = (path, a, b) => { try { execFileSync('git', ['-C', path, 'merge-base', '--is-ancestor', a, b], { stdio: 'ignore' }); return true; } catch { return false; } };
const count = (path, range) => { const c = git(path, ['rev-list', '--count', range]); return c === null ? null : Number(c); };
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const ymdhm = (d) => `${ymd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

function readRepo(r) {
  if (!existsSync(join(r.path, '.git')) && git(r.path, ['rev-parse', '--git-dir']) === null) return { lines: [`${r.name} — no clone at ${r.path}`], rows: [], noClone: true };
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

const read = readRepo(repository);
if (read.noClone) { process.stdout.write(read.lines[0] + '\n'); process.exit(1); }
const row = read.rows.find((x) => x.branch === opt.branch);
process.stdout.write((row ? row.line : 'landed') + '\n');

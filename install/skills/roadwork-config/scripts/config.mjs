#!/usr/bin/env node
// roadwork-config — reads and sets roadwork/config.json (the register's settings file).
// Usage: node config.mjs [--config-file PATH] [set <key> <value> | set <list-key> [<path> …] | get <key> | set-from-env | set-from-file <key> <path> | empty]
// Secrets are never printed: only "set, <n> characters" or "empty". No network, no dependencies.
import { existsSync, readFileSync, writeFileSync, chmodSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, isAbsolute, basename, sep } from 'node:path';
import process from 'node:process';

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const isHttps = (v) => { try { return new URL(v).protocol === 'https:'; } catch { return false; } };
const nonEmpty = (v) => v.length > 0;
const isDirUnder = (p) => existsSync(p) && statSync(p).isDirectory();
const isEmpty = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

const SCHEMA = [
  ['org-slug', "the organisation's slug", 'kebab-case ^[a-z0-9]+(-[a-z0-9]+)*$', false, (v) => KEBAB.test(v)],
  ['externality-add-endpoint', "the externality service's add address", 'an https:// URL', false, isHttps],
  ['externality-update-endpoint', "the externality service's update address", 'an https:// URL', false, isHttps],
  ['externality-status-endpoint', "the externality service's status address", 'an https:// URL', false, isHttps],
  ['externality-inventory-endpoint', "the externality service's inventory address", 'an https:// URL', false, isHttps],
  ['externality-key', "the externality service's key, one static key per org; low security, set as any key", 'non-empty', false, nonEmpty],
].map(([key, meaning, shape, secret, valid]) => ({ key, meaning, shape, secret, valid }));
// A list key, optional: the project's standards folders, relative to the project's root, each an existing folder under it.
SCHEMA.push({ key: 'standards-folders', meaning: "the project's standards folders, in the project's own structure — coding standards, brand, styling and the like; optional, empty where a project keeps none; a list, in the order given", shape: "a list of folder paths relative to the project's root, each an existing folder under it", secret: false, list: true, optional: true, valid: (entries, root) => entries.every((e) => isDirUnder(join(root, e))) });
// Instance keys: docs/local/config-keys.json beside the register's config.json (ignored by git, instance material):
// [{ "key", "meaning", "shape": "non-empty" | "https" | "kebab", "secret": true|false }, ...]. Merged after the schema; a key the schema has is refused.
const SHAPES = { 'non-empty': ['non-empty', nonEmpty], https: ['an https:// URL', isHttps], kebab: ['kebab-case ^[a-z0-9]+(-[a-z0-9]+)*$', (v) => KEBAB.test(v)] };
function loadInstanceKeys(configFile) {
  const f = join(dirname(configFile), 'docs', 'local', 'config-keys.json');
  if (!existsSync(f)) return;
  let list; try { list = JSON.parse(readFileSync(f, 'utf8')); } catch { fail(`${f}: not JSON`); }
  if (!Array.isArray(list)) fail(`${f}: not a list`);
  for (const e of list) {
    if (!e || typeof e.key !== 'string' || !SHAPES[e.shape]) fail(`${f}: an entry needs key, meaning, shape (non-empty | https | kebab), secret`);
    if (SCHEMA.some((s) => s.key === e.key)) fail(`${f}: ${e.key} is already in the schema`);
    const [shape, valid] = SHAPES[e.shape];
    SCHEMA.push({ key: e.key, meaning: `${e.meaning || ''} (instance key)`, shape, secret: !!e.secret, valid });
  }
}
const byKey = new Map();

function fail(msg) { process.stderr.write(msg + '\n'); process.exit(1); }

function findConfig() {
  const cwd = process.cwd();
  let d = resolve(cwd);
  for (;;) {
    if (existsSync(join(d, 'roadwork', 'ordering.md'))) return join(d, 'roadwork', 'config.json');
    if (existsSync(join(d, 'ordering.md'))) return join(d, 'config.json');
    const p = dirname(d);
    if (p === d) fail(`no register found above ${cwd}`);
    d = p;
  }
}

// The project's root: the folder that holds nethub/ where the register sits at nethub/nexus/roadwork/; elsewhere the folder that holds the register.
function projectRoot(file) {
  const d = dirname(file);
  if (basename(d) === 'roadwork' && basename(dirname(d)) === 'nexus' && basename(dirname(dirname(d))) === 'nethub') return dirname(dirname(dirname(d)));
  return dirname(d);
}
// A list key's entries: each resolved against the root, normalised root-relative, refused when it escapes the root, is not a folder, or repeats.
function listEntries(key, paths, root) {
  const out = [];
  for (const p of paths) {
    const abs = resolve(root, p);
    const rel = relative(root, abs);
    if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) fail(`${key} refused: ${p} escapes the project's root ${root}`);
    if (!isDirUnder(abs)) fail(`${key} refused: ${p} is not an existing folder under the project's root ${root}`);
    const norm = rel.split(sep).join('/');
    if (out.includes(norm)) fail(`${key} refused: ${norm} repeated`);
    out.push(norm);
  }
  return out;
}

function load(file) {
  if (!existsSync(file)) { writeFileSync(file, '{}\n', { mode: 0o600 }); chmodSync(file, 0o600); }
  let obj;
  try { obj = JSON.parse(readFileSync(file, 'utf8')); } catch { fail(`${file} is not valid JSON`); }
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) fail(`${file} is not a JSON object`);
  return obj;
}

function save(file, obj) {
  writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', { mode: 0o600 });
  chmodSync(file, 0o600);
}

function check(key, value) {
  const s = byKey.get(key);
  if (!s) fail(`unknown key ${key}; the schema's keys: ${SCHEMA.map((x) => x.key).join(', ')}`);
  if (!s.valid(value)) fail(`${key} refused: ${s.meaning}; shape: ${s.shape}`);
  return s;
}

function setMasked(file, key, value) {
  if (value === undefined || value === '') { if (!byKey.has(key)) check(key, ''); fail('empty value refused'); }
  check(key, value);
  const obj = load(file);
  obj[key] = value;
  save(file, obj);
  process.stdout.write(`${key}: set, ${value.length} characters\n`);
}

let args = process.argv.slice(2);
let file;
if (args[0] === '--config-file') {
  if (!args[1]) fail('--config-file needs a path');
  file = resolve(args[1]);
  args = args.slice(2);
} else {
  file = findConfig();
}
loadInstanceKeys(file);
for (const s of SCHEMA) byKey.set(s.key, s);
const [cmd, ...rest] = args;

if (cmd === undefined) {
  const obj = load(file);
  const out = [];
  for (const s of SCHEMA) {
    const raw = obj[s.key];
    const v = Array.isArray(raw) ? raw.join(', ') : (typeof raw === 'string' ? raw : (raw == null ? '' : String(raw)));
    if (s.secret) out.push(`${s.key}: ${v ? `set, ${v.length} characters` : 'empty'}`);
    else out.push(`${s.key}: ${v || 'empty'}`);
  }
  for (const k of Object.keys(obj)) if (!byKey.has(k)) out.push(`${k}: unknown, not in the schema`);
  process.stdout.write(out.join('\n') + '\n');
} else if (cmd === 'set' && byKey.get(rest[0])?.list) {
  const [key, ...paths] = rest;
  const entries = listEntries(key, paths, projectRoot(file));
  const obj = load(file);
  obj[key] = entries;
  save(file, obj);
  process.stdout.write(`${key}: ${entries.length ? entries.join(', ') : 'empty'}\n`);
} else if (cmd === 'get') {
  if (rest.length !== 1) fail('usage: get <key>');
  const key = rest[0];
  const s = byKey.get(key);
  if (!s) check(key, '');
  const raw = load(file)[key];
  if (s.secret) { const v = typeof raw === 'string' ? raw : ''; process.stdout.write(v ? `set, ${v.length} characters\n` : 'empty\n'); }
  else if (s.list) process.stdout.write(Array.isArray(raw) && raw.length ? raw.join('\n') + '\n' : 'empty\n');
  else process.stdout.write((typeof raw === 'string' && raw) ? raw + '\n' : 'empty\n');
} else if (cmd === 'set') {
  if (rest.length !== 2) fail('usage: set <key> <value>');
  const [key, value] = rest;
  const s = byKey.get(key);
  if (!s) check(key, value);
  if (s.secret) fail(`set ${key} from the terminal line the skill prints`);
  check(key, value);
  const obj = load(file);
  obj[key] = value;
  save(file, obj);
  process.stdout.write(`${key}: ${value}\n`);
} else if (cmd === 'set-from-env') {
  const key = process.env.CONFIG_KEY;
  if (!key) fail('CONFIG_KEY is not set');
  setMasked(file, key, process.env.CONFIG_VALUE);
} else if (cmd === 'set-from-file') {
  if (rest.length !== 2) fail('usage: set-from-file <key> <path>');
  const [key, path] = rest;
  if (!byKey.has(key)) check(key, '');
  let value;
  try { value = readFileSync(path, 'utf8'); } catch { fail(`cannot read ${path}`); }
  if (value.endsWith('\r\n')) value = value.slice(0, -2);
  else if (value.endsWith('\n')) value = value.slice(0, -1);
  setMasked(file, key, value);
} else if (cmd === 'empty') {
  const obj = load(file);
  const empty = SCHEMA.filter((s) => !s.optional && isEmpty(obj[s.key]));
  if (empty.length === 0) process.stdout.write('none\n');
  else process.stdout.write(empty.map((s, i) => `${i + 1}. ${s.key} — ${s.meaning}`).join('\n') + '\n');
} else {
  fail(`unknown command ${cmd}; the commands: set, get, set-from-env, set-from-file, empty`);
}

#!/usr/bin/env node
// roadwork-config — reads and sets roadwork/config.json (the register's settings file).
// Usage: node config.mjs [--config-file PATH] [set <key> <value> | set-from-env | set-from-file <key> <path> | empty]
// Secrets are never printed: only "set, <n> characters" or "empty". No network, no dependencies.
import { existsSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import process from 'node:process';

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const isHttps = (v) => { try { return new URL(v).protocol === 'https:'; } catch { return false; } };
const nonEmpty = (v) => v.length > 0;

const SCHEMA = [
  ['org-slug', "the organisation's slug", 'kebab-case ^[a-z0-9]+(-[a-z0-9]+)*$', false, (v) => KEBAB.test(v)],
  ['externality-add-endpoint', "the externality service's add address", 'an https:// URL', false, isHttps],
  ['externality-update-endpoint', "the externality service's update address", 'an https:// URL', false, isHttps],
  ['externality-status-endpoint', "the externality service's status address", 'an https:// URL', false, isHttps],
  ['externality-inventory-endpoint', "the externality service's inventory address", 'an https:// URL', false, isHttps],
  ['externality-key', "the externality service's key, one static key per org", 'non-empty', true, nonEmpty],
  ['RAILWAY_TOKEN', "the service's deploy token on Railway", 'non-empty', true, nonEmpty],
].map(([key, meaning, shape, secret, valid]) => ({ key, meaning, shape, secret, valid }));
const byKey = new Map(SCHEMA.map((s) => [s.key, s]));

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
const [cmd, ...rest] = args;

if (cmd === undefined) {
  const obj = load(file);
  const out = [];
  for (const s of SCHEMA) {
    const v = typeof obj[s.key] === 'string' ? obj[s.key] : (obj[s.key] == null ? '' : String(obj[s.key]));
    if (s.secret) out.push(`${s.key}: ${v ? `set, ${v.length} characters` : 'empty'}`);
    else out.push(`${s.key}: ${v || 'empty'}`);
  }
  for (const k of Object.keys(obj)) if (!byKey.has(k)) out.push(`${k}: unknown, not in the schema`);
  process.stdout.write(out.join('\n') + '\n');
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
  const empty = SCHEMA.filter((s) => !obj[s.key]);
  if (empty.length === 0) process.stdout.write('none\n');
  else process.stdout.write(empty.map((s, i) => `${i + 1}. ${s.key} — ${s.meaning}`).join('\n') + '\n');
} else {
  fail(`unknown command ${cmd}; the commands: set, set-from-env, set-from-file, empty`);
}

#!/usr/bin/env node
// roadwork-config — reads and sets roadwork/config.json (the register's settings file).
// Usage: node config.mjs [--config-file PATH] [set <key> <value> | set <list-key> [<path> …] | get <key> | unset <key> | set-from-env | set-from-file <key> <path> | empty]
// Secrets are never printed: only "set, <n> characters" or "empty". No network, no dependencies.
import { existsSync, readFileSync, writeFileSync, chmodSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, isAbsolute, sep } from 'node:path';
import process from 'node:process';

const isHttps = (v) => { try { return new URL(v).protocol === 'https:'; } catch { return false; } };
const nonEmpty = (v) => v.length > 0;
const isDirUnder = (p) => existsSync(p) && statSync(p).isDirectory();
const isEmpty = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

// Every key is optional and each meaning is one sentence saying what reads the key and why it exists.
const SCHEMA = [];
// The four externality keys, the settings of the two generic calls of the rule's section "Externalities and their notices"
// (a notice of an entry opened or cleared, a read of entries' state): two public URL keys, printed in the clear; two secret
// token keys, the credential each address wants, sent as `Authorization: Bearer <token>` when set, masked in every reply.
SCHEMA.push({ key: 'notify-url', meaning: "the address the notice of an externality entry opened or cleared is posted to, read by `scripts/externality.mjs` alone so that a project may be told of every wait outside it, optional (empty means no notice, never asked for by the empty-keys prompt), a public address with no credential in it, printed in the clear and set by `/roadwork-config notify-url <value>` or by a route of §2", shape: 'an https:// URL', secret: false, optional: true, valid: isHttps });
SCHEMA.push({ key: 'status-url', meaning: "the address an item's externalities' state is read from for the make, the inventory and the archive, read by `scripts/externality.mjs` alone so that the state need not be asked of the Operator, optional (empty means the Operator is asked, never asked for by the empty-keys prompt), a public address as `notify-url` is, set by the same routes", shape: 'an https:// URL', secret: false, optional: true, valid: isHttps });
SCHEMA.push({ key: 'notify-token', meaning: "the credential `notify-url` wants, sent as `Authorization: Bearer <token>` on the notice when set and omitted when empty, read by `scripts/externality.mjs` alone so that the address need carry no credential, optional (never asked for by the empty-keys prompt), a secret masked in every reply and set by a route of §2", shape: 'a non-empty string', secret: true, optional: true, valid: nonEmpty });
SCHEMA.push({ key: 'status-token', meaning: "the credential `status-url` wants, sent as `Authorization: Bearer <token>` on the status read when set and omitted when empty, read by `scripts/externality.mjs` alone so that the address need carry no credential, optional (never asked for by the empty-keys prompt), a secret masked in every reply and set by a route of §2", shape: 'a non-empty string', secret: true, optional: true, valid: nonEmpty });
// A list key, optional: the project's standards folders, relative to the project's root, each an existing folder under it.
SCHEMA.push({ key: 'standards-folders', meaning: "the project's standards folders in its own structure (coding standards, brand, styling and the like, in the order given), read by the specplan and intentify skills so that a spec and an intent are written to the project's own standards, set at setup by the setup skill, or by hand, optional and empty where a project keeps none", shape: "a list of folder paths relative to the project's root, each an existing folder under it", secret: false, list: true, optional: true, valid: (entries, root) => entries.every((e) => isDirUnder(join(root, e))) });
// The sub-agent group, optional: the model family each sub-agent type runs on — a family name the dispatching host resolves (any vendor), never a release;
// unset reads as the default named in each meaning. Shape only: one token, no spaces, no separated version suffix (`sonnet-5-5`, `gpt-5.1` refused; `o3` admitted); whether the host serves the family is the skill's check at dispatch.
const isFamily = (v) => /^\S+$/.test(v) && !/[-._]\d+([-._]\d+)*$/.test(v);
for (const [type, dflt, what] of [
  ['reader', 'sonnet', 'a fresh reader of a document against one question (the verification rounds, the audit, the sanity checks)'],
  ['finder', 'haiku', "a fact lookup for the dispatcher (a file, a record of the project's history, a config value, what another item says), returned with its source by path"],
  ['explorer', 'sonnet', 'local file discovery across the project'],
  ['researcher', 'sonnet', 'outside documents and facts, compared and summarised'],
  ['builder', 'opus', 'a deliverable built under a ledger (the make, a cohort member)'],
  ['reviewer', 'opus', 'a finished change checked against its brief'],
]) SCHEMA.push({ key: `subagent-${type}`, meaning: `the model family the ${type} sub-agent runs on — ${what} — read by every skill's sub-agent dispatch as the one place a project names a model family per sub-agent type, a family name the dispatching host resolves (Anthropic's or another vendor's, the newest release of that family the host offers assumed), optional, unset reading as ${dflt}, never asked for by the empty-keys prompt`, shape: 'a model family name the host resolves; one token, no spaces, no dashed or dotted version number', secret: false, valid: isFamily, optional: true });
// A renamed key's old name, read through while the new key is empty and the old holds a value; never written, never deleted.
const OLD_KEYS = { 'subagent-researcher': 'subagent-research' };
const readThrough = (obj, key) => {
  const old = OLD_KEYS[key];
  const v = old && isEmpty(obj[key]) ? obj[old] : undefined;
  return typeof v === 'string' && v ? { old, value: v, note: `(read from the old key ${old}; set it under the new name)` } : null;
};
// The project's place, two keys, optional, each set at setup: where the project's root is from the register (unset reads as
// the default in its meaning), and the list key `standards-folders` above.
SCHEMA.push({ key: 'project-root', meaning: "the project's root as a relative path from the register (`..` where the register sits at the root's `roadwork/`, one `..` more per folder deeper), read by the config script, the audit's dispatch and writing-check scripts and the make, intentify and audit skills' texts so that every path a skill resolves against the project's root starts from it, set at setup by the setup skill, or by hand, optional, unset reading as `..`, never asked for by the empty-keys prompt", shape: 'a relative path of `..` steps: `..`, `../..` and so on', secret: false, optional: true, valid: (v) => /^\.\.(\/\.\.)*$/.test(v) });
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

// The project's root: the register's folder resolved through the setting project-root; unset, the folder that holds the register.
function projectRoot(file) {
  const v = load(file)['project-root'];
  return resolve(dirname(file), typeof v === 'string' && v ? v : '..');
}
// A list key's entries: each resolved against the root, normalised root-relative, refused when it escapes the root, is not a folder, or repeats;
// the root itself is `.` where the key admits it (allowRoot), refused elsewhere.
function listEntries(key, paths, root, allowRoot) {
  const out = [];
  for (const p of paths) {
    const abs = resolve(root, p);
    const rel = relative(root, abs);
    if ((rel === '' && !allowRoot) || rel.startsWith('..') || isAbsolute(rel)) fail(`${key} refused: ${p} escapes the project's root ${root}`);
    if (!isDirUnder(abs)) fail(`${key} refused: ${p} is not an existing folder under the project's root ${root}`);
    const norm = rel === '' ? '.' : rel.split(sep).join('/');
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
for (const s of SCHEMA) byKey.set(s.key, s);
const [cmd, ...rest] = args;

if (cmd === undefined) {
  const obj = load(file);
  const out = [];
  const readOld = new Set();
  for (const s of SCHEMA) {
    const raw = obj[s.key];
    const v = Array.isArray(raw) ? raw.join(', ') : (typeof raw === 'string' ? raw : (raw == null ? '' : String(raw)));
    const rt = readThrough(obj, s.key);
    if (rt) { readOld.add(rt.old); out.push(`${s.key}: ${rt.value} ${rt.note}`); }
    else if (s.secret) out.push(`${s.key}: ${v ? `set, ${v.length} characters` : 'empty'}`);
    else out.push(`${s.key}: ${v || 'empty'}`);
  }
  for (const k of Object.keys(obj)) if (!byKey.has(k) && !readOld.has(k)) out.push(`${k}: unknown, not in the schema`);
  process.stdout.write(out.join('\n') + '\n');
} else if (cmd === 'set' && byKey.get(rest[0])?.list) {
  const [key, ...paths] = rest;
  const entries = listEntries(key, paths, projectRoot(file), !!byKey.get(key).allowRoot);
  const obj = load(file);
  obj[key] = entries;
  save(file, obj);
  process.stdout.write(`${key}: ${entries.length ? entries.join(', ') : 'empty'}\n`);
} else if (cmd === 'get') {
  if (rest.length !== 1) fail('usage: get <key>');
  const key = rest[0];
  const s = byKey.get(key);
  if (!s) check(key, '');
  const obj = load(file);
  const raw = obj[key];
  const rt = readThrough(obj, key);
  if (rt) { process.stdout.write(rt.value + '\n'); process.stderr.write(`${key}: ${rt.note}\n`); }
  else if (s.secret) { const v = typeof raw === 'string' ? raw : ''; process.stdout.write(v ? `set, ${v.length} characters\n` : 'empty\n'); }
  else if (s.list) process.stdout.write(Array.isArray(raw) && raw.length ? raw.join('\n') + '\n' : 'empty\n');
  else process.stdout.write((typeof raw === 'string' && raw) ? raw + '\n' : 'empty\n');
} else if (cmd === 'unset') {
  // Removes one key from the file, written as set writes it; any key name, no shape check. A key absent: nothing written.
  if (rest.length !== 1) fail('usage: unset <key>');
  const key = rest[0];
  const obj = existsSync(file) ? load(file) : {};
  if (!Object.hasOwn(obj, key)) process.stdout.write(`${key}: not set\n`);
  else { delete obj[key]; save(file, obj); process.stdout.write(`unset ${key}\n`); }
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
  fail(`unknown command ${cmd}; the commands: set, get, unset, set-from-env, set-from-file, empty`);
}

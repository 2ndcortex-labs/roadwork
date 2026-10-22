#!/usr/bin/env node
// roadwork-config — externality.mjs: the calling script of the Roadwork skills, the one place `notify-url` and `status-url` are read.
// Usage: node externality.mjs [--config-file <path>] [--item <ref>] [--wait-ms <n>] notify --state open|cleared --entry <file> | status
// Reads the settings file in-process at the call and prints neither URL, nor any part of one. No dependencies.
// Exit 0 on every notice and status outcome; 1 on a fault (one line naming it); 2 on usage.
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import process from 'node:process';

const USAGE = 'usage: node externality.mjs [--config-file <path>] [--item <ref>] [--wait-ms <n>] notify --state open|cleared --entry <file> | status';
const FIELDS = ['what', 'who-acts', 'how-observed', 'atlas', 'set-date', 'cleared-date', 'cleared-words'];
const end = (stream, text, code) => { stream.write(text + '\n', () => process.exit(code)); return null; };
const fail = (m) => end(process.stderr, m, 1);
const usage = (m) => end(process.stderr, `${m}\n${USAGE}`, 2);
const say = (lines) => end(process.stdout, lines.join('\n'), 0);

function findConfig() {
  for (let d = resolve(process.cwd()); ; d = dirname(d)) {
    if (existsSync(join(d, 'roadwork', 'ordering.md'))) return join(d, 'roadwork', 'config.json');
    if (existsSync(join(d, 'ordering.md'))) return join(d, 'config.json');
    if (dirname(d) === d) return null;
  }
}

function readJson(file) {
  try { return { value: JSON.parse(readFileSync(file, 'utf8')) }; } catch (e) { return { missing: e.code === 'ENOENT' }; }
}

function parse(argv) {
  const opt = { cmd: null };
  const valued = { '--config-file': 'configFile', '--item': 'item', '--wait-ms': 'waitMs', '--state': 'state', '--entry': 'entry' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (valued[a]) {
      if (i + 1 >= argv.length) return usage(`${a} needs a value`);
      opt[valued[a]] = argv[++i];
    } else if (a.startsWith('-')) return usage(`unknown option ${a}`);
    else if (opt.cmd !== null) return usage(`unexpected argument ${a}`);
    else opt.cmd = a;
  }
  return opt;
}

async function main() {
  const opt = parse(process.argv.slice(2));
  if (!opt) return;
  if (opt.cmd !== 'notify' && opt.cmd !== 'status') return usage(opt.cmd === null ? 'no command' : `unknown command ${opt.cmd}`);
  if (opt.cmd === 'notify' && opt.state !== 'open' && opt.state !== 'cleared') return usage('--state needs open or cleared');
  const waitMs = opt.waitMs === undefined ? 10000 : Number(opt.waitMs);
  if (!Number.isInteger(waitMs) || waitMs <= 0) return usage('--wait-ms needs a positive whole number');
  if (!opt.item) return fail('--item missing: the item reference is required');

  let entry;
  if (opt.cmd === 'notify') {
    if (!opt.entry) return fail('--entry missing: the entry file is required');
    const r = readJson(opt.entry);
    if (r.missing) return fail(`--entry: ${opt.entry} not found`);
    if (r.value === undefined) return fail(`--entry: ${opt.entry} not JSON`);
    entry = r.value;
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) return fail(`--entry: not an object with the seven fields: ${FIELDS.join(', ')}`);
    const absent = FIELDS.filter((f) => !Object.hasOwn(entry, f));
    if (absent.length) return fail(`--entry: missing ${absent.join(', ')}`);
  }

  const file = opt.configFile ? resolve(opt.configFile) : findConfig();
  if (!file) return fail(`settings file missing: no register found above ${process.cwd()}`);
  const s = readJson(file);
  if (s.missing) return fail(`settings file missing: ${file}`);
  if (s.value === undefined) return fail(`settings file not JSON: ${file}`);
  if (s.value === null || typeof s.value !== 'object' || Array.isArray(s.value)) return fail(`settings file not a JSON object: ${file}`);
  const key = (k) => (typeof s.value[k] === 'string' ? s.value[k].trim() : '');

  if (opt.cmd === 'notify') {
    const url = key('notify-url');
    if (!url) return say(['no notify URL: no notice (set notify-url by /roadwork-config)']);
    const body = {
      what: entry.what, 'who-acts': entry['who-acts'], 'how-observed': entry['how-observed'], state: opt.state, item: opt.item,
      'set-date': entry['set-date'], 'cleared-date': entry['cleared-date'], 'cleared-words': entry['cleared-words'], atlas: entry.atlas,
    };
    let code;
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(waitMs) });
      code = res.status;
    } catch { code = null; }
    if (code !== null && code >= 200 && code <= 299) return say([`notice sent: ${opt.state}, ${opt.item}`]);
    return say([`notice failed: ${opt.state}, ${opt.item}, ${code === null ? 'no answer' : code}`]);
  }

  const base = key('status-url');
  if (!base) return say(['no status URL (set status-url by /roadwork-config)']);
  const url = `${base}${base.includes('?') ? '&' : '?'}item=${encodeURIComponent(opt.item)}`;
  let res, text;
  try {
    res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(waitMs) });
    text = await res.text();
  } catch { return say(['unknown: no answer']); }
  if (res.status < 200 || res.status > 299) return say([`unknown: status code ${res.status}`]);
  let answer;
  try { answer = JSON.parse(text); } catch { return say(['unknown: not JSON']); }
  if (!Array.isArray(answer)) return say(['unknown: not an array']);
  if (answer.length === 0) return say(['empty: no externality in the answer']);
  const one = (v) => (typeof v === 'string' ? v.trim().replace(/\s*[\r\n]+\s*/g, ' ') : '');
  return say(answer.map((el) => {
    const what = el && typeof el === 'object' ? one(el.what) : '';
    const state = el && typeof el === 'object' ? el.state : undefined;
    return what && (state === 'open' || state === 'cleared') ? `${state}: ${what}` : `unmatched: ${what || '-'}`;
  }));
}

main();

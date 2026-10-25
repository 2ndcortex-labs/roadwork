#!/usr/bin/env node
// roadwork-specplan — observed-by.mjs: runs every externality entry's observed-by test, at acceptance and before a make.
// Usage: node observed-by.mjs run --item-dir <dir> [--wait-ms <n>] [--record acceptance|make] [--date <YYYY-MM-DD>] | count --item-dir <dir>
// Reads <dir>/spec.md's ## Dependencies; an entry another register item acts on is skipped. No dependencies, no settings file, no network.
// Prints no line of a command's output: the output is kept in a file under a folder made by mkdtemp, named on a failure's line.
// Exit 0 whenever it ran; 1 on a fault (one line naming it); 2 on usage.
import { appendFileSync, closeSync, existsSync, mkdtempSync, openSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';

const USAGE = 'usage: node observed-by.mjs run --item-dir <dir> [--wait-ms <n>] [--record acceptance|make] [--date <YYYY-MM-DD>] | count --item-dir <dir>';
const end = (stream, text, code) => { stream.write(text + '\n', () => process.exit(code)); return null; };
const fail = (m) => end(process.stderr, m, 1);
const usage = (m) => end(process.stderr, `${m}\n${USAGE}`, 2);

const ENTRY = /^D(\d+)\.\s+(.*?) — who acts: (.*?) — observed by: (.*)$/;
const ITEM_PARTY = /^`?(todo|feature|main|nexus)\//;
const TAGS = /((?:\s*\[[^[\]]*\])+)\s*$/;
const SPAN = /^`([^`]+)`$/;

function parse(argv) {
  const opt = { cmd: null };
  const valued = { '--item-dir': 'itemDir', '--wait-ms': 'waitMs', '--record': 'record', '--date': 'date' };
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

// The observed-by part split into its core and its trailing [...] tags, each tag with its leading space.
function split(rest) {
  const m = rest.match(TAGS);
  const core = (m ? rest.slice(0, m.index) : rest).trimEnd();
  const tags = m ? m[1].match(/\s*\[[^[\]]*\]/g) : [];
  return { core, tags };
}

function entries(lines) {
  const start = lines.findIndex((l) => l.trimEnd() === '## Dependencies');
  if (start < 0) return [];
  const out = [];
  for (let i = start + 1; i < lines.length && !lines[i].startsWith('## '); i++) {
    const m = lines[i].replace(/\r$/, '').match(ENTRY);
    if (!m || ITEM_PARTY.test(m[3].trim())) continue;
    const { core } = split(m[4]);
    const span = core.trim().match(SPAN);
    out.push({ i, n: Number(m[1]), what: m[2].trim(), command: span ? span[1] : null });
  }
  return out.sort((a, b) => a.n - b.n);
}

function runOne(command, cwd, file, waitMs) {
  return new Promise((done) => {
    const fd = openSync(file, 'w');
    let timedOut = false;
    let settled = false;
    const child = spawn('/bin/sh', ['-c', command], { cwd, detached: true, stdio: ['ignore', fd, fd] });
    const killGroup = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch { /* the group is gone */ } };
    const timer = setTimeout(() => { timedOut = true; killGroup(); }, waitMs);
    const finish = (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      killGroup();
      closeSync(fd);
      if (timedOut) return done(`no answer after ${waitMs} ms`);
      if (code === 0) return done(null);
      if (code === null) return done(`exit ${128 + (os.constants.signals[signal] || 0)}`);
      return done(`exit ${code}`);
    };
    child.on('error', () => finish(127, null));
    child.on('exit', finish);
  });
}

function itemFile(dir) {
  for (const f of ['todo.md', 'feature.md']) if (existsSync(join(dir, f))) return join(dir, f);
  return null;
}

async function main() {
  const opt = parse(process.argv.slice(2));
  if (!opt) return;
  if (opt.cmd !== 'run' && opt.cmd !== 'count') return usage(opt.cmd === null ? 'no command' : `unknown command ${opt.cmd}`);
  if (!opt.itemDir) return usage('--item-dir needs a value');
  if (opt.cmd === 'count' && (opt.waitMs !== undefined || opt.record !== undefined || opt.date !== undefined)) return usage('count takes --item-dir only');
  const waitMs = opt.waitMs === undefined ? 30000 : Number(opt.waitMs);
  if (!Number.isInteger(waitMs) || waitMs <= 0) return usage('--wait-ms needs a positive whole number');
  if (opt.record !== undefined && opt.record !== 'acceptance' && opt.record !== 'make') return usage('--record needs acceptance or make');
  if (opt.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(opt.date)) return usage('--date needs YYYY-MM-DD');
  const date = opt.date || new Date().toISOString().slice(0, 10);

  const dir = opt.itemDir;
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return fail(`--item-dir: ${dir} is not a folder`);
  const specFile = join(dir, 'spec.md');
  if (!existsSync(specFile)) return fail(`spec.md missing in ${dir}`);
  const text = readFileSync(specFile, 'utf8');
  const lines = text.split('\n');
  const list = entries(lines);

  if (opt.cmd === 'count') return end(process.stdout, `${list.filter((e) => e.command !== null).length} by command`, 0);
  if (list.length === 0) return end(process.stdout, 'none: no externality entry', 0);
  const item = opt.record ? itemFile(dir) : null;
  if (opt.record && !item) return fail(`item file missing in ${dir}: todo.md or feature.md`);

  let outDir = null;
  const said = [];
  for (const e of list) {
    if (e.command === null) { e.answer = 'word'; said.push(`word: D${e.n} — ${e.what}`); continue; }
    if (e.command.includes('://')) { e.answer = 'a URL inline'; said.push(`fail: D${e.n} — ${e.what}, a URL inline`); continue; }
    outDir = outDir || mkdtempSync(join(os.tmpdir(), 'observed-by-'));
    const file = join(outDir, `D${e.n}.out`);
    e.answer = await runOne(e.command, dir, file, waitMs);
    said.push(e.answer === null ? `pass: D${e.n} — ${e.what}` : `fail: D${e.n} — ${e.what}, ${e.answer}, output: ${file}`);
  }

  if (opt.record) {
    const at = opt.record === 'acceptance' ? 'at acceptance' : 'at the make';
    const failed = list.filter((e) => e.answer !== null && e.answer !== 'word');
    if (opt.record === 'acceptance') {
      for (const e of list) {
        const cr = lines[e.i].endsWith('\r') ? '\r' : '';
        const line = cr ? lines[e.i].slice(0, -1) : lines[e.i];
        const cut = line.indexOf(' — observed by: ') + ' — observed by: '.length;
        const { core, tags } = split(line.slice(cut));
        const result = e.answer === null ? 'pass' : e.answer === 'word' ? "the Operator's word" : `fail, ${e.answer}`;
        const kept = tags.filter((t) => !t.trim().startsWith('[tested '));
        lines[e.i] = `${line.slice(0, cut)}${core} [tested ${date} ${at}: ${result}]${kept.join('')}${cr}`;
      }
      writeFileSync(specFile, lines.join('\n'));
    }
    if (failed.length) {
      const prior = readFileSync(item, 'utf8');
      const sep = prior === '' || prior.endsWith('\n\n') ? '' : prior.endsWith('\n') ? '\n' : '\n\n';
      appendFileSync(item, sep + failed.map((e) => `**Externality test failed (${date}, ${at}): D${e.n} — ${e.what}, ${e.answer}**`).join('\n\n') + '\n');
    }
  }
  return end(process.stdout, said.join('\n'), 0);
}

main();

#!/usr/bin/env node
// smoke — an end-to-end trial of the init: in an empty project made under the system's temporary folder, run
// bin/roadwork-init.mjs with no --project, then the installed config script and inventory script bare, then check that
// the help skill's inputs are in place. Node only, no dependencies. The temporary project is kept, never removed.
// Prints "OK smoke <project>" and exits 0 on a pass; one "FAIL smoke <what>" line per failure and exit 1 otherwise.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HOME = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const project = fs.mkdtempSync(path.join(os.tmpdir(), 'roadwork-smoke-'));
const register = path.join(project, 'roadwork');
const skills = path.join(project, '.claude', 'skills');
const failures = [];
const fail = (what) => failures.push(what);
const lastLine = (s) => String(s || '').trim().split('\n').pop() || '';
const run = (label, args, cwd) => {
  const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', timeout: 300000 });
  if (r.status !== 0) fail(`${label} exited ${r.status ?? r.signal ?? r.error?.code}: ${lastLine(r.stderr) || lastLine(r.stdout)}`);
  return r;
};

// 1. the init, the register path the only argument
const init = run('the init', [path.join(HOME, 'bin', 'roadwork-init.mjs'), register], project);
if (init.status === 0 && !/^Roadwork register: roadwork\b/m.test(init.stdout)) fail(`the init printed no law line naming roadwork: ${lastLine(init.stdout)}`);

if (init.status === 0) {
  // 2. the config script bare, from the project's root: one "<key>: <value>" line per key
  const config = run('the config script', [path.join(skills, 'roadwork-config', 'scripts', 'config.mjs')], project);
  if (config.status === 0) {
    const lines = config.stdout.split('\n').filter((l) => l !== '');
    if (!lines.length) fail('the config script printed no key lines');
    for (const l of lines) if (!/^[a-z0-9][a-z0-9-]*: \S/.test(l)) fail(`the config script printed a line that is not "<key>: <value>": ${l}`);
    for (const k of ['project-root', 'ref-alias', 'repos', 'audit-root-prefix']) if (!lines.some((l) => l.startsWith(`${k}: `))) fail(`the config script printed no ${k} line`);
  }
  // 3. the inventory script bare, from inside the new register (it finds the register upward from where it runs)
  const inventory = run('the inventory script', [path.join(skills, 'roadwork-inventory', 'scripts', 'inventory.mjs')], register);
  if (inventory.status === 0 && inventory.stdout.trim() === '') fail('the inventory script printed no page');
  // 4. the help skill's inputs: the teach-me in the register and the installed skill
  for (const p of [path.join(register, 'docs', 'teachme.md'), path.join(skills, 'roadwork-help', 'SKILL.md')]) {
    if (!fs.existsSync(p)) fail(`${path.relative(project, p).split(path.sep).join('/')} missing in the project`);
  }
}

if (failures.length) {
  for (const f of failures) process.stdout.write(`FAIL smoke ${f}\n`);
  process.stdout.write(`(the project is kept at ${project})\n`);
  process.exit(1);
}
process.stdout.write(`OK smoke ${project}\n`);

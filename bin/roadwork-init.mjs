#!/usr/bin/env node
// roadwork-init — copies the Roadwork scaffold into a project once, and installs (or refreshes) the rule, the skills and
// the agent files.
// Node only, no dependencies. Run `node bin/roadwork-init.mjs --help` for the usage.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HOME_ADDRESS = 'github.com/2ndcortex-labs/roadwork';
const USAGE = `Usage: node bin/roadwork-init.mjs <register-path> [--project <root>]
       node bin/roadwork-init.mjs --help

Sets Roadwork up in a project, or refreshes it.

  <register-path>   where the project's register goes, for example my-project/roadwork;
                    its last folder must be named roadwork, as the rule loads only for
                    files under a roadwork/ folder.
                    When nothing is there yet, this repository's scaffold/ is copied there
                    once, the line "Copied from Roadwork <release> (${HOME_ADDRESS})
                    on <date>" is added to the copy's CLAUDE.md, and the copy is made
                    its own git repository with one commit and no remote. When a
                    register is already there (a folder holding ordering.md and
                    working.md), it is left untouched.
  --project <root>  the project's root folder: the register path's parent or an
                    ancestor of it. Default: the register path's parent.

Every run replaces <root>/.claude/rules/roadwork-constitution.md, each of this
repository's skill folders under <root>/.claude/skills/ and each of its agent files
under <root>/.claude/agents/ with this repository's copies; any other file or folder
there is left alone. It then prints the line to add to the
project's CLAUDE.md, and writes nothing else.

Refused, exit 1: a register path whose last folder is not named roadwork; a register
path that exists and is not a register; a register path inside this repository; a
--project that is not the register path's parent or an ancestor of it.
`;

const say = (line) => process.stdout.write(`${line}\n`);
// A refusal or a fault: one line, exit 1.
const stop = (line) => { process.stderr.write(`roadwork-init: ${line}\n`); process.exit(1); };
const usageError = (line) => { process.stderr.write(`roadwork-init: ${line}\n${USAGE}`); process.exit(1); };

// --- arguments ----------------------------------------------------------------------------------------------------
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) { process.stdout.write(USAGE); process.exit(0); }
let registerArg = null;
let projectArg = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--project') {
    if (projectArg !== null) usageError('--project given twice');
    if (i + 1 >= argv.length) usageError('--project needs a folder');
    projectArg = argv[++i];
  } else if (a.startsWith('-')) usageError(`unknown option ${a}`);
  else if (registerArg !== null) usageError('one register path only');
  else registerArg = a;
}
if (registerArg === null) usageError('the register path is missing');

// --- paths, compared by their real spelling (a temporary folder is often reached through a symbolic link) ---------
function real(p) {
  let head = path.resolve(p);
  const tail = [];
  while (!fs.existsSync(head)) {
    const up = path.dirname(head);
    if (up === head) break;
    tail.unshift(path.basename(head));
    head = up;
  }
  return path.join(fs.realpathSync(head), ...tail);
}
const isInside = (child, parent) => {
  const rel = path.relative(parent, child);
  return rel === '' || (rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel));
};
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
const isRegister = (p) => isDir(p) && fs.existsSync(path.join(p, 'ordering.md')) && fs.existsSync(path.join(p, 'working.md'));

const home = real(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const scaffold = path.join(home, 'scaffold');
const rule = path.join(home, 'rules', 'roadwork-constitution.md');
const skillsHome = path.join(home, 'skills');
const agentsHome = path.join(home, 'agents');
if (!isDir(scaffold) || !fs.existsSync(rule) || !isDir(skillsHome) || !isDir(agentsHome)) stop(`the Roadwork repository at ${home} lacks scaffold/, rules/roadwork-constitution.md, skills/ or agents/`);

const register = real(registerArg);
const root = projectArg === null ? path.dirname(register) : real(projectArg);

// --- the four refusals, before anything is written ------------------------------------------------------------------
if (isInside(register, home)) stop(`refused: ${register} is inside the Roadwork repository at ${home}; give a path in your project`);
// the name as given, not through a link: the rule's header loads it only for files under a folder named roadwork/
if (path.basename(path.resolve(registerArg)) !== 'roadwork') stop(`refused: ${register} is not named roadwork; the register's folder must be named roadwork, as the rule loads only for files under a roadwork/ folder`);
if (projectArg !== null && (register === root || !isInside(register, root))) stop(`refused: --project ${root} is not the register path's parent or an ancestor of it`);
const exists = fs.lstatSync(register, { throwIfNoEntry: false }) !== undefined;
if (exists && !isRegister(register)) stop(`refused: ${register} exists and is not a register (a register holds ordering.md and working.md)`);
const firstRun = !exists;

// --- the release: the version of the CHANGELOG's newest release heading, `## [x.y.z] - <date>` ----------------------
function releaseOf() {
  let text;
  try { text = fs.readFileSync(path.join(home, 'CHANGELOG.md'), 'utf8'); } catch { return 'unreleased'; }
  const m = text.match(/^## \[(\d+\.\d+\.\d+[^\]]*)\] - /m);
  return m ? m[1] : 'unreleased';
}

// --- a first run: the scaffold copied once, the release line, the register's own repository -------------------------
let madeRepository = false;
if (firstRun) {
  const release = releaseOf();
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  fs.mkdirSync(path.dirname(register), { recursive: true });
  fs.cpSync(scaffold, register, { recursive: true, errorOnExist: true, force: false });
  // the settings file: shipped with every key empty, ignored by the register's git, owner-only as the config skill writes it
  fs.chmodSync(path.join(register, 'config.json'), 0o600);
  const anchor = path.join(register, 'CLAUDE.md');
  const before = fs.existsSync(anchor) ? fs.readFileSync(anchor, 'utf8') : '';
  const lead = before === '' ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  fs.appendFileSync(anchor, `${lead}Copied from Roadwork ${release} (${HOME_ADDRESS}) on ${today}\n`);

  const git = (args) => spawnSync('git', args, { cwd: register, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const init = git(['init', '-q']);
  if (init.error && init.error.code === 'ENOENT') {
    say('git is not on the PATH, so the register was copied without a repository of its own');
  } else {
    // a local identity, so the commit is made on a machine with no git configuration of its own
    const identity = ['-c', 'user.name=roadwork-init', '-c', 'user.email=roadwork-init@localhost', '-c', 'commit.gpgsign=false'];
    const steps = [
      ['init', () => init],
      ['add', () => git(['add', '--all'])],
      ['commit', () => git([...identity, 'commit', '-q', '-m', `Register copied from Roadwork ${release}`])],
    ];
    for (const [what, step] of steps) {
      const res = step();
      if (res.error || res.status !== 0) {
        const why = (res.error ? res.error.message : (res.stderr || res.stdout || '').trim().split('\n')[0]) || `exit ${res.status}`;
        stop(`git ${what} failed in ${register} (${why}); the register was copied without its first commit`);
      }
    }
    madeRepository = true;
  }
}

// --- every run: the rule and the skills installed into the project's .claude folders ---------------------------------
const rulesDir = path.join(root, '.claude', 'rules');
fs.mkdirSync(rulesDir, { recursive: true });
const ruleTarget = path.join(rulesDir, 'roadwork-constitution.md');
fs.rmSync(ruleTarget, { force: true }); // the one file, never the folder: other rules beside it stay
fs.copyFileSync(rule, ruleTarget);

const skillsDir = path.join(root, '.claude', 'skills');
fs.mkdirSync(skillsDir, { recursive: true });
const SKILL_NAME = /^[a-z0-9][a-z0-9-]*$/;
const skills = fs.readdirSync(skillsHome, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
for (const name of skills) {
  const target = path.join(skillsDir, name);
  // The one recursive delete in Roadwork's tools, so that a file the repository no longer ships vanishes from the
  // installed skill. The target is built here from the repository's own skill folder name, never from an argument's text: it must sit
  // directly under <root>/.claude/skills/ and its last segment must be that name, or nothing is removed.
  if (!SKILL_NAME.test(name) || path.dirname(target) !== skillsDir || path.basename(target) !== name || path.relative(skillsDir, target) !== name) {
    stop(`refused to replace ${target}: not a skill folder directly under ${skillsDir}`);
  }
  if (fs.lstatSync(target, { throwIfNoEntry: false }) !== undefined) fs.rmSync(target, { recursive: true });
  fs.cpSync(path.join(skillsHome, name), target, { recursive: true });
}

// the agent files: each of the repository's agents/*.md replaced by name, the one file, never the folder: a project's
// own agent files beside them stay
const agentsDir = path.join(root, '.claude', 'agents');
fs.mkdirSync(agentsDir, { recursive: true });
const AGENT_FILE = /^[a-z0-9][a-z0-9-]*\.md$/;
const agents = fs.readdirSync(agentsHome, { withFileTypes: true }).filter((e) => e.isFile() && AGENT_FILE.test(e.name)).map((e) => e.name).sort();
for (const name of agents) {
  const target = path.join(agentsDir, name);
  fs.rmSync(target, { force: true });
  fs.copyFileSync(path.join(agentsHome, name), target);
}

// --- the law line ---------------------------------------------------------------------------------------------------
// on a first run that made the register a repository, the tail: a git project must ignore it, or the project's
// repository records it as a link to another repository
const rel = path.relative(root, register).split(path.sep).join('/');
say(`Roadwork register: ${rel} — add this to your project's law${madeRepository ? ` — and \`${rel}\` to its ignore file: the register is a git repository of its own` : ''}`);

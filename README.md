# Roadwork

Roadwork is a work-plans system for projects run with Claude Code, by 2nd Cortex Labs. It keeps one folder of plans in your project, the register — todos (fixes and chores, done once), features (capabilities, built once and reused) and sparks (ideas parked for later) — and a set of skills that work them: a note is filed, an interview settles what is wanted, a spec and a plan are written with pass-or-fail gates, the build runs against the gates, and the result is verified and archived. Each step is a command you type, such as `/roadwork-ingest` or `/roadwork-make`, and each ends by offering the next.

This is the Roadwork repository. It ships three things: the rule every skill follows, `rules/roadwork-constitution.md`; the skills, `skills/`; and the skeleton of the register, `scaffold/`. An init tool, `bin/roadwork-init.mjs`, copies the skeleton into your project once and installs the rule and the skills where Claude Code finds them. Nothing here belongs to any one project: no keys, no names, no items. Your items, maps and records are yours and never come from here.

You need Claude Code, which loads skills from a project's `.claude/skills/` and rules from its `.claude/rules/`; Node.js 22 or later (CI runs 24), for the init and the skills' scripts, with nothing to install from a package registry; git, so the init can make the register a repository of its own (without git it still copies and installs); and Python 3 for two of the audit skill's scripts.

## Quickstart

```
git clone https://github.com/2ndcortex-labs/roadwork.git roadwork-repo
node roadwork-repo/bin/roadwork-init.mjs <your-project>/roadwork
echo 'Roadwork register: roadwork' >> <your-project>/CLAUDE.md
cat <your-project>/roadwork/docs/teachme.md
```

1. Clone this repository anywhere outside your project (or download a release and unpack it).
2. Run the init with the path where your project's register should go: a folder named `roadwork`, usually at your project's root. The name is required — the rule loads only for files under a `roadwork/` folder, and a project has one register, `roadwork/`. The init ends by printing a line that begins `Roadwork register: roadwork — add this to your project's law`. It refuses, with one line and exit status 1, a register path whose last folder is not named `roadwork`, a path that exists and is not a register, a path inside the Roadwork repository, and a `--project` that is not the register path's parent or an ancestor of it.
3. Add that line, `Roadwork register: roadwork`, to your project's `CLAUDE.md` — the instructions Claude Code loads in every session, which the skills call the project's law. If your project is a git repository, add `roadwork/` to its `.gitignore`: the register is a git repository of its own.
4. Read the teach-me, `roadwork/docs/teachme.md` in your project: a walk-through of the register and the commands, written for a person. In a Claude Code session, `/roadwork-help` answers questions about it.

## Updating

Pull or download a newer copy of the Roadwork repository and run its init again with the same register path. It finds the register there and leaves it untouched; it replaces `.claude/rules/roadwork-constitution.md` and each skill folder the repository ships under `.claude/skills/` with the newer copies, so a file a skill no longer has disappears. Any other rule or skill in those folders is left alone. `docs/install-and-update.md` gives the details.

## Layout

- `README.md` — this file.
- `LICENSE` — the MIT License.
- `CHANGELOG.md` — what changed in each release.
- `CONTRIBUTING.md` — how to propose a change.
- `.gitignore` — the files git leaves out of this repository.
- `.github/workflows/check.yml` — the CI workflow: it runs `node bin/check.mjs` on every push and pull request.
- `bin/` — the tools: `bin/roadwork-init.mjs`, the init; `bin/check.mjs`, the checks CI runs; `bin/smoke.mjs`, a trial of the init in an empty temporary project.
- `docs/` — this repository's own documents: `docs/install-and-update.md`, the init and the update path; `docs/how-the-pieces-fit.md`, the rule, the skills, the scaffold, the register and the settings file.
- `rules/roadwork-constitution.md` — the rule, called the constitution: the register's layout, how each skill acts, and the terms table and glossary every skill's words come from.
- `skills/` — the skills, one folder each, `skills/<skill>/` with its `SKILL.md`: the nineteen whose names begin `roadwork-`, and `unlazy`, a completion-discipline skill the build runs under, shipped as its own project publishes it.
- `scaffold/` — the skeleton the init copies into a project as its register: `CLAUDE.md`, `.gitignore`, `ordering.md` (what comes next), `working.md` (what is in process), and the folders `todo/`, `feature/`, `spark/`, `docs/`, `destinations/`, `maps/`, `guidebooks/` and `atlases/`, each with a `CLAUDE.md` saying what it holds.

## Migrating a cloned register

Before 1.0.0 a register was a clone of this whole repository and carried an `install/` folder holding the rule and the skills. To migrate such a register, delete its `install/` folder and nothing else; if its folder has another name, rename it `roadwork` first. From then on, install and refresh the rule and the skills as under Updating: the init finds a register at that path and leaves it untouched.

## License

MIT; see `LICENSE`. Copyright (c) 2026 2nd Cortex Labs.

## Contributing

See `CONTRIBUTING.md`.

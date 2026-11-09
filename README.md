# Roadwork

Roadwork is a work-plans system for projects run with Claude Code, by 2nd Cortex Labs. It keeps one folder of plans in your project, the register — todos (fixes and chores, done once), features (capabilities, built once and reused) and sparks (ideas parked for later) — and a set of skills that work them: a note is filed, an interview settles what is wanted, a spec and a plan are written with pass-or-fail gates, the build runs against the gates, and the result is verified and archived. Each step is a command you type, such as `/roadwork-ingest` or `/roadwork-make`, and each ends by offering the next.

This is the Roadwork repository. It ships three things: the rule every skill follows, `rules/roadwork-constitution.md`; the skills, `skills/`; and the skeleton of the register, `skeleton/`. You copy the skeleton into your project once as its register and copy the rule, the skills and the agent files — `agents/`, one instruction file per sub-agent type the constitution defines — into the project's `.claude/` folders, where Claude Code finds them. Nothing here belongs to any one project: no keys, no names, no items. Your items, maps and records are yours and never come from here.

You need Claude Code, which loads skills from a project's `.claude/skills/` and rules from its `.claude/rules/`; Node.js 22 or later (CI runs 24), for the skills' scripts, with nothing to install from a package registry; and Python 3 for two of the audit skill's scripts.

## Quickstart

```
cp -R roadwork-copy/skeleton <your-project>/roadwork
cp -R roadwork-copy/rules/. roadwork-copy/skills/. roadwork-copy/agents/. <your-project>/.claude/
echo 'Roadwork register: roadwork' >> <your-project>/CLAUDE.md
cat <your-project>/roadwork/docs/teachme.md
```

1. Get a copy of the Roadwork repository anywhere outside your project (download a release and unpack it), then copy its `skeleton/` into your project as `roadwork/`, usually at the root. The name is required — the rule loads only for files under a `roadwork/` folder, and a project has one register, `roadwork/`.
2. Copy `rules/`, `skills/` and `agents/` into your project's `.claude/rules/`, `.claude/skills/` and `.claude/agents/`.
3. Add the line `Roadwork register: roadwork` to your project's `CLAUDE.md` — the instructions Claude Code loads in every session, which the skills call the project's law; the skills read the register's path from it.
4. Read the teach-me, `roadwork/docs/teachme.md` in your project: a walk-through of the register and the commands, written for a person. In a Claude Code session, `/roadwork-help` answers questions about it.

## Updating

Get a newer copy of the Roadwork repository and copy the newer rule, skills and agent files over the old, whole — each skill folder replaced, not mixed file by file, so a file a skill no longer has disappears — and the register's `docs/teachme.md` and `docs/facts.md` from the skeleton's. The register's items, its `CLAUDE.md` and its settings file are never touched; any other rule, skill or agent file in those folders is left alone. `docs/install-and-update.md` gives the details.

## Layout

- `README.md` — this file.
- `LICENSE` — the MIT License.
- `CHANGELOG.md` — what changed in each release.
- `CONTRIBUTING.md` — how to propose a change.
- `.gitignore` — the files git leaves out of this repository.
- `.github/workflows/check.yml` — the CI workflow: it runs `node bin/check.mjs` on every push and pull request.
- `bin/` — `bin/check.mjs`, the checks CI runs.
- `docs/` — the Roadwork repository's own documents: `docs/install-and-update.md`, the install and the update by hand; `docs/how-the-pieces-fit.md`, the rule, the skills, the skeleton, the register and the settings file.
- `rules/roadwork-constitution.md` — the rule, called the constitution: the register's layout, how each skill acts, and the terms table and glossary every skill's words come from.
- `skills/` — the skills, one folder each, `skills/<skill>/` with its `SKILL.md`: the nineteen whose names begin `roadwork-`, and `unlazy`, a completion-discipline skill the build runs under, shipped as its own project publishes it.
- `skeleton/` — the skeleton you copy into a project as its register: `CLAUDE.md`, `config.json` (the settings file, every key empty), `ordering.md` (what comes next), `working.md` (what is in process), and the folders `todo/`, `feature/`, `spark/`, `docs/`, `destinations/`, `maps/`, `guidebooks/` and `atlases/`, each with a `CLAUDE.md` saying what it holds.

## Migrating an old register

Before 1.0.0 a register was a copy of the Roadwork repository whole and carried an `install/` folder holding the rule and the skills. To migrate such a register, delete its `install/` folder and nothing else; if its folder has another name, rename it `roadwork` first. From then on, install and refresh the rule and the skills by copying, as the install doc says: the register itself is left untouched.

## License

MIT; see `LICENSE`. Copyright (c) 2026 2nd Cortex Labs.

## Contributing

See `CONTRIBUTING.md`.

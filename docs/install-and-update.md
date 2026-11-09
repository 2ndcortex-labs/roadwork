# Installing and updating Roadwork

Roadwork is installed in a project by hand: copying what the Roadwork repository ships into the places where Claude Code and the skills find it. The Roadwork repository ships four things: the rule, `rules/roadwork-constitution.md`; the skills, `skills/`, one folder per skill; the agent files, `agents/`, one instruction file per sub-agent type the constitution defines; and the skeleton of the register, `skeleton/`, the folder a project's plans are recorded in once it is copied.

Paths inside a project are written here from the project's root, with the register at its usual place, `roadwork/`.

## Install

1. Copy `skeleton/` into your project as `roadwork/`, whole: `CLAUDE.md`, `config.json` (the settings file, every key empty), `ordering.md`, `working.md`, and the folders `todo/`, `feature/`, `spark/`, `docs/`, `destinations/`, `maps/`, `guidebooks/` and `atlases/` with what they hold. The name is required — the rule loads only for files under a `roadwork/` folder, and a project has one register, `roadwork/`, usually at its root.
2. Copy `rules/`, `skills/` and `agents/` into your project's `.claude/` folders: `rules/roadwork-constitution.md` as `.claude/rules/roadwork-constitution.md`, each `skills/<skill>/` as `.claude/skills/<skill>/`, and each agent file under `agents/` as `.claude/agents/<name>.md`.
3. Write the line `Roadwork register: roadwork` into your project's `CLAUDE.md` — the instructions Claude Code loads at the start of every session, which the skills call the project's law; the skills read the register's path from that line.
4. On update, with a newer copy of the Roadwork repository, replace the rule, each skill folder and each agent file whole — delete the old and copy the new — and the register's `docs/teachme.md` and `docs/facts.md` from the skeleton's; never the register's items.

## What an update never touches

The register's items, its `CLAUDE.md` and its settings file, `config.json`, are the project's own: an update replaces the rule, the skills, the agent files and the register's two documents, and nothing else. Any other rule, skill or agent file in the project's `.claude/` folders is left alone, and a skill the Roadwork repository stops shipping stays in the project until you delete its folder yourself.

## A register below the root's top level

The register may sit any depth below the project's root. Tell the skills where the root is: set the `project-root` setting to the path from the register to the root, `../..` for `my-project/planning/roadwork`, by typing `/roadwork-config project-root ../..` in a Claude Code session. `docs/how-the-pieces-fit.md` describes the settings file.

## What the Roadwork repository holds

- `README.md`, the overview and quickstart; `LICENSE`, the MIT License; `CHANGELOG.md`, the releases; `CONTRIBUTING.md`, how to propose a change; and `.github/workflows/check.yml`, the CI workflow.
- `bin/check.mjs`, the checks CI runs.
- `docs/` — this page, `docs/install-and-update.md`, and `docs/how-the-pieces-fit.md`.
- `rules/roadwork-constitution.md`, the rule; `skills/`, one folder per skill, `skills/<skill>/`; `agents/`, the agent files, one per sub-agent type; and `skeleton/`, the register's skeleton.

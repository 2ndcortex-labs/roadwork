# Installing and updating Roadwork

This page describes `bin/roadwork-init.mjs`, the one tool that sets Roadwork up in a project and keeps it current. It copies the home's `scaffold/` into your project once, as the project's register — the folder where the project's plans are recorded — and on every run installs the rule and the skills into the project's `.claude/` folders, where Claude Code finds them. It runs on Node.js with nothing to install from a package registry, and uses git when git is present.

Paths inside a project are written here from the project's root, with the register at its usual place, `roadwork/`.

## The command

```
node bin/roadwork-init.mjs <register-path> [--project <root>]
node bin/roadwork-init.mjs --help
```

- `<register-path>` — where the register goes, for example `my-project/roadwork`. A relative path is read from the folder you run the command in.
- `--project <root>` — the project's root folder, the one whose `.claude/` folders receive the rule and the skills. Without it the root is the register path's parent. Give it when the register sits deeper, for example `my-project/planning/roadwork` with `--project my-project`.
- `--help` — prints the usage and exits.

## A first run

When nothing exists at the register path, the init:

1. copies the home's `scaffold/` there whole: `CLAUDE.md`, `.gitignore`, `ordering.md`, `working.md`, and the folders `todo/`, `feature/`, `spark/`, `docs/`, `destinations/`, `maps/`, `guidebooks/` and `atlases/` with what they hold;
2. adds one line at the end of the register's `CLAUDE.md`, the release line: `Copied from Roadwork <release> (github.com/2ndcortex-labs/roadwork) on <date>`, where the release is the version in the newest release heading of the home's `CHANGELOG.md` (`unreleased` when there is none) and the date is the day of the run — so a register made from a downloaded release with no git history still says where it came from;
3. makes the register a git repository of its own with one commit, `Register copied from Roadwork <release>`, made under a local name (`roadwork-init`) so that it works on a machine with no git identity set, and with no remote: the register's history stays on your machine and is never pushed; your project's own repository, if it has one, is not touched;
4. installs the rule and the skills, as every run does (below);
5. prints the law line.

## Every run

- `.claude/rules/roadwork-constitution.md` under the project's root is deleted and written again from the home's `rules/roadwork-constitution.md`. Other files in `.claude/rules/` are left alone.
- For each skill folder the home ships under `skills/`, the folder of the same name under `.claude/skills/` is removed whole and copied fresh, so a file the home no longer ships in that skill disappears. Every other folder under `.claude/skills/` — your own skills, or skills from elsewhere — is left alone. A skill the home stops shipping is therefore not removed from your project; delete its folder yourself when you no longer want it.
- When a register is already at the register path — a folder holding both `ordering.md` and `working.md` — nothing in it is touched: not its items, not its `CLAUDE.md`, not its repository.
- Nothing else is written. The init never edits your project's `CLAUDE.md`.

## The law line

The last line the init prints names the register's path from the project's root:

```
Roadwork register: roadwork — add this to your project's law
```

Your project's law is its `CLAUDE.md`, the instructions Claude Code loads at the start of every session; the constitution has the law name the register's path. Add the line `Roadwork register: roadwork`, with your path, to it once. On a first run the printed line goes on: `— and to its ignore file if you keep the two apart`. The register is a repository of its own, so if your project is a git repository too, add the register's path to the project's `.gitignore` to keep the register's records out of the project's history.

## When the init refuses

Each refusal prints one line, writes nothing, and exits with status 1:

- the register path exists and is not a register — a file, or a folder without both `ordering.md` and `working.md`: the init never writes into a folder it did not make;
- the register path is inside the home itself: a register belongs in your project, not in the copy of Roadwork it is made from; the paths are compared as the system resolves them, so a path reached through a link to the home is refused too;
- `--project` names a folder that is not the register path's parent or an ancestor of it.

A missing register path, a second one or an unknown option prints the usage and exits with status 1.

## Without git

When git is not on the PATH, a first run prints one line saying so, copies the register without a repository of its own, installs the rule and the skills, prints the law line, and exits with status 0. You can make the register a repository later by running `git init` inside it.

## Updating

Get the newer home — `git pull` in your clone of it, or a newer release — and run the init again with the same register path, and the same `--project` if you gave one. The rule and the skills are refreshed; the register is untouched, so its release line keeps naming the release it was first copied from. `CHANGELOG.md` says what changed in each release and whether a release asks anything of an existing register.

## A register below the root's top level

With `--project`, the rule and the skills go into the root's `.claude/` folders and the register may sit any depth below the root. Tell the skills where the root is: set the `project-root` setting to the path from the register to the root, `../..` for `my-project/planning/roadwork`, by typing `/roadwork-config project-root ../..` in a Claude Code session. `docs/how-the-pieces-fit.md` describes the settings file.

## What the home holds

- `README.md`, the overview and quickstart; `LICENSE`, the MIT License; `CHANGELOG.md`, the releases; `CONTRIBUTING.md`, how to propose a change; `.gitignore`; and `.github/workflows/check.yml`, the CI workflow.
- `bin/` — `bin/roadwork-init.mjs`, the init this page describes; `bin/check.mjs`, the checks CI runs; `bin/smoke.mjs`, a trial of the init in an empty temporary project.
- `docs/` — this page, `docs/install-and-update.md`, and `docs/how-the-pieces-fit.md`.
- `rules/roadwork-constitution.md`, the rule; `skills/`, one folder per skill, `skills/<skill>/`; and `scaffold/`, the register's skeleton.

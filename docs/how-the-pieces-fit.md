# How the pieces fit

Roadwork has five pieces: the rule, the skills, the scaffold, the register made from the scaffold, and the settings file. The Roadwork repository — this one — ships the first three; `bin/roadwork-init.mjs` turns them into the other two in your project (`docs/install-and-update.md` describes it). Paths inside a project are written here from the project's root, with the register at its usual place, `roadwork/`.

## The vocabulary

The words below, and every word the skills use with you, are defined in the constitution's terms table, the section "Terms — the plain word, the agent's word, the meaning" of `rules/roadwork-constitution.md`, and in the glossary after it: each row gives the plain word you will read in replies, the word the skills use for the same thing, and what it means. The teach-me, `roadwork/docs/teachme.md` in your project, walks through the same ground for a person.

## The rule

`rules/roadwork-constitution.md`, called the constitution, is installed in your project as `.claude/rules/roadwork-constitution.md`. Claude Code loads rules from a project's `.claude/rules/`; the header of this one names the files it applies to, those in a `roadwork/` folder or a `roadwork-` skill's folder. It says how the register is laid out, which skill writes which file, how items are named and pointed at, how a skill offers the next step, and which helper agents a skill may hand work to. Every skill's `## Prerequisites` section requires the whole constitution in the session before the skill acts, and says how to find it when it is not.

## The skills

`skills/` holds one folder per skill, `skills/<skill>/`, each with a `SKILL.md`: a header holding the skill's `name` and `description`, then its instructions. The init installs each as `.claude/skills/<skill>/` in your project, and you run one by typing a slash and its name, for example `/roadwork-help`. Nineteen are Roadwork's own and their names begin `roadwork-`; the twentieth, `unlazy`, keeps a long build honest — the build of an item runs under it, against the item's pass-or-fail gates — and is shipped as its own project publishes it. Some skills carry scripts in a `scripts/` folder, in Node and two in Python, which the skill runs for what can be computed, such as `roadwork-config/scripts/config.mjs`, which reads the settings file, and `roadwork-inventory/scripts/inventory.mjs`, which prints every open item on one page.

## The scaffold

`scaffold/` is the register's skeleton as the Roadwork repository ships it: `CLAUDE.md`, `.gitignore`, `ordering.md`, `working.md`, and the folders `todo/`, `feature/`, `spark/`, `docs/`, `destinations/`, `maps/`, `guidebooks/` and `atlases/`. Every folder in it, and every `archive/` inside one, carries an anchor — a `CLAUDE.md` saying what the folder holds and which part of the constitution governs it — and its docs folder holds the teach-me, `teachme.md`, and `facts.md`, the short facts some replies end with. It holds no item and no map: those are always the project's own. The init copies it once, and never again into the same register.

## The register

The register is your project's copy of the scaffold, usually `roadwork/` at the project's root: the one place the project's work is recorded. Its `todo/`, `feature/` and `spark/` folders hold the work items — todos, features, and sparks, ideas parked for later — one folder each, a todo or feature folder holding its notes, its intent, its spec and its plan; `ordering.md` lists what comes next, top first, and `working.md` what is in process now; `destinations/`, `maps/`, `guidebooks/` and `atlases/` hold the larger aims and the ways to reach them; its docs folder holds the teach-me, the facts and, as items ship, their specs kept as decision records. The register is a git repository of its own with no remote: its commits stay on your machine, it is never pushed, and nothing in it goes back to the Roadwork repository. Only the skills write in it, each the files the constitution gives it.

## The settings file

`roadwork/config.json` holds the project's settings, one value per key. The scaffold ships it with every key of the schema present and empty, so the init's copy already lists what can be set; it is ignored by git and never committed, and it is read and written only through the config skill, `/roadwork-config`, and its script, which every skill runs before it acts. Four keys place the register in its project: `project-root`, the path from the register to the project's root (`..` by default); `ref-alias`, a second prefix, besides `main/` (as in `main/todo/<item-name>`), for references to items (none by default); `repos`, the repositories whose unmerged branches the inventory lists (`.`, the project's own, by default); and `audit-root-prefix`, a prefix every path in an audited document must start with (none by default). Values that belong to one project and are not settings live beside the file in `roadwork/docs/local/`, also ignored by git: the list of your project's own names (`roadwork/docs/local/instance-strings.txt`), which the audit keeps out of a document, and the audit's pairs of documents kept as copies of each other, `roadwork/docs/local/twins.txt`.

## The lifecycle

Work moves through the skills in one order, each a command you type and each ending by offering the next: `/roadwork-destination` makes a destination, a larger aim, with you, and `/roadwork-nav-to-destination` breaks it into a group of items; `/roadwork-ingest` files one item from your notes, kept word for word; `/roadwork-intentify` interviews you until the item's intent is settled in your words; `/roadwork-specplan` writes the spec and the plan with its gates; `/roadwork-make` is your go, and builds the item under `unlazy` against the gates; `/roadwork-verify-and-archive` checks what was built and, on your word, archives the item. Accepting a spec is never the go. Beside the chain, `/roadwork-help` answers questions and `/roadwork-inventory` prints everything open.

## What the Roadwork repository holds

- `README.md`, the overview and quickstart; `LICENSE`, the MIT License; `CHANGELOG.md`, the releases; `CONTRIBUTING.md`, how to propose a change; `.gitignore`; and `.github/workflows/check.yml`, the CI workflow.
- `bin/` — `bin/roadwork-init.mjs`, the init; `bin/check.mjs`, the checks CI runs; `bin/smoke.mjs`, a trial of the init in an empty temporary project.
- `docs/` — `docs/install-and-update.md` and this page, `docs/how-the-pieces-fit.md`.
- `rules/roadwork-constitution.md`, the rule; `skills/`, the skills; and `scaffold/`, the register's skeleton.

# Contributing to Roadwork

Changes come in as pull requests on GitHub. The steps:

1. Fork the repository and make a branch for your change.
2. Make the change. Keep each skill's behaviour as its `SKILL.md` describes it unless the change is about that behaviour, and say so when it is.
3. Run the checks locally, from the repository's root, and make them pass:

   ```
   node bin/check.mjs
   node bin/smoke.mjs
   ```

4. Add a line under `## [Unreleased]` in `CHANGELOG.md`, in the group that fits — Added, Changed, Deprecated, Removed, Fixed or Security — as [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) describes.
5. Open a pull request against `main`, saying what the change does and why.

## What CI runs

`.github/workflows/check.yml` runs `node bin/check.mjs` on every push and every pull request, on Node.js 24. It runs five checks, each of which you can also run alone, as `node bin/check.mjs <check>`:

- `anchors` — every anchor of the scaffold is present: the register's own files (`scaffold/CLAUDE.md`, `scaffold/.gitignore`, `scaffold/ordering.md`, `scaffold/working.md`, `scaffold/docs/teachme.md`, `scaffold/docs/facts.md`) and the `CLAUDE.md` of every folder the constitution lists, and `scaffold/spark/archive/CLAUDE.md`.
- `skills` — every folder under `skills/` has a `SKILL.md` whose header holds `name` and `description`, and every skill but `unlazy` has its `## Prerequisites` and `## Sub-agents` sections.
- `terms` — every entry of the constitution's glossary has a row in its terms table.
- `selftests` — every shipped script that has a `--selftest` passes it, and every shipped Python script compiles.
- `words` — no file under `rules/`, `skills/` or `scaffold/` carries a word from the list in `bin/check.mjs`: words that meant something only inside the project Roadwork was first built in.

`bin/smoke.mjs` is the trial of the init: in an empty temporary project it runs the init, then the installed config and inventory scripts, and checks that the help skill's inputs are in place.

## What a change must not carry

No key, token, password or other secret; no machine name, personal path or address; and no value that belongs to one project only. A value that has to differ from project to project is read from the register's settings file, `roadwork/config.json`, through the config skill, or from a file in the register's `roadwork/docs/local/`, both ignored by git — never written into a shipped file.

## The unlazy skill

`skills/unlazy/` is the unlazy skill exactly as its own project publishes it (its `README.md` and `LICENSE` travel with it). It is not changed in this repository; changes to it belong to its own project.

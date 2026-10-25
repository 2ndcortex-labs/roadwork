# Changelog

All notable changes to Roadwork are recorded here, in the form of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-25

### Added

- `bin/roadwork-init.mjs`, the init tool: `node bin/roadwork-init.mjs <register-path> [--project <root>]` copies `scaffold/` once into a project as its register, makes the copy its own local git repository with one commit, writes the release it was copied from into the register's `CLAUDE.md`, and installs the rule and the skills into the project's `.claude/rules/` and `.claude/skills/`; a re-run refreshes the rule and the skills and leaves the register untouched.
- The repository's furniture: `README.md` with a quickstart, `CONTRIBUTING.md`, this changelog, `docs/install-and-update.md` and `docs/how-the-pieces-fit.md`.
- Continuous integration: `.github/workflows/check.yml` runs `node bin/check.mjs` on every push and pull request; `bin/check.mjs` checks the scaffold's anchors, every skill's frontmatter and sections, the glossary against the terms table, the shipped self-tests, and the words no shipped file may carry (the `words` check CONTRIBUTING.md names); `bin/smoke.mjs`, run by hand, tries the init in an empty temporary project and calls the installed config and inventory scripts there.
- Attribution: the workflow uses `actions/checkout` v7.0.1 and `actions/setup-node` v7.1.0, both by GitHub and both under the MIT License, pinned by their full commit SHAs; `LICENSE` is the MIT License text as the Open Source Initiative publishes it.

### Changed

- The layout: the rule lives in `rules/`, the skills in `skills/`, and the register's skeleton in `scaffold/`; nothing of the register sits at the repository's root.
- A register is now a copy of `scaffold/`, made once by the init tool, with no remote; it is no longer a clone of this repository. The constitution, `scaffold/CLAUDE.md`, the teach-me and the facts list say so.
- The shipped files no longer carry the words of the project that built them: eleven files are rewritten in generic terms, and the values that vary per project are read from four new settings keys — `project-root`, `ref-alias`, `repos` and `audit-root-prefix` — and from the project-only file `docs/local/twins.txt` in the register. With the keys unset, the skills behave as for a plain project with its register at `roadwork/`.

### Removed

- `install/`: the rule and the skills now ship in `rules/` and `skills/` and are installed by the init tool.
- The GPL-2 license, replaced by the MIT License.

**Migrating a register made by clone.** A register cloned from this repository before 1.0.0 migrates by deleting its `install/` folder and nothing else. From then on the rule and the skills are installed and refreshed as for any register, by running the init tool against the register's path, which finds a register there and leaves it untouched.

[Unreleased]: https://github.com/2ndcortex-labs/roadwork/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/2ndcortex-labs/roadwork/releases/tag/v1.0.0

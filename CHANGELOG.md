# Changelog

All notable changes to Roadwork are recorded here, in the form of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The Offers section states what nethub's reply-form rule carried alone: the multi-word form (one box answering all the words, its `except:` twin, then one box per word), the question-tool form (one list of choices, a tick the word, several ticks one batch where the skill accepts batches), and the refusal of an id with text where the offer takes no completion; that rule can retire.

### Changed

- The form of an invocation that carries a word (the constitution's N.2): a word the invoked skill owns follows the input bare; a word of the step before — `spec accepted`, `G<n> accepted`, `confirm` to the interview that offered the skill, `group is right` — follows after `given`, so it never reads as the skill's argument. The skills' offers now state the form the constitution states (they still read `<word> and /<skill>`, the order the constitution left in 1.0.0).

## [1.0.1] - 2026-10-25

### Fixed

- The constitution's anchor list names its sixteenth anchor, `scaffold/spark/archive/CLAUDE.md` (as `spark/archive/CLAUDE.md` in the register), which the tree carried and the list did not.
- The constitution's `docs/` bullet names `docs/local/twins.txt`, the twin pairs file beside the instance-strings list.
- The alias of the reference prefix is named as the `ref-alias` setting at every place the constitution speaks of it; the sentence that gave the project's law a share in it is gone.

### Changed

- "The home", where it meant this repository, reads "the Roadwork repository" in the constitution and the skills; the register's own glossary entry Home keeps its meaning (where an item lives).
- The parenthetical "(reply-form rule)", a citation of a rule this repository never shipped, is struck from the constitution and the skills; what it pointed at is now written in the constitution itself: N.10's restatement form (one bullet per concern, gate, finding or section the word answers; the form of each), the new point N.13 (a document asked about is printed whole before its offer), and the Offer form row of the terms table.
- "Workspace", in the sense of the project a register serves, reads "project"; "harness" reads "the host"; the unlazy skill, shipped as its own project publishes it, is untouched.
- The `words` check of `bin/check.mjs` guards "reply-form" and "harness" as well, and skips `skills/unlazy/`; CONTRIBUTING.md says so.

### Added

- `CODE_OF_CONDUCT.md`: the Contributor Covenant, version 2.1, with a contact address; CONTRIBUTING.md points at it.
- The workflow runs the smoke test, `node bin/smoke.mjs`, as a second step after `node bin/check.mjs`.

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

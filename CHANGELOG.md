# Changelog

All notable changes to Roadwork are recorded here, in the form of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The Offers section states what nethub's reply-form rule carried alone: the multi-word form (one box answering all the words, its `except:` twin, then one box per word), the question-tool form (one list of choices, a tick the word, several ticks one batch where the skill accepts batches), and the refusal of an id with text where the offer takes no completion; that rule can retire.
- `scaffold/config.json`, the settings file with every key of the schema present and empty: a fresh register carries it from the init's copy on, owner-only, ignored by the register's git as before (the constitution's register bullet; `docs/how-the-pieces-fit.md`; the config skill).
- `agents/`, the six agent instruction files, one per sub-agent type the constitution defines — `reader.md`, `finder.md`, `explore.md`, `researcher.md`, `builder.md`, `reviewer.md` — none carrying a model, the model family being the settings file's; the type `research` is renamed `researcher` and its settings key `subagent-research` becomes `subagent-researcher` (the config script reads the old key through while the new is empty, and says so); the init installs the agent files into `.claude/agents/` on every run, each replaced by name, a project's own agent files left alone; `bin/check.mjs` gains the mode `agents`, run by `all`.
- The frontmatter key `gated` — a build the make stopped at a gate it cannot meet from inside the project, with the date and what it waits on; written and cleared by the make, read and counted by the inventory page, put as a finding by the archive skill, emptied by the archive act and a reconsideration (the constitution's Frontmatter bullet, its terms row and glossary entry).
- The settings keys `notify-token` and `status-token`, the credential each externality address wants, sent as the header `Authorization: Bearer <token>` by the config skill's calling script when set and omitted when empty; optional, secret, set by the terminal or file route.
- The builder's code ruleset in `agents/builder.md`: the reach list, the shortcut marker, and — verbatim from Ponytail 5.3.3 (github.com/DietrichGebert/ponytail, MIT License, Copyright (c) 2026 DietrichGebert) — the six-rung ladder, the "Never cut" line and the test rule; the report's Risks part says every cut. The reviewer's finding form in `agents/reviewer.md`: what the code does, what goes wrong, the fix, the consequence of leaving it.

### Changed

- Every dispatch of a sub-agent names the host's agent of the type's name, so the type's instruction file under `.claude/agents/` is its standing instructions and the brief the task only: the constitution's sub-agents bullet (the brief line and each type's instruction file), every skill's Sub-agents section, the dispatch lines of the make, the specplan (the rounds and the prior-art search), the audit, the navsanity and the intentify, and `docs/how-the-pieces-fit.md`.
- The form of an invocation that carries a word (the constitution's N.2): a word the invoked skill owns follows the input bare; a word of the step before — `spec accepted`, `G<n> accepted`, `confirm` to the interview that offered the skill, `group is right` — follows after `given`, so it never reads as the skill's argument. The skills' offers now state the form the constitution states (they still read `<word> and /<skill>`, the order the constitution left in 1.0.0).
- The six agent files under `agents/` complete their limits against the constitution's sub-agents bullet (builder's and reviewer's missing may-nots, the general no-Operator/no-channel/no-key line in all six); researcher's prohibition narrowed so running a read-only tool by `npx` is not an install.
- `notify-url` and `status-url` are public addresses, printed in the clear and set in chat with `/roadwork-config <key> <value>`; a credential once carried in a URL is moved to the token key before updating.
- The sub-agent type `explore` is renamed `explorer`: its agent file is `agents/explorer.md`, its settings key `subagent-explorer`; the old key is not read through, and every skill, the constitution, the checks and the docs name the new one.
- The register's template folder `scaffold/` is renamed `skeleton/`, and the word with it across the repository: the rule, the README, CONTRIBUTING, the docs, the init tool (which now copies `skeleton/` into a project), the check's anchors and words modes, the config skill and the skeleton's own `CLAUDE.md`, `docs/facts.md` and `docs/teachme.md`; this changelog's history keeps the old name.
- The make records each item's landings at the go in `landing.json`, in the item's folder — one `{ "path", "branch" }` per landing, read from the plan's "lands as" lines, which the plan form now writes in one fixed form, `branch <branch> of <path>` or `a local commit in the register`; the archive's landing and unlanded-branch findings and the make's unpushed line read it, the unlanded check taking `--path <path> --branch <branch>`; the config script gains `unset <key>`, the one way a key leaves the settings file.
- References resolve with any prefix: the inventory and the externality test read everything before the last `todo/` or `feature/` segment as the prefix and read no setting for it; the audit's path check (`check-writing.py --paths`) tests each path for existence under the project's root, its new `--root` option naming the root where no register lies above; the settings file `config.json` is committed with the register and carries only the schema's keys, the skeleton's `.gitignore` no longer naming it (the constitution, the config skill, the README, CONTRIBUTING and the docs say so); the externality contract is stated as two generic calls any receiver may implement, `scripts/externality.mjs` one implementation; every remaining key's meaning is one sentence saying what reads it and why it exists, `project-root` and `standards-folders` set at setup.
- Roadwork is installed and updated by hand: `docs/install-and-update.md` is a four-step procedure — copy `skeleton/` into the project as `roadwork/`; copy `rules/`, `skills/` and `agents/` into the project's `.claude/` folders; write the line `Roadwork register: roadwork` into the project's `CLAUDE.md`; on update replace the rule, each skill folder, each agent file and the register's two docs whole, never its items — and the README, `docs/how-the-pieces-fit.md`, the constitution's register bullet, the skeleton's `CLAUDE.md`, `docs/teachme.md` and `docs/facts.md` say so. Roadwork's texts name no version-control act or artefact as Roadwork's own: fifteen skills' "Commit in the register" lines read "Save in the register" and their "Commit and hand back" headings "Save and hand back"; the plan form's "lands as" line is free words, `lands as: <where the step's work goes, in the project's own words>`, read by no skill or script, and the make's rule that combined eligible items by it is gone, each eligible item its own go; the specplan's provenance names the skills by name as installed in `.claude/skills/` on the date of writing; the constitution's terms table carries one row per glossary term, the Batch row and glossary entry reading "the coherent bundle a project's changes ship in as one, in the project's own terms; the work-plans' own records stay in the register"; the due-course pause examples read "a deployment, a reboot, a wait on another party's answer"; the builder's safety rules are reworded as "where a project's plan names a version-control act, do only that act, never a destructive or publishing one", in `agents/builder.md` and the constitution's builder definition, the same sentence in `agents/reviewer.md` and `agents/explorer.md`; the finder's texts (`agents/finder.md`, the constitution, the config skill's `subagent-finder` meaning) name "a record of the project's history" as an example of a fact and return its source by path; the audit skill's section form carries one line, the session agent's, naming the copy of each source it read.
- The make's briefs ask the builder for the report's tail and name the reviewer's finding form (§3, §3b); the spec skill names the builder's ruleset as a constraint for code-writing items (§1) and its plan template offers an optional gate on the test the builder leaves (§3).

### Removed

- The init tool `bin/roadwork-init.mjs` and its smoke test `bin/smoke.mjs`, with the workflow step that ran it; the landing checks — `skills/roadwork-inventory/scripts/unlanded.mjs`, the make's `landing.json` record and landing refusal, its unpushed line and pull-request offer, the archive's Landing and Unlanded-branch findings and pull-request-offer sentence, the constitution's git offer and its "pull-request offer" terms row; the skeleton's `.gitignore`, struck from the constitution's register files, the check's anchors list, the README, CONTRIBUTING and the docs; the constitution's ten git-word terms rows (commit, branch, PR, merge, fetch, clone, push, tip, ancestry, repo) and the terms-table bullet's clause "and one per git word a skill puts in front of a person"; the audit planner's VERSION lines, copy comparison and `--copy` option, with the audit skill's paragraph "The version lines and the copy question"; and every remaining mention of git, a commit, a repository, a push, a fetch, a branch, a pull request or a merge as Roadwork's own, from the rule, the skills, the agent files, the skeleton and the docs — the home's own furniture (this changelog, CONTRIBUTING, the code of conduct, its `.gitignore` and workflow) and the referent listing's reading of a project's ignore files keep theirs.

- The settings keys `repos` and `versioned`; the inventory page's not-yet-landed block, with its `--unlanded-lines` option, the `unlanded:` filter form and the terms row "Not yet landed"; the unlanded check's list mode. The inventory reads the register alone; an item's landing is its own record.
- The settings keys `org-slug`, `ref-alias` and `audit-root-prefix`, with the audit check's `--root-prefix` option; the instance-keys mechanism (`docs/local/config-keys.json`, read by the config script); the rule that the settings file and its tokens are never committed.

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

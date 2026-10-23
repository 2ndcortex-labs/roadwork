---
name: roadwork-audit
description: Audits one document with fresh readers for writing, truth or continuity when the Operator asks, and records the findings.
when_to_use: Use when the user says /roadwork-audit <document> <kind>, "audit this document", "check this for writing, truth and continuity", or /roadwork-audit alone for the kinds and the known pairs.
argument-hint: <document> <kind> [<path> …] [--item <ref>]
---

# roadwork-audit — one document, five fresh readers, three kinds of audit

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. This skill sits beside the lifecycle chain: it reads one document, dispatches readers, records their findings, and offers the work. It never edits the document it reads, never rules on a finding (the Operator does), and never runs a second round of readers on its own.

## 1. Invocation and kinds

`/roadwork-audit <document> <kind> [<path> …] [--referent <folder>] [--item <ref>]` — `<document>` a path from the workspace root; `<kind>` one of `writing`, `truth`, `continuity`, `all`; the paths after the kind are extra sources (truth) or counterparts (continuity); `--referent <folder>` names a folder referent, an input of the truth kind: the folder the document describes, its listing a source (§4); `--item <ref>` names the register item the findings land on.

- With no kind the skill asks which kind and does nothing else. With a document that does not exist it says so and stops. A bare `/roadwork-audit` prints the kinds and the known pairs (§4) and writes nothing.
- *writing* tests how the document reads: the Operator's four rules and the paths-and-instance-strings question, the document alone.
- *truth* tests whether the document agrees with the homes it points at: contradiction, unsupported claim, stale pointer, altered restatement, homeless fact.
- *continuity* tests whether the document agrees with the documents that must agree with it: divergence, missing counterpart, orphaned statement, naming, version.
- `all` runs writing, truth, continuity in that order, fifteen readers in three waves of five; paths after `all` go to truth as sources and to continuity as counterparts; one audit section per kind, one report folder per kind, one holder todo for the run.

## 2. The reader form (every kind)

Five fresh sub-agents, launched in parallel through the harness's Agent tool, model opus at effort xhigh — fixed; the dispatcher may not lower them (the Operator's standing word on sub-agents, 2026-10-12). One question each; each reader is given the document's path and, for truth and continuity, the sources' paths, and nothing else; each writes its report verbatim to its file. Findings are line-numbered, at most ten per reader; a reader with none writes "clean".

The five prompts come from `scripts/dispatch-plan.py --doc <document> --kind <kind> [--sources <path>…] --report-dir <dir> [--root <root>] [--copy <repo>=<commons|main|working-tree>…]`: run it, read its VERSION lines (truth, continuity — §4; a COPY QUESTION means stop and ask, nothing dispatched), send its five prompts as five Agent calls in one turn, wait for all five, then read the five reports from `<dir>/q1.md` … `q5.md`. The reader brief, `texts/reader-brief.md`, verbatim (the bracketed clause for truth and continuity only):

> You are a fresh reviewer with no other context. Read this one file: <document>. [truth, continuity: Then read these source files, and nothing else: <sources>. The version of each, in that order: <versions>. Open your report with those lines, verbatim, before your findings.] Answer this one question: <question>. Give a numbered list of findings, each with the line it points at and one sentence; at most ten; say 'clean' if none. Write your report, exactly as you return it, to the file <report path> (create it; it does not exist). Do not rewrite anything else. Do not read any other file.

## 3. writing

The four rules, the Operator's (2026-10-13), their home the brief's archived audit items `todo/next-workspace-standup/archive/fix-the-nethub-claude-md` and `…/implement-the-audit-findings` in the register:

1. Definition before use — every term is defined in a clause before its first use, or pointed at its defining file at or before that use.
2. No forward references — no line depends on something stated only later in the document.
3. Explicit premises — every rule states the premise it rests on: why it holds, or what fact makes it apply.
4. Implicit knowledge audited — nothing the reader must already know is left unstated and unpointed.

The five questions are `texts/questions-writing.md`: one per rule, then paths and instance strings. Before the readers, run the mechanical checker and print its result with the readers' findings as a sixth set:

```
python3 <skill>/scripts/check-writing.py --doc <document> --paths --instance-free [--root-prefix nethub/] [--strings <list>]
```

`--paths`: every path token (a backticked span containing `/`, outside fenced blocks, that is not a slash command or a git ref) starts with the root prefix, default `nethub/`; none opens with `/` or `...`. `--instance-free`: the strings of the list file are absent; the default list is the register's `docs/local/instance-strings.txt`, this workspace's own names, kept by the Operator and ignored by git (instance material).

## 4. truth and continuity

**The version lines and the copy question** — every truth and continuity audit; writing prints none. Terms: a *commons copy* is a path under `nethub/reference/repos/<repo>/`; a *seated clone* is `<root>/<repo>/`, a git repository beside `nethub/` (the root: the folder holding `nethub/`); a path is *twinned* when it lies under a commons copy whose repository has a seated clone, or under a seated clone whose repository has a commons copy. Before any reader runs, `scripts/dispatch-plan.py` prints one version line per source or counterpart — `VERSION: <path>@<commit>`, the path from the root, the commit the short HEAD of the repository holding the path, `<path>@unversioned` for a path in no repository — and for a twinned path compares the three copies by commit: the commons copy (the commons clone's HEAD), the clone's `main` (its local ref, never fetched — the audit fetches nothing) and the clone's working tree (its checked-out branch's HEAD and the file on disk). Equal, the file unmodified: one line, `commons and seated clone both at <commit>`, and the commons copy is read. Differing by any of the three commits, or the file modified in the working tree: the script prints `COPY QUESTION: <repo>` and the three copies as choices, each by its version line — `<path>@<commit>, the commons copy`; `<path>@<commit>, the main copy`; `<path>@<branch> <commit>[ modified], the working-tree copy` — and exits 2 with no prompt; nothing is written on the item until the Operator answers. The session agent puts the question as three offers in the reply form, blocks with O-numbers, each the audit invocation re-typed with `--copy <repo>=<commons|main|working-tree>` appended — every repository whose copies differ named in each block, a mixed answer typed by hand with one `--copy` per repository; no default: the skill never picks a copy. The answer re-runs the audit; the script prints the version lines with the chosen copies and the five prompts: `commons` reads the commons path; `working-tree` the clone's file; `main` the file as `git show main:<path>` gives it, written to `<report-dir>/sources/<repo>-main-<commit>-<file name>`, the reader given that path and the version line naming the clone's path and the `main` commit. `--root <root>` names the root where the skill is not run from under `nethub/`. Every version line goes three places: the prompts (the brief's clause), the item's audit section (§5) and the head of each reader's report.

*truth* — the sources: every pointer the document carries — a backticked path, resolved from the workspace root, or a document named in prose, resolved by file name against `nethub/docs/`, `nethub/.claude/rules/` and the commons' `docs/` folders — plus the constitution at `nethub/reference/repos/buzz-agentic-architecture/docs/constitution.md` always — a twinned path wherever the store is seated, read through the copy question above like any other source — plus the paths given on the invocation. A pointer that resolves to nothing is reported as a stale pointer before dispatch. With a folder referent (`--referent <folder>`), the listing made by `scripts/list-referent.mjs` is among every reader's sources. The skill prints the source list before dispatch. The questions: `texts/questions-truth.md` — the five, then a sixth: "Omission — what exists in the referent listing that the document does not name? List each path, with the document section that should name it." The reader form is unchanged — model opus at effort xhigh, fixed — with one reader more, the sixth question's.

*continuity* — the counterparts, from this table, matched by the document's path:

| document | counterpart |
|---|---|
| the brief `nethub/CLAUDE.md` | the constitution (the path above; its copy by the copy question above) |
| any `reference/CLAUDE.md` anchor | the brief `nethub/CLAUDE.md` |
| a file of the seed (`nexus/`, cloned beside nethub) | the same file in the object `nethub/nexus/`, and the other way |

A pair the table lacks is given as paths on the invocation; with neither, the skill asks for the counterparts. The questions: `texts/questions-continuity.md`.

## 5. Where the findings land

On the item named by `--item` (`--item <ref>`): a dated section `**Audit (<date>, <kind>, written by /roadwork-audit):**` appended to its item file: the invocation line, then one version line per source as the script printed it (truth, continuity), then every reader's findings listed, each citing its report at `audit/<date>-<kind>/q<n>.md` in that item's folder — each report's first lines are the version lines of the sources that reader was given, in the order given, as the brief instructs. A folder referent's listing is kept at `<report-dir>/sources/referent-<folder's last segment>.txt`, and its VERSION line, `VERSION: referent <folder> listing sha256 <first twelve hex digits>`, is among the version lines. With no item: a new todo filed in the full ingest form (frontmatter, placeholders, an ordering line) under `unnavigated/`, named `audit-of-<document path, slashes as hyphens, the extension dropped>-<date>`, its notes the invocation line verbatim, its reading the findings' summary, the reports in its `audit/` folder. The act is committed in the register, local. The skill never edits the document it audits and writes only in the register's item folders and the files the invocation names.

## 6. Hand back

Print every reader's findings whole, the checker's set first for writing. Then one offer, in the offer form: an ingest of a todo that implements the findings, its notes prefilled —

```
/roadwork-ingest implement the audit findings recorded at <ref>
```

— where `<ref>` is the holder todo or the named item; when the findings sit on a named item, offer that item's next lifecycle step instead. Then the back offers as `/roadwork-ingest` §5b computes them, and the fact suffix, by the clock.

## Never

Never edits the document; never lowers the readers' model or effort; never files on a bare call; never a second round of readers on its own; never rules a finding out (the Operator does, on the holder item); never posts anywhere outside the workspace.

**Text for the Operator.** In text for the Operator, use the plain words of the terms table — `docs/terms.md` in the register, one row per term: the plain word, the agent's word, the meaning; the agent's words stay in the skill.

## Glossary

- **Roadwork** — the Roadwork system by 2nd Cortex Labs — road plans and the skills that work them.
- **Road plans** — the project's `roadwork/`: the one place its work is recorded. Three **sub-registers**: `todo/` (fixes, chores, decisions, findings), `feature/` (new capabilities), `spark/` (ideas; never worked); the test: a todo is done once, a feature is reused when built — the Operator may name the kind against it.
- **Item** — one folder under its destination's folder in a sub-register (`unnavigated/` until a navigation cites it): `todo.md` or `feature.md` (the **item file**) plus `intent.md`, `plan.md`, `spec.md`; a spark holds only `idea.md`.
- **Home** — the register an item lives in: the project's one register, at the path the project's law names; a clone of a remote, fetched and merged, never pushed.
- **Reference (ref)** — `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`; from anywhere, `main/<kind>/<item-name>` — the project's law may alias the prefix.
- **Frontmatter** — the YAML block opening an item file: `blocker`, `blocking`, `blocked-by`, `external`, `group`, `in-process`, `disposition`, `road-level` (the item's level within its destination — `main`, `secondary`, `side` — or empty), a feature's `onroad-cohort` before it.
- **External** — the `external` key: an externality, a dependency that will not be met without something specific and out-of-band happening (Operator, 2026-10-11); an operational pause in the due course — a push, a merge, a fetch, a reboot — is never one. Stated by the spec skill as a fact in the spec's Dependencies section (what, who acts, how observed) — one entry per out-of-band act, never per party or per service — and written on spec acceptance: a `blocked-by` where another item acts, the key's text where another party does, with the item file's dated `**External set**` line; emptied only by the Operator, with the dated `**External cleared**` line; `/roadwork-make` refuses while it is set; its observed-by part run as a test at acceptance and before a make, a command deciding it where one is written, the Operator's word where not; notified where the workspace names an address.
- **`ordering.md`** — the register's loose priority list; top is next. **`working.md`** — the register's dated list of items in process.
- **Operator (user)** — the human owner; every decision is theirs.
- **Session agent** — the agent running the session that invokes the skill.
- **Project scope** — everything at and under the root the project's law names; the paths an item touches are its **Paths:** line.
- **Batch** — the coherent bundle a project's changes ship in as one PR; the register's own commits are local and never a PR.
- **Lifecycle** — `/roadwork-atlas` (three documents into an atlas, above a destination) → `/roadwork-destination` → `/roadwork-nav-to-destination` (a destination into a group) → `/roadwork-ingest` → `/roadwork-intentify` → `/roadwork-specplan` → `/roadwork-make` (the go — the skill or the Operator's word; builds under `/unlazy`) → `/roadwork-verify-and-archive`. Every skill ends by offering the next. Beside the chain, `/roadwork-help` answers and `/roadwork-intent-insights` learns from the day's interviews.
- **PRD** — a product requirements document, `destinations/<destination-slug>.prd.md`, made by `/roadwork-destination` and the source of a group of items made by `/roadwork-nav-to-destination`; cited by path in every derived item.
- **Destination** — two files beside each other in `destinations/`: `<destination-slug>.intent.md`, what is wanted and why in the Operator's words, in the item intent's form, interviewed and written first; and `<destination-slug>.prd.md`, written from it, in a fixed form (a frontmatter block with `bucket-list-priority`, 1–10, 10 the highest, and `atlas`; the destination, a Stack section — the architecture read, the guidebooks drawn on, the changes to their stacks — numbered requirements, Out, Success); its slug categorises the register's items — one destination per item, the group's, written on the item by `/roadwork-nav-to-destination`; both files archived to `destinations/archive/` by hand when built.
- **Map** — one `maps/<destination-slug>.md`: the way to one destination, one map per destination — before agents, process, stack, judgements, inputs — in a fixed form, made by `/roadwork-map`, drawing on guidebooks by copying their relevant parts in (a **Guidebooks:** line names them); named on an item by its **Map:** line, one per item, read by `/roadwork-intentify` and `/roadwork-specplan`; enforced by nothing; retired to `maps/archive/` by hand.
- **Stack** — what a destination is built on: environment, framework, tooling, assets and services; chosen per destination from the guidebooks, carried by the requirements file, the map, the spec and the plan.
- **Sanity todo** — the todo `/roadwork-nav-to-destination` creates last, `todo/<destination-slug>-sanity`: the group list and the requirement↔item mapping both ways; blocks every other item in the group until the Operator says the group is right.
- **Check types** — the six sanity checks `/roadwork-navsanity` runs over a group: completeness, provenance, shape, dependencies, order, scope.
- **Run** — one pass of `/roadwork-navsanity` over a group: six checks, ten questions, the changes made; recorded as a dated section in the group's sanity todo.
- **Hand-made group** — a group not born of a PRD; its requirements are its members' own claims plus the group's line in `ordering.md`.
- **Cohort** — a subgroup of a group's features that can be built in parallel by sub-agents: the rubric passes on every criterion; named in each member's `onroad-cohort`.
- **Cohortmeister (CM)** — `feature/cm-<group>-<cohort>`: the pseudo-feature that blocks a cohort's members, is onroaded in their place, and whose ledger is the results checker; archives them by cascade.
- **Rubric** — the five pass/fail criteria a subgroup must meet to be a cohort: no dependency edge, disjoint ownership, accepted spec and plan with gates, no external and not in process, self-contained builds.
- **Reconsideration** — `/roadwork-specplan`'s second mode: on an item whose accepted spec and plan already exist, re-read them against everything dated since; a dated `Reconsidered` changelog, proven gates carried, the previous go ended, the spec proposed again.
- **Verification round** — `/roadwork-specplan`'s fresh-eyes check: six predefined questions on the spec, five on the plan, one fresh reader each — run as one workflow where the harness runs workflows, on the top model of the tier one step below the session's (or the session's own where no lower tier exists) at an effort the dispatcher sets, findings in one bounded shape (file, line, one sentence, an empty disposition slot; at most eight; "clean" as none), sub-agents the fallback — findings incorporated or rejected with a reason and recorded in the document by the session agent; one round per document.
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never runs; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, the last part of its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names its slugs by their bearer — `<destination-slug>`, `<map-slug>`, `<guidebook-slug>`, `<atlas-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs. Before such an offer, each concern or gate its word answers is restated simply right above it — one bullet, the question in plain words, the options with the recommended one first and its reason, two sentences at most; a gate's bullet says what is approved and where it was shown (Operator, 2026-10-14). Every offer printed as a block carries an id, `O1`, `O2`, … in printing order, in bold at the start of its sentence; the id typed alone is the Operator's word for that offer, read as the whole block, recorded in full with the id after it; nothing changes where the offers go through the question tool (Operator, 2026-10-15). Where typing it makes or changes something, the sentence carries, in parentheses right after the thing acted on, what is to be accomplished — the change or the product itself, as what will exist or be said afterwards, a few words opening "to", specific to the item where the item is known, never a sentence, never the skill's definition, never the reason, the gate, the authority or the item — "runs the map skill on the-lifecycle (to rename its Assets and tools section to Stack)"; a directive phrase the same; a bare listing or a help call, which leaves nothing behind, carries none; the Gate id entry's parenthetical says what a thing is, this one what a run accomplishes (Operator, 2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

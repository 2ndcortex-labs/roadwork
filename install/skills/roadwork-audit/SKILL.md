---
name: roadwork-audit
description: Audits one document with five fresh readers — writing (the Operator's four rules plus paths and instance strings), truth (against the homes it points at), continuity (against the documents that must agree with it), or all three — records the findings on a register item and offers a todo to implement them; never edits the document; asks which kind when none is given.
---

# roadwork-audit — one document, five fresh readers, three kinds of audit

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. This skill sits beside the lifecycle chain: it reads one document, dispatches readers, records their findings, and offers the work. It never edits the document it reads, never rules on a finding (the Operator does), and never runs a second round of readers on its own.

## 1. Invocation and kinds

`/roadwork-audit <document> <kind> [<path> …] [--item <ref>]` — `<document>` a path from the workspace root; `<kind>` one of `writing`, `truth`, `continuity`, `all`; the paths after the kind are extra sources (truth) or counterparts (continuity); `--item <ref>` names the register item the findings land on.

- With no kind the skill asks which kind and does nothing else. With a document that does not exist it says so and stops. A bare `/roadwork-audit` prints the kinds and the known pairs (§4) and writes nothing.
- *writing* tests how the document reads: the Operator's four rules and the paths-and-instance-strings question, the document alone.
- *truth* tests whether the document agrees with the homes it points at: contradiction, unsupported claim, stale pointer, altered restatement, homeless fact.
- *continuity* tests whether the document agrees with the documents that must agree with it: divergence, missing counterpart, orphaned statement, naming, version.
- `all` runs writing, truth, continuity in that order, fifteen readers in three waves of five; paths after `all` go to truth as sources and to continuity as counterparts; one audit section per kind, one report folder per kind, one holder todo for the run.

## 2. The reader form (every kind)

Five fresh sub-agents, launched in parallel through the harness's Agent tool, model opus at effort xhigh — fixed; the dispatcher may not lower them (the Operator's standing word on sub-agents, 2026-10-12). One question each; each reader is given the document's path and, for truth and continuity, the sources' paths, and nothing else; each writes its report verbatim to its file. Findings are line-numbered, at most ten per reader; a reader with none writes "clean".

The five prompts come from `scripts/dispatch-plan.py --doc <document> --kind <kind> [--sources <path>…] --report-dir <dir>`: run it, send its five prompts as five Agent calls in one turn, wait for all five, then read the five reports from `<dir>/q1.md` … `q5.md`. The reader brief, `texts/reader-brief.md`, verbatim (the bracketed clause for truth and continuity only):

> You are a fresh reviewer with no other context. Read this one file: <document>. [truth, continuity: Then read these source files, and nothing else: <sources>.] Answer this one question: <question>. Give a numbered list of findings, each with the line it points at and one sentence; at most ten; say 'clean' if none. Write your report, exactly as you return it, to the file <report path> (create it; it does not exist). Do not rewrite anything else. Do not read any other file.

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

*truth* — the sources: every pointer the document carries — a backticked path, resolved from the workspace root, or a document named in prose, resolved by file name against `nethub/docs/`, `nethub/.claude/rules/` and the commons' `docs/` folders — plus the constitution at `nethub/reference/repos/buzz-agentic-architecture/docs/constitution.md` always, plus the paths given on the invocation. A pointer that resolves to nothing is reported as a stale pointer before dispatch. The skill prints the source list before dispatch. The questions: `texts/questions-truth.md`.

*continuity* — the counterparts, from this table, matched by the document's path:

| document | counterpart |
|---|---|
| the brief `nethub/CLAUDE.md` | the constitution (the path above) |
| any `reference/CLAUDE.md` anchor | the brief `nethub/CLAUDE.md` |
| a file of the seed (`nexus/`, cloned beside nethub) | the same file in the object `nethub/nexus/`, and the other way |

A pair the table lacks is given as paths on the invocation; with neither, the skill asks for the counterparts. The questions: `texts/questions-continuity.md`.

## 5. Where the findings land

On the item named by `--item` (`--item <ref>`): a dated section `**Audit (<date>, <kind>, written by /roadwork-audit):**` appended to its item file, every reader's findings listed, each citing its report at `audit/<date>-<kind>/q<n>.md` in that item's folder. With no item: a new todo filed in the full ingest form (frontmatter, placeholders, an ordering line) under `unnavigated/`, named `audit-of-<document path, slashes as hyphens, the extension dropped>-<date>`, its notes the invocation line verbatim, its reading the findings' summary, the reports in its `audit/` folder. The act is committed in the register, local. The skill never edits the document it audits and writes only in the register's item folders and the files the invocation names.

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
- **`ordering.md`** — the register's loose priority list; top is next. **`working.md`** — the register's dated list of items in process.
- **Operator (user)** — the human owner; every decision is theirs.
- **Session agent** — the agent running the session that invokes the skill.
- **Project scope** — everything at and under the root the project's law names; the paths an item touches are its **Paths:** line.
- **Batch** — the coherent bundle a project's changes ship in as one PR; the register's own commits are local and never a PR.
- **Lifecycle** — `/roadwork-destination` → `/roadwork-nav-to-destination` (a destination into a group) → `/roadwork-ingest` → `/roadwork-intentify` → `/roadwork-specplan` → `/roadwork-make` (the only go; builds under `/unlazy`) → `/roadwork-verify-and-archive`. Every skill ends by offering the next. Beside the chain, `/roadwork-help` answers.
- **PRD** — a product requirements document, `destinations/<destination-slug>.prd.md`, made by `/roadwork-destination` and the source of a group of items made by `/roadwork-nav-to-destination`; cited by path in every derived item.
- **Destination** — one `destinations/<destination-slug>.prd.md`: what is wanted, in a fixed form (a frontmatter block with `bucket-list-priority`, 1–10, 10 the highest; the destination, numbered requirements, Out, Success); its slug categorises the register's items — one destination per item, the group's, written on the item by `/roadwork-nav-to-destination`; archived to `destinations/archive/` by hand when built.
- **Map** — one `maps/<map-slug>.md`: a primitive of the way to a destination — before agents, process, tools, judgements, inputs — in a fixed form, made by `/roadwork-map`; named on an item by its **Map:** line, one per item, read by `/roadwork-intentify` and `/roadwork-specplan`; a pattern to follow or improve, enforced by nothing; retired to `maps/archive/` by hand.
- **Sanity todo** — the todo `/roadwork-nav-to-destination` creates last, `todo/<destination-slug>-sanity`: the group list and the requirement↔item mapping both ways; blocks every other item in the group until the Operator says the group is right.
- **Check types** — the six sanity checks `/roadwork-navsanity` runs over a group: completeness, provenance, shape, dependencies, order, scope.
- **Run** — one pass of `/roadwork-navsanity` over a group: six checks, ten questions, the changes made; recorded as a dated section in the group's sanity todo.
- **Hand-made group** — a group not born of a PRD; its requirements are its members' own claims plus the group's line in `ordering.md`.
- **Cohort** — a subgroup of a group's features that can be built in parallel by sub-agents: the rubric passes on every criterion; named in each member's `onroad-cohort`.
- **Cohortmeister (CM)** — `feature/cm-<group>-<cohort>`: the pseudo-feature that blocks a cohort's members, is onroaded in their place, and whose ledger is the results checker; archives them by cascade.
- **Rubric** — the five pass/fail criteria a subgroup must meet to be a cohort: no dependency edge, disjoint ownership, accepted spec and plan with gates, no external and not in process, self-contained builds.
- **Reconsideration** — `/roadwork-specplan`'s second mode: on an item whose accepted spec and plan already exist, re-read them against everything dated since; a dated `Reconsidered` changelog, proven gates carried, the previous go ended, the spec proposed again.
- **Verification round** — `/roadwork-specplan`'s fresh-eyes check: five predefined questions on the spec, four on the plan, one fresh reader each — run as one workflow where the harness runs workflows, on the top model of the tier one step below the session's (or the session's own where no lower tier exists) at an effort the dispatcher sets, findings in one bounded shape (file, line, one sentence, an empty disposition slot; at most eight; "clean" as none), sub-agents the fallback — findings incorporated or rejected with a reason and recorded in the document by the session agent; one round per document.
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never invocations; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, and its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names one, a destination's `<destination-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a lifecycle skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs.
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadmap system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

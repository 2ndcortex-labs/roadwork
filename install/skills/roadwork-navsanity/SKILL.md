---
name: roadwork-navsanity
description: The thorough check of a group of road plans items — reads every member's files, runs six check types (completeness, provenance, shape, dependencies, order, scope), puts ten checkup questions to the Operator with the findings attached, and on their word per change amends or adds items, re-points dependencies and re-orders the block; never deletes. Works and records in the group's sanity todo. Use when the user says /roadwork-navsanity <group>, "sanity-check this group", "is this group right".
---

# roadwork-navsanity — the thorough check of a group

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the Destinations
bullet). Takes one group name. Runs on any group — born of a destination by
`/roadwork-nav-to-destination` or hand-made. "Sanity skill should be Thorough" (Operator,
2026-09-10): every file, never a sample; report what is clean as well as
what is wrong. Every re-write is a proposal until the Operator says so;
"should not delete items only amend or add".

## 0. Resolve the group

A batch (`ref && ref`) is refused here: one group at a time.

Find every member in the register by the `group` key. Find the source: the destination path the
members cite (`destinations/<destination-slug>.prd.md`), else "hand-made: the members' own claims plus the group's
line in `ordering.md`". Refuse a group with no members, naming it.

## 1. Ensure the sanity todo

If `todo/<group>-sanity` does not exist in the owning home, file it
through `/roadwork-ingest` (notes = the group list): the group list with kinds
and homes, the requirement → item and item → source mappings, the
checklist. A hand-made group's sanity todo blocks only members **not yet
in process** (`in-process` empty); a destination's group blocks every member
(that is `/roadwork-nav-to-destination`'s doing). Never create it before reading the
group.

## 2. Read everything — with sub-agents for breadth

Every member's item file, `intent.md`, `plan.md`, `spec.md`, `GATES.md`
if any; the PRD if any; the group's block in the register's
`ordering.md`; every `blocking` / `blocked-by`
among members and to items outside the group.

Thoroughness is breadth, and breadth is what sub-agents are for:
dispatch one sub-agent per sub-register — as one workflow where the harness runs workflows, one agent per sub-register, each reporting its facts in one shape (file, line, one sentence each; no cap — a reader lists what it finds), on the top model of the tier below the session's, or the session's own where no lower tier exists, at an effort the dispatching agent sets for the run; where the harness runs none, or the run is declined, sub-agents as before; the findings stay yours — to read its members and report
facts (files present, frontmatter values, citations, ordering lines), and
for a large group one per check type in step 3 to gather that check's
evidence — in parallel, each with a narrow brief and the file paths it
owns. Sub-agents find; they never judge, never write, never talk to the
Operator. Every finding in step 3 is yours, made from their reports and
your own reading; a report you did not read is not a check that ran.
Record in the run which checks were gathered by sub-agent.

## 3. The six check types

Each ends "clean" or a numbered finding with the file it points at
(evidence gathered by sub-agent where step 2 dispatched one; the finding
itself is yours):

1. **Completeness** — every requirement (the PRD's; or, hand-made, each
   member's own claims and the group's ordering line) maps to an item or
   is named "deliberately dropped: <why>".
2. **Provenance** — every item traces to its source: the PRD cited by
   path with requirement numbers, or a stated reason; the Operator's
   notes present verbatim.
3. **Shape** — kind (todo vs feature) and home right; frontmatter
   well-formed, all seven keys; the group name on every member; no item name
   collision within the register.
4. **Dependencies** — `blocking` and `blocked-by` agree on both sides;
   no cycle; every named
   blocker exists; the sanity todo blocks what it should.
5. **Order** — the block respects the dependencies; parallel items sit
   adjacent; within the block `main` items sit before `secondary` before `side`, dependencies permitting; the block is placed sensibly in the loose ordering — the destinations' blocks by `bucket-list-priority` descending, equal priorities by judgement, a block out of place reported, the order informed and never rewritten by the keys; every line's
   reason still holds.
6. **Scope** — no member duplicates another or an open item elsewhere;
   nothing too large to build as one or too small to stand alone.
7. **Cohorts** — for every cohort in the group (members sharing an
   `onroad-cohort`): the rubric re-applied, dependency above all — no
   edge between members in either direction, none through an open item
   outside; disjoint ownership; one cohortmeister per cohort, every member
   in its `blocking` and naming it in `blocked-by`; the CM's plan in the
   PLAN form; cohorts last in the block.

## 4. Ten checkup questions — one round

Put these to the Operator in the roadwork-intentify round form, closed as `/roadwork-intentify` §2 closes a round, each with the
relevant findings attached and a recommendation, closed after the questions with three blocks in this order: `go with recos` — every recommendation taken; `go with recos except:` — the questions that differ answered after the colon; `go with recos and group is right and /roadwork-verify-and-archive todo/<group>-sanity` — every recommendation taken, the group right, the sanity todo archived in the same turn; the pieces are the ten answers by number, typed, no block — then **wait**:

1. Does the group cover everything the source asks, or is something
   missing?
2. Is anything in the group not asked for by the source?
3. Are the deliberately dropped requirements right to drop?
4. Is each item the right kind, todo or feature?
5. Is each item's Paths line right, where it carries one?
6. Are the dependencies right — anything blocked that should not be, or
   free that should be blocked?
7. Is the order right — what must come first, what may run in parallel?
8. Is any item too big to build as one, or too small to stand alone?
9. Should any item belong to another group as well, and is the group's
   name right?
10. What does the source imply that the split missed — constraints,
    non-functional requirements, external dependencies?
11. Are the cohorts right — anything in a cohort that depends on
    something else, or two members that would write the same files?

## 5. Re-write — on the Operator's word, per change

Apply only what the Operator said yes to, one change at a time:

- **Amend** an item: its reading, "not decided" list, frontmatter, or
  cross-notes — never its verbatim notes.
- **Add** an item through `/roadwork-ingest`, in the group.
- **Re-point** `blocking` / `blocked-by` on both sides, `blocker`
  re-derived.
- **Re-order** the block ("can re-order"), each moved line's reason
  re-derived.

Every amended or added item gains a dated
`**Cross-items (<date>, written by /roadwork-navsanity run on <group>):**`
line naming the change. **Never delete** an item, withdraw one, strike an
ordering line, or touch `spark/`: a duplicate or a dead item is reported
and left to the Operator and `/roadwork-verify-and-archive`.

## 6. Record the run

In the sanity todo, a dated section `## Run <n> — <date>`: the six check
results (clean or findings), the ten answers verbatim, and every change
made as `- change: <ref> — <what>`. The sanity todo is the group's audit
trail; the skill may run again, each run its own section.

Commit in the register (its commits local).

## 7. Hand back

Reply with: the source; the six results in one line each; the changes
made; what remains open. End with the offer, one invocation in its own code block, preceded by its sentence (offer form), never invoked:
`group is right and /roadwork-verify-and-archive todo/<group>-sanity` — the word recorded in the run's section before the archive skill runs — or, once said, `/roadwork-verify-and-archive todo/<group>-sanity` alone;
otherwise the change awaiting their word or the next run; plus the
top-most unblocked item in `ordering.md` with its skill. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never delete, withdraw, or strike; never act without the Operator's
word; never build; never archive (that is `/roadwork-verify-and-archive`); never touch
`spark/`; never a second interview beyond the ten questions; never open
a PR.

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
- **Map** — one `maps/<destination-slug>.md`: the way to one destination, one map per destination — before agents, process, assets and tools, judgements, inputs — in a fixed form, made by `/roadwork-map`, drawing on guidebooks by copying their relevant parts in (a **Guidebooks:** line names them); named on an item by its **Map:** line, one per item, read by `/roadwork-intentify` and `/roadwork-specplan`; enforced by nothing; retired to `maps/archive/` by hand.
- **Guidebook** — one `guidebooks/<guidebook-slug>.md`: a standardized knowledge base broad in application — standards, preferred tooling, vendors, judgements, sources — in a fixed form, made by `/roadwork-guidebook`; names no destination; a map copies its relevant parts in and cites the whole only when the whole applies; never done; retired to `guidebooks/archive/` by hand.
- **Sanity todo** — the todo `/roadwork-nav-to-destination` creates last, `todo/<destination-slug>-sanity`: the group list and the requirement↔item mapping both ways; blocks every other item in the group until the Operator says the group is right.
- **Check types** — the six sanity checks `/roadwork-navsanity` runs over a group: completeness, provenance, shape, dependencies, order, scope.
- **Run** — one pass of `/roadwork-navsanity` over a group: six checks, ten questions, the changes made; recorded as a dated section in the group's sanity todo.
- **Hand-made group** — a group not born of a PRD; its requirements are its members' own claims plus the group's line in `ordering.md`.
- **Cohort** — a subgroup of a group's features that can be built in parallel by sub-agents: the rubric passes on every criterion; named in each member's `onroad-cohort`.
- **Cohortmeister (CM)** — `feature/cm-<group>-<cohort>`: the pseudo-feature that blocks a cohort's members, is onroaded in their place, and whose ledger is the results checker; archives them by cascade.
- **Rubric** — the five pass/fail criteria a subgroup must meet to be a cohort: no dependency edge, disjoint ownership, accepted spec and plan with gates, no external and not in process, self-contained builds.
- **Reconsideration** — `/roadwork-specplan`'s second mode: on an item whose accepted spec and plan already exist, re-read them against everything dated since; a dated `Reconsidered` changelog, proven gates carried, the previous go ended, the spec proposed again.
- **Verification round** — `/roadwork-specplan`'s fresh-eyes check: five predefined questions on the spec, five on the plan, one fresh reader each — run as one workflow where the harness runs workflows, on the top model of the tier one step below the session's (or the session's own where no lower tier exists) at an effort the dispatcher sets, findings in one bounded shape (file, line, one sentence, an empty disposition slot; at most eight; "clean" as none), sub-agents the fallback — findings incorporated or rejected with a reason and recorded in the document by the session agent; one round per document.
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never invocations; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, and its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names one, a destination's `<destination-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a lifecycle skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs. Where typing it makes or changes something, the sentence carries, in parentheses right after the thing acted on, what is to be accomplished — the change or the product itself, as what will exist or be said afterwards, a few words opening "to", specific to the item where the item is known, never a sentence, never the skill's definition, never the reason, the gate, the authority or the item — "runs the map skill on the-lifecycle (to rename its Tools section to Assets and tools)"; a directive phrase the same; a bare listing or a help call, which leaves nothing behind, carries none; the Gate id entry's parenthetical says what a thing is, this one what a run accomplishes (Operator, 2026-10-07).
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadmap system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

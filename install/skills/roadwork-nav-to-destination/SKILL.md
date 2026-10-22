---
name: roadwork-nav-to-destination
description: Navigates one destination into a group of items with a sanity todo last.
when_to_use: Use when the user says /roadwork-nav-to-destination <destination-slug>, "navigate to this destination", "break this destination into items".
argument-hint: <destination-slug>
---

# roadwork-nav-to-destination — a destination becomes a trustworthy group of items

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the Destinations
bullet). Input: only a destination slug — the destination is
`destinations/<destination-slug>.prd.md` in the register's
`destinations/`, made by
`/roadwork-destination`. Anything else — a path, a pasted document, no
argument — is refused in one line, with the offer of `/roadwork-destination
<slug>` (which saves a document as `destinations/<slug>.source.md` and
interviews it into a destination). Output: a
group of items, a block in `ordering.md`, and a sanity todo. "Always
creates a sanity todo … to allow operater to validate prd group"
(Operator, 2026-09-10).

## 1. Read the destination

A batch (`ref && ref`) is refused here: one destination at a time; a
non-slug argument refused as above.

**The intent above.** The destination is the level above every item this
skill files, and its intent, `destinations/<destination-slug>.intent.md`, is read
first — before the PRD, before anything is written — because the group is cut
from the PRD's requirements but judged against what the destination is for; the
sanity todo records the reading on its **Destination intent read:** line, and
every filed item says on its Destination line that the intent was read;
one level up is the minimum, not a limitation: the atlas's intent the destination's
names may be read as well. A destination without an intent file (made before
the destination skill wrote one): the sanity todo's line reads
`none — the destination has no intent file`, the reply says so in one line and
offers `/roadwork-destination <destination-slug>` (its update interviews the intent
first), and the navigation proceeds — the reading is enforced by nothing.
Then the PRD, `destinations/<destination-slug>.prd.md`, whole.

Read it whole. Its requirements are its numbered list (the fixed form
`/roadwork-destination` writes); where a destination made by hand lacks one,
number them yourself and say so. A
requirement is one thing the programme must deliver or must not do.

## 2. Decompose

One item per coherent deliverable: a new capability is a **feature**; a
fix, chore, decision to take, or finding to trace is a **todo** (the road plans test (the glossary's **Road plans** entry): done once, or reused when built). For each
item: title in the PRD's words, kind, the paths it is relevant to ("ord seeds
whatever it is relevant to" — its Paths line, where the PRD names them), the requirement numbers it
covers, and its dependencies on other items where the PRD's own ordering
words imply them. Where an existing open item already covers a
requirement, cite it instead of filing a duplicate. Where the paths are in
doubt, mark the item "paths: ask" — "can confirm with operator if any
doubt".

## 3. Read back — once

One message: the numbered requirements as you read them; the proposed
items (title, kind, home, requirement numbers, dependencies); the
proposed order; every "home: ask" as a question with your
recommendation; then the two questions — anything to add to the notes?
any comments on the reading? Wait once. Fold what comes back ("answers
not required"); a "no" or silence means proceed as proposed.

Close with three blocks in this order: `go with recos` — nothing to add,
proceed as proposed; `go with recos except:` — proceed except as listed
after the colon; `no, no` — the pair alone, the proposals answered by
hand.

## 4. File every item through `/roadwork-ingest`

For each item, in dependency order, follow `/roadwork-ingest` §1–§4 exactly (the
one item form; this skill adds nothing to it), with:

- notes = the destination's words for that item, verbatim, opened by the
  citation: `From <home>/destinations/<destination-slug>.prd.md,
  requirements <n, n>:` ("prd doc name with path included in every
  derived feature and todo");
- the line **Destination:** `<destination-slug>` (the destination's intent read) under the item's owner
  line — the item's one destination, the group's, its intent read at §1; no frontmatter key;
- the line **Map:** `<map-slug>` under it when the destination names one —
  inherited by every item of the group; no frontmatter key;
- the filer's reading and the numbered "not decided" list as `/roadwork-ingest` requires; an answer by number
  lands on the derived item's file as `/roadwork-ingest` records it — the same heading, the pairs,
  each answer a summary that loses no meaning, a question back carried in its
  pair (Operator, 2026-09-23);
- frontmatter: `group: [<destination-slug>-<YYYY-MM-DD>]` (today's date;
  one group per destination), `road-level` (`main`, `secondary` or `side` — the item's level within the destination, the session agent's reading of the requirement's weight, put in the read-back of §3 for the Operator's correction, changeable by hand after),`blocked-by` = the items it depends on **plus the
  sanity todo's reference** (filled in at step 6), `blocking` on the
  other side, `blocker` re-derived;
- The item file carries its `**Paths:**` line as `/roadwork-ingest` §3 gives it, when the source names paths.
- the item's folder under `<kind>/<destination-slug>/`; an existing item cited from `unnavigated/` — or from another destination's folder, on the Operator's word [proposed: a re-navigation's move, the same act] — is moved there in the same act, by `git mv`, history kept.

A navigation should generally exist immediately after a destination is established. Where unnavigated items exist — filed before the navigation existed — they should helpfully inform the navigation, to a degree: read them for the requirements they already answer, cite them, never file them twice (the Operator, 2026-09-18).

## 5. The block in `ordering.md`

In the register's `ordering.md`, one line for the sanity todo, carrying
the destination (`— destination: <destination-slug>`), with the group's
indented block beneath it — the items in execution order
(dependencies first, then `road-level` — `main` before `secondary` before `side` — then your judgment, parallel items adjacent; the block among the other destinations' by `bucket-list-priority` descending, informing the judgement that places it) — placed
whole where you judge the programme belongs. "Section in ordering.md to order group
execution."

## 6. The sanity todo — created last

`todo/<destination-slug>-sanity` in the destination's home, filed through `/roadwork-ingest` with
notes = the group list; its `todo.md` carries, after the notes:

- **Destination intent read:** `destinations/<destination-slug>.intent.md`, <date> — the
  reading of §1, recorded; or `none — the destination has no intent file`.
- **Group:** every reference with kind and home.
- **Requirement → item:** each numbered requirement and the item(s)
  covering it, or "deliberately dropped: <why>".
- **Item → requirements:** each item and its numbers.
- **Checklist** (for `/roadwork-navsanity` and the Operator): completeness —
  every requirement covered or dropped on purpose; no item without a source;
  kinds and homes right; dependencies consistent (both sides agree, no
  cycle, nothing points up); order workable; group name on every member.

Frontmatter: `group` the same; `road-level: main`; `blocking` = every other item in the
group; `blocker: yes`. Then write the sanity todo's reference into every
other item's `blocked-by`. It archives only on the Operator's word, through
`/roadwork-verify-and-archive`; "sanity check also for completness" — `/roadwork-navsanity` works
it. Nothing in the group starts before it is verified and archived.

## 7. Commit and hand back

Commit in the register (its commits local). Reply with: the destination's path; the group name; the group list
with kinds and homes; the requirement → item mapping's gaps, if any; the
block's place in `ordering.md`; the sanity todo's reference. End with the
offer, one invocation in its own code block, preceded by its sentence (offer form), never invoked: `/roadwork-navsanity <group>` (until that
skill exists: the Operator reads the sanity todo and archives it by
`/roadwork-verify-and-archive`), and the top-most unblocked item in `ordering.md` with its
skill as the next logical item now. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

The specs this skill writes follow `/roadwork-specplan` §0a — the
Operator's spec-writing guidelines — and get its verification rounds.

## Never

Never build; never interview beyond the one read-back (each item's
`/roadwork-intentify` is its own); never file an item outside `/roadwork-ingest`'s form;
never read a PRD from anywhere but `destinations/`; never make or amend a destination (that is `/roadwork-destination`); never create the sanity todo
first; never archive, move, or strike anything; never open a PR.

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
- **Guidebook** — one `guidebooks/<guidebook-slug>.md`: a standardized knowledge base broad in application — standards, stack, vendors, judgements, sources, an Architectures line saying which architectures its stack fits, or none — in a fixed form, made by `/roadwork-guidebook`; names no destination; a map copies its relevant parts in and cites the whole only when the whole applies; never done; retired to `guidebooks/archive/` by hand.
- **Stack** — what a destination is built on: environment, framework, tooling, assets and services; chosen per destination from the guidebooks, carried by the requirements file, the map, the spec and the plan.
- **Atlas** — one `atlases/<atlas-slug>/`: the highest-order thing in the register, above the destination — the Operator's `vision.md`, `intent.md` and `architecture.md`, verbatim, and the skill's `atlas.md`; made by `/roadwork-atlas` from three documents, never interviewed, its destinations suggested in `atlas.md` by the skill and each offered as a destination interview; named by a destination's `atlas` key, one per destination; retired to `atlases/archive/` by hand.
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
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

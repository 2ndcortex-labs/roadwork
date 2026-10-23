---
name: roadwork-map
description: Makes or updates the map to one destination, the way there, with the Operator.
when_to_use: Use when the user says /roadwork-map, "new map", "how do we get there", "here is how we used to do it", "update the map".
argument-hint: "[<destination-slug> <description> | <existing-slug>]"
---

# roadwork-map — a map, made with the Operator

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the
Maps bullet). A map is one file, `maps/<destination-slug>.md`, in the register's
`maps/`. It is the way to one destination, one map per destination: what
process, what stack, what judgements, what inputs — and, most helpfully,
how it was done before agents were in the picture. A destination says
what is wanted; a map says how it is reached. A map draws on the
register's guidebooks — standardized knowledge bases, `/roadwork-guidebook`'s —
by copying their relevant parts in, never by pointing at them alone.
`/roadwork-intentify` and `/roadwork-specplan` read the map an item names;
no skill enforces one. A retired map moves to `maps/archive/` by hand;
there is no archive skill.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one map at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<new-slug> <initial description>`**: the destination's own slug — an
  open `destinations/<destination-slug>.prd.md` — not yet in `maps/` or
  `maps/archive/` of any home (a slug is never reused), followed by the
  Operator's words — the interview of §3, the file of §4. A slug that is not an open destination's, or whose destination already has a map, is refused with the reason printed; `the-lifecycle` is the one map that keeps a name of its own, `dogfood-roadmap`'s. A destination
  already has a map when `maps/<destination-slug>.md` exists or its
  **Map:** line names one.
- **`<existing-slug>`**: a slug already in `maps/` — the update of §4.
- **`<new-slug>` with a document** — a pasted document in the message, or a
  path to one: the entrance of §5, then the interview shortened.
- **a document with no slug**, or a path alone: propose a slug in the
  Operator's words and ask once; on their word proceed as above.

## 2. The bare call — the maps

Read the register's `maps/` — `archive/` excluded — and print a count line
(`maps: <n>`) and then one line per map: its slug, its opening
words (the map's own), and the count of open items whose
**Map:** line names it. No navigation state: a map is never done. With no
map in any home — the empty case — print the counts and the offer to start
one, `/roadwork-map <new-slug> <description>`. A bare call writes nothing.

## 3. The interview — the intentify pattern

Read back the Operator's description as given (verbatim), then your
reading of it, marked as yours, and ask the two questions — anything to
add? any comments on the reading? Then the rounds of `/roadwork-intentify`
§2, closed as `/roadwork-intentify` §2 closes a round: the design tree, the frontier asked whole each round, every question
numbered with your recommendation, the facts found by you, never asked;
the decisions the Operator's. The root branches for a map:

- **The destination it reaches** — which destination this is the way to; in one paragraph.
- **Guidebooks** — which of the register's guidebooks apply, listed as the
  bare `/roadwork-guidebook` prints them; "none" always an answer; for each
  that applies, whether whole or in parts, and which parts serve which
  section.
- **Before agents** — how it was done by hand, by whom, with what record.
- **Process** — the steps in order.
- **Stack** — the destination's requirements file's Stack section read first (`destinations/<destination-slug>.prd.md`; a map that keeps a name of its own reads its destination's) and read back — the guidebooks drawn on and the changes to their stacks, or that the file names none, or carries no Stack section; a named guidebook that resolves to no file, or carries no Stack section, said and asked; then one round of two questions: which guidebooks beyond those the file names this map draws on for its stack, every open guidebook listed as the bare `/roadwork-guidebook` lists them, "none" an answer, one named on the Operator's word copied like the file's, after them, and named on the `Changes of this map:` line as added on the Operator's word; and the map's own extensions or modifications of the copied stacks, "none" an answer. Where no guidebook is drawn on for the stack — the file names none, or carries no Stack section, and the Operator adds none — the map's own stack is asked in their place: the assets the steps use, what the project holds by path, and the tools they call on from outside the tree, in the Operator's words. The guidebooks are never changed by the choice.
- **Judgements** — the calls a person makes along the way, and on what.
- **Inputs** — what the way starts from and consumes.
- **Crossings** — open items, destinations and other maps this one
  touches; read, never written into.

Stop when the frontier is empty; say so and ask the Operator to confirm. Offer `confirm and /roadwork-intentify <ref>` in its own block — the reference §6 would offer — and `confirm` in another, or `confirm` alone when §6 would offer none; on the pair, write the file as on `confirm` alone, then run the interview skill in the same turn.
Do not write the file until they confirm.

## 4. Write the map — the fixed form

On confirm, `maps/<map-slug>.md` in the owning home, in this form and no
other:

```
# Map: <title in the Operator's words>
_Map, made <date> by /roadwork-map; open until retired._

<the destination it reaches: one paragraph>

**Guidebooks:** `<slug>`, `<slug>` (whole)

## Before agents
<how it was done by hand>

## Process
1. <step>
2. …

## Stack
_From guidebook `<guidebook-slug>`, § Stack:_
<that guidebook's Stack section, verbatim>

Changes from the requirements file: <the text of the file's third Stack line after its label, verbatim> | none — the requirements file names no guidebook | none — the requirements file carries no Stack section
Changes of this map: <the map's own extensions or modifications; a guidebook added on the Operator's word named here> | none

## Judgements
<a paragraph or a list>

## Inputs
<a paragraph or a list>

## Changelog
- <date>: made.
```

(The copied Stack sections and the first Changes line are separated by one blank line; the two Changes lines are adjacent; where the map's own stack stands in the copies' place it is a paragraph or a list, then one blank line, then the two lines.)

The **Guidebooks:** line names every guidebook drawn on — "(whole)" after
one included by reference, which is done only when the entire guidebook
is relevant — and reads `none` when none. A part of a guidebook lands
inline in the section it serves — Process, Stack, Judgements or Inputs —
opening with the marker line ``_From guidebook `<guidebook-slug>`, § <section>:_``.
An excerpt is copied near-verbatim into the section it serves.

The Stack section's order is fixed: one copied Stack section per guidebook drawn on for the stack — the requirements file's first, in its order, then any the Operator added — each under its marker line, copied verbatim, the one section whose copy is exact; where no guidebook is drawn on for the stack, the map's own stack in its own words stands in the copied sections' place; then, after one blank line, the two Changes lines: `Changes from the requirements file:` carrying the text of the file's third Stack line (`Changes to the guidebooks' stacks:`) after its label, verbatim, or `none — the requirements file names no guidebook`, or `none — the requirements file carries no Stack section`; and `Changes of this map:` carrying the map's own extensions or modifications, a guidebook added on the Operator's word named there as added, or `none`. A guidebook copied here is named on the Guidebooks line as any excerpt's is.

**An update** (`<existing-slug>`): read the file back whole, ask what
changes and interview only that, then rewrite the file whole on confirm
and append one dated line under `## Changelog` saying what changed; the
Guidebooks line and the excerpts may be added or changed as any update.
The Stack branch is asked when the Operator names the stack among what changes, and whenever the requirements file's Guidebooks line names a guidebook of which the map's Stack section carries no excerpt — said at the read-back; "none" an answer each time.
The Process keeps its numbers; a dropped step is struck ("~~n.~~ dropped
<date>: <why>"), never renumbered, so that plans citing steps stay true.

## 5. A document arrives

When the Operator pastes a document or names a path — a procedure written
elsewhere, a runbook, a page of notes on how it used to be done — save it
first, verbatim, as `maps/<map-slug>.source.md` in the owning home (a
header line above it: `_Source of <map-slug>, received <date>; verbatim._`).
Then the interview of §3, shortened to what the source leaves open: read
back your reading of the source into the six parts and the guidebooks it
draws on, its stack mapped onto the Stack section's order — a named guidebook that resolves to no file said and asked, the Stack branch asked where the source names none — ask the two
questions, then only the rounds the gaps need. The map is written as §4;
its first changelog line names the source. The source file stays beside
it and moves with it to `archive/`.

## 6. Commit and hand back

Commit in the register (its commits local). Reply with: the map's path
(and the source's, if any); its title and the count of its Process steps;
the crossings found; then the map printed whole and verbatim, before the offers (reply-form rule). End with the offer, one invocation in its own code
block, preceded by its sentence (offer form), never invoked: the top-most
open item, not in process, whose file names a destination the map's
opening paragraph names —

```
/roadwork-intentify <ref>
```

— else no offer. Then the back offers as `/roadwork-ingest` §5b computes
them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never enforce a map (no skill checks one); never a second map for a
destination; never file, interview or spec an item (those are the
chain's); never write into an item, a destination, a guidebook or another
map; never renumber a step; never write a map the Operator did
not confirm; never archive or move a map; never a frontmatter key on any
item; never open a PR.

**Text for the Operator.** In text for the Operator, use the plain words of the terms table — `docs/terms.md` in the register, one row per term: the plain word, the agent's word, the meaning; the agent's words stay in the skill.

## Glossary

- **Roadwork** — the Roadwork system by 2nd Cortex Labs — road plans and the skills that work them.
- **Road plans** — the project's `roadwork/`: the one place its work is recorded. Three **sub-registers**: `todo/` (fixes, chores, decisions, findings), `feature/` (new capabilities), `spark/` (ideas; never worked); the test: a todo is done once, a feature is reused when built — the Operator may name the kind against it.
- **Item** — one folder under its destination's folder in a sub-register (`unnavigated/` until a navigation cites it): `todo.md` or `feature.md` (the **item file**) plus `intent.md`, `plan.md`, `spec.md`; a spark holds only `idea.md`.
- **Home** — the register an item lives in: the project's one register, at the path the project's law names; a clone of a remote, never pushed.
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
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

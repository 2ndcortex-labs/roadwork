---
name: roadwork-destination
description: Makes, updates or receives a destination — its intent and its product requirements document, the pair a group of items is navigated from.
when_to_use: Use when the user says /roadwork-destination, "new destination", "where are we going", "here is a PRD", "update the destination".
argument-hint: "[<new-slug> <description> | <existing-slug> | <path>]"
---

# roadwork-destination — a destination, made with the Operator

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the
Destinations bullet). A destination is two files beside each other in the
register's `destinations/`: `<destination-slug>.intent.md` — what is wanted
and why, in the Operator's words, in the item intent's form (the form
`/roadwork-intentify` §3 writes), interviewed and written first — and
`<destination-slug>.prd.md`, the product requirements document written from
it, in a fixed form; `/roadwork-nav-to-destination <destination-slug>` later
turns the pair into a group of items. This skill only makes, updates or
receives the two files. A built destination's two files move to
`destinations/archive/` by hand, together; there is no archive skill.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one destination at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<new-slug> <initial description>`**: a kebab-case slug not yet in
  `destinations/` or `destinations/archive/` of any home (a slug is never
  reused) and not an atlas slug, open or archived (`atlases/`,
  `atlases/archive/` — refused as taken), followed by the Operator's words — the interview of §3, the two files
  of §4.
- **`<existing-slug>`**: a slug already in `destinations/` — the update
  of §4, both files read back.
- **`<new-slug>` with a document** — a pasted document in the message, or
  a path to one: the entrance of §5, then the interview shortened.
- **a document with no slug**, or a path alone: propose a slug in the
  Operator's words and ask once; on their word proceed as above.

## 2. The bare call — the destinations

Read the register's `destinations/` — `archive/` excluded — and print a count
line (`open destinations: <n>`) and then one line per
destination: its slug, the opening of its first paragraph in the session
agent's words, and its navigation state — **navigated** when a group
`<destination-slug>-<date>` has a block in the register's `ordering.md`,
**not navigated** otherwise. For each destination not navigated, one
sentence, "Typing this turns `<destination-slug>` into a group of items
with its sanity todo:", and the invocation in its own fenced code block
(offer form):

```
/roadwork-nav-to-destination <slug>
```

With no destination in any home — the empty case — print the counts and
two offers: work on an existing destination (none, so omitted) or start a
new one, `/roadwork-destination <new-slug> <description>`. A bare call
writes nothing.

## 3. The interview — the intentify pattern

Read back the Operator's description as given (verbatim), then your
reading of it, marked as yours, and ask the two questions — anything to
add? any comments on the reading? Then the rounds of `/roadwork-intentify`
§2, closed as `/roadwork-intentify` §2 closes a round: the design tree, the frontier asked whole each round, every question
numbered with your recommendation, the facts found by you, never asked;
the decisions the Operator's.

**The intent first, and the atlas before it.** The **Atlas** branch is asked
first: where the destination serves an atlas, that atlas's intent document,
`atlases/<atlas-slug>/intent.md` (every atlas has one — the atlas skill saves
its three documents at creation), is read before the destination's intent is written —
it is the level above this destination, and the destination's intent names
it on its Atlas line. A destination serves the atlas's intent, so its own intent is written knowing it; one level up is the minimum, not a limitation. The atlas's `architecture.md` is read there too, after its intent, for the Stack branch below.
Then the intent's root branches, in the
order `/roadwork-intentify` §2 gives them — Problem, Proposed outcome,
Affected users and systems, Constraints, Open questions — and only then the
PRD's branches: the PRD is written from the intent, never the other way. One
interview, one frontier per round; one confirm writes both files. The root
branches for a destination, in that order:

- **Atlas** — which atlas does this destination serve, if any? The open
  atlases listed by slug with their description (as the bare
  `/roadwork-atlas` lists them); 'none' always an answer; no atlas yet, the
  question is not asked and the key is written empty; a slug that is no
  open atlas is refused and the question asked again. Asked at creation
  always, §5's entrance included; one atlas per destination — a
  destination serving two is two destinations. The answer is the `atlas`
  key of §4; no atlas is made here. Where an atlas is named, its `architecture.md` is read after its intent — the path, the read date and one line in the session agent's words naming what it describes are the Stack section's Architecture line; no atlas, or the file absent or empty, "none read" with the reason.
- **Problem** — what is wrong or missing, for whom, how often, at what
  cost; evidenced.
- **Proposed outcome** — the state of the world when the destination is
  reached, as anyone would observe it; what is explicitly out.
- **Affected users and systems** — who and what changes; who must be told.
- **Constraints** — the law that binds, the project's standards, what must
  not change.
- **Open questions** — what stays unknown after this interview, and who can
  settle it.
- **The destination** — the state of the world when it is reached, in one
  paragraph; for whom.
- **Requirements** — each one thing the programme must deliver or must
  not do, numbered; mandatory, preference, possibility or exclusion kept
  distinct.
- **Stack** — which guidebooks does this destination draw on, and what does it change in their stacks? One round, two questions. Every open guidebook listed as the bare `/roadwork-guidebook` lists them — slug, opening words, `architectures: …` — the ones whose Architectures line the session agent reads as fitting the architecture read marked `fits` and recommended, none marked where none was read; the Operator chooses any number, names any other guidebook on their word — an archived one by its slug, one not yet made by name, said as such — or answers "none". Then the destination's own extensions or modifications of the chosen stacks, in the Operator's words, or "none" — "none" by itself where no guidebook was chosen. The guidebooks are never changed by the choice; the intent never carries a stack.
- **Out** — what is not part of this destination.
- **Success** — how anyone sees the destination is reached.
- **Bucket-list priority** — one integer, 1 to 10, 10 the highest: where this destination sits among the others; the Operator's number, asked, never derived.
- **Crossings** — open items, sparks and other destinations
  this one touches; read, never written into.
- **Map** — is a map wanted for this destination? "no" always an answer.
  A yes makes no map here: §6 offers `/roadwork-map <destination-slug>`.

Stop when the frontier is empty; say so and ask the Operator to confirm. Offer `confirm and /roadwork-nav-to-destination <destination-slug>` in its own block and `confirm` in another; on the pair, write both files as on `confirm` alone, then run the navigation skill in the same turn.
Do not write either file until they confirm.

## 4. Write the destination — two files, the fixed forms

On confirm, two files in the owning home, the intent first.
`destinations/<destination-slug>.intent.md`, in this form and no other:

```
# Intent: <title in the Operator's words>
Author: the Operator, interviewed by the AIR (the seat). Status: accepted <date> (<the confirm as typed>).
Destination: <destination-slug> (`destinations/<destination-slug>.prd.md`). Interview: <date>. Atlas: <atlas-slug> — its intent (`atlases/<atlas-slug>/intent.md`) read <date> as the level above | none. Map: <map-slug> | none.

## Problem
<what is wrong or missing, for whom, evidenced — two to six lines>

## Proposed outcome
<the observable end state; what is explicitly out>

## Affected users and systems
<who and what changes; who must be told>

## Constraints
<the law that binds, stated as constraints on this destination; what must not change>

## Open questions
<what the interview left open, and who settles it — or "none">
```

Then `destinations/<destination-slug>.prd.md`, written from the intent, in
this form and no other (its frontmatter gains no key for the intent: the
pair is by slug, as the source file's is):

```
---
bucket-list-priority: <1–10, 10 the highest>
atlas: ""
---
# Destination: <title in the Operator's words>
_Destination, made <date> by /roadwork-destination; open until built._

<the destination: one paragraph>

**Map:** `<map-slug>` (optional — the map the destination's items follow; inherited by every item of the group)

## Stack
Architecture: <path>, read <date> — <one line> | none read — <reason>
Guidebooks drawn on: <slug>, <slug>, … | none
Changes to the guidebooks' stacks: <the extensions or modifications, stated> | none

## Requirements
1. <one thing the programme must deliver or must not do>
2. …

## Out
- <what this destination excludes>

## Success
<one paragraph, or bullets, of what is seen when it is reached>

## Changelog
- <date>: made, from <destination-slug>.intent.md.
```

The Stack section is written from the Stack branch; the frontmatter gains no key for it.

The `atlas` key holds the slug of the one open atlas the destination serves, or stays empty (`""`); it is written by this skill alone, from the **Atlas** answer of §3.

**An update** (`<existing-slug>`): read both files back whole, ask what
changes and interview only that — the intent revisited as well as the PRD; the **Atlas** question asked only when the key is empty, the **Map** question only when the file carries no Map line; the **Stack** branch asked when the Operator names the stack among what changes, when the update sets or changes the `atlas` key — the architecture read then as at creation — and when the file carries no Stack section, "none" an answer each time, the section written from its answers. A destination that has a PRD and no intent (one made before this form) is interviewed for its intent first — the intent's five branches, the atlas's intent read as above where the PRD's `atlas` key names one — and its intent written; the PRD is left as it is unless the Operator changes it. Then rewrite the changed file whole on confirm
and append one dated line under the PRD's `## Changelog` that names what changed in each file; the intent's status line gains `; updated <date>` when the intent changed. The
requirements keep their numbers; a dropped one is struck ("~~n.~~ dropped
<date>: <why>"), never renumbered, so that items citing numbers stay true.

## 5. A document arrives

When the Operator pastes a document or names a path — a PRD written
elsewhere, a brief, a page of notes — save it first, verbatim, as
`destinations/<destination-slug>.source.md` in the owning home (a header
line above it: `_Source of <destination-slug>, received <date>; verbatim._`).
Then the interview of §3, shortened to what the source leaves open: read
back your reading of the source into the four parts and, where the source names a stack, its Stack section — the architecture, the guidebooks, the changes, the source's prose mapped onto the three lines, a named guidebook that resolves to no file said and asked — the Stack branch asked where the source names none, ask the two
questions, then only the rounds the gaps need — the intent's branches among
them. The intent is written from the shortened interview, never copied from the source; the `.prd.md` is written as
§4, from the intent; its first changelog line names the intent and the source; the source file stays as it is
beside them and moves with them to `archive/`.

## 6. Commit and hand back

Commit in the register (its commits local). Reply with: the destination's
path (and the source's, if any); its title and the count of requirements; the guidebooks drawn on and whether the recommendation was taken;
the crossings found; then the destination printed whole and verbatim — the intent first, then the PRD — before the offers (reply-form rule). End with the offers, each one invocation in its own code
block, preceded by its sentence (offer form), never invoked. When the
interview answered yes to **Map**, this one first, never made here — Typing this makes the map of this destination with you:

```
/roadwork-map <destination-slug>
```

Then, always, the navigation offer:

```
/roadwork-nav-to-destination <destination-slug>
```

Then the back offers as `/roadwork-ingest` §5b computes them — up to
five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never decompose a destination into items (that is
`/roadwork-nav-to-destination`); never navigate; never build; never write a
destination the Operator did not confirm; never renumber a requirement;
never write into an item, a spark or another destination; never archive
or move a destination; never a frontmatter key on any item; never copy a source into the intent; never a sweep over existing destinations — each gains its intent on the Operator's invocation, one at a time; never open a
PR.

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
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

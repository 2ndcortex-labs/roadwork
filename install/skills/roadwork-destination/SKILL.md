---
name: roadwork-destination
description: Makes, updates or receives a destination — its intent and its product requirements document, the pair a group of items is navigated from.
when_to_use: Use when the user says /roadwork-destination, "new destination", "where are we going", "here is a PRD", "update the destination".
argument-hint: "[<new-slug> <description> | <existing-slug> | <path>]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

# roadwork-destination — a destination, made with the Operator

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary (the
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
five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never decompose a destination into items (that is
`/roadwork-nav-to-destination`); never navigate; never build; never write a
destination the Operator did not confirm; never renumber a requirement;
never write into an item, a spark or another destination; never archive
or move a destination; never a frontmatter key on any item; never copy a source into the intent; never a sweep over existing destinations — each gains its intent on the Operator's invocation, one at a time; never open a
PR.

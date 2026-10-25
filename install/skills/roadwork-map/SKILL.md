---
name: roadwork-map
description: Makes or updates the map to one destination, the way there, with the Operator.
when_to_use: Use when the user says /roadwork-map, "new map", "how do we get there", "here is how we used to do it", "update the map".
argument-hint: "[<destination-slug> <description> | <existing-slug>]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

The settings file, `config.json` at the register's root, must be read before this skill acts — the constitution's bullet "The settings file": one run of the config skill's script with no argument, `node <config skill>/scripts/config.mjs`, its lines held in the working context for the run — every key with its value, a secret as "set, <n> characters" or "empty", never its value. The file is read by the script and by nothing else, never opened or printed directly. A key this skill needs that reads "empty" takes the default the schema names for it; a key without a default is not asked for here — the config skill's empty-keys prompt asks it. Where a compaction has removed the lines, read them again before acting, as with the constitution.

Before any sub-agent is dispatched, every `subagent-<type>` value this run may use is checked against the dispatching host: the family must be one the host resolves — a vendor the host serves, a family still offered, spelled as the host knows it. A value the host does not resolve — another vendor's family on a host that serves one vendor, a family retired or renamed, a release number where a family name belongs, a misspelling — is reported to the Operator in one line naming the key, the value and what is wrong with it, with the config skill's line to set it right, and this skill stops before dispatching; it never substitutes a family of its own choosing, never falls back to the default over a set value, and never dispatches on the other keys while one is wrong. An empty key is not wrong: it takes its default. The check is the session agent's reading of the host's model list where the host exposes one, and otherwise the dispatch's own refusal, reported the same way and before any further dispatch.

## Sub-agents

- Six sub-agent types are defined in the constitution's bullet "Sub-agents and their models" — reader, finder, explore, research, builder, reviewer — and this skill may dispatch any of them; the three categories there describe the types, they do not limit which a skill uses. Where a step of this skill needs a type the constitution does not name, the step defines it in place — its purpose, what it is given, what it returns, what it may and may not do, and the `subagent-<type>` key it reads for its model family, a key the config skill's schema must carry before the type is dispatched — and the definition holds for this skill alone until the constitution adopts it.
- The type of each dispatch is the session agent's determination at the time of invocation, from what the task asks for — a document read against a question, a fact looked up, files found, outside sources compared, a deliverable built, a change checked — unless a step of this skill names the type itself, in which case that step's type is used.
- The model family of each type is the value of its `subagent-<type>` key in `config.json`, read under Prerequisites — a family name the dispatching host resolves, Anthropic's or another vendor's, the newest release of that family assumed at dispatch; a key read "empty" takes the default the config skill's schema names. This skill names no model family and no release itself.
- The effort of each dispatch is the session agent's judgement at the time of invocation, set from the task's difficulty — the depth of reading or building the brief asks for, how much a miss would cost — and set explicitly on every dispatch; no fixed level is prescribed here.
- A sub-agent's return is evidence, not a decision: the session agent reads every finding and claim, accepts or rejects each one by its own judgement, records the disposition and the reason, and reverifies a builder's claim of done by the gates before relying on it. A finding is never incorporated because a sub-agent produced it, nor dropped without the reason said.
- The session agent is the only dispatcher; a sub-agent never dispatches another, never speaks to the Operator, and never approves an oracle.

# roadwork-map — a map, made with the Operator

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary (the
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
them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never enforce a map (no skill checks one); never a second map for a
destination; never file, interview or spec an item (those are the
chain's); never write into an item, a destination, a guidebook or another
map; never renumber a step; never write a map the Operator did
not confirm; never archive or move a map; never a frontmatter key on any
item; never open a PR.

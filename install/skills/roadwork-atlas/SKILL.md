---
name: roadwork-atlas
description: Makes one atlas from the Operator's vision, intent and architecture, the highest-order thing above a destination.
when_to_use: Use when the user says /roadwork-atlas, "new atlas", "here are the vision, the intent and the architecture".
argument-hint: "[<atlas-slug> <vision> <intent> <architecture>]"
---

# roadwork-atlas — an atlas, ingested from the Operator's three documents

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the Atlases bullet). An atlas is one folder, `atlases/<atlas-slug>/`, in the register's `atlases/`: the highest-order thing in the register, above the destination — what several destinations serve. It holds the Operator's three documents — `vision.md`, `intent.md`, `architecture.md` — verbatim, and one file this skill writes, `atlas.md`. A destination names the atlas it serves by its frontmatter key `atlas`, one atlas per destination, asked by `/roadwork-destination`; this skill never writes a destination. Ingest only: no interview and no update — a changed document is replaced by hand; a retired atlas moves whole to `atlases/archive/` by hand; there is no archive skill. The pages do not yet group destinations by atlas; that is a later item's. It suggests the atlas's destinations in `atlas.md` (§3b, §4b) and offers each as a destination interview; it never makes one.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one atlas at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<atlas-slug>` with three named parts**: a kebab-case slug of the Operator's, then the three parts, each named for what it is. On the invocation line: `vision: <path or URL>`, `intent: <path or URL>`, `architecture: <path or URL>`, in any order. Pasted in the message: each part introduced by a line at column zero reading `## vision`, `## intent` or `## architecture`, running to the next such line or the message's end, saved without that introducing line. Path, URL and paste mix freely across the three parts; one way per part. The ingest of §3.
- **`<atlas-slug>` alone**: the slug of an open atlas — the derivation of §3b and the section of §4b written into its `atlas.md`, nothing else touched; a slug of no open atlas refused with one line.
- **anything else** — a part without its name, a second slug, a part named twice: refused with one line saying what this skill takes; nothing written.

## 2. The bare call — the atlases

Read the register's `atlases/` — `archive/` excluded — and print a count line (`open atlases: <n>`) and then one line per atlas: its slug, its description as its `atlas.md` carries it, and the open destinations (`destinations/`, `archive/` excluded) whose `atlas` key names it, read at the call — "no destination" when none names it. With no atlas — the empty case — the count line alone. A bare call writes nothing.

## 3. Ingest — all three held before anything is written

Read every part before writing anything: a path by the harness's file read, its bytes as given; a URL by the harness's fetch tool, asked for the page's text whole and verbatim, nothing summarised — what it returns is the text as fetched; a pasted part from the message, its lines as given. Hold all three, then test the slug: kebab-case, and in none of `atlases/`, `atlases/archive/`, `destinations/`, `destinations/archive/` (a slug is never reused, and a destination's slug is never an atlas's).

**The intent it serves.** Nothing sits above an atlas, so the intent read before anything is written is the atlas's own `intent.md`: the part given as `atlases/<atlas-slug>/intent.md` is read as the intent it serves — this atlas's own — as given, before `atlas.md` is written, and `atlas.md`'s status line records the reading. The Operator's word — whatever the invocation carries beyond the slug and the three parts — is read as intent where it adds to the document and recorded verbatim in that status line, `none` where no word was given; it is never replacing or editing `intent.md`, which is saved as given, and where the word contradicts the document the reply says so and the document stands. The three parts are still all held before anything is written; one level up is the minimum, not a limitation, and an atlas, having no level above, reads its own intent and stops — the destinations under it read that intent as the level above them.

The skill refuses the whole call — one line naming the cause, nothing written: no folder, no file, no commit — when:
- a part is missing, or a part is given twice (on the line and pasted, or twice either way);
- a path does not exist, or is not a text file;
- a URL does not answer, answers with an error, or returns an empty body or a body with no text;
- the slug is taken — an atlas or a destination, open or archived — or is not kebab-case.

Then derive the description: at most two sentences, in the session agent's words, from `vision.md` alone — what the atlas gathers and what the world looks like when it is reached. The title is the text of the first line of `vision.md` that opens `# `, else the slug. The description is printed in the reply, marked derived (§5), never passed off as the Operator's; the Operator may rewrite it in `atlas.md` by hand.

## 3b. Derive the suggested destinations

Derived after `atlas.md` is written (a creation) or read (a slug call); nothing is interviewed, and the Operator rewrites the section by hand or at a destination's interview. First the taken: every destination, open or archived, whose `atlas` key names this atlas, each with the architecture's `## ` headings the session agent reads its requirements file as covering. Then the suggestions: the remaining headings grouped into broad categories of the vision's work, each a destination one could pursue start to finish — never an item, never a section split between two; for each, a kebab-case slug (`^[a-z0-9]+(-[a-z0-9]+)*$`) in the documents' words that is no open, archived or taken destination's; one paragraph opening `serves the atlas `<atlas-slug>``, written from the vision's and the architecture's words; the headings it covers; what it needs from no other suggestion. Then the independence test, pairwise: for each suggestion, which others it would wait on; any is a failed set — the shared prerequisite becomes its own suggestion, or is named as out of band in the `stands alone:` line, and the set is re-derived until every `waits on:` reads none. Then the covering test: every heading of `architecture.md` cited exactly once across the taken and the suggestions; a heading no suggestion and no taken destination cites, or two suggestions cite, is a failed set, re-derived; a heading two taken destinations cite is listed under both and named in the covering line, nothing re-derived for it; the taken covering every heading leaves no suggestion, and the section says so in its one bullet's place. No count is fixed.

## 4. Write the atlas — the fixed form

The folder `atlases/<atlas-slug>/` with the three documents — `vision.md`, `intent.md`, `architecture.md` — each saved as given (a path's or a pasted part's bytes unchanged) or as fetched (a URL's text as the fetch tool returned it), and `atlas.md` in this form and no other:

```
# Atlas: <title>
_Atlas, made <date> by /roadwork-atlas; its intent.md read as the intent it serves; the Operator's word: "<verbatim>" | none; open until retired._

**vision.md:** <the path as given | pasted | <URL>, fetched <date>, as the fetch tool rendered it>
**intent.md:** <the same, for its own source>
**architecture.md:** <the same, for its own source>

_Description derived from vision.md by /roadwork-atlas, <date>; the Operator may rewrite it._
<the description: at most two sentences>
```

One atlas per call; the three documents and `atlas.md` and nothing else in the folder.

## 4b. The suggested destinations section

Written into `atlas.md` after the description, whole, and replaced whole on a re-derivation — the section runs from its heading to the file's end, so the file carries it once:

```
## Suggested destinations
_Derived by /roadwork-atlas, <date>; proposals, not destinations — the Operator may rewrite or strike any; a destination is made only by /roadwork-destination._
covering: every section of the architecture assigned once[; covered twice by taken destinations: <heading>]
taken: `<destination-slug>`[ (archived)] — covers: <heading>, <heading>
- `<slug>`
  <the paragraph, opening `serves the atlas `<atlas-slug>``>
  covers: <heading>, <heading>
  stands alone: <what it needs from no other suggestion>
  waits on: none
```

(The `taken:` lines zero or more, before the bullets; the bullets one or more, or the one line `- no suggestion: the taken destinations cover every section` in their place; the headings' text as in `architecture.md`; the section is written whole and replaced whole, so `atlas.md` carries it once; the folder keeps its four files, no file per suggestion.)

## 5. Commit and hand back

One commit in the register (its commits local) for the atlas. Reply with: the folder's path; the three sources, one line each; the description, marked derived; then `atlas.md` printed whole and verbatim, before the offers (reply-form rule).

The section of §4b is printed whole and verbatim after `atlas.md`'s body — a slug call prints the section alone, the atlas file otherwise unchanged. Then, before the listing offer, one offer per suggestion in printing order: **O<n>** — typing this starts the destination interview from the suggestion (to make the destination `<slug>` under the atlas `<atlas-slug>`): and the block `/roadwork-destination <slug> <the paragraph>` on one line; a `no suggestion` section offers none.

Then the listing offer, **O<n+1>** — "Typing this lists the destinations; updating one by its slug asks which atlas it serves:"

```
/roadwork-destination
```

Then the back offers as `/roadwork-ingest` §5b computes them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never interview (the three documents are the Operator's, taken as given); never update an atlas (a changed document is replaced by hand); never archive or move an atlas (retirement to `atlases/archive/` is by hand); never write a destination or its `atlas` key (that is `/roadwork-destination`'s); never a second atlas in one call; never write anything on a refusal; never open a PR.

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
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

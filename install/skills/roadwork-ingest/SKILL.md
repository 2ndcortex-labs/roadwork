---
name: roadwork-ingest
description: The item-ingest SOP — the one way an item enters road plans. Takes the Operator's notes, decides the kind (todo or feature) by the road plans test (the glossary's **Road plans** entry) unless the notes name it, refuses a duplicate, files the folder with the notes verbatim, the filer's reading, the pre-considered first round, placeholders and frontmatter, and places the item in ordering.md. Use when the user says /roadwork-ingest, "file a todo", "file a feature", "new feature:", "new todo:", "add to the roadwork", or hands over notes for something to be done later. Never archives an item.
---

# roadwork-ingest — ingest an item

Road plans are `roadwork/` with `todo/`, `feature/`, `spark/` (Roadwork conventions: this skill's glossary; in a workspace, its rules file as well). This skill files a **todo** or a
**feature** from the Operator's notes. Sparks are `/roadwork-spark`'s;
interviews are `/roadwork-intentify`'s; archiving is `/roadwork-verify-and-archive`'s. This skill ends
when the item exists, is placed, and its first round is prepared.

## 1. Kind

A batch (`ref && ref`) is refused here: one filing at a time — each item is its own folder and its own prepared round — except a **spark batch**: `spark/<a> && spark/<b> && …`, all in one home, which §4b converts into one item (Operator, 2026-09-15). Many todos from one source file through this form by `/roadwork-tasksplit`.

Kind: decided by the session agent by the road plans test (the glossary's **Road plans** entry) — a todo is done once and is
then over (a fix, chore, decision to take, finding to trace); a feature is
built once and reused when built (a new capability) — and said in the reply
with its reason in one clause ("done once" or "reused when built"). The
notes may name the kind in plain words, any wording, no syntax; then that
kind is filed, and when the test would have read it otherwise the reply
says so in one clause. The kind is fixed at filing (Operator, 2026-09-15).

## 2. Refuse a duplicate

Read the register's open items — item files and `ordering.md`. Judge,
never string-match: if an open item already carries this ask, do not file;
reply with its reference and offer to add the new notes to it as a dated
addendum (verbatim). A archived item with the same item name means the item name is
taken — choose another; item names are never reused. Read the open sparks
too: name in the reply any the new item would absorb, as a proposal for the
Operator — a fold is their word, never yours.

## 3. File the folder

`roadwork/todo/unnavigated/<item-name>/` or `roadwork/feature/unnavigated/<item-name>/` — under the destination's own folder instead when a navigation files it — with a kebab-case item name
in the Operator's words — never a skill name (Roadwork conventions) — four files:

- The item file (`todo.md` or `feature.md`), in this order:
  1. Frontmatter — all seven keys, empty unless the notes or the existing
     items already establish a dependency or group (`in-process` is
     always empty at ingest; only `/roadwork-make` writes it; `disposition` too —
     only `/roadwork-verify-and-archive` writes it):
     ```
     ---
     blocker: no
     blocking: []
     blocked-by: []
     external: ""
     group: []
     in-process: ""
     disposition: ""
     onroad-cohort: ""    # feature.md only — omit on todo.md
     road-level: ""       # main | secondary | side — set by /roadwork-nav-to-destination, empty until then
     ---
     ```
     `blocker` is `yes` iff `blocking` is non-empty. References use the
     rule's forms. A `blocked-by` you write here is also written into the
     other item's `blocking` (and its `blocker` re-derived) — both sides,
     same act.
  2. `# <Title>` in the Operator's words.
  3. A status line: dated, "open — filed by Operator directive …; initial
     notes only, not yet interviewed".
  4. `**Owner:** …` and, where known, what the item depends on in prose.
  5. `**Paths:** <path>, <path>` — the paths the work touches, relative to the project's root, comma-separated; written when the source names them (the notes, a document, a destination), omitted otherwise; never a frontmatter key. An item touching the register names the register's path as the project's law names it, deeper where narrower.
  6. `**Operator's initial notes (<date>, verbatim):** "…"` — the notes
     exactly as given, quotation marks and all. Later notes: `**Operator's
     addendum (<date>, verbatim):**`, appended, never merged.
  7. `**The session agent's reading of the notes (the filer's; pending the
     Operator's correction).**` — what you take the notes to mean, in
     bullets, each claim traceable to a phrase in the notes or to a fact
     you looked up (cite it). Never pass a reading off as the notes.
  8. `**Not decided by this filing:**` — a numbered list (`1.`, `2.`, …):
     the open questions the notes leave, one per number, each with your
     own reading of the likely answer on the same line. This list is
     the interview's prepared first round; it is asked only after
     `/roadwork-intentify`'s read-back, never instead of it. The Operator may
     answer by number ("1 yes, 2 (b), 3 no"); the answer is recorded under
     `**Operator's addendum (<date>), answering the not-decided list by number:**`
     as pairs — one line `The pairs (the recorder's summary):`, then for each
     number the question's text copied from the list in italics, a dash, and
     the Operator's answer for it as a summary that loses no meaning;
     the whole is not also quoted — the one record written as a summary rather than verbatim
     (Operator, 2026-09-23). An answer that is a question back is carried in
     its pair by dated clauses — the question back, the fact found, the later
     decision — until the number is decided; a closing alone records each
     recommendation's text as the answer taken.
- `intent.md`: `_Not yet interviewed — placeholder by the Roadwork conventions;
  `/roadwork-intentify` writes this file._`
- `plan.md`: `Not yet scoped.` plus what it is gated on, if anything.
- `spec.md`: the standard "not yet specified" placeholder.

## 4. Place it

Add one line to the register's `ordering.md` — `- <kind>/<item-name> — <one clause
on why it sits here>` — at the position your judgment gives it (top is
next). If the item belongs to a group, put the line inside that group's
indented block, creating the block if the group is new (`<name>-<date>`).
An item with a non-empty `blocked-by` or `external` sits below what
blocks it.

## 4b. From a spark

When the notes are a spark — the reference is `spark/<item-name>` — the
spark's `idea.md` is the notes: the new item's notes open
"from spark/<item-name>" and quote `idea.md` verbatim; file and place the item as
above; then append "converted to <ref> (<date>)"
to the spark's `idea.md` and move the spark's folder whole into
`spark/archive/`. A conversion happens only on the Operator's invocation. This is the only move a spark ever makes and the only
archiving this skill performs; `/roadwork-verify-and-archive` never touches `spark/`.

**A spark batch** — `spark/<a> && spark/<b> && …`, two or more sparks, all
in one home (a batch that mixes homes or names anything but sparks is
refused as §1 says) — converts into **one item**, listed by the bare
`/roadwork-spark` or not: any spark batch within one home is accepted,
listed or not. Kind: as the list's group line proposed; for an unlisted
batch, §1's rule. Item name: named as the list proposed; for an unlisted batch,
an item name in the Operator's words taken from the members' titles, the
session agent's choice said in the reply. The notes open "from spark/<a>, spark/<b>
…" and quote every member's `idea.md` verbatim in invocation order, each
under its own line `**From spark/<item-name> (filed <date>), its idea.md
verbatim:**`. One not-decided list follows, numbered through. Every member is appended "converted to <ref> (<date>)" and
moved whole into `spark/archive/` in the same act as the filing. When
converting one spark or a batch, the session agent may propose further open sparks
the invocation did not name as fold candidates, by its judgement, in the
reply — and never fold one unasked (Operator, 2026-09-15).

## 5. Commit and hand back

Commit in the register (its commits local) with a message naming the item
and the Operator's directive. Reply with: the reference, the kind and its
reason, the frontmatter you set and what you set on other items,
where the line landed in `ordering.md`, and the "not decided" list, numbered as filed. End
by offering the next step as one invocation in its own code block, preceded by its sentence (offer form) — `/roadwork-intentify <ref>`, which opens
with the read-back — as an offer, never by invoking it (every skill in
the chain ends this way: Roadwork conventions). Then the back offers
of §5b, on their own lines after the next-step offer. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## 5b. Back offers

An ingest usually interrupts a lifecycle step in flight. So after the
next-step offer, offer the way back: the open lifecycle steps of the
road plans, **read at that moment, never from memory**. Read, in
the register, the
`working.md` and, for each open item (empty `disposition`), its four
files and its `GATES.md` if one exists; classify each item into one of
five states — the names are verbatim in the printed line:

- **"interview open"** — `intent.md` is a placeholder and the item file
  carries a Read-back or Round section but no "Interview closed" line →
  `/roadwork-intentify <ref>`.
- **"intent accepted"** — `intent.md` accepted, `spec.md` a placeholder
  → `/roadwork-specplan <ref>`.
- **"awaiting the go"** — `spec.md` accepted, no "go given" line,
  `in-process` empty → `/roadwork-make <ref>`.
- **"built, to be verified and archived"** — `in-process` set and every gate in
  `GATES.md` checked → `/roadwork-verify-and-archive <ref>`.
- **"archive interview open"** — the item file carries an "Archive interview"
  section and `disposition` is empty → `/roadwork-verify-and-archive <ref>`.
- **"round open"** — a spark whose `idea.md` carries no `**Round (` heading
  → `/roadwork-spark spark/<item-name>` (the answer is folded in; no new
  round). Sparks are read for this state only.

An item in none of these states (no interview begun; on the road with
gates unmet) is not in flight and is not offered. Exclude the instant item
(the one just filed) and the item the primary offer names. Sort by the
most recent dated entry in the item's files (latest first); tie by
`ordering.md` position (higher first). Print **up to five**, most recent
first, no heading and no label: for each, one plain sentence — the item,
what is waiting on it (the state, in plain words), what typing the block
does — then its fenced code block (three backticks, no language tag),
`/<skill> <ref>`, using the reference forms of the rule. Related offers combine
into one invocation with ` && ` — one sentence for the combined invocation,
every item named: related means the same skill, the same state, the same landing
(for verify-and-archive, tracked changes that landed in the same batch; for
roadwork-make, changes that will ride the same batch), by the session agent's judgement; the
offers of skills that refuse a batch never combine. When no item qualifies, print nothing — no heading,
no "none". Offers only; never invoke.

## Never

Never paraphrase the notes; never file into a home the notes do not
support; never file a duplicate; never write `intent.md`, `spec.md`, or
`plan.md` content; never archive, move, or strike an item; never open a PR.

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
- **Notes verbatim** — the Operator's words exactly, quoted under a dated heading; never paraphrased. **The filer's reading** — the session agent's interpretation, marked as such. **"Not decided by this filing"** — a numbered list, the prepared first round of the interview.
- **Duplicate** — an open item in any home that already carries the ask; judged, never string-matched.
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

---
name: roadwork-spark
description: Files a spark — an idea memorialized for later, never worked — into the road plans' spark/ sub-register as a single idea.md (the Operator's notes verbatim, the filer's reading, a Related line), then asks at most one round of mini-intentify and stops; with no argument, lists the open sparks grouped for conversion. Use when the user says /roadwork-spark, "spark:", "idea:", "note this idea", "park this for later". No frontmatter, no place in ordering.md, nothing blocks on it; its one exit is conversion through /roadwork-ingest.
---

# roadwork-spark — memorialize an idea

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. A spark is an
idea, not work: `roadwork/spark/<item-name>/idea.md` and nothing else —
"minimalistic, no frontmatter, designed to be a quick way to document
ideas for later consideration" (Operator, 2026-09-10). "Nothing beyond
idea/intent will ever happen for sparks." This skill files one spark and
asks at most one round.

## 0. The bare call — the open sparks, grouped for conversion

`/roadwork-spark` with no argument files nothing: it lists. Read the
register's `spark/` — open folders only, `archive/` excluded — and print
a count line (`open sparks: <n>`) and then the **groups**:
each group a set of open sparks the session agent judges could convert into one todo
or one feature. Sparks belong together when they would change the same
skill section, the same folder or file, or the same decision, or when their
Related lines or rounds already name each other as converting together.
A spark that belongs with none is a group of one. Order the groups by the
session agent's judgement of readiness — every member's round answered, the work it
would become neither in process nor blocked by an open item, the most
other items or sparks it would unblock or absorb — and give each group one
line of reason.

Print each group as: a line with the kind (todo or feature, by the road plans test (the glossary's **Road plans** entry)), a proposed
item name in the Operator's words, and the reason; then one bullet per
spark — its reference and a short description in the session agent's words, never
the notes re-quoted; then one sentence, "Typing this converts these <n>
sparks into one <kind> named `<item-name>`:" — "this spark" when the
group is one — and the batched ingest
invocation in its own fenced code block (reply-form rule), the members
joined with ` && `:

```
/roadwork-ingest spark/<a> && spark/<b>
```

A bare call writes nothing — no file, no group key, no line in any spark
or item; the grouping is computed at the call and may differ next time.
With no open spark in any home — the empty case — print the counts and
nothing else. The
list is a suggestion: `/roadwork-ingest` accepts any spark batch within one
home, listed or not (Operator, 2026-09-15).

## 1. Item name

A batch (`ref && ref`) is refused here: one spark at a time — one round. A bare call lists instead (§0).

Item name in the Operator's words, kebab-case, never reused (a archived spark's
item name is taken). Judge, never string-match, whether an open spark or item
already carries the idea: if a spark does, append the new notes to its
`idea.md` as a dated addendum, verbatim, and stop; if an item does, say
so and file nothing.

## 2. Related — once, at creation

Read the register once — `todo/`, `feature/`, `spark/` and `ordering.md` — for what the
idea touches: overlap, the same theme, a thing it would change. The
result is one `Related:` line of references in `idea.md`. Nothing is
written into any other item or spark, now or later: "cross-item
consideration ingest only at idea.md creation".

## 3. Write `idea.md`

In this order, nothing else:

```
# <Title in the Operator's words>

_Spark, filed <date>; open until converted._

**Operator's notes (<date>, verbatim):** "…"

**The session agent's reading (the filer's):** …

**Related:** <refs, or "none found">
```

Commit `idea.md` — as filed, nothing else — in the register
before the round of §4 is presented, always. The round's answer lands in a second commit.

## 4. At most one round

Two messages. The first: the read-back's two questions — anything to add
to the notes? any comments on the reading? — closed with `no, no` in its
own block. The second, after the answer: the prepared questions the
notes allow, each with a recommendation, in the roadwork-intentify round
form, closed with three blocks in this order: `go with recos`; `go with
recos except:`; `go with recos and /roadwork-ingest spark/<item-name>` —
for an idea that is work already.

Wait after each. Whatever comes back — all, some, or the closings alone — fold it
into `idea.md` under `**Round (<date>):**` as pairs — one line `The pairs
(the recorder's summary):`, then each question's text in italics with its
number, a dash, and the Operator's answer for it as a summary that loses no
meaning; a closing alone records each recommendation's text as the answer taken; a question back is carried
in its pair by dated clauses until decided — the one record written as a
summary rather than verbatim (Operator, 2026-09-23) — in a second commit,
and stop. An answer that arrives later, after other
work, is folded in the same way, under `**Round (<date>):**` — the record
is the Operator's, late or not. Until an answer comes the spark stands on
the notes and the reading. No second round, ever.

## 5. Hand back

Reply with the reference, the Related line, and whether a
round was answered. End with the offer, one invocation in its own code block, preceded by its sentence (offer form), never invoked: `/roadwork-ingest
spark/<item-name>` for when the idea becomes work, and the top-most unblocked
item in `ordering.md` with the skill it is ready for as the next logical
item now. End with the back offers as `/roadwork-ingest` §5b computes them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never frontmatter; never a line in `ordering.md` or `working.md`; never a
cross-note into another item; never a second round; never any work on a
spark; never archive or move a spark (conversion is `/roadwork-ingest`'s, on the
Operator's word); never `intent.md`, `plan.md`, or `spec.md`; never
write anything on a bare call.

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
- **Spark** — an idea memorialized in `roadwork/spark/<item-name>/idea.md`; never worked; nothing blocks on it; no place in `ordering.md`.
- **Conversion** — the only move a spark makes: `/roadwork-ingest spark/<item-name>` — or a spark batch, `spark/<a> && spark/<b>`, converting into one item — files the todo or feature it became ("from spark/<item-name>"), appends "converted to <ref>" and moves each spark whole into `spark/archive/`, on the Operator's word.
- **Related** — the one line of references written at creation; the only cross-item consideration a spark ever receives or gives.
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

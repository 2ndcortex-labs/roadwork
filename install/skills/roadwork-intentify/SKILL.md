---
name: roadwork-intentify
description: Interviews the Operator on one item until nothing is assumed and writes its intent in their words.
when_to_use: Use when an item in todo/ or roadwork/ has no intent.md, has a placeholder one, or the user says /roadwork-intentify, "write the intent", "what do we actually want here".
argument-hint: <ref>
---

# roadwork-intentify — from a road plans item to its intent

A road plans item is a folder holding four files: the item (`todo.md` or
`feature.md`), `intent.md`, `plan.md`, `spec.md` (Roadwork conventions: this skill's glossary; in a workspace, its rules file as well). This skill produces **`intent.md`**: the
originator's proto-spec in the originator's own terms — what is wanted,
why, and under which constraints. The intent is the user's; the facts are
yours to find. Do not write `plan.md` or `spec.md` here; those are how
and what-exactly, not what-is-wanted.

## 1. Locate and read

A batch (`ref && ref`) is refused here: one tree at a time — the Operator can hold one tree in their head, not five.

Resolve the item from the argument (an item name, a folder path, or a path to
the item file); with no argument, the item whose file is open or was last
touched in this session; if still ambiguous, list the candidates in the
nearest `roadwork/todo/` and `roadwork/feature/` and ask which one — that is the only
question you may ask before reading.

Read the whole folder: the item file (its frontmatter first — `blocked-by`,
`blocking`, `external`, `group` — then the notes, the filer's reading and
its "not decided" list, which is the prepared first round), any existing
`intent.md` (a placeholder or a thin one is the normal case), any `plan.md`
and `spec.md`. Read what the item cites: files, commits, channel ids, other
items.

**Road plans awareness.** Read the register's `ordering.md` and `working.md`,
then the register's other open items
(`todo/`, `feature/`, and `spark/` for reading only). Note every item
that crosses the instant one: overlapping scope, a shared group, a
dependency either way, the same home decision. Crossings become questions
in the rounds (section 2) and cross-notes at writing (section 3).

## 1b. Read back before the first round

**The insights first.** Where the register's `docs/intent-insights.md` exists, read it before anything is read back: the filer's reading this skill writes or revises, and every recommended answer of every round, start from the insights — shaped by every insight that bears on them — and each recommendation an insight shaped is marked `(from insight <date>-<n>)` after it. An insight shapes a recommendation, never an answer: every question is still asked, a question the insights answer in kind carrying the insight's answer as its recommendation, never skipped.

**The map first.** When the item file carries a **Map:** line, read that map
(`maps/<map-slug>.md` in the register) before the read-back; the rounds of §2
then follow the map's Process and Judgements. When it carries none, say so
in one line and proceed as below. The read-back gains a third question,
"which map, if any?" — the Operator's answer becomes the item's Map line.

An item filed from the Operator's notes carries those notes verbatim and
the filer's interpretation of them (Roadwork conventions). Before any design
question, read both back to the user: the notes exactly as recorded, then
the interpretation as it stands. If the item file has no interpretation,
write one now from the notes and read that back, marked as yours. Then
ask these questions and wait:

```
❓ **Q1** - **Anything to add to the notes?**

❓ **Q2** - **Any comments on the interpretation?**

❓ **Q4** - **Consistent with what?**
```

Q4 is asked of every item: what the item's product describes — a folder
by path from the project's root or a system by name — or `none`, the
session agent's recommendation given.

Close the read-back with three blocks, one sentence each, always in this
order: `no, no and go with recos` — nothing to add, the reading stands,
the map's and the referent's recommendations taken;
`no, no and go with recos except:` — the same, the map and the referent answered after the colon;
`no, no` — the notes and the interpretation alone, the map and the referent answered by hand. With the question tool, the questions with
"nothing" first, or, where the tool cannot take one choice, the blocks
above.

Fold the answers into the item file before round 1: additions to the
notes go under a dated addendum heading, in the user's words; comments
revise the interpretation, which stays marked as the filer's. The design
tree starts from the corrected pair, never from the original alone.
Round 1 then opens from the item's prepared "not decided by this filing"
list — written at ingest with fresh context, its numbers kept as the
round's question numbers where the list is numbered; a prose list from an
earlier filing is numbered by the round, as today — re-checked against the
read-back answers, never instead of them.

## 2. Interrogate — the design tree in rounds

Interview the user relentlessly until you reach a shared understanding.
Map the intent as a **design tree**: every decision branches into the
decisions that hang off it. For an intent the root branches are always:

- **Problem** — what is actually wrong or missing, for whom, how often,
  at what cost; what the item file asserts versus what is evidenced.
- **Proposed outcome** — the state of the world when this is done; how
  anyone would observe it; what is explicitly out.
- **Affected users and systems** — who and what changes, who must be
  told, which path the work lands in.
- **Constraints** — law that binds (the brief, the rules, the canon),
  the project's standards (the settings key `standards-folders`, read as
  `/roadwork-specplan` reads it: every file in every listed folder, the
  ones that bind named by path), keys and secrets, loci, batching, what
  must not change; what must happen outside the project, out of band, before this work can complete, and who makes it happen (the rule's test for `external`).
- **Open questions** — what stays unknown after this interview, and who
  can settle it.

Work the tree in **rounds**. The **frontier** is every decision whose
prerequisites are already settled: the questions you can ask *now*
without guessing at answers you have not heard yet. Ask the whole
frontier in one round: number each question and give your recommended
answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Every round closes with two offers in the offer form — one sentence,
then `go with recos` in its own block, taking every recommendation as
given; one sentence, then `go with recos except:` in its own block,
which the Operator completes with the questions that differ. A plain
answer list is still an answer. Where the harness has a question tool,
the round is put instead as one question per item, the recommendation
first and labelled (recommended), the round's alternatives after, the
free-text choice for anything else, the questions of the round together
so one answer submits it, or, where the tool cannot take the round
whole, the blocks above; a second submission never splits a round; a
tick on the recommendation is the same as `go with recos` for that item.
Whatever comes back is written verbatim, followed by the recommendations
it took, one per question.

When taking every recommendation would empty the frontier, the round
closes with four blocks in this order: `go with recos and confirm`; `go
with recos except:`; `go with recos`; `go with recos and confirm and
/roadwork-specplan <ref>` — the confirm written and accepted as on
`confirm` alone, the spec skill run in the same turn; answered
otherwise, the frontier is recomputed and another round follows.
Directly above those blocks, each question of the round is restated
simply (reply-form rule).

Each round the user answers reshapes the tree: settled decisions push
the frontier outward and unblock questions that depended on them.
Recompute the frontier and ask the next round. A question whose answer
depends on another question still open in this round belongs to a
*later* round, not this one.

Finding **facts** is your job, never the user's. When a frontier
question needs a fact from the environment — a file, a commit, a channel
record, a config value, what another item already says — dispatch a
sub-agent to find it, or read it yourself; never ask the user for
anything you could look up. Do not block on it: a running exploration is
an unsettled prerequisite, so only the questions downstream of it wait
for the report; ask the rest of the frontier now. The **decisions** are
the user's: put each to them and wait.

Recommended answers are recommendations: state them plainly, one per
question, and let the user overrule. Never convert silence into a yes. A recommendation an insight shaped carries its mark; the Operator overrules it as any other.

The interview is done when the frontier is empty: every branch visited,
nothing left silently assumed. Then say so in one line and ask the user
to confirm the shared understanding. Offer `confirm and /roadwork-specplan <ref>` in its own block and `confirm` in another; on the pair, write and accept the file as on `confirm` alone, then run the spec skill in the same turn. **Do not write the file until they
confirm.**

## 3. Write `intent.md`

Write the file in the item's folder, in the user's own terms, in this
general form:

```
# Intent: <short title in the user's words>
Author: <originator — the Operator, by name or role>. Status: accepted <date>.
Item: <todo.md or feature.md>, <road plans home>. Interview: <date>.

## Problem
<what is wrong or missing, for whom, evidenced — two to six lines>

## Proposed outcome
<the observable end state; what is explicitly out>

## Affected users and systems
<who and what changes; which path the work lands in>

## Constraints
<the law that binds, stated as constraints on this work; what must not change; the outside dependencies, each with who makes it happen>

## Open questions
<what the interview left open, and who settles it — or "none">
```

Rules for the text: dated claims where a claim is made; ids and hashes
machine-read from what you looked up, never recalled; no plan steps,
no verification steps, no change lists — those belong in `plan.md` and
`spec.md`; the Operator's
words kept where they decided something. If an `intent.md` already
existed, replace it whole and say in your reply what changed.

**Write the crossings, both ways.** In the same act: for each related
item the interview established a crossing with, append a dated
`**Cross-items (<date>, written by /roadwork-intentify of <ref>):**` section to its
item file saying how the instant item bears on it; where the crossing is a
dependency, update that item's frontmatter (`blocked-by` or `blocking`,
`blocker` re-derived) and the instant item's to match, using the
reference forms of the Roadwork conventions (`main/<kind>/<item-name>`).
Revise the instant item's line in the register's
`ordering.md` if the interview changed its weight or group. Set the item
file's status line to "intent accepted <date>". Write the **Map:** `<map-slug>` line under the owner line (after
the Destination line where both exist) when the Operator named a map; one
map per item, no frontmatter key. Write the `**Referent:**` line directly after the Map line (after the Owner line where there is no Map line) when the Operator named one; open the intent's Constraints with `Referent: <the same>`. Commit in the
register (its commits local).

After writing: `intent.md` printed whole and verbatim in the reply, before the offers (reply-form rule); no PR; the register's commits are local. If the interview surfaced facts that
belong in the item file (a wrong claim, a new observation), say so and
offer to amend it — the intent never silently corrects the item. End by
offering the next step as one invocation in its own code block, preceded by its sentence (offer form) — `/roadwork-specplan <ref>` — as an offer,
never by invoking it (every skill in the chain ends this way: road plans
rule). Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Triggers and scope

Runs for one item at a time. Serves `todo.md` items in `roadwork/todo/`
and `feature.md` items in `roadwork/feature/` with the same procedure; the
root branches read "feature" for "todo" in the second case. Sparks
(`roadwork/spark/`) are read for crossings, never interviewed here —
`/roadwork-spark` gives them their one round.
If asked to do many at once, do them one interview after another,
never in parallel — the user can hold one tree in their head, not
five.

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
- **Read-back** — the step before any question: notes and interpretation read back, two questions asked — a third, which map, where the item names none — and a fourth, the referent, of every item: four questions in all, the notes, the interpretation, the map, the referent. **Round / frontier** — the frontier is every decision whose prerequisites are settled; a round asks the whole frontier at once; the interview proceeds in rounds until the frontier is empty.
- **Crossing / cross-note** — another item this one overlaps, shares a group with, or depends on; recorded as a dated `Cross-items` section in that item's file, and in frontmatter when it is a dependency.
- **PRD** — a product requirements document, `destinations/<destination-slug>.prd.md`, made by `/roadwork-destination` and the source of a group of items made by `/roadwork-nav-to-destination`; cited by path in every derived item.
- **Destination** — two files beside each other in `destinations/`: `<destination-slug>.intent.md`, what is wanted and why in the Operator's words, in the item intent's form, interviewed and written first; and `<destination-slug>.prd.md`, written from it, in a fixed form (a frontmatter block with `bucket-list-priority`, 1–10, 10 the highest, and `atlas`; the destination, a Stack section — the architecture read, the guidebooks drawn on, the changes to their stacks — numbered requirements, Out, Success); its slug categorises the register's items — one destination per item, the group's, written on the item by `/roadwork-nav-to-destination`; both files archived to `destinations/archive/` by hand when built.
- **Map** — one `maps/<destination-slug>.md`: the way to one destination, one map per destination — before agents, process, stack, judgements, inputs — in a fixed form, made by `/roadwork-map`, drawing on guidebooks by copying their relevant parts in (a **Guidebooks:** line names them); named on an item by its **Map:** line, one per item, read by `/roadwork-intentify` and `/roadwork-specplan`; enforced by nothing; retired to `maps/archive/` by hand.
- **Referent** — the thing an item's product describes — a folder by path or a system by name — named on the item by its `**Referent:**` line, written by `/roadwork-intentify` from the read-back's fourth question; read by `/roadwork-specplan`, which binds a folder referent as a source and writes the plan's reality gate against it.
- **Documentary item** — an item carrying a Referent line: its product describes something, and the chain checks the document against the referent — the plan's reality gate, the truth audit's listing, the make review gate's kept claims and proposed additions.
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

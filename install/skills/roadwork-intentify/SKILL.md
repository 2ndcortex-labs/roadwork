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

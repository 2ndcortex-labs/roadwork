---
name: roadwork-spark
description: Parks an idea as a spark for later, never worked, or lists the open sparks grouped for conversion.
when_to_use: Use when the user says /roadwork-spark, "spark:", "idea:", "note this idea", "park this for later", "assign <spark> to <destination>".
argument-hint: "[<notes> | spark/<item-name> to <destination-slug>]"
---

## Prerequisites

- You should have the contents of roadwork-constitution.md in you working context. This file should have loaded from some level of .claude/rules/roadwork-constitution.md. If this file did not load you must notify the operator that this vital information was not loaded and you should refuse to execute this skill. You may advise the operator how to ensure the roadwork-constitution.md file automatically loads in your context.

# roadwork-spark — memorialize an idea

Roadwork conventions: as per roadwork-constitution.md including its glossary. A spark is an
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

**Destination (<date>, the Operator: "<the invocation as typed>"):** <destination-slug> (`destinations/<destination-slug>.prd.md`) — the destination this spark is assigned to; the spark stays in `spark/` until converted.
```

The Destination line is optional: absent until the spark is assigned (§4b).

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

## 4b. Assign to a destination

`/roadwork-spark spark/<item-name> to <destination-slug>` assigns an open
spark to a destination. The argument is read as this word when it opens with `spark/`
and carries ` to ` — notes that file a new spark never open with `spark/`. The
word appends the Destination line of §3 to the spark's `idea.md` — the
invocation verbatim and dated — in one register commit; a second
assignment appends a new dated line and never rewrites the first, the
inventory page reading the last. The word is refused with its reason when
`spark/<item-name>/idea.md` does not exist among the open sparks (an archived
spark sits under `spark/archive/`, not open) or
`destinations/<destination-slug>.prd.md` does not exist (its `archive/`
excluded); nothing else written — no frontmatter, no move, no `ordering.md`
or `working.md` line. The reply says the line written and ends as §5 ends.

## 5. Hand back

Reply with the reference, the Related line, and whether a
round was answered. End with the offer, one invocation in its own code block, preceded by its sentence (offer form), never invoked: `/roadwork-ingest
spark/<item-name>` for when the idea becomes work.
Then follow the back offer guidance in roadwork-constitution.md .

## Never

Never frontmatter; never a line in `ordering.md` or `working.md`; never a
cross-note into another item; never a second round; never any work on a
spark; never archive or move a spark (conversion is `/roadwork-ingest`'s, on the
Operator's word); never `intent.md`, `plan.md`, or `spec.md`; never
write anything on a bare call.

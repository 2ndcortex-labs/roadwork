---
name: roadwork-spark
description: Parks an idea as a spark for later, never worked, or lists the open sparks grouped for conversion.
when_to_use: Use when the user says /roadwork-spark, "spark:", "idea:", "note this idea", "park this for later", "assign <spark> to <destination>".
argument-hint: "[<notes> | spark/<item-name> to <destination-slug>]"
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

# roadwork-spark — memorialize an idea

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. A spark is an
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

Print each group as: a line with the kind (todo or feature, by the road plans test (the terms table's **Road plans** row)), a proposed
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
form — a recommendation says what is wanted, never how it is made or checked: no technology, structure, format or command the notes did not name — closed with three blocks in this order: `go with recos`; `go with
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

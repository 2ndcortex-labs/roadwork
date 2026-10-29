---
name: roadwork-ingest
description: Files a todo or feature from the Operator's notes, verbatim, and places it in the ordering.
when_to_use: Use when the user says /roadwork-ingest, "file a todo", "file a feature", "new feature:", "new todo:", "add to the roadwork", or hands over notes for something to be done later.
argument-hint: <notes> | spark/<item-name> [&& spark/<item-name> …]
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

The settings file, `config.json` at the register's root, must be read before this skill acts — the constitution's bullet "The settings file": one run of the config skill's script with no argument, `node <config skill>/scripts/config.mjs`, its lines held in the working context for the run — every key with its value, a secret as "set, <n> characters" or "empty", never its value. The file is read by the script and by nothing else, never opened or printed directly. A key this skill needs that reads "empty" takes the default the schema names for it; a key without a default is not asked for here — the config skill's empty-keys prompt asks it. Where a compaction has removed the lines, read them again before acting, as with the constitution.

Before any sub-agent is dispatched, every `subagent-<type>` value this run may use is checked against the dispatching host: the family must be one the host resolves — a vendor the host serves, a family still offered, spelled as the host knows it. A value the host does not resolve — another vendor's family on a host that serves one vendor, a family retired or renamed, a release number where a family name belongs, a misspelling — is reported to the Operator in one line naming the key, the value and what is wrong with it, with the config skill's line to set it right, and this skill stops before dispatching; it never substitutes a family of its own choosing, never falls back to the default over a set value, and never dispatches on the other keys while one is wrong. An empty key is not wrong: it takes its default. The check is the session agent's reading of the host's model list where the host exposes one, and otherwise the dispatch's own refusal, reported the same way and before any further dispatch.

## Sub-agents

- Six sub-agent types are defined in the constitution's bullet "Sub-agents and their models" — reader, finder, explore, researcher, builder, reviewer — and this skill may dispatch any of them; the three categories there describe the types, they do not limit which a skill uses. Where a step of this skill needs a type the constitution does not name, the step defines it in place — its purpose, what it is given, what it returns, what it may and may not do, and the `subagent-<type>` key it reads for its model family, a key the config skill's schema must carry before the type is dispatched — and the definition holds for this skill alone until the constitution adopts it.
- The type of each dispatch is the session agent's determination at the time of invocation, from what the task asks for — a document read against a question, a fact looked up, files found, outside sources compared, a deliverable built, a change checked — unless a step of this skill names the type itself, in which case that step's type is used. Each dispatch is made as the host's agent of that type's name, so the type's instruction file under `.claude/agents/` (`reader.md`, `finder.md`, `explore.md`, `researcher.md`, `builder.md`, `reviewer.md`) is its standing instructions and the brief carries the task only.
- The model family of each type is the value of its `subagent-<type>` key in `config.json`, read under Prerequisites — a family name the dispatching host resolves, Anthropic's or another vendor's, the newest release of that family assumed at dispatch; a key read "empty" takes the default the config skill's schema names. This skill names no model family and no release itself.
- The effort of each dispatch is the session agent's judgement at the time of invocation, set from the task's difficulty — the depth of reading or building the brief asks for, how much a miss would cost — and set explicitly on every dispatch; no fixed level is prescribed here.
- A sub-agent's return is evidence, not a decision: the session agent reads every finding and claim, accepts or rejects each one by its own judgement, records the disposition and the reason, and reverifies a builder's claim of done by the gates before relying on it. A finding is never incorporated because a sub-agent produced it, nor dropped without the reason said.
- The session agent is the only dispatcher; a sub-agent never dispatches another, never speaks to the Operator, and never approves an oracle.

# roadwork-ingest — ingest an item

Road plans are `roadwork/` with `todo/`, `feature/`, `spark/` (Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary). This skill files a **todo** or a
**feature** from the Operator's notes. Sparks are `/roadwork-spark`'s;
interviews are `/roadwork-intentify`'s; archiving is `/roadwork-verify-and-archive`'s. This skill ends
when the item exists, is placed, and its first round is prepared.

## 1. Kind

A batch (`ref && ref`) is refused here: one filing at a time — each item is its own folder and its own prepared round — except a **spark batch**: `spark/<a> && spark/<b> && …`, all in one home, which §4b converts into one item (Operator, 2026-09-15). Many todos from one source file through this form by `/roadwork-tasksplit`.

Kind: decided by the session agent by the road plans test (the terms table's **Road plans** row) — a todo is done once and is
then over (a fix, chore, decision to take, finding to trace); a feature is
built once and reused when built (a new capability) — and said in the reply
with its reason in one clause ("done once" or "reused when built"). The
notes may name the kind in plain words, any wording, no syntax; then that
kind is filed, and when the test would have read it otherwise the reply
says so in one clause. The kind is considered fixed at filing.

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
     gated: ""
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
     you looked up (cite it); a claim of means — a technology, a structure, a format, a command — is written only where the notes name it. Never pass a reading off as the notes.
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
reply — and never fold one unasked.

## 5. Commit and hand back

Commit in the register (its commits local) with a message naming the item
and the Operator's directive. Reply with: the reference, the kind and its
reason, the frontmatter you set and what you set on other items,
where the line landed in `ordering.md`, and the "not decided" list, numbered as filed. End
by offering the next step as one invocation in its own code block, preceded by its sentence (offer form) — `/roadwork-intentify <ref>`, which opens
with the read-back — as an offer, never by invoking it (every skill in
the chain ends this way: Roadwork conventions). Then the back offers
of §5b, on their own lines after the next-step offer. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the host has a question tool, blocks otherwise (the terms table's **Offer form** row).

## 5b. Back offers

An ingest usually interrupts a lifecycle step in flight - so, while the back offer guidance in roadwork-constitution.md should generally be followed by road work skills, after your
next-step offer, offer the way back in a more specific way by: the open lifecycle steps of the
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
gates unmet) is not in flight and you defer to the back offers guidance in roadwork-constitution.md. 
Exclude the instant item
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

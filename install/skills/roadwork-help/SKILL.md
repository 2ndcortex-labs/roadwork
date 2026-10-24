---
name: roadwork-help
description: Answers questions about the road plans without acting, from the teach-me doc, the skills and the register.
when_to_use: Use when the user says /roadwork-help, "what does X do", "where is X", "what is a Y", "help me with the road plans".
argument-hint: "[<skill> | <ref> | <term>]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

# roadwork-help — the map, or one thing, read live

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. This skill sits
beside the lifecycle chain, not in it: it never files, interviews,
writes or builds. It reads and answers. Its sources are the teach-me
(`docs/teachme.md` in the register),
the constitution's terms table and glossary (`roadwork-constitution.md`), and the register itself —
read at the call, never from memory.

## 1. Resolve the argument

A batch (`ref && ref`) is refused here: one thing at a time.

Read the argument in this order, first match wins:

- **none** — the map of §2.
- **a reference** — it contains `/` (`todo/<item-name>`, `feature/<item-name>`,
  `spark/<item-name>`, `main/<kind>/<item-name>`):
  the item of §3.
- **a skill name** — a folder of that name among the skills, with or
  without the leading `/`: the skill of §3.
- **a term** — a glossary entry or a terms-table row of that name (case-insensitive)
  in the constitution: the term of §3.
- **anything else** — one line: "not found: `<argument>` is not a
  reference, a skill or a term", then what this skill takes,
  then stop.

## 2. The map

Print: the lifecycle in one paragraph, in the teach-me's words; the
skills in order, one line each — its invocation and what it does; then
where things are — the folders of the register (the three
sub-registers, `archive/`, `docs/`, `destinations/`, `maps/`, `guidebooks/`, `atlases/`), `ordering.md`,
`working.md`. Every line comes from the teach-me's section of that name
or the skill's own description line, read at the call.

## 3. One thing

- **A skill**: its description line (its purpose), what it takes, and
  the offers it ends with — read from its `SKILL.md`; the teach-me's
  line on it.
- **An item**: its state — the kind, the status line of its
  item file, `intent.md` accepted or not, `spec.md` accepted or not,
  `in-process`, the gates met per `GATES.md` when one exists, what blocks
  it — and the next skill it is ready for, by the states of
  `/roadwork-ingest` §5b; read from the item's files.
- **A term**: the glossary entry or the terms-table row, verbatim, and the teach-me's paragraph
  that explains it, when one does.

Say "not found" as §1 when the item, skill or term does not exist; never
invent a state.

## 4. Sources — live, never memory

Every answer names the file it was read from, in one trailing line
("read from: …"). The teach-me is read from the register's `docs/`
(`docs/teachme.md`); a term from the constitution, `roadwork-constitution.md`; an item from
its folder; a skill from its `SKILL.md`. Nothing is answered from what
the session agent remembers.

## 5. Hand back

Writes nothing — no file, no line in any register. When the argument was
an item, end with one offer, the next skill that item is ready for, as
one invocation in its own code block preceded by its sentence (offer
form), never invoked. Otherwise no offer. As a checkbox list where the harness has a question tool, blocks otherwise (the terms table's **Offer form** row). No back offers: this skill
interrupts nothing.

## Never

Never write; never file, interview, spec, build or archive; never answer
from memory; never invent a state — say "not found"; never a second
question; never open a PR.

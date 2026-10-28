---
name: roadwork-help
description: Answers questions about the road plans without acting, from the teach-me doc, the skills and the register.
when_to_use: Use when the user says /roadwork-help, "what does X do", "where is X", "what is a Y", "help me with the road plans".
argument-hint: "[<skill> | <ref> | <term>]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

The settings file, `config.json` at the register's root, must be read before this skill acts — the constitution's bullet "The settings file": one run of the config skill's script with no argument, `node <config skill>/scripts/config.mjs`, its lines held in the working context for the run — every key with its value, a secret as "set, <n> characters" or "empty", never its value. The file is read by the script and by nothing else, never opened or printed directly. A key this skill needs that reads "empty" takes the default the schema names for it; a key without a default is not asked for here — the config skill's empty-keys prompt asks it. Where a compaction has removed the lines, read them again before acting, as with the constitution.

Before any sub-agent is dispatched, every `subagent-<type>` value this run may use is checked against the dispatching host: the family must be one the host resolves — a vendor the host serves, a family still offered, spelled as the host knows it. A value the host does not resolve — another vendor's family on a host that serves one vendor, a family retired or renamed, a release number where a family name belongs, a misspelling — is reported to the Operator in one line naming the key, the value and what is wrong with it, with the config skill's line to set it right, and this skill stops before dispatching; it never substitutes a family of its own choosing, never falls back to the default over a set value, and never dispatches on the other keys while one is wrong. An empty key is not wrong: it takes its default. The check is the session agent's reading of the host's model list where the host exposes one, and otherwise the dispatch's own refusal, reported the same way and before any further dispatch.

## Sub-agents

- Six sub-agent types are defined in the constitution's bullet "Sub-agents and their models" — reader, finder, explore, researcher, builder, reviewer — and this skill may dispatch any of them; the three categories there describe the types, they do not limit which a skill uses. Where a step of this skill needs a type the constitution does not name, the step defines it in place — its purpose, what it is given, what it returns, what it may and may not do, and the `subagent-<type>` key it reads for its model family, a key the config skill's schema must carry before the type is dispatched — and the definition holds for this skill alone until the constitution adopts it.
- The type of each dispatch is the session agent's determination at the time of invocation, from what the task asks for — a document read against a question, a fact looked up, files found, outside sources compared, a deliverable built, a change checked — unless a step of this skill names the type itself, in which case that step's type is used.
- The model family of each type is the value of its `subagent-<type>` key in `config.json`, read under Prerequisites — a family name the dispatching host resolves, Anthropic's or another vendor's, the newest release of that family assumed at dispatch; a key read "empty" takes the default the config skill's schema names. This skill names no model family and no release itself.
- The effort of each dispatch is the session agent's judgement at the time of invocation, set from the task's difficulty — the depth of reading or building the brief asks for, how much a miss would cost — and set explicitly on every dispatch; no fixed level is prescribed here.
- A sub-agent's return is evidence, not a decision: the session agent reads every finding and claim, accepts or rejects each one by its own judgement, records the disposition and the reason, and reverifies a builder's claim of done by the gates before relying on it. A finding is never incorporated because a sub-agent produced it, nor dropped without the reason said.
- The session agent is the only dispatcher; a sub-agent never dispatches another, never speaks to the Operator, and never approves an oracle.

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
form), never invoked. Otherwise no offer. As a checkbox list where the host has a question tool, blocks otherwise (the terms table's **Offer form** row). No back offers: this skill
interrupts nothing.

## Never

Never write; never file, interview, spec, build or archive; never answer
from memory; never invent a state — say "not found"; never a second
question; never open a PR.

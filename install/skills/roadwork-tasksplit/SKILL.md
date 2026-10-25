---
name: roadwork-tasksplit
description: Splits any document or list into a dated group of todos, one per unit, the source's words verbatim.
when_to_use: Use when the user says /roadwork-tasksplit <source>, "split this list into todos", "make todos from this doc".
argument-hint: <source>
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

# roadwork-tasksplit — any document or list becomes a group of todos, verbatim

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. `/roadwork-nav-to-destination`
takes a product requirements document and makes features and todos with a
sanity todo; this skill takes the small case — "similar to roadmap-prd,
takes a list of tasks and creates a group of todos" (Operator, 2026-09-11) —
where the source's units already are todos. It adds nothing of its own:
"make sure everything relevant to todo is verbatim copied from source, make
sure to capture into each todo all relevant context from the source"
(Operator, 2026-09-11).

## 1. Read the source

A batch (`ref && ref`) is refused here: one source at a time.

The source "could be many types of document or a list" (Operator):
a file cited by path, or pasted text. A paste is stored whole, first, as
`docs/<name>.source.md` in the register's `docs/` — `<name>` from the source's title
or first line, kebab-case, never reused — and cited by that path from then
on. The skill never edits the source. Read it whole.

## 2. Delineate

The units are what the source itself delineates: its list items, its
headings, its numbered steps, its paragraphs where nothing finer exists.
One todo per unit — never merged or split beyond the source's structure.
An item that reads as a capability is still a todo; the skill never files
a feature and never refuses a unit for its shape. Dependencies exist only
where the source states an order or a dependency in words.

## 3. Read back once

Present the units as a numbered list, each with the source's words it
will carry and the dependencies the source states, plus the group's
name and where the block will sit in `ordering.md` —
where the Operator says at the read-back; the default is below the
lifecycle group. Ask
whether the split is right, and wait — the units are read back once, never
twice; corrections are folded in and the filing proceeds on the Operator's
word.

## 4. File every todo through `/roadwork-ingest`'s form

Each unit becomes one todo in `roadwork/todo/unnavigated/<item-name>/` (a navigation's units under its destination's folder) — item names by
`/roadwork-ingest`'s rule (kebab-case, in the source's words for that unit,
never reused, never a skill name) — with the four files of the form:

- the item file: the eight keys (`road-level` empty — a tasksplit navigates nothing), `group: [<source-name>-<YYYY-MM-DD>]`,
  `blocked-by`/`blocking` only where the source states them; the title in
  the source's words; the status line "open — filed by /roadwork-tasksplit
  from <source path>; not yet interviewed"; the notes: the unit's own words
  verbatim under `**Source (<path>, verbatim):**`; then
  `**Context from the source (verbatim):**` — every passage of the source
  that bears on the unit, quoted; the filer's reading reads exactly
  "from <source path>, verbatim, no reading added"; the not-decided list
  carries only questions the source itself poses, or "none the source
  poses";
- `intent.md`, `plan.md`, `spec.md`: the placeholders of the form.

Nothing is paraphrased; nothing the source does not say enters a todo.

The item file carries its `**Paths:**` line as `/roadwork-ingest` §3 gives it, when the source names paths.

## 5. The block in `ordering.md`

As `/roadwork-nav-to-destination` §5: one indented block under the group's line, the
todos in the source's order, placed where the read-back settled. No
sanity todo is created and nothing blocks the group: "we can skip sanity
checking for this" (Operator). The group is never cohorted ("no cohort
subagenting" — Operator): todos only, so `/roadwork-subagentifygroup` does
not apply.

## 6. Commit and hand back

Commit in the register (its commits local).
Reply with the group's name, the source's path, and every todo filed with
its reference; say that the Operator may run `/roadwork-navsanity <group>`
by hand later. End by offering the next step for the group's first todo —
`/roadwork-intentify <ref>` — as one invocation in its own code block, preceded by its sentence (offer form), never
invoked, then the back offers as `/roadwork-ingest` §5b computes them. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never a feature; never a PRD (that is `/roadwork-nav-to-destination`); never a sanity todo
or a sanity check; never a cohort; never a reading added; never a
paraphrase of the source; never a second read-back; never a PR.

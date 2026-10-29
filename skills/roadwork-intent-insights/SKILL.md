---
name: roadwork-intent-insights
description: Learns from the day's interviews and writes the insights into the register's intent-insights document on the Operator's confirm.
when_to_use: Use when the user says /roadwork-intent-insights, "end of day", "what did today's interviews teach".
argument-hint: "[<YYYY-MM-DD>]"
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

# roadwork-intent-insights — what the day's interviews taught

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. This skill sits beside the chain: it reads the day's interviews and writes what they teach into `docs/intent-insights.md` in the register, for `/roadwork-intentify` to read before its next read-back. It changes no skill and no item.

## 1. Resolve the invocation

**bare**: today, the machine's local date. **`<YYYY-MM-DD>`**: that day. **anything else** — two arguments, a date in another form, a reference: refused with one line saying what this skill takes; nothing written. A batch (`ref && ref`) is refused here. The invocation carries nothing else: no word changes what a day's run does.

## 2. Gather — the day's records

Read every item file under `todo/` and `feature/`, their `archive/` folders included, and every `intent.md` beside them. The day's records are: every paragraph opening `**Read-back record (<date>)`, `**Round <n> (<date>)`, `**Interview closed <date>` or `**Spec accepted (<date>)` whose date is the day; every `intent.md` whose status line reads `accepted <date>` with that day. Nothing else is read for insights: not the specs, not the plans, not the rulings. A day with no record: one line saying so, nothing written.

## 3. Distil — one bullet per insight

From the records, what they teach about how the Operator decides: a recommendation overruled and why; a reading corrected; a question that proved unnecessary, or that the Operator answered as the recommendation said; a ruling that recurs; a word the Operator used for a thing. Each insight is one bullet, in this form (the skill carries it as a fenced block of one line, so the inner backticks stand):

```
- **<date>-<n>** — <the pattern in plain words> (from: `<ref>`, `<ref>`; the Operator: "<at most one sentence, verbatim>")
```

— the references in code, the quote in double quotes. An insight cites every item it came from; a quote is the Operator's words as the record carries them, or none. No count is fixed; a day may teach one thing. A quote is at most one sentence: it ends at the first `.`, `?` or `!` followed by a space or its end, so it carries at most one such mark and only at its end. Where an insight suggests a change to a question a skill asks, that is a bullet of its own in the same form, opening `- **<date>-<n>** — proposal: `, the change in plain words, the items cited; this skill proposes, it edits no skill.

## 4. The confirm

Print the day's section whole — `## <date>` and its bullets — then this skill's three blocks, in this order: `go with recos and confirm` writes it; `go with recos except:` takes the bullets as they stand but the ones amended or struck after the colon, then asks again; `go with recos` settles the bullets and writes nothing.

## 5. Write and commit

On the confirm, append the section to `docs/intent-insights.md` in the register — the file created with the title `# Intent insights` and one line, `_What the interviews taught about how the Operator decides; read by /roadwork-intentify before every read-back; appended by /roadwork-intent-insights, one section per day, never rewritten._`, when it does not exist — one commit in the register (its commits local). No bullet carries a key, a token, a URL or any secret value: the Operator's words are quoted as the record carries them, and a record that carries such a value is cited by reference, never quoted. Reply with the section printed whole and verbatim, then the back offers as `/roadwork-ingest` §5b computes them, then the fact suffix, by the clock.

## Never

Never write without the confirm; never rewrite an earlier day's section; never edit a skill, an item file or an intent; never read a spec, a plan or a ruling for an insight; never schedule itself; never push; never open a PR; never write a key, a token, a URL or a secret value into the document.

---
name: roadwork-intent-insights
description: Learns from the day's interviews and writes the insights into the register's intent-insights document on the Operator's confirm.
when_to_use: Use when the user says /roadwork-intent-insights, "end of day", "what did today's interviews teach".
argument-hint: "[<YYYY-MM-DD>]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

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

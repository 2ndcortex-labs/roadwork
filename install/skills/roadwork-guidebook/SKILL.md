---
name: roadwork-guidebook
description: Makes or updates a guidebook, a standardized knowledge base broad in application, with the Operator.
when_to_use: Use when the user says /roadwork-guidebook, "new guidebook", "update the guidebook", "here is how we do things in general".
argument-hint: "[<new-slug> <description> | <existing-slug>]"
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

# roadwork-guidebook — a guidebook, made with the Operator

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary (the
Guidebooks bullet). A guidebook is one file, `guidebooks/<guidebook-slug>.md`,
in the register's `guidebooks/`. It is a standardized knowledge base, broad
in application: the standards that hold, the stack preferred and which
architectures it fits, the vendors used, the judgements a person makes
with them, and the sources it rests on. It names no destination — a map
is the way to one destination,
a guidebook serves any map that draws on it. `/roadwork-map` reads the
guidebooks that apply and copies their relevant parts into the map,
citing a whole guidebook only when the whole applies; no skill enforces
one. A retired guidebook moves to `guidebooks/archive/` by hand; there is
no archive skill.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one guidebook at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<new-slug> <initial description>`**: a kebab-case slug not yet in
  `guidebooks/` or `guidebooks/archive/` of any home (a slug is never
  reused), followed by the Operator's words — the interview of §3, the file
  of §4.
- **`<existing-slug>`**: a slug already in `guidebooks/` — the update of §4.
- **`<new-slug>` with a document** — a pasted document in the message, or a
  path to one: the entrance of §5, then the interview shortened.
- **a document with no slug**, or a path alone: propose a slug in the
  Operator's words and ask once; on their word proceed as above.

## 2. The bare call — the guidebooks

Read the register's `guidebooks/` — `archive/` excluded — and print a count
line (`guidebooks: <n>`) and then one line per guidebook: its slug, its
opening words (the guidebook's own), its architectures as the clause
`architectures: <the line's words>` — `architectures: none` where the line
reads none or is absent — and the count of maps in `maps/` —
`maps/archive/` excluded — whose **Guidebooks:** line names it. No state
beyond that: a guidebook is never done. With no guidebook in any home —
the empty case — print the count and the offer to start one,
`/roadwork-guidebook <new-slug> <description>`. A bare call writes nothing.

## 3. The interview — the intentify pattern

Read back the Operator's description as given (verbatim), then your
reading of it, marked as yours, and ask the two questions — anything to
add? any comments on the reading? Then the rounds of `/roadwork-intentify`
§2, closed as `/roadwork-intentify` §2 closes a round: the design tree, the
frontier asked whole each round, every question numbered with your
recommendation, the facts found by you, never asked; the decisions the
Operator's. The root branches for a guidebook:

- **What it covers** — the field the guidebook holds knowledge of, and how
  broadly it applies; in one paragraph.
- **Standards** — what must hold: conventions, formats, rules, thresholds
  the Operator has settled on, each with its reason.
- **Stack** — whether the guidebook carries a stack at all ("none" skips
  the section); the environment, framework, tooling, assets and services
  preferred, each with its reason, and what they are preferred over; which
  architectures the stack fits, in the Operator's words, or "none" where it
  fits no application architecture.
- **Vendors** — the providers used, and on what terms.
- **Judgements** — the calls a person makes in this field, and on what.
- **Sources** — where the knowledge comes from: documents, people,
  experience; named so a map can go further.
- **Crossings** — open items, maps and other guidebooks this one touches;
  read, never written into.

Stop when the frontier is empty; say so and ask the Operator to confirm.
Offer `confirm` in its own block. Do not write the file until they
confirm.

## 4. Write the guidebook — the fixed form

On confirm, `guidebooks/<guidebook-slug>.md` in the owning home, in this
form and no other:

```
# Guidebook: <title in the Operator's words>
_Guidebook, made <date> by /roadwork-guidebook; open until retired._

**Architectures:** <free words in the Operator's terms, or none>

<what it covers: one paragraph>

## Standards
<a paragraph or a list>

## Stack
<a paragraph or a list>

## Vendors
<a paragraph or a list>

## Judgements
<a paragraph or a list>

## Sources
<a paragraph or a list>

## Changelog
- <date>: made.
```

The Stack section is written only where the guidebook carries a stack; a
guidebook with none omits the section, heading and all, and its
Architectures line reads none — as does the line of a stack that fits no
application architecture, whose section stays.

A guidebook names no destination: no **Destination:** line, no
destination's slug. Its sections are what a map copies from — a map's
excerpt opens with ``_From guidebook `<guidebook-slug>`, § <section>:_``,
so the section names above are the ones a map cites.

**An update** (`<existing-slug>`): read the file back whole, ask what
changes and interview only that, then rewrite the file whole on confirm
and append one dated line under `## Changelog` saying what changed. A
map that copied a part of it is not rewritten here: its own update is
`/roadwork-map <destination-slug>`, on the Operator's word. The
Architectures line and the Stack section are read back with the file and
may be revisited; where the line is absent — a guidebook written before
the line existed, read as none until then — the update asks the
architectures question and writes it.

## 5. A document arrives

When the Operator pastes a document or names a path — a standards page, a
vendor list, a stack note, a page of what has been learned — save it
first, verbatim, as `guidebooks/<guidebook-slug>.source.md` in the owning
home (a header line above it: `_Source of <guidebook-slug>, received <date>; verbatim._`).
Then the interview of §3, shortened to what the source leaves open: read
back your reading of the source into the covering paragraph, the
Architectures line — asked of the Operator where the document does not
state it — and the sections, ask the two questions, then only the rounds
the gaps need. The guidebook is written as §4; its first changelog line
names the source.
The source file stays beside it and moves with it to `archive/`.

## 6. Commit and hand back

Commit in the register (its commits local). Reply with: the guidebook's
path (and the source's, if any); its title; the crossings found; then the
guidebook printed whole and verbatim, before the offers (reply-form rule).
End with one offer, one invocation in its own code block, preceded by its
sentence (offer form), never invoked: the open destination first by the inventory's order that has no **Map:** line and no map file —
the highest `bucket-list-priority`, ties by `ordering.md` position, then
slug —

```
/roadwork-map <destination-slug>
```

— else no offer. Then the back offers as `/roadwork-ingest` §5b computes
them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never enforce a guidebook (no skill checks one); never write into a map,
an item or a destination; never file, interview or spec an item (those
are the chain's); never write a guidebook the Operator did not confirm;
never archive or move a guidebook; never a frontmatter key on any item;
never open a PR.

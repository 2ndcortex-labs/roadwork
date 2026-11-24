---
name: roadwork-guidebook
description: Makes or updates a guidebook, a building block for architecture of one kind and scope, with the Operator; makes templates and converts guidebooks.
when_to_use: Use when the user says /roadwork-guidebook, "new guidebook", "update the guidebook", "here is how we do things in general", "make a template", "convert this guidebook".
argument-hint: "[<new-slug> <description> | <existing-slug> | [<new-slug>] template: <template-name> | template: new <name> <description> | convert <guidebook-slug> to template [<name>] | convert <guidebook-slug> for another project [<name>]]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

The settings file, `config.json` at the register's root, must be read before this skill acts — the constitution's bullet "The settings file": one run of the config skill's script with no argument, `node <config skill>/scripts/config.mjs`, its lines held in the working context for the run — every key with its value, a secret as "set, <n> characters" or "empty", never its value. The file is read by the script and by nothing else, never opened or printed directly. A key this skill needs that reads "empty" takes the default the schema names for it; a key without a default is not asked for here — the config skill's empty-keys prompt asks it. Where a compaction has removed the lines, read them again before acting, as with the constitution.

Before any sub-agent is dispatched, every `subagent-<type>` value this run may use is checked against the dispatching host: the family must be one the host resolves — a vendor the host serves, a family still offered, spelled as the host knows it. A value the host does not resolve — another vendor's family on a host that serves one vendor, a family retired or renamed, a release number where a family name belongs, a misspelling — is reported to the Operator in one line naming the key, the value and what is wrong with it, with the config skill's line to set it right, and this skill stops before dispatching; it never substitutes a family of its own choosing, never falls back to the default over a set value, and never dispatches on the other keys while one is wrong. An empty key is not wrong: it takes its default. The check is the session agent's reading of the host's model list where the host exposes one, and otherwise the dispatch's own refusal, reported the same way and before any further dispatch.

## Sub-agents

- Six sub-agent types are defined in the constitution's bullet "Sub-agents and their models" — reader, finder, explorer, researcher, builder, reviewer — and this skill may dispatch any of them; the three categories there describe the types, they do not limit which a skill uses. Where a step of this skill needs a type the constitution does not name, the step defines it in place — its purpose, what it is given, what it returns, what it may and may not do, and the `subagent-<type>` key it reads for its model family, a key the config skill's schema must carry before the type is dispatched — and the definition holds for this skill alone until the constitution adopts it.
- The type of each dispatch is the session agent's determination at the time of invocation, from what the task asks for — a document read against a question, a fact looked up, files found, outside sources compared, a deliverable built, a change checked — unless a step of this skill names the type itself, in which case that step's type is used. Each dispatch is made as the host's agent of that type's name, so the type's instruction file under `.claude/agents/` (`reader.md`, `finder.md`, `explorer.md`, `researcher.md`, `builder.md`, `reviewer.md`) is its standing instructions and the brief carries the task only.
- The model family of each type is the value of its `subagent-<type>` key in `config.json`, read under Prerequisites — a family name the dispatching host resolves, Anthropic's or another vendor's, the newest release of that family assumed at dispatch; a key read "empty" takes the default the config skill's schema names. This skill names no model family and no release itself.
- The effort of each dispatch is the session agent's judgement at the time of invocation, set from the task's difficulty — the depth of reading or building the brief asks for, how much a miss would cost — and set explicitly on every dispatch; no fixed level is prescribed here.
- A sub-agent's return is evidence, not a decision: the session agent reads every finding and claim, accepts or rejects each one by its own judgement, records the disposition and the reason, and reverifies a builder's claim of done by the gates before relying on it. A finding is never incorporated because a sub-agent produced it, nor dropped without the reason said.
- The session agent is the only dispatcher; a sub-agent never dispatches another, never speaks to the Operator, and never approves an oracle.

# roadwork-guidebook — a guidebook, made with the Operator

This skill is a tool beside the lifecycle: it runs on the Operator's invocation or as a step of a work item's plan, its scripts are also run by other skills as their own text says, and an agent never picks it as the way to do work it was asked for.

Roadwork conventions: `roadwork-constitution.md`, its terms table and its
glossary (the Guidebooks bullet).

A guidebook is a building block for architecture, of one kind, with a
scope. It is a standardized knowledge base: the standards that hold, the
stack preferred and which architectures it fits, the vendors used, the
judgements a person makes with them, the sources it rests on, and the
items the Operator chose — for example hosts, MCPs, coding standards per
language, SOPs and best practices.

- **Where:** one file, `guidebooks/<guidebook-slug>.md`, in the register's
  `guidebooks/`.
- **Kind and scope:** its header block states them; §4 gives the form.
- **Kind `atlas`:** it reaches every destination under that atlas, and
  their work items.
- **Kind `destination`:** it reaches that one destination and its work
  items.
- **Kind `template`:** it is made to leave the project; it lives under
  `guidebooks/outgoing/` and reaches nothing.
- **Any number** of guidebooks may name one destination or one atlas.
- **Unscoped, made earlier:** a guidebook with no header block. It is
  listed and drawn on as before, and reaches nothing by scope.

Reach is computed from header blocks alone by
`node <this skill>/scripts/guidebooks.mjs reach`; the later steps run it
and read what it prints. `/roadwork-map` copies a guidebook's relevant
parts into the map, citing a whole guidebook only when the whole applies.
No skill enforces a guidebook. A retired guidebook moves to
`guidebooks/archive/` by hand; there is no archive skill. A destination's
guidebook stays when its destination is archived: no skill moves or
retires it.

Everything that leaves the project is written under
`guidebooks/outgoing/<name>.md`, the name kebab-case and the Operator's:
a template made here (§5c) and every converted result (§5d). The name is
no guidebook's slug in `guidebooks/` or `guidebooks/archive/`, and no
other outgoing file's. Nothing may draw on an outgoing file: no map,
destination, work item or reach reads it. Placing it in the store or in
another project is the Operator's act; this skill writes into neither.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one guidebook at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<new-slug> <initial description>`**: a kebab-case slug not yet in
  `guidebooks/` or `guidebooks/archive/` of any home, and no outgoing
  file's name, `guidebooks/outgoing/<slug>.md` (a slug is never reused),
  followed by the Operator's words — the interview of §3, the file
  of §4.
- **`<existing-slug>`**: a slug already in `guidebooks/` — the update of §4.
- **`<new-slug>` with a document** — a pasted document in the message, or a
  path to one: the entrance of §5, then the interview shortened.
- **`[<new-slug>] template: <template-name>`**: a template of the store
  the setting `guidebook-templates` names — the section "A template is
  named" (§5b); the slug left out, the template's name is the slug.
- **`template: new <name> <description>`**: a template from scratch by
  the interview — §5c, written to `guidebooks/outgoing/<name>.md`.
- **`convert <slug> to template [<name>]`**: the conversion of a guidebook
  into a template — §5d.
- **`convert <slug> for another project [<name>]`**: the conversion of a
  guidebook for another project — §5d.
- **a document with no slug**, or a path alone: propose a slug in the
  Operator's words and ask once; on their word proceed as above.

A new guidebook's slug — in any invocation that makes one, a template
call included — that is in `guidebooks/` or `guidebooks/archive/`, or
that `guidebooks/outgoing/` holds as `<slug>.md`, is refused in one line;
nothing is written.

Where a name for an outgoing file is left out, propose one in the
Operator's words and ask once. A name that is not kebab-case, that is a
guidebook's slug in `guidebooks/` or `guidebooks/archive/`, or that
`guidebooks/outgoing/` already holds, is refused in one line; nothing is
written.

## 2. The bare call — the guidebooks

Run `node <this skill>/scripts/guidebooks.mjs list` and print its lines as
they are:

- `guidebooks: <n>`, then one line per guidebook: `<slug> — <title> —
  atlas: <atlas-slug>`, `… — destination: <destination-slug>`, or
  `… — unscoped`.
- Where `guidebooks/outgoing/` holds any file: `outgoing: <n>`, then one
  line per file with its state — `template: no store set`,
  `template: in the store`, `template: not yet in the store`,
  `template: store unreadable`, or `for another project`.
- Where it prints one refusal line (exit 1), print that line and stop.

At the end of each guidebook's line, add two clauses of your own, read
from the register:

- **Architectures:** the clause `architectures: <the line's words>`, from
  the guidebook's **Architectures:** line; `architectures: none` where the
  line reads none or is absent.
- **Maps:** the count of maps in `maps/` — `maps/archive/` excluded —
  that draw on it: their **Guidebooks:** line names it. A map whose line
  names it only as "(read by reach)" is not counted.

No state beyond that: a guidebook is never done. With no guidebook — the
empty case — the count line is followed by the offer to start one,
`/roadwork-guidebook <new-slug> <description>`.

After the project's own guidebooks, run
`node <this skill>/scripts/templates.mjs list` and print its lines as they
are, under the project's own: `templates: <n>`, then one line per template
of the store, `<name> — <title> — template`. The script prints nothing
where the setting `guidebook-templates` is empty; then say nothing about
templates, and the list is what it was without the setting. Where it
prints `store unreadable: <reason>` (exit code 3), print that one line
and go on: the list never stops for it. Both scripts write
nothing. A bare call writes nothing.

## 3. The interview — the intentify pattern

One interview serves every kind, a template included. Read back the
Operator's description as given (verbatim), then your reading of it,
marked as yours, and ask the two questions — anything to add? any comments
on the reading? Then the rounds of `/roadwork-intentify` §2, closed as
`/roadwork-intentify` §2 closes a round: the design tree, the frontier
asked whole each round, every question numbered with your recommendation,
the facts found by you, never asked; the decisions the Operator's.

### 3a. First, the kind and its scope

The first round asks the kind and its scope, before anything else.

- **Kind:** `atlas`, `destination` or `template`. Recommend `atlas` only
  where an open atlas exists, `destination` only where an open destination
  exists.
- **Scope of kind `atlas`:** one open atlas, a folder `atlases/<atlas-slug>/`
  holding `atlas.md`.
- **Scope of kind `destination`:** one open destination, a file
  `destinations/<destination-slug>.prd.md`.
- **Kind `template`:** no scope; the result is written as §5c, to
  `guidebooks/outgoing/<new-slug>.md`, under that section's name rules.

If the Operator names a kind `destination` with no open destination of
that slug, refuse it in one line, `no open destination <slug>`; nothing is
written. If they name a kind `atlas` with no open atlas of that slug,
refuse it the same way, `no open atlas <slug>`. The question stays open
until they name an open one. No new guidebook is written without a kind
and, for kind `atlas` or `destination`, its scope.

### 3b. Then, which items

The second round asks which items the guidebook includes. Offer these
five, each with your recommendation:

- **Hosts** — the part `## Hosts`.
- **MCPs** — the part `## MCPs`.
- **Coding standards per language** — one part per language,
  `## Coding standards: <language>`; one language alone is allowed.
- **SOPs** — the part `## SOPs`.
- **Best practices** — the part `## Best practices`.

The Operator adds any item in that round. An item the Operator adds is a
part under the name they give, never one of the six existing part names
of §4: Standards, Stack, Vendors, Judgements, Sources, Changelog.
Each chosen item becomes one `## ` part; an unchosen item leaves no
heading. Each chosen item is then a root node of the rounds that follow.

### 3c. Then, the parts every guidebook has

The root nodes after the items:

- **What it covers** — the field the guidebook holds knowledge of, and how
  broadly it applies; in one line, then bullets.
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

On confirm, draft `guidebooks/<guidebook-slug>.md` in the owning home, in
this form and no other:

```
---
kind: <atlas | destination | template>
atlas: "<atlas-slug, or empty>"
destination: "<destination-slug, or empty>"
---
# Guidebook: <title in the Operator's words>
_Guidebook, made <date> by /roadwork-guidebook; open until retired._

**Architectures:** <free words in the Operator's terms, or none>

<what it covers: one line, then bullets>

## Standards
<a list>

## Stack
<a list>

## Vendors
<a list>

## Judgements
<a list>

## <each chosen item, in the order chosen>
<a list>

## Sources
<a list>

## Changelog
- <date>: made.
```

The header block holds three keys, always present: `kind`, `atlas`,
`destination`.

- **Kind `atlas`:** `atlas` names one open atlas; `destination` is empty.
- **Kind `destination`:** `destination` names one open destination;
  `atlas` is empty.
- **Kind `template`:** both are empty.

The six existing parts keep their names, order and rules: `## Standards`,
`## Stack`, `## Vendors`, `## Judgements`, `## Sources`, `## Changelog`.
The item parts stand after `## Judgements` and before `## Sources`, in the
order chosen, under the names of §3b. The Stack section is written only
where the guidebook carries a stack; a guidebook with none omits the
section, heading and all, and its Architectures line reads none — as does
the line of a stack that fits no application architecture, whose section
stays. The section names above are the ones a map cites: a map's excerpt
opens with ``_From guidebook `<guidebook-slug>`, § <section>:_``.

Hold the draft in a file under the system's temporary folder, never
inside the project. Run
`node <this skill>/scripts/guidebooks.mjs check <draft> --as guidebooks/<guidebook-slug>.md`
on it before any guidebook is written. It prints `OK check` (exit 0), or
one `FAULT <what>` line per broken rule (exit 1). While it reports a
fault, nothing is written. If it reports a fault after the Operator's
confirm:

1. Print the `FAULT` lines and mend the draft.
2. Run `check` again until it prints `OK check`.
3. Show the Operator what changed, and ask `confirm` again in its own
   block.

A mended draft is never written unseen. On `OK check` and the Operator's
confirm of that very draft, write it to its place.

**An update** (`<existing-slug>`): it runs on the Operator's invocation or as a step of a work item's plan. Words that say what should change, and name no skill and no trigger phrase, are an instruction to do work: they are filed as a work item, never answered by running this skill on the agent's own initiative, because a change to a made thing is work by default (the constitution's bullets "How work enters" and "Steps and tools"). A skill's name or trigger phrase inside an instruction to change something does not invoke this skill: words invoke it only when they ask for the skill's own act, and in doubt the agent asks once. Read the file back whole.

- **Unscoped, made earlier:** where the file has no header block, ask its
  kind and scope first (§3a), then its items (§3b), once, in this update.
  The guidebook is written with its header block.
- **Scoped:** the header block is read back and may be revisited; kind
  `template` is never written under `guidebooks/` — that is the
  conversion of §5d.
- **Archived scope:** a guidebook whose destination or atlas is archived
  can still be updated, its scope unchanged; a new guidebook needs an open
  one.
- **What changes:** ask what changes and interview only that.
- **Architectures:** the line and the Stack section are read back and may
  be revisited; where the line is absent — read as none until then — ask
  the architectures question and write it.

Rewrite the file whole on confirm, after `guidebooks.mjs check` passes on
the draft — a draft mended after the confirm is shown and confirmed again,
as above — and append one dated line under `## Changelog` saying what
changed. An update never reads the store of templates, whatever the
guidebook was made from. A map that copied a part of it is not rewritten
here: its own update is `/roadwork-map <destination-slug>`, on the
Operator's word.

## 5. A document arrives

When the Operator pastes a document or names a path — a standards page, a
vendor list, a stack note, a page of what has been learned — save it
first, verbatim, as `guidebooks/<guidebook-slug>.source.md` in the owning
home (a header line above it: `_Source of <guidebook-slug>, received <date>; verbatim._`).
Then the interview of §3, shortened to what the source leaves open. The
kind and its scope are asked first, as for any new guidebook, then which
items. Read back your reading of the source into the covering paragraph,
the Architectures line — asked of the Operator where the document does
not state it — the item parts and the sections, ask the two questions,
then only the rounds the gaps need. The guidebook is written as §4; its
first changelog line names the source. The source file stays beside it
and moves with it to `archive/`.

## 5b. A template is named

A template is a guidebook an organization keeps in one store for many
projects: a `.md` file at the store's top level, in the fixed form of §4
— with a header block and item parts, or without them, as made earlier —
its name the file's stem. The store is the folder or the repository the
setting `guidebook-templates` names; only this skill's scripts read it,
and nothing writes to it.

Run `node <this skill>/scripts/templates.mjs copy <template-name> <guidebook-slug>`.
It copies the template verbatim into `guidebooks/<guidebook-slug>.source.md`
in the owning home, under the header line
`_Source of <guidebook-slug>, from the template <template-name> of the store <value>, copied <date>; verbatim._`,
and writes nothing else. Then, by its exit code:

- **1, a refusal**: print its one line and stop; nothing was written. The
  script refuses when no store is set; when the slug is already in
  `guidebooks/` or `guidebooks/archive/` — pick another slug, or update the
  existing guidebook with `/roadwork-guidebook <existing-slug>`; when the
  store holds no template of that name; when the named file is not in the
  fixed form; when the name or the slug is not kebab-case.
- **3, the store cannot be read**: print its one line,
  `store unreadable: <reason>`, offer the other two ways — a description,
  or a document handed over — and stop. A store that cannot be read never
  blocks a guidebook.
- **0**: hold the interview of §5 on the copy, exactly as for a document
  handed over: it asks the kind and its scope first, like any new
  guidebook, then which items. Then write the guidebook as §4.

The guidebook made from a copy carries its own header block, the one its
interview decided, never the template's. It starts its own changelog —
the template's stays in the source file — and its first line reads
`- <date>: made from the template <template-name> of the store <value>.`

Once made, the guidebook is the project's own: no skill compares it with
its template again, and a later change to the template never reaches it.

## 5c. A template from scratch

`template: new <name> <description>` makes a template by the interview of
§3. The kind is `template`, given by the call; the interview goes on with
which items, then the parts every guidebook has. The name follows the
rules of §1.

The acts, in this order:

1. **Draft:** the guidebook in the form of §4, kind `template`, both scope
   keys empty, held in a file under the system's temporary folder, never
   inside the project. Run
   `guidebooks.mjs check <draft> --as guidebooks/outgoing/<name>.md` and
   mend the draft until it prints `OK check`.
2. **Scan:** run `node <this skill>/scripts/guidebooks.mjs scan <draft>`.
3. **Show:** the result whole, then the scan's lines, as §5d step 3.
4. **Confirm:** as §5d step 4.
5. **Write:** as §5d step 5.

## 5d. The conversions

Two conversions, each from a guidebook of this project:

- **`convert <slug> to template [<name>]`:** the result is kind
  `template`, both scope keys empty.
- **`convert <slug> for another project [<name>]`:** the Operator names
  the kind, `atlas` or `destination`, and that project's atlas or
  destination. The result names that one scope key, the other empty; the
  scope is not looked up, as it is another project's.

The Operator may call either conversion on any guidebook of the project,
at any time — scoped or unscoped, of any kind. The conversion for another
project is never offered unasked.

What a conversion takes out:

- **The destination's name**, wherever it stands.
- **The project's paths and names:** its atlas, destination, map,
  guidebook and work item names, and the project root's folder name.
- **Instance-only values:** a value true of this project alone — an
  address, an account, a person, a machine, a date.

Each thing taken out is replaced by a general word, or its sentence is
removed where none fits. Beyond what is taken out and replaced, nothing
else changes but the header block, the
changelog, and the status line's date, which becomes the date of the
conversion: the result is made then. The changelog starts anew, one line, `- <date>: made.`; it
names no source. No skill compares the result with the guidebook converted
from again.

The acts, in this order:

1. **Draft:** read the guidebook whole; write the result, as above, into a
   file under the system's temporary folder, never inside the project. Run
   `guidebooks.mjs check <draft> --as guidebooks/outgoing/<name>.md` and
   mend the draft until it prints `OK check`.
2. **Scan:** run `node <this skill>/scripts/guidebooks.mjs scan <draft>`.
   It skips the draft's header block, so the scope named there is never
   listed. It prints `OK scan` (exit 0) where no line after the block
   holds a name or value of this project. Otherwise it prints one line per such line,
   `<line number>: <what matched> — <the line>` (exit 1).
3. **Show:** print the result whole and verbatim, then the scan's lines as
   printed. For each listed line, ask: take it out, or keep it.
4. **Confirm:** a line taken out is redrafted; run `check` and `scan`
   again and show the result again. Offer `confirm` in its own block,
   whether the scan listed lines or none; nothing is written without the
   Operator's confirm. The result is written only when the scan lists
   nothing, or the Operator keeps each listed line by word, naming its
   line number.
5. **Write:** on confirm, write the result to `guidebooks/outgoing/<name>.md`
   and nothing else. Where a draft changes after the Operator's confirm —
   a fault mended, a line redrafted — show what changed and ask `confirm`
   again before writing; a mended draft is never written unseen.

Where `guidebooks.mjs` refuses during `check` or `scan` — one refusal
line, exit 1, not `FAULT` or scan lines — or exits 2, print its one line
and stop; nothing is written. The same holds in §4 and §5c.

The guidebook converted from stays unchanged, byte-equal before and after:
this skill never writes to it during a conversion.

## 6. Save and hand back

Save in the register. Reply with: the file's path (and the source's, if
any); its title; its kind and scope; the crossings found; then the file
printed whole and verbatim, before the offers.

For a file under `guidebooks/outgoing/`, say where it is, and that placing
it — in the store, or in the other project's `guidebooks/` — is the
Operator's act; this skill writes into neither. Until then, the bare call
lists it with its state.

End with the offers, each one invocation in its own code block, preceded
by its sentence (offer form), never invoked. The map offer and the
conversion offer are made only where a guidebook of the project, in
`guidebooks/`, was made or updated in this run. After an outgoing file —
`template: new`, a conversion, or kind `template` chosen in §3a — neither
is made; an outgoing file of kind `destination` never brings the
conversion offer. Where they are made, the next-step offer is the map
offer where one applies; the conversion offer follows it, or stands first
where no map offer applies.

1. The open destination first by the inventory's order that has no
   **Map:** line and no map file — the highest `bucket-list-priority`,
   ties by `ordering.md` position, then slug —

   ```
   /roadwork-map <destination-slug>
   ```

   — else no such offer.
2. When a kind `destination` guidebook is confirmed — made or updated in
   `guidebooks/` — the offer to convert it to a template: one sentence in the
   offer form, "Typing this converts `<guidebook-slug>` into a template (to
   have a general copy other projects can start from).", with its box:

   ```
   /roadwork-guidebook convert <guidebook-slug> to template
   ```

   It converts nothing by itself; nothing waits on it.

Then the back offers as `/roadwork-ingest` §5b computes them — up to five,
most recent first, as offers only. Then the fact suffix, by the clock (the
glossary's **Fact suffix** entry). As a checkbox list where the host has a
question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never enforce a guidebook (no skill checks one); never write into a map,
an item or a destination; never file, interview or spec an item (those
are the chain's); never write a guidebook or an outgoing file the Operator
did not confirm; never write a file while `guidebooks.mjs check` reports a
fault; never write to a guidebook converted from; never archive or move a
guidebook; never a frontmatter key on any item; never write to the store
of templates, and never read it but on the bare call and on
`template: <template-name>` (`template: new` reads no store); never write into another project; never offer the conversion for
another project unasked.

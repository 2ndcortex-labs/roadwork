---
name: roadwork-atlas
description: Makes one atlas from the Operator's vision, intent and architecture, the highest-order thing above a destination.
when_to_use: Use when the user says /roadwork-atlas, "new atlas", "here are the vision, the intent and the architecture".
argument-hint: "[<atlas-slug> <vision> <intent> <architecture>]"
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

# roadwork-atlas — an atlas, ingested from the Operator's three documents

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary (the Atlases bullet). An atlas is one folder, `atlases/<atlas-slug>/`, in the register's `atlases/`: the highest-order thing in the register, above the destination — what several destinations serve. It holds the Operator's three documents — `vision.md`, `intent.md`, `architecture.md` — verbatim, and one file this skill writes, `atlas.md`. A destination names the atlas it serves by its frontmatter key `atlas`, one atlas per destination, asked by `/roadwork-destination`; this skill never writes a destination. Ingest only: no interview and no update — a changed document is replaced by hand; a retired atlas moves whole to `atlases/archive/` by hand; there is no archive skill. The pages do not yet group destinations by atlas; that is a later item's. It suggests the atlas's destinations in `atlas.md` (§3b, §4b) and offers each as a destination interview; it never makes one.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one atlas at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<atlas-slug>` with three named parts**: a kebab-case slug of the Operator's, then the three parts, each named for what it is. On the invocation line: `vision: <path or URL>`, `intent: <path or URL>`, `architecture: <path or URL>`, in any order. Pasted in the message: each part introduced by a line at column zero reading `## vision`, `## intent` or `## architecture`, running to the next such line or the message's end, saved without that introducing line. Path, URL and paste mix freely across the three parts; one way per part. The ingest of §3.
- **`<atlas-slug>` alone**: the slug of an open atlas — the derivation of §3b and the section of §4b written into its `atlas.md`, nothing else touched; a slug of no open atlas refused with one line.
- **anything else** — a part without its name, a second slug, a part named twice: refused with one line saying what this skill takes; nothing written.

## 2. The bare call — the atlases

Read the register's `atlases/` — `archive/` excluded — and print a count line (`open atlases: <n>`) and then one line per atlas: its slug, its description as its `atlas.md` carries it, and the open destinations (`destinations/`, `archive/` excluded) whose `atlas` key names it, read at the call — "no destination" when none names it. With no atlas — the empty case — the count line alone. A bare call writes nothing.

## 3. Ingest — all three held before anything is written

Read every part before writing anything: a path by the harness's file read, its bytes as given; a URL by the harness's fetch tool, asked for the page's text whole and verbatim, nothing summarised — what it returns is the text as fetched; a pasted part from the message, its lines as given. Hold all three, then test the slug: kebab-case, and in none of `atlases/`, `atlases/archive/`, `destinations/`, `destinations/archive/` (a slug is never reused, and a destination's slug is never an atlas's).

**The intent it serves.** Nothing sits above an atlas, so the intent read before anything is written is the atlas's own `intent.md`: the part given as `atlases/<atlas-slug>/intent.md` is read as the intent it serves — this atlas's own — as given, before `atlas.md` is written, and `atlas.md`'s status line records the reading. The Operator's word — whatever the invocation carries beyond the slug and the three parts — is read as intent where it adds to the document and recorded verbatim in that status line, `none` where no word was given; it is never replacing or editing `intent.md`, which is saved as given, and where the word contradicts the document the reply says so and the document stands. The three parts are still all held before anything is written; one level up is the minimum, not a limitation, and an atlas, having no level above, reads its own intent and stops — the destinations under it read that intent as the level above them.

The skill refuses the whole call — one line naming the cause, nothing written: no folder, no file, no commit — when:
- a part is missing, or a part is given twice (on the line and pasted, or twice either way);
- a path does not exist, or is not a text file;
- a URL does not answer, answers with an error, or returns an empty body or a body with no text;
- the slug is taken — an atlas or a destination, open or archived — or is not kebab-case.

Then derive the description: at most two sentences, in the session agent's words, from `vision.md` alone — what the atlas gathers and what the world looks like when it is reached. The title is the text of the first line of `vision.md` that opens `# `, else the slug. The description is printed in the reply, marked derived (§5), never passed off as the Operator's; the Operator may rewrite it in `atlas.md` by hand.

## 3b. Derive the suggested destinations

Derived after `atlas.md` is written (a creation) or read (a slug call); nothing is interviewed, and the Operator rewrites the section by hand or at a destination's interview. First the taken: every destination, open or archived, whose `atlas` key names this atlas, each with the architecture's `## ` headings the session agent reads its requirements file as covering. Then the suggestions: the remaining headings grouped into broad categories of the vision's work, each a destination one could pursue start to finish — never an item, never a section split between two; for each, a kebab-case slug (`^[a-z0-9]+(-[a-z0-9]+)*$`) in the documents' words that is no open, archived or taken destination's; one paragraph opening `serves the atlas `<atlas-slug>``, written from the vision's and the architecture's words; the headings it covers; what it needs from no other suggestion. Then the independence test, pairwise: for each suggestion, which others it would wait on; any is a failed set — the shared prerequisite becomes its own suggestion, or is named as out of band in the `stands alone:` line, and the set is re-derived until every `waits on:` reads none. Then the covering test: every heading of `architecture.md` cited exactly once across the taken and the suggestions; a heading no suggestion and no taken destination cites, or two suggestions cite, is a failed set, re-derived; a heading two taken destinations cite is listed under both and named in the covering line, nothing re-derived for it; the taken covering every heading leaves no suggestion, and the section says so in its one bullet's place. No count is fixed.

## 4. Write the atlas — the fixed form

The folder `atlases/<atlas-slug>/` with the three documents — `vision.md`, `intent.md`, `architecture.md` — each saved as given (a path's or a pasted part's bytes unchanged) or as fetched (a URL's text as the fetch tool returned it), and `atlas.md` in this form and no other:

```
# Atlas: <title>
_Atlas, made <date> by /roadwork-atlas; its intent.md read as the intent it serves; the Operator's word: "<verbatim>" | none; open until retired._

**vision.md:** <the path as given | pasted | <URL>, fetched <date>, as the fetch tool rendered it>
**intent.md:** <the same, for its own source>
**architecture.md:** <the same, for its own source>

_Description derived from vision.md by /roadwork-atlas, <date>; the Operator may rewrite it._
<the description: at most two sentences>
```

One atlas per call; the three documents and `atlas.md` and nothing else in the folder.

## 4b. The suggested destinations section

Written into `atlas.md` after the description, whole, and replaced whole on a re-derivation — the section runs from its heading to the file's end, so the file carries it once:

```
## Suggested destinations
_Derived by /roadwork-atlas, <date>; proposals, not destinations — the Operator may rewrite or strike any; a destination is made only by /roadwork-destination._
covering: every section of the architecture assigned once[; covered twice by taken destinations: <heading>]
taken: `<destination-slug>`[ (archived)] — covers: <heading>, <heading>
- `<slug>`
  <the paragraph, opening `serves the atlas `<atlas-slug>``>
  covers: <heading>, <heading>
  stands alone: <what it needs from no other suggestion>
  waits on: none
```

(The `taken:` lines zero or more, before the bullets; the bullets one or more, or the one line `- no suggestion: the taken destinations cover every section` in their place; the headings' text as in `architecture.md`; the section is written whole and replaced whole, so `atlas.md` carries it once; the folder keeps its four files, no file per suggestion.)

## 5. Commit and hand back

One commit in the register (its commits local) for the atlas. Reply with: the folder's path; the three sources, one line each; the description, marked derived; then `atlas.md` printed whole and verbatim, before the offers (reply-form rule).

The section of §4b is printed whole and verbatim after `atlas.md`'s body — a slug call prints the section alone, the atlas file otherwise unchanged. Then, before the listing offer, one offer per suggestion in printing order: **O<n>** — typing this starts the destination interview from the suggestion (to make the destination `<slug>` under the atlas `<atlas-slug>`): and the block `/roadwork-destination <slug> <the paragraph>` on one line; a `no suggestion` section offers none.

Then the listing offer, **O<n+1>** — "Typing this lists the destinations; updating one by its slug asks which atlas it serves:"

```
/roadwork-destination
```

Then the back offers as `/roadwork-ingest` §5b computes them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never interview (the three documents are the Operator's, taken as given); never update an atlas (a changed document is replaced by hand); never archive or move an atlas (retirement to `atlases/archive/` is by hand); never write a destination or its `atlas` key (that is `/roadwork-destination`'s); never a second atlas in one call; never write anything on a refusal; never open a PR.

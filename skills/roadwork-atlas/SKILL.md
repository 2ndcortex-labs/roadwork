---
name: roadwork-atlas
description: Makes one atlas from the Operator's vision, intent and architecture, and their charter where given, the highest-order thing above a destination.
when_to_use: Use when the user says /roadwork-atlas, "new atlas", "here are the vision, the intent and the architecture".
argument-hint: "[<atlas-slug> <vision> <intent> <architecture> [<charter>] | <atlas-slug> scope]"
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

# roadwork-atlas — an atlas, ingested from the Operator's three documents and their charter where given

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary (the Atlases bullet). An atlas is one folder, `atlases/<atlas-slug>/`, in the register's `atlases/`: the highest-order thing in the register, above the destination — what several destinations serve. An atlas spans its own goals and its own architecture of the work, so that context stays discrete. Neither a repository nor a type of work decides where an atlas ends: its goals and its architecture of the work do. Website builds and SEO on those websites are two atlases. It holds the Operator's three documents — `vision.md`, `intent.md`, `architecture.md` — verbatim, their `charter.md` verbatim where given (the atlas's terms, optional), and one file this skill writes, `atlas.md`. A destination names the atlas it serves by its frontmatter key `atlas`, one atlas per destination, asked by `/roadwork-destination`; this skill never writes a destination. Ingest only: no interview and no update, except the round of scoping questions and the kind asked when an atlas is made (§3) and the scope call that asks it again (§4c) — a changed document is replaced by hand; a retired atlas moves whole to `atlases/archive/` by hand; there is no archive skill. The pages do not yet group destinations by atlas; that is a later item's. It suggests the atlas's destinations in `atlas.md` (§3b, §4b) and offers each as a destination interview; it never makes one.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one atlas at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<atlas-slug>` with three named parts, or four**: a kebab-case slug of the Operator's, then the three parts, each named for what it is. On the invocation line: `vision: <path or URL>`, `intent: <path or URL>`, `architecture: <path or URL>`, in any order. Pasted in the message: each part introduced by a line at column zero reading `## vision`, `## intent` or `## architecture`, running to the next such line or the message's end, saved without that introducing line. An optional fourth part, the charter, is named the same way: `charter: <path or URL>` on the line, or a pasted part introduced by `## charter`. Path, URL and paste mix freely across the parts; one way per part. A call with the required three and no charter makes the atlas without one. The ingest of §3.
- **`<atlas-slug>` alone**: the slug of an open atlas — the derivation of §3b and the section of §4b written into its `atlas.md`, nothing else touched; a slug of no open atlas refused with one line.
- **`<atlas-slug> scope`**: the slug of an open atlas, then the word `scope` (never read as a second slug) — the round asked on that atlas and its answers written into its `atlas.md` (§4c), nothing else touched; a scope call on a slug of no open atlas is refused with one line, as the slug call refuses, nothing written.
- **anything else** — a part without its name, a second slug, a part named twice: refused with one line saying what this skill takes; nothing written.

## 2. The bare call — the atlases

Read the register's `atlases/` — `archive/` excluded — and print a count line (`open atlases: <n>`) and then one line per atlas: its slug; `kind: <kind>` where its `atlas.md` carries a kind line, the kind the text after `**Kind:** ` up to the line's last ` (the Operator,`; its description as its `atlas.md` carries it; and the open destinations (`destinations/`, `archive/` excluded) whose `atlas` key names it, read at the call — "no destination" when none names it. An atlas without a kind line — an earlier atlas, made before the kind — prints the same line as before, with no `kind:` clause. With no atlas — the empty case — the count line alone. A bare call writes nothing.

## 3. Ingest — every part held before anything is written

Read every part before writing anything: a path by the host's file read, its bytes as given; a URL by the host's `WebFetch` tool, asked for the page's text whole and verbatim, nothing summarised — what it returns is the text as fetched; a pasted part from the message, its lines as given. Hold every part given, three or four, before anything is written, then test the slug: kebab-case, and in none of `atlases/`, `atlases/archive/`, `destinations/`, `destinations/archive/` (a slug is never reused, and a destination's slug is never an atlas's).

**The intent it serves.** Nothing sits above an atlas, so the intent read before anything is written is the atlas's own `intent.md`: the part given as `atlases/<atlas-slug>/intent.md` is read as the intent it serves — this atlas's own — as given, before `atlas.md` is written, and `atlas.md`'s status line records the reading. The Operator's word — whatever the invocation carries beyond the slug and the named parts (the charter one of them) — is read as intent where it adds to the document and recorded verbatim in that status line, `none` where no word was given; it is never replacing or editing `intent.md`, which is saved as given, and where the word contradicts the document the reply says so and the document stands. Every part given is still held before anything is written; one level up is the minimum, not a limitation, and an atlas, having no level above, reads its own intent and stops — the destinations under it read that intent as the level above them.

The skill refuses the whole call — one line naming the cause, nothing written: no folder, no file, nothing saved — when:
- a required part is missing, or a part is given twice (on the line and pasted, or twice either way);
- a charter is given that cannot be read, by any cause below, or a charter is given twice;
- a path does not exist, or is not a text file;
- a URL does not answer, answers with an error, or returns an empty body or a body with no text;
- the slug is taken — an atlas or a destination, open or archived — or is not kebab-case.

**The round — four scoping questions and the kind.** Once every part is held and no refusal applies, the skill asks the Operator one round, in one message: the four scoping questions, then the kind question, in `/roadwork-intentify`'s round form (its "Format each round"). Nothing is written until the Operator has answered every question of the round: no folder, no file. A refused call asks nothing. The set of scoping questions is open to more; this skill asks these four.

The agent's part, before the round is printed:
- For each scoping question, it recommends an answer from the documents given, marked `(the agent's reading of the documents)`.
- Where the documents do not say, it recommends `not known yet`.
- For "Already housed?" it reads the `atlas.md` of every atlas in `atlases/` and `atlases/archive/` and names in its recommendation any whose work covers this one.
- For the kind, it may recommend one suggested kind, marked the same way; where none fits, it recommends none and says so.

The round prints, in this order, each scoping question with its why on the line directly above it:

```
Why: two sets of goals means two atlases.
❓ **Q1** - **One outcome?** Does all the work meant for this atlas serve one set of goals?

➡️ <the recommended answer> (the agent's reading of the documents)

---

Why: work done two ways mixes context.
❓ **Q2** - **One way of working?** Is all of it done one way, under one architecture of the work?

➡️ <the recommended answer> (the agent's reading of the documents)

---

Why: several like jobs point to repeating work.
❓ **Q3** - **One job or several?** Is this one job, or several like jobs?

➡️ <the recommended answer> (the agent's reading of the documents)

---

Why: an existing atlas may already cover this.
❓ **Q4** - **Already housed?** Does an existing atlas already cover this work?

➡️ <the recommended answer, naming any atlas that covers the work> (the agent's reading of the documents)

---

❓ **Q5** - **Which kind?** One kind for this atlas, one line of text, any words. The suggested kinds: project-build, recurring-work, maintenance, dev-ops, audit, accounting. Any word of Operator is also valid.

➡️ <one suggested kind> (the agent's reading of the documents) | none of the suggested kinds fits; type the kind (the agent's reading of the documents)
```

Then the round closes with two boxes, each after one sentence: typing the first takes every recommendation as given; typing the second, completed after its colon with the short names whose answers differ and those answers, takes the rest.

```
go with recos
```

```
go with recos except:
```

**The answers.** Every question is answered before the atlas is written; "not known yet" is an answer, recorded as given.
- A reply that leaves a question out — a typed list missing one — is asked for that question alone; nothing is written meanwhile.
- A session that ends before every answer is in leaves nothing written.
- `go with recos` takes each recommendation; where the agent recommended no kind, the kind stays unanswered and is asked again.
- An answer the Operator typed is recorded as typed.
- A recommendation taken is recorded as the Operator's word, then the recommendation's text marked as the agent's reading: `"go with recos" — <the recommendation's text> (the agent's reading)`.
- A kind is one line of text, any words; an atlas carries one kind. The kind describes only: no skill acts on the kind, and nothing behaves differently by it.

**Two atlases, or already housed.** Once every answer is in, and before anything is written, the agent reads the answers by meaning, with no threshold and no script.
- If it reads the answers as pointing to two atlases, it says so in one line and recommends a split into two atlases, each made by its own call.
- If it reads an existing atlas as covering the work, it names that atlas in one line and recommends against a new atlas.
- In doubt on either, it says so in the same line. Where both hold, both lines are printed, one after the other.
- The lines read `Two atlases: <the reading, one clause>. Recommended: split this into two atlases, each made by its own call.` and `Already housed: <atlas-slug> covers this work — <the reading, one clause>. Recommended against a new atlas: use <atlas-slug>.`, each ending `In doubt: <why>.` where the agent is in doubt.

In either case two boxes follow, each after one sentence: typing the first writes the atlas as answered; typing the second writes nothing and ends the call.

```
make the atlas
```

```
stop
```

The Operator decides; the skill refuses nothing. In no other case is a second word asked: with neither line, the atlas is written as answered.

Then derive the description: at most two sentences, in the session agent's words, from `vision.md` alone — what the atlas gathers and what the world looks like when it is reached. The title is the text of the first line of `vision.md` that opens `# `, else the slug. The description is printed in the reply, marked derived (§5), never passed off as the Operator's; the Operator may rewrite it in `atlas.md` by hand.

## 3b. Derive the suggested destinations

**The charter first.** Where the folder holds `charter.md`, the skill reads it first, before any suggestion is derived: at a creation, the charter given; at a slug call, the charter given then or placed by hand since. Whether an atlas has a charter is the file's presence in its folder, never `atlas.md`'s source line. The skill suggests no destination the charter rules out: an architecture heading whose work the charter rules out is left out of the suggestions and named on the section's `ruled out by the charter:` line (§4b). A destination the Operator makes anyway is theirs to make, and no skill refuses it. Whether the charter rules a heading's work out is the session agent's reading by meaning, with no threshold and no script; in doubt, the skill says so in one line and the Operator decides. The skill never rewrites, edits, moves or interviews the charter. With no charter in the folder, the section records `charter: none` and the derivation runs as below.

Derived after `atlas.md` is written (a creation) or read (a slug call); nothing is interviewed, and the Operator rewrites the section by hand or at a destination's interview. First the taken: every destination, open or archived, whose `atlas` key names this atlas, each with the architecture's `## ` headings the session agent reads its requirements file as covering. Then the suggestions: the remaining headings, less those the charter rules out, grouped into broad categories of the vision's work, each a destination one could pursue start to finish — never an item, never a section split between two; for each, a kebab-case slug (`^[a-z0-9]+(-[a-z0-9]+)*$`) in the documents' words that is no open, archived or taken destination's; one paragraph opening `serves the atlas `<atlas-slug>``, written from the vision's and the architecture's words; the headings it covers; what it needs from no other suggestion. Then the independence test, pairwise: for each suggestion, which others it would wait on; any is a failed set — the shared prerequisite becomes its own suggestion, or is named as out of band in the `stands alone:` line, and the set is re-derived until every `waits on:` reads none. Then the covering test: every heading of `architecture.md` cited exactly once across the taken, the suggestions and the `ruled out by the charter:` line; a heading a taken destination covers is listed with it, even where the charter rules it out; a heading no suggestion and no taken destination cites, and the charter does not rule out, or two suggestions cite, is a failed set, re-derived; a heading two taken destinations cite is listed under both and named in the covering line, nothing re-derived for it; the taken, with the headings the charter rules out, covering every heading leaves no suggestion, and the section says so in its one bullet's place, naming the charter where its `ruled out by the charter:` line stands. No count is fixed.

## 4. Write the atlas — the fixed form

The folder `atlases/<atlas-slug>/` with the three documents — `vision.md`, `intent.md`, `architecture.md` — and the charter where given, as `atlases/<atlas-slug>/charter.md`, each saved as given (a path's or a pasted part's bytes unchanged) or as fetched (a URL's text as the `WebFetch` tool returned it), and `atlas.md` in this form and no other:

```
# Atlas: <title>
_Atlas, made <date> by /roadwork-atlas; its intent.md read as the intent it serves; the Operator's word: "<verbatim>" | none; open until retired._

**vision.md:** <the path as given | pasted | <URL>, fetched <date>, as the `WebFetch` tool rendered it>
**intent.md:** <the same, for its own source>
**architecture.md:** <the same, for its own source>
**charter.md:** <the same, for its own source> | none given at creation
**Kind:** <kind> (the Operator, <date>)

_Description derived from vision.md by /roadwork-atlas, <date>; the Operator may rewrite it._
<the description: at most two sentences>

## Scope
_Asked by /roadwork-atlas, <date>; the Operator's answers, in their words._
- **One outcome?** <the answer>
- **One way of working?** <the answer>
- **One job or several?** <the answer>
- **Already housed?** <the answer>

Changes:
- <date>: <kind | the question's short name> — before: <the earlier value>
```

The kind and the scope section, as the round of §3 answered them:
- The kind line stands directly after the `**charter.md:**` line; a record without that line takes the kind line after its last source line. Its date is the day the current kind was given.
- The section `## Scope` stands after the description and before `## Suggested destinations` (§4b), which follows it.
- Its first line carries the date of the atlas's first round; then the four bullets, `- **<the question's short name>** <the answer>`, in the round's order, each answer as §3 records it.
- The kind line and the four bullets always hold the current values.
- The list headed `Changes:` is absent until the first change (§4c); at a making the section ends after the four bullets.
- The round and the kind change no document of the Operator's: the three documents and the charter are saved as given and never touched by the round.
- An earlier atlas, made before the kind, has no kind line and no scope section; it reads unchanged until a scope call names it (§4c).

One atlas per call; the three documents, the charter where given or placed by hand, and `atlas.md`, and nothing else in the folder. A charter placed by hand later leaves the `**charter.md:**` line reading `none given at creation`; no call rewrites it, and the Operator may edit it by hand.

## 4b. The suggested destinations section

Written into `atlas.md` after the description, whole, and replaced whole on a re-derivation — the section runs from its heading to the file's end, so the file carries it once:

```
## Suggested destinations
_Derived by /roadwork-atlas, <date>; proposals, not destinations — the Operator may rewrite or strike any; a destination is made only by /roadwork-destination._
charter: atlases/<atlas-slug>/charter.md read <date>
covering: every section of the architecture assigned once[; covered twice by taken destinations: <heading>]
ruled out by the charter: <heading>, <heading>
taken: `<destination-slug>`[ (archived)] — covers: <heading>, <heading>
- `<slug>`
  <the paragraph, opening `serves the atlas `<atlas-slug>``>
  covers: <heading>, <heading>
  stands alone: <what it needs from no other suggestion>
  waits on: none
```

(The `charter:` line always, reading `charter: none` where the folder holds no charter; the `ruled out by the charter:` line only where the charter rules out a heading no taken destination covers, and the covering line then reads "every section of the architecture assigned once or ruled out by the charter"; the `taken:` lines zero or more, before the bullets; the bullets one or more, or the one line `- no suggestion: the taken destinations cover every section` in their place, reading `- no suggestion: the taken destinations and the charter cover every section` where the `ruled out by the charter:` line stands; the headings' text as in `architecture.md`; the section is written whole and replaced whole, so `atlas.md` carries it once; the folder keeps its files, no file per suggestion.)

## 4c. The scope call — the round on an open atlas

`/roadwork-atlas <atlas-slug> scope` asks the round of §3 on an open atlas, an earlier atlas among them, and writes its answers into that atlas's `atlas.md`; nothing is written before the answer. Step by step:
1. Resolve the slug: an atlas in `atlases/`, `archive/` excluded; any other slug is refused with one line (§1), nothing written.
2. Read its `atlas.md`, its three documents, its charter where the folder holds one, and the `atlas.md` of every other atlas in `atlases/` and `atlases/archive/`.
3. Ask the round of §3, in its form, closed by `go with recos` and `go with recos except:`.
4. Where the record holds a kind or an answer, that current value, as the record holds it, is the recommendation, marked `(the agent's reading: the current answer)`.
5. Where it holds none — an earlier atlas's first scope call — the agent recommends from the documents, as at a making.
6. "Already housed?" leaves the atlas itself out of the atlases it reads.
7. Take the answers as §3 takes them: a question left out is asked again, nothing written meanwhile.
8. Say the lines on two atlases and on an atlas that covers the work as at a making; print no `make the atlas` and no `stop` boxes, since the atlas exists.
9. On the answer, write the kind line and the scope section of §4 into the record, and nothing else: no other line changes, no suggestion is derived, no document is touched.

How a change is kept:
- A current value taken again — by `go with recos`, or left out of a `go with recos except:` list — is unchanged and stays as the record holds it.
- A new value is recorded as §3 records it, and the value it replaces gains one line at the end of the list headed `Changes:`, in this form: `- <date>: <kind | the question's short name> — before: <the earlier value>`.
- A change to the kind is named `kind`; a change to an answer by the question's short name, for example `One outcome?`.
- The list opens, after a blank line below the four bullets, at the first change; it grows by one line per change, and no line is ever removed.
- An unchanged kind or answer gains no line.
- An earlier atlas's first scope call has no earlier value, so it writes no `Changes:` line.
- The scope section's first line keeps the date of the first round; the kind line takes the date of the kind's latest change.

## 5. Save and hand back

Save in the register. Reply with: the folder's path; the sources, one line each, the charter's source with the other three, or `none given at creation`; the description, marked derived; then `atlas.md` printed whole and verbatim, before the offers, so the reply shows the kind and the answers. A scope call replies with the atlas's `atlas.md` printed whole and verbatim, then the offers below less the offers per suggestion, since it derives none.

The section of §4b is printed whole and verbatim after `atlas.md`'s body — a slug call prints the section alone, the atlas file otherwise unchanged. Then, before the listing offer, one offer per suggestion in printing order: **O<n>** — typing this starts the destination interview from the suggestion (to make the destination `<slug>` under the atlas `<atlas-slug>`): and the block `/roadwork-destination <slug> <the paragraph>` on one line; a `no suggestion` section offers none.

Then the listing offer, **O<n+1>** — "Typing this lists the destinations; updating one by its slug asks which atlas it serves:"

```
/roadwork-destination
```

Then one line with one box, **O<n+2>**: guidebooks for this atlas may be made before its destinations; nothing waits on it — "Guidebooks for this atlas may be made before its destinations; nothing waits on it. Typing this makes one with you, its kind and scope asked first:":

```
/roadwork-guidebook <guidebook-slug> <description>
```

Then the back offers as `/roadwork-ingest` §5b computes them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the host has a question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never interview (the three documents and the charter are the Operator's, taken as given; the round of scoping questions and the kind, at a making and at a scope call, is the one exception, and it changes no document); never update an atlas (a changed document, the charter among them, is replaced by hand; a scope call writes the kind line and the scope section, nothing else); never rewrite, edit or move the charter; never archive or move an atlas (retirement to `atlases/archive/` is by hand); never write a destination or its `atlas` key (that is `/roadwork-destination`'s); never a second atlas in one call; never write anything on a refusal.

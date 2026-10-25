---
name: roadwork-inventory
description: Prints everything open in the road plans on one page, each work item's next step under its line, when the Operator asks what is open.
when_to_use: Use when the user says /roadwork-inventory, "inventory", "what's open", "show me everything", "the whole picture".
argument-hint: "[<words>]"
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

# roadwork-inventory — everything open, on one page

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. This skill shows and does nothing else: one page of everything open in the register, in the order the register itself gives. The **bare call** — `/roadwork-inventory` with nothing after it — prints the whole page; words after it narrow it (§1). It writes nothing: no file, no line in any register file; the page is computed at the call and may differ next time.

## 0. The page — four blocks, in this order

Read the register live — never from memory — and print the four blocks under the terms table's plain words as headings (§3). Nothing is re-sorted here: the order is `ordering.md`'s and the destinations' own priorities, the atlases' order derived from those priorities. The page is printed by `node <inventory>/scripts/inventory.mjs`, run in the register; the session agent prints its output unchanged, grouping the sparks (Block 3) when any are open.

**Block 1 — the atlases and their destinations.** First, directly under the title `# Inventory — <date>`, one counts line, `<n> open work items · <a> await interview · <b> intent accepted · <c> await the go · <d> in process · <e> blocked · <f> external`, every open work item counted once — a blocked item under its lifecycle state, except at awaits the go, where it is counted blocked — a drafted intent under await interview, a drafted spec under intent accepted, an in-process item with no ledger under in process. Then the open destinations, grouped under the atlas each serves. The atlases: every folder of `atlases/`, `archive/` left out, ordered by the highest `bucket-list-priority` among each atlas's open destinations, descending, an atlas no open destination names last among them; ties by atlas slug. Each atlas is the heading `## Atlas: <atlas-slug>`, then directly under it its description on its own line, in italics,

`_<description>_`

the slug and the description as the bare `/roadwork-atlas` prints them (the description the first sentence of the atlas's description as its `atlas.md` carries it, cut at the first full stop; `_(no description)_` where it is empty), then a blank line and its counts line, `<n> open destinations · <m> navigated · <k> built` — numerals, the noun singular when n is 1, the built clause only when k is not zero, n every destination under the atlas, navigated and built by the tests below; an atlas no open destination names prints its heading, description and counts line with nothing under them. After the last atlas, the heading `## No atlas`, printed only when a destination's `atlas` key is empty or names an atlas that is not open (read as none), those destinations under it. Under an atlas's counts line, and under `## No atlas`, its destinations: every `destinations/<destination-slug>.prd.md` whose `atlas` key names that atlas, `destinations/archive/` left out. Order: `bucket-list-priority` from each file's frontmatter, highest first; equal priorities keep the order of their group blocks in `ordering.md`, then the slug; a destination whose file carries no priority comes after every one that does, by slug. Each destination is the heading `### <destination-slug> — <title>`, the title from the file's first heading with a leading `Goal: ` or `Destination: ` stripped, then directly under it one line:

`<navigation state> · <p> open items · <q> ready`

The navigation state is the test the bare `/roadwork-destination` applies (its §0): **navigated <date>** when a group block in `ordering.md` cites the destination (the date the block's name carries); **built, every item archived** when only struck group blocks in `ordering.md` cite the destination; **not yet navigated** otherwise. No priority number is printed — the order shows it. p counts the destination's open items and q those of them whose bullet carries a block (the next step, inline, below), both on the bare page whatever the filter (§1), the noun singular when p is 1; a destination not yet navigated counts `0 open items · 0 ready`.

**Under each destination, its items.** The open items (empty `disposition` in the frontmatter) of `todo/<destination-slug>/` and `feature/<destination-slug>/`, in their position within the destination's group block in `ordering.md`, one bullet each after the destination's line and a blank line. Two lines each:

``- `<ref>` · <level> · <state>``, then on the second line two spaces and `<short description>`

or, when a block follows it (the next step, inline, below), ``- **O<k>** `<ref>` · <level> · **<state>**`` — the id first, the state in bold — then the second line as above.

- `<ref>` in the reference form of the conventions (`todo/<item-name>`, `feature/<item-name>`), printed in code.
- `<level>`: the item's frontmatter `road-level` — `main`, `secondary` or `side` — read from the item's own file at the call, never from an ordering line; empty (an item under no destination yet, until navigated), the clause is left out and the first line reads ``- `<ref>` · <state>``.
- `<short description>`, the second line: the item file's title, verbatim — the text of its first `# ` heading — never the ordering line's reason re-quoted, never the notes re-quoted.
- `<state>`: one clause, re-derived from the item's own files at the call, never copied from `ordering.md` or `working.md`. The first of these that holds:
  1. **in process at G<n>** — `in-process` set; `<n>` the first unmet gate by `gate-check --status` on the item's `GATES.md`; **in process, all gates met** when none is unmet; **in process, no ledger** when no `GATES.md` exists;
  2. **external: <text> — <state>** — `external` set; `<state>` is `open | cleared | unknown | no status URL`, read by the inventory's own script per item, the status read of the rule's section "Externalities and their notices", the answer matched to the item's spec's Dependencies entries by `what` — the worst of the item's entries: open over cleared, an unmatched entry or an empty answer as open, unknown over all; `no status URL` where the key is empty;
  3. **intent drafted, not accepted** — an `intent.md` neither placeholder nor accepted;
  4. the lifecycle state by the placeholder tests the lifecycle skills use — **awaits interview** (a placeholder `intent.md`), **intent accepted** (an accepted intent, a placeholder `spec.md`), **spec drafted, not accepted** — an accepted intent, a `spec.md` neither placeholder nor accepted; no block, **awaits the go** (an accepted spec).

  A line whose item is blocked — a `blocked-by` entry whose item is open and whose ledger is not all met, the test `/roadwork-make` §0 applies; an entry whose item is archived (its folder under an `archive/`) is past and does not block — reads its clause by tests 3 and 4 and then ` · blocked by `<ref>` (<the blocker's state>)`, the blocker's `<ref>` printed in code, the blocker's own state clause by these same tests, a blocker itself blocked printing `blocked by <its blocker>` with no further parenthetical; a block stops only the build, so the line keeps the lifecycle state the block does not touch. Tests 1 and 2 keep precedence: an item in process or external prints that clause alone.

An item in process is shown in place under its destination, not pulled out. An open item with no line in `ordering.md` prints last in its block, its first line ending ` · not in the ordering`. A destination navigated but with no open item prints one bullet, **no open items**; one not yet navigated prints nothing under its line.

**The next step, inline.** Directly under the second line of each work item whose next step can run now, one fenced code block (three backticks, no language tag) holding that item's next-step invocation, or the Operator's word and the invocation together, and nothing else, its three lines indented two spaces so the bullet list continues through it. The next step by the state clause, the same reading the back offers use:

- **awaits interview** → `/roadwork-intentify <ref>`
- **intent drafted, not accepted** → `/roadwork-intentify <ref>`
- **intent accepted** → `/roadwork-specplan <ref>`
- **awaits the go** → `/roadwork-make <ref>`
- **in process, all gates met** → `/roadwork-verify-and-archive <ref>`
- **in process at G<n>**, the gate the Operator approves (its `APPROVER:` line in `GATES.md` naming the Operator; a manual gate without one, or a command gate, is not) → `G<n> accepted and <next step>` — several of the Operator's gates unmet in a run, `G<n> and G<m> accepted`; the next step the make hand-back's reading: `open the pull request for <repo> <branch>` where the item's `base.json` names a branch the Not yet landed block prints, `/roadwork-verify-and-archive <ref>` where no unmet gate follows the run, no block where neither holds

A line whose clause is **in process at G<n>** at a gate the Operator does not approve, **in process, no ledger**, **external: …** or **awaits the go · blocked by …** carries no block, its state clause standing alone; a blocked line at any earlier lifecycle state carries the block that state gives, the blocked clause after the bold state; a line whose clause is none of those listed carries no block; **not in the ordering** is a placement, not a state, so such a line carries the block its state gives. Every bullet that carries a block opens with its id, `O1`, `O2`, … in printing order across the whole page, one sequence, restarting at `O1` on every page printed; a bullet without a block carries no id; the fact suffix's help block, when the clock prints it, takes the next id. An id typed alone after the page is the Operator's word for that block, read as the reply-form rule reads it. The page offers nothing after itself: these blocks are part of the page, printed, never invoked.

**Block 2 — the unnavigated.** After the last destination, under the heading `## Not yet navigated` and, directly under it, its counts line `<p> open items · <q> ready` and a blank line, the open items of `todo/unnavigated/` and `feature/unnavigated/`, in their `ordering.md` position, lines as above.

**Block 3 — the sparks.** Last, the open sparks — `spark/`, `archive/` left out — in the groups the bare `/roadwork-spark` computes (its §0: which sparks could convert into one item together, ordered by readiness). This skill points at that section and restates none of it. The sparks: the script prints the open sparks flat, one bullet each; the session agent groups them as the bare `/roadwork-spark` computes only when any are open. Each group is printed as its kind, its proposed item name and its one-line reason, then one bullet per spark, ``- `spark/<item-name>` · <title> · <assignment>`` — its reference, the title of its `idea.md` verbatim, then its assignment: `assigned to <destination-slug>` when the spark's `idea.md` carries a **Destination** line (the last such line where there are several), `pending assignment` otherwise — read from the spark's own file at the call. The group's ingest invocation is **not** printed: it is an offer after a reply, and this page offers nothing after itself; an idea's bullet carries no block. The assignment is the spark skill's to write (its §4b); this page reads it and writes nothing.

**Block 4 — not yet landed.** After the sparks, under one heading (§3), only when the config key `versioned` is `yes` and `node <inventory>/scripts/unlanded.mjs` prints lines (it prints nothing where there is none, or where `versioned` is not `yes`, so the block is absent and the page keeps its four blocks): the script's lines verbatim, one bullet each, grouped by repository in the order the setting `repos` lists them (unset, `.`, the project's own repository), oldest tip first — `<repo> <branch> — <n> commits, <d> days (tip <date>); last fetch <time>`, ` — waits on <branch>` where the branch directly below in the same repository is itself not landed, `<repo> <branch> — pushed, not landed; last fetch <time>` for a branch pushed and not yet an ancestor of `origin/main`, and the default branch's own line where it is ahead of its upstream. The script reads local refs only and fetches nothing; the page prints its lines with no block under them — the pull-request offer stays `/roadwork-verify-and-archive`'s and `/roadwork-make`'s (the terms table's **Not yet landed** row).

**Sources.** The PRD files and their frontmatter (the `atlas` key among it); `atlases/<atlas-slug>/atlas.md` (the description); `ordering.md`'s group blocks and lines; each item's frontmatter (`road-level` among it), `intent.md` and `spec.md` (their status lines and placeholders); `GATES.md` through `node <unlazy>/scripts/gate-check.mjs --status`; the sparks' `idea.md`. `working.md` is read for nothing — the state comes from the item.

## 1. Keywords — words after the invocation

`/roadwork-inventory <words>` prints the page of §0, narrowed. The words are the runs of text after the invocation separated by spaces, read as typed. Each run is a keyword; a run whose first character is `-` is a **negative keyword**, the rest of the run its word. The leading `-` is the only mark: no quoting, no grouping.

**Read by meaning, against the printed line.** Each keyword is read by the session agent by meaning, never from a fixed vocabulary, against each item line as the page prints it — reference, level, short description, state — and against each idea's bullet (its reference and description). Nothing in the item's files beyond the printed line is read for the filter; a destination's or an atlas's name is not on an item's line, so it matches an item only where the item's own line carries that meaning — the atlas line, like the destination line, is not an item line. The Operator's example: `archive` means the items awaiting verify-and-archive — the state clause **in process, all gates met** — and `-archive` removes them. The mechanics: the session agent reads the keywords by meaning against the bare page's lines, then runs the script once more with `--filtered-by "<words>" --kept "<reading>" --removed "<reading>" --only <token> [<token> …]` — a token an item or spark reference, or `unlanded:<repo>/<branch>` — and prints its output; the script prints the alteration sentence, keeps the named bullets, prints the emptied lines this section names, numbers the ids from `O1` in the filtered order, and prints the counts line, the atlas lines and the destination lines as on the bare page.

**Kept and removed.** An item line is kept when some positive keyword matches it, and removed when any negative keyword matches it; a negative wins over a positive on the same line. With negative keywords only, every line not removed is kept — the whole page less the removed.

**The alteration sentence.** A filtered page prints, between its title and the counts line, one sentence: "Filtered by <the keywords as typed>: kept <what the positives were read to mean>; removed <what the negatives were read to mean>." With no negative keywords the "removed" clause is left out; with no positive keywords the "kept" clause is left out. A keyword that matched nothing is still said in its clause, as it was read.

**Headings and their lines unchanged.** The headings (§3) — `## Not yet landed` too where `node <inventory>/scripts/unlanded.mjs` printed its block, whose lines a keyword is read against as item lines are, each kept or removed the same way — print as the bare call prints them, and so do the lines under each `## Atlas: <atlas-slug>` heading (its description and counts line) and the line under each `### <destination-slug> — <title>` heading, their counts the bare page's. A destination whose work items the filter emptied prints one bullet, **no keyword-filtered items found**; an atlas every one of whose destinations the filter emptied prints that bullet directly under its counts line too, its destinations' headings and lines and their own bullet after it; a destination with no open items before the filter keeps **no open items**; one not yet navigated prints nothing under its line. The work items under no destination yet, emptied, print the same bullet under `## Not yet navigated` and its counts line; the kept work items print their two lines and carry their blocks and ids, numbered from `O1` in the filtered page's printing order.

**The ideas.** Each idea's bullet is kept or removed the same way; a group's line — its kind, proposed item name and reason — stays; a group whose bullets the filter emptied prints **no keyword-filtered items found** indented under it.

**Nothing else changes.** The bare call, with no words, prints the whole page as §0 says. A filtered call writes nothing, offers nothing after itself and re-sorts nothing: the ordering's order and the destinations' priorities hold; the fact suffix follows the page by the clock as on the bare call.

## 2. Hand back

The page, and nothing before it or after it — its first line the title, a filtered page's alteration sentence under it (§1); no offer after the page, the blocks under the work items being part of the page (§0); then the fact suffix, by the clock (the glossary's **Fact suffix** entry), its help block taking the next id. Every offer after a reply that the register gives lives in the skills whose lists this page gathers.

## 3. Headings

The page's headings and their levels — one more where `node <inventory>/scripts/unlanded.mjs` prints lines: `# Inventory — <date>` (the page's title, the machine's local date at the call), then `## Atlas: <atlas-slug>` above each atlas and `### <destination-slug> — <title>` above each of its destinations (the terms table's plain words, an atlas and a destination), `## No atlas` after the last atlas (only where a destination names none), `## Not yet navigated` (the work items under no destination yet), `## Ideas parked for later` (the sparks), `## Not yet landed` (the block `node <inventory>/scripts/unlanded.mjs` fills, last). The bold `Destinations` label and the no-`#` rule of the Operator's word of 2026-10-02 are superseded by the Operator's word of 2026-10-20 (todo/inventory-page-restyled).

## 4. The rendered form

Every line the page prints, exactly as it renders; nothing else is printed. The page opens with its title, `# Inventory — <YYYY-MM-DD>`, the machine's local date at the call, and a blank line; a filtered page prints its alteration sentence (§1) next, between the title and the counts line, plain text, and a blank line after it; then the counts line, `<n> open work items · <a> await interview · <b> intent accepted · <c> await the go · <d> in process · <e> blocked · <f> external`, plain text, and a blank line. Each atlas: the heading `## Atlas: <atlas-slug>`; directly under it the description in italics, `_<description>_` (`_(no description)_` where it is empty); a blank line; the counts line `<n> open destinations · <m> navigated[ · <k> built]`, the built clause only when k is not zero; a blank line; then its destinations; an atlas no open destination names, its heading, description and counts line with nothing under them. Each destination: the heading `### <destination-slug> — <title>`, the title the file's first heading as it reads with a leading `Goal: ` or `Destination: ` stripped; directly under it its line, `<navigated <date> | built, every item archived | not yet navigated> · <p> open items · <q> ready`, plain text, its counts the bare page's whatever the filter; a blank line; then, under a navigated or built destination, its bullets and a blank line after the last; under one not yet navigated, nothing. A work item is two lines: the first ``- **O<k>** `<ref>` · <level> · **<state>**`` where a block follows it, ``- `<ref>` · <level> · <state>[ · not in the ordering]`` otherwise — the reference in code, the level clause left out when empty (§0), the state clause in bold only where a block follows, a blocked line's lifecycle state in bold and its blocked clause plain after it, a blocked clause ``blocked by `<ref>` (<the blocker's state>)`` with the blocker's reference in code, an external clause `external: <text> — <state>` with `<state>` one of `open | cleared | unknown | no status URL`, read from the status URL as §0 says, ` · not in the ordering` last on the line of an item with no place in the ordering; the second line is two spaces then the item file's title, verbatim; a bullet whose next step can run now is followed directly by its fenced block — three lines, the fence, the next-step invocation, or the Operator's word and the invocation together, the fence, each indented two spaces — and the next bullet follows with no blank line. A destination with no open item, the one bullet `- no open items` in the bullets' place; a destination the filter emptied, `- no keyword-filtered items found`; an atlas the filter emptied, the same bullet directly under its counts line. After the atlases: `## No atlas`, only when a destination's `atlas` key is empty or names an atlas that is not open, then a blank line and its destinations as above; `## Not yet navigated`, directly followed by `<p> open items · <q> ready` for the work items under no destination, a blank line, their bullets in the same two-line shape, blocks and ids included (`- no open items` where there is none, the filtered-empty bullet where the filter emptied them), and a blank line; `## Ideas parked for later`, directly followed by each group as a plain line ``<kind>, `<item-name>` — <reason>:`` and one bullet per spark, ``- `spark/<item-name>` · <title> · <assigned to <destination-slug> | pending assignment>``, a blank line between groups; a group the filter emptied, the one bullet `- no keyword-filtered items found`; no open spark, the one bullet `- no open items`; `## Not yet landed`, last and only when `node <inventory>/scripts/unlanded.mjs` prints lines, a blank line before it, directly followed by one bullet per line the script prints, `- ` before the line verbatim, no block under any. One blank line before every `##` and `###` heading; no bold line is a heading. Singulars: `1 open work item`, `1 open destination`, `1 open item`. The separators: ` — ` (an em dash with a space either side) on the title, between a slug and its title on a destination heading, on the ideas' group lines, inside the unlanded lines and before the external clause's state, nowhere else; ` · ` (a middle dot with a space either side) between the fields of every counts line, a destination's line, a work item's first line and an idea's bullet. After the last block, the fact suffix when the clock says so, else nothing: no sentence of the session agent's before or after the page, no note, no aside inside an item line beyond its fields. The example below is the form rendered; a page is printed as it is, with the register's content in place of the example's.

## 5. Example page

````
# Inventory — 2026-03-03

6 open work items · 4 await interview · 0 intent accepted · 0 await the go · 2 in process · 0 blocked · 0 external

## Atlas: harbour-board
_the harbour's works, lit and charted_

2 open destinations · 1 navigated · 1 built

### harbour-lights — the harbour lit by night
navigated 2026-03-02 · 5 open items · 4 ready

- **O1** `todo/lamp-posts-counted` · main · **awaits interview**
  every lamp post on the quay numbered
  ```
  /roadwork-intentify todo/lamp-posts-counted
  ```
- **O2** `todo/quay-lamps-wired` · secondary · **intent drafted, not accepted**
  the quay's lamps wired to the mains
  ```
  /roadwork-intentify todo/quay-lamps-wired
  ```
- `feature/lamp-timer` · secondary · in process at G2 (the timer switches the lamps at dusk)
  the lamps switch on at dusk by a timer
- **O3** `feature/quay-crane-certified` · secondary · **in process at G3 (the Operator's review of the crane's papers)**
  the quay crane certified for the season
  ```
  G3 accepted and /roadwork-verify-and-archive feature/quay-crane-certified
  ```
- **O4** `todo/timer-manual-written` · side · **awaits interview** · blocked by `feature/lamp-timer` (in process at G2 (the timer switches the lamps at dusk))
  the timer's manual written for the keeper
  ```
  /roadwork-intentify todo/timer-manual-written
  ```

### harbour-wall — the harbour wall rebuilt
built, every item archived · 0 open items · 0 ready

- no open items

## No atlas

### tide-tables — the tide tables printed each month
not yet navigated · 0 open items · 0 ready

## Not yet navigated
1 open item · 1 ready

- **O5** `todo/quay-gate-repainted` · **awaits interview**
  the quay gate repainted before winter
  ```
  /roadwork-intentify todo/quay-gate-repainted
  ```

## Ideas parked for later
todo, `bell-at-the-pier-head` — one spark, its round answered:
- `spark/a-bell-at-the-pier-head` · a bell rung at the pier head in fog · pending assignment
````

## Never

Never a write — no file, no line in `ordering.md`, `working.md` or any item; never a re-sort — the order is `ordering.md`'s and the priorities'; never an offer after the page; never a block under a line whose next step cannot run; never a second list beside the page; never a keyword read from a fixed vocabulary; never a state copied from an ordering line, never a line outside the form of §4.

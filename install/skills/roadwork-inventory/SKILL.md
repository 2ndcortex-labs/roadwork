---
name: roadwork-inventory
description: Prints everything open in the road plans on one page, each work item's next step under its line, when the Operator asks what is open.
when_to_use: Use when the user says /roadwork-inventory, "inventory", "what's open", "show me everything", "the whole picture".
argument-hint: "[<words>]"
---

# roadwork-inventory — everything open, on one page

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. This skill shows and does nothing else: one page of everything open in the register, in the order the register itself gives. The **bare call** — `/roadwork-inventory` with nothing after it — prints the whole page; words after it narrow it (§1). It writes nothing: no file, no line in any register file; the page is computed at the call and may differ next time.

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

**Block 4 — not yet landed.** After the sparks, under one heading (§3), only when the config key `versioned` is `yes` and `node <inventory>/scripts/unlanded.mjs` prints lines (it prints nothing where there is none, or where `versioned` is not `yes`, so the block is absent and the page keeps its four blocks): the script's lines verbatim, one bullet each, grouped by repository in the statement of authority's order, oldest tip first — `<repo> <branch> — <n> commits, <d> days (tip <date>); last fetch <time>`, ` — waits on <branch>` where the branch directly below in the same repository is itself not landed, `<repo> <branch> — pushed, not landed; last fetch <time>` for a branch pushed and not yet an ancestor of `origin/main`, and the default branch's own line where it is ahead of its upstream. The script reads local refs only and fetches nothing; the page prints its lines with no block under them — the pull-request offer stays `/roadwork-verify-and-archive`'s and `/roadwork-make`'s (the glossary's **Not yet landed** entry).

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

**Text for the Operator.** In text for the Operator, use the plain words of the terms table — `docs/terms.md` in the register, one row per term: the plain word, the agent's word, the meaning; the agent's words stay in the skill.

## Glossary

- **Roadwork** — the Roadwork system by 2nd Cortex Labs — road plans and the skills that work them.
- **Road plans** — the project's `roadwork/`: the one place its work is recorded. Three **sub-registers**: `todo/` (fixes, chores, decisions, findings), `feature/` (new capabilities), `spark/` (ideas; never worked); the test: a todo is done once, a feature is reused when built — the Operator may name the kind against it.
- **Item** — one folder under its destination's folder in a sub-register (`unnavigated/` until a navigation cites it): `todo.md` or `feature.md` (the **item file**) plus `intent.md`, `plan.md`, `spec.md`; a spark holds only `idea.md`.
- **Home** — the register an item lives in: the project's one register, at the path the project's law names; a clone of a remote, never pushed.
- **Reference (ref)** — `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`; from anywhere, `main/<kind>/<item-name>` — the project's law may alias the prefix.
- **Frontmatter** — the YAML block opening an item file: `blocker`, `blocking`, `blocked-by`, `external`, `group`, `in-process`, `disposition`, `road-level` (the item's level within its destination — `main`, `secondary`, `side` — or empty), a feature's `onroad-cohort` before it.
- **External** — the `external` key: an externality, a dependency that will not be met without something specific and out-of-band happening (Operator, 2026-10-11); an operational pause in the due course — a push, a merge, a fetch, a reboot — is never one. Stated by the spec skill as a fact in the spec's Dependencies section (what, who acts, how observed) — one entry per out-of-band act, never per party or per service — and written on spec acceptance: a `blocked-by` where another item acts, the key's text where another party does, with the item file's dated `**External set**` line; emptied only by the Operator, with the dated `**External cleared**` line; `/roadwork-make` refuses while it is set; its observed-by part run as a test at acceptance and before a make, a command deciding it where one is written, the Operator's word where not; notified where the workspace names an address.
- **`ordering.md`** — the register's loose priority list; top is next. **`working.md`** — the register's dated list of items in process.
- **Operator (user)** — the human owner; every decision is theirs.
- **Session agent** — the agent running the session that invokes the skill.
- **Project scope** — everything at and under the root the project's law names; the paths an item touches are its **Paths:** line.
- **Batch** — the coherent bundle a project's changes ship in as one PR; the register's own commits are local and never a PR.
- **Lifecycle** — `/roadwork-atlas` (three documents into an atlas, above a destination) → `/roadwork-destination` → `/roadwork-nav-to-destination` (a destination into a group) → `/roadwork-ingest` → `/roadwork-intentify` → `/roadwork-specplan` → `/roadwork-make` (the go — the skill or the Operator's word; builds under `/unlazy`) → `/roadwork-verify-and-archive`. Every skill ends by offering the next. Beside the chain, `/roadwork-help` answers and `/roadwork-intent-insights` learns from the day's interviews.
- **PRD** — a product requirements document, `destinations/<destination-slug>.prd.md`, made by `/roadwork-destination` and the source of a group of items made by `/roadwork-nav-to-destination`; cited by path in every derived item.
- **Destination** — two files beside each other in `destinations/`: `<destination-slug>.intent.md`, what is wanted and why in the Operator's words, in the item intent's form, interviewed and written first; and `<destination-slug>.prd.md`, written from it, in a fixed form (a frontmatter block with `bucket-list-priority`, 1–10, 10 the highest, and `atlas`; the destination, a Stack section — the architecture read, the guidebooks drawn on, the changes to their stacks — numbered requirements, Out, Success); its slug categorises the register's items — one destination per item, the group's, written on the item by `/roadwork-nav-to-destination`; both files archived to `destinations/archive/` by hand when built.
- **Map** — one `maps/<destination-slug>.md`: the way to one destination, one map per destination — before agents, process, stack, judgements, inputs — in a fixed form, made by `/roadwork-map`, drawing on guidebooks by copying their relevant parts in (a **Guidebooks:** line names them); named on an item by its **Map:** line, one per item, read by `/roadwork-intentify` and `/roadwork-specplan`; enforced by nothing; retired to `maps/archive/` by hand.
- **Guidebook** — one `guidebooks/<guidebook-slug>.md`: a standardized knowledge base broad in application — standards, stack, vendors, judgements, sources, an Architectures line saying which architectures its stack fits, or none — in a fixed form, made by `/roadwork-guidebook`; names no destination; a map copies its relevant parts in and cites the whole only when the whole applies; never done; retired to `guidebooks/archive/` by hand.
- **Stack** — what a destination is built on: environment, framework, tooling, assets and services; chosen per destination from the guidebooks, carried by the requirements file, the map, the spec and the plan.
- **Atlas** — one `atlases/<atlas-slug>/`: the highest-order thing in the register, above the destination — the Operator's `vision.md`, `intent.md` and `architecture.md`, verbatim, and the skill's `atlas.md`; made by `/roadwork-atlas` from three documents, never interviewed, its destinations suggested in `atlas.md` by the skill and each offered as a destination interview; named by a destination's `atlas` key, one per destination; retired to `atlases/archive/` by hand.
- **Sanity todo** — the todo `/roadwork-nav-to-destination` creates last, `todo/<destination-slug>-sanity`: the group list and the requirement↔item mapping both ways; blocks every other item in the group until the Operator says the group is right.
- **Check types** — the six sanity checks `/roadwork-navsanity` runs over a group: completeness, provenance, shape, dependencies, order, scope.
- **Run** — one pass of `/roadwork-navsanity` over a group: six checks, ten questions, the changes made; recorded as a dated section in the group's sanity todo.
- **Hand-made group** — a group not born of a PRD; its requirements are its members' own claims plus the group's line in `ordering.md`.
- **Cohort** — a subgroup of a group's features that can be built in parallel by sub-agents: the rubric passes on every criterion; named in each member's `onroad-cohort`.
- **Cohortmeister (CM)** — `feature/cm-<group>-<cohort>`: the pseudo-feature that blocks a cohort's members, is onroaded in their place, and whose ledger is the results checker; archives them by cascade.
- **Rubric** — the five pass/fail criteria a subgroup must meet to be a cohort: no dependency edge, disjoint ownership, accepted spec and plan with gates, no external and not in process, self-contained builds.
- **Reconsideration** — `/roadwork-specplan`'s second mode: on an item whose accepted spec and plan already exist, re-read them against everything dated since; a dated `Reconsidered` changelog, proven gates carried, the previous go ended, the spec proposed again.
- **Verification round** — `/roadwork-specplan`'s fresh-eyes check: six predefined questions on the spec, five on the plan, one fresh reader each — run as one workflow where the harness runs workflows, on the top model of the tier one step below the session's (or the session's own where no lower tier exists) at an effort the dispatcher sets, findings in one bounded shape (file, line, one sentence, an empty disposition slot; at most eight; "clean" as none), sub-agents the fallback — findings incorporated or rejected with a reason and recorded in the document by the session agent; one round per document.
- **Not yet landed** — the page's fifth block, printed only where the config key `versioned` is `yes` and `node <inventory>/scripts/unlanded.mjs` prints lines: every branch of the project's repositories not yet an ancestor of `origin/main`, from local refs, one line each in the script's form; the page lists, the two acting skills offer (`/roadwork-verify-and-archive` §2, `/roadwork-make` §4).
- **Inventory** — the one page `/roadwork-inventory` prints: the open destinations by priority, each with its open items in the ordering's position and one state clause; the unnavigated after them; the sparks last in the bare `/roadwork-spark`'s groups; with words after it, the item lines narrowed to the keywords' matches by meaning, the alteration said first on the page; each work item's next step offered inline under its line, nothing offered after the page; read live, nothing written.
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never runs; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, the last part of its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names its slugs by their bearer — `<destination-slug>`, `<map-slug>`, `<guidebook-slug>`, `<atlas-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs. Before such an offer, each concern or gate its word answers is restated simply right above it — one bullet, the question in plain words, the options with the recommended one first and its reason, two sentences at most; a gate's bullet says what is approved and where it was shown (Operator, 2026-10-14). Every offer printed as a block carries an id, `O1`, `O2`, … in printing order, in bold at the start of its sentence; the id typed alone is the Operator's word for that offer, read as the whole block, recorded in full with the id after it; nothing changes where the offers go through the question tool (Operator, 2026-10-15). Where typing it makes or changes something, the sentence carries, in parentheses right after the thing acted on, what is to be accomplished — the change or the product itself, as what will exist or be said afterwards, a few words opening "to", specific to the item where the item is known, never a sentence, never the skill's definition, never the reason, the gate, the authority or the item — "runs the map skill on the-lifecycle (to rename its Assets and tools section to Stack)"; a directive phrase the same; a bare listing or a help call, which leaves nothing behind, carries none; the Gate id entry's parenthetical says what a thing is, this one what a run accomplishes (Operator, 2026-10-07).
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

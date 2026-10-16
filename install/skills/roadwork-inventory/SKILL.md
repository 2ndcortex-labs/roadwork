---
name: roadwork-inventory
description: Prints one page of everything open in the road plans, in the ordering's order — the open destinations by bucket-list-priority, each with its open todos and features in their ordering.md position and one state clause each; the unnavigated items after the last destination under one heading; the open sparks last, in the groups the bare /roadwork-spark computes. Read live at the call; words after the invocation narrow the page's item lines to the keywords' matches, a leading `-` removing; writes nothing, offers nothing. Use when the user says /roadwork-inventory, "inventory", "what's open", "show me everything", "the whole picture".
---

# roadwork-inventory — everything open, on one page

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. This skill shows and does nothing else: one page of everything open in the register, in the order the register itself gives. The **bare call** — `/roadwork-inventory` with nothing after it — prints the whole page; words after it narrow it (§1). It writes nothing: no file, no line in any register file; the page is computed at the call and may differ next time.

## 0. The page — four blocks, in this order

Read the register live — never from memory — and print the four blocks under the terms table's plain words as headings (§3). Nothing is re-sorted here: the order is `ordering.md`'s and the destinations' own priorities.

**Block 1 — the destinations.** The open destinations: every `destinations/<destination-slug>.prd.md`, `destinations/archive/` left out. Order: `bucket-list-priority` from each file's frontmatter, highest first; equal priorities keep the order of their group blocks in `ordering.md`, then the slug; a destination whose file carries no priority comes after every one that does, by slug. One line each:

`<destination-slug> — <title, from the file's first heading> — <navigation state>`

The navigation state is the test the bare `/roadwork-destination` applies (its §0): **navigated <date>** when a group block in `ordering.md` cites the destination (the date the block's name carries); **not yet navigated** otherwise. No priority number is printed — the order shows it.

**Under each destination, its items.** The open items (empty `disposition` in the frontmatter) of `todo/<destination-slug>/` and `feature/<destination-slug>/`, in their position within the destination's group block in `ordering.md`. One line each, indented under the destination:

`<ref> — <level> — <short description> — <state>`

- `<ref>` in the reference form of the conventions (`todo/<item-name>`, `feature/<item-name>`).
- `<level>`: the item's frontmatter `road-level` — `main`, `secondary` or `side` — read from the item's own file at the call, never from an ordering line; empty (an item under no goal yet, until navigated), the clause is left out and the line reads `<ref> — <short description> — <state>`.
- `<short description>`: one clause in the session agent's own words, read from the item file's title and notes — never the ordering line's reason re-quoted, never the notes re-quoted.
- `<state>`: one clause, re-derived from the item's own files at the call, never copied from `ordering.md` or `working.md`. The first of these that holds:
  1. **in process at G<n>** — `in-process` set; `<n>` the first unmet gate by `gate-check --status` on the item's `GATES.md`; **in process, all gates met** when none is unmet;
  2. **external: <text>** — `external` set;
  3. **blocked by <ref>** — a `blocked-by` entry whose ledger is not all met, the test `/roadwork-make` §0 applies;
  4. the lifecycle state by the placeholder tests the lifecycle skills use — **awaits interview** (a placeholder `intent.md`), **intent accepted** (an accepted intent, a placeholder `spec.md`), **awaits the go** (an accepted spec).

An item in process is shown in place under its destination, not pulled out. An open item with no line in `ordering.md` prints last in its block with the clause **not in the ordering**. A destination navigated but with no open item prints one indented line, **no open items**; one not yet navigated prints nothing under it.

**Block 2 — the unnavigated.** After the last destination, under one heading, the open items of `todo/unnavigated/` and `feature/unnavigated/`, in their `ordering.md` position, lines as above.

**Block 3 — the sparks.** Last, the open sparks — `spark/`, `archive/` left out — in the groups the bare `/roadwork-spark` computes (its §0: which sparks could convert into one item together, ordered by readiness). This skill points at that section and restates none of it. Each group is printed as its kind, its proposed item name and its one-line reason, then one bullet per spark — its reference and a short description in the session agent's words, then its assignment: `assigned to <destination-slug>` when the spark's `idea.md` carries a **Destination** line (the last such line where there are several), `pending assignment` otherwise — read from the spark's own file at the call. The group's ingest invocation is **not** printed: it is an offer, and this page offers nothing. The assignment is the spark skill's to write (its §4b); this page reads it and writes nothing.

**Sources.** The PRD files and their frontmatter; `ordering.md`'s group blocks and lines; each item's frontmatter (`road-level` among it), `intent.md` and `spec.md` (their status lines and placeholders); `GATES.md` through `node <unlazy>/scripts/gate-check.mjs --status`; the sparks' `idea.md`. `working.md` is read for nothing — the state comes from the item.

## 1. Keywords — words after the invocation

`/roadwork-inventory <words>` prints the page of §0, narrowed. The words are the runs of text after the invocation separated by spaces, read as typed. Each run is a keyword; a run whose first character is `-` is a **negative keyword**, the rest of the run its word. The leading `-` is the only mark: no quoting, no grouping.

**Read by meaning, against the printed line.** Each keyword is read by the session agent by meaning, never from a fixed vocabulary, against each item line as the page prints it — reference, level, short description, state — and against each idea's bullet (its reference and description). Nothing in the item's files beyond the printed line is read for the filter; a goal's name is not on an item's line, so it matches an item only where the item's own line carries that meaning. The Operator's example: `archive` means the items awaiting verify-and-archive — the state clause **in process, all gates met** — and `-archive` removes them.

**Kept and removed.** An item line is kept when some positive keyword matches it, and removed when any negative keyword matches it; a negative wins over a positive on the same line. With negative keywords only, every line not removed is kept — the whole page less the removed.

**The alteration sentence.** A filtered page opens, before the first heading, with one sentence: "Filtered by <the keywords as typed>: kept <what the positives were read to mean>; removed <what the negatives were read to mean>." With no negative keywords the "removed" clause is left out; with no positive keywords the "kept" clause is left out. A keyword that matched nothing is still said in its clause, as it was read.

**Headings and goal lines unchanged.** The four headings (§3) and every goal's line print as the bare call prints them. A goal whose item lines the filter emptied prints one indented line, **no keyword-filtered items found**; a goal with no open items before the filter keeps **no open items**; a goal not yet navigated prints nothing under it. The work items under no goal yet, emptied, print the same new line under their heading.

**The ideas.** Each idea's bullet is kept or removed the same way; a group's line — its kind, proposed item name and reason — stays; a group whose bullets the filter emptied prints **no keyword-filtered items found** indented under it.

**Nothing else changes.** The bare call, with no words, prints the whole page as §0 says. A filtered call writes nothing, offers nothing and re-sorts nothing: the ordering's order and the goals' priorities hold; the fact suffix follows the page by the clock as on the bare call.

## 2. Hand back

The page, and nothing before it or after it — a filtered page's first line is the alteration sentence (§1); no offer of any kind; then the fact suffix, by the clock (the glossary's **Fact suffix** entry). Every offer the register gives lives in the skills whose lists this page gathers.

## 3. Headings

The four blocks' headings: **Destinations** (the Operator's word for the first block, 2026-10-02), then the terms table's plain words — **Work items** under each goal, **Work items under no goal yet** (the unnavigated), **Ideas parked for later** (the sparks).

## Never

Never a write — no file, no line in `ordering.md`, `working.md` or any item; never a re-sort — the order is `ordering.md`'s and the priorities'; never an offer; never a second list beside the page; never a keyword read from a fixed vocabulary; never a state copied from an ordering line.

**Text for the Operator.** In text for the Operator, use the plain words of the terms table — `docs/terms.md` in the register, one row per term: the plain word, the agent's word, the meaning; the agent's words stay in the skill.

## Glossary

- **Roadwork** — the Roadwork system by 2nd Cortex Labs — road plans and the skills that work them.
- **Road plans** — the project's `roadwork/`: the one place its work is recorded. Three **sub-registers**: `todo/` (fixes, chores, decisions, findings), `feature/` (new capabilities), `spark/` (ideas; never worked); the test: a todo is done once, a feature is reused when built — the Operator may name the kind against it.
- **Item** — one folder under its destination's folder in a sub-register (`unnavigated/` until a navigation cites it): `todo.md` or `feature.md` (the **item file**) plus `intent.md`, `plan.md`, `spec.md`; a spark holds only `idea.md`.
- **Home** — the register an item lives in: the project's one register, at the path the project's law names; a clone of a remote, fetched and merged, never pushed.
- **Reference (ref)** — `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`; from anywhere, `main/<kind>/<item-name>` — the project's law may alias the prefix.
- **Frontmatter** — the YAML block opening an item file: `blocker`, `blocking`, `blocked-by`, `external`, `group`, `in-process`, `disposition`, `road-level` (the item's level within its destination — `main`, `secondary`, `side` — or empty), a feature's `onroad-cohort` before it.
- **`ordering.md`** — the register's loose priority list; top is next. **`working.md`** — the register's dated list of items in process.
- **Operator (user)** — the human owner; every decision is theirs.
- **Session agent** — the agent running the session that invokes the skill.
- **Project scope** — everything at and under the root the project's law names; the paths an item touches are its **Paths:** line.
- **Batch** — the coherent bundle a project's changes ship in as one PR; the register's own commits are local and never a PR.
- **Lifecycle** — `/roadwork-destination` → `/roadwork-nav-to-destination` (a destination into a group) → `/roadwork-ingest` → `/roadwork-intentify` → `/roadwork-specplan` → `/roadwork-make` (the only go; builds under `/unlazy`) → `/roadwork-verify-and-archive`. Every skill ends by offering the next. Beside the chain, `/roadwork-help` answers.
- **PRD** — a product requirements document, `destinations/<destination-slug>.prd.md`, made by `/roadwork-destination` and the source of a group of items made by `/roadwork-nav-to-destination`; cited by path in every derived item.
- **Destination** — one `destinations/<destination-slug>.prd.md`: what is wanted, in a fixed form (a frontmatter block with `bucket-list-priority`, 1–10, 10 the highest; the destination, numbered requirements, Out, Success); its slug categorises the register's items — one destination per item, the group's, written on the item by `/roadwork-nav-to-destination`; archived to `destinations/archive/` by hand when built.
- **Map** — one `maps/<destination-slug>.md`: the way to one destination, one map per destination — before agents, process, assets and tools, judgements, inputs — in a fixed form, made by `/roadwork-map`, drawing on guidebooks by copying their relevant parts in (a **Guidebooks:** line names them); named on an item by its **Map:** line, one per item, read by `/roadwork-intentify` and `/roadwork-specplan`; enforced by nothing; retired to `maps/archive/` by hand.
- **Guidebook** — one `guidebooks/<guidebook-slug>.md`: a standardized knowledge base broad in application — standards, preferred tooling, vendors, judgements, sources — in a fixed form, made by `/roadwork-guidebook`; names no destination; a map copies its relevant parts in and cites the whole only when the whole applies; never done; retired to `guidebooks/archive/` by hand.
- **Sanity todo** — the todo `/roadwork-nav-to-destination` creates last, `todo/<destination-slug>-sanity`: the group list and the requirement↔item mapping both ways; blocks every other item in the group until the Operator says the group is right.
- **Check types** — the six sanity checks `/roadwork-navsanity` runs over a group: completeness, provenance, shape, dependencies, order, scope.
- **Run** — one pass of `/roadwork-navsanity` over a group: six checks, ten questions, the changes made; recorded as a dated section in the group's sanity todo.
- **Hand-made group** — a group not born of a PRD; its requirements are its members' own claims plus the group's line in `ordering.md`.
- **Cohort** — a subgroup of a group's features that can be built in parallel by sub-agents: the rubric passes on every criterion; named in each member's `onroad-cohort`.
- **Cohortmeister (CM)** — `feature/cm-<group>-<cohort>`: the pseudo-feature that blocks a cohort's members, is onroaded in their place, and whose ledger is the results checker; archives them by cascade.
- **Rubric** — the five pass/fail criteria a subgroup must meet to be a cohort: no dependency edge, disjoint ownership, accepted spec and plan with gates, no external and not in process, self-contained builds.
- **Reconsideration** — `/roadwork-specplan`'s second mode: on an item whose accepted spec and plan already exist, re-read them against everything dated since; a dated `Reconsidered` changelog, proven gates carried, the previous go ended, the spec proposed again.
- **Verification round** — `/roadwork-specplan`'s fresh-eyes check: five predefined questions on the spec, five on the plan, one fresh reader each — run as one workflow where the harness runs workflows, on the top model of the tier one step below the session's (or the session's own where no lower tier exists) at an effort the dispatcher sets, findings in one bounded shape (file, line, one sentence, an empty disposition slot; at most eight; "clean" as none), sub-agents the fallback — findings incorporated or rejected with a reason and recorded in the document by the session agent; one round per document.
- **Inventory** — the one page `/roadwork-inventory` prints: the open destinations by priority, each with its open items in the ordering's position and one state clause; the unnavigated after them; the sparks last in the bare `/roadwork-spark`'s groups; with words after it, the item lines narrowed to the keywords' matches by meaning, the alteration said first on the page; read live, nothing written, nothing offered.
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never invocations; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, and its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names one, a destination's `<destination-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a lifecycle skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs. Where typing it makes or changes something, the sentence carries, in parentheses right after the thing acted on, what is to be accomplished — the change or the product itself, as what will exist or be said afterwards, a few words opening "to", specific to the item where the item is known, never a sentence, never the skill's definition, never the reason, the gate, the authority or the item — "runs the map skill on the-lifecycle (to rename its Tools section to Assets and tools)"; a directive phrase the same; a bare listing or a help call, which leaves nothing behind, carries none; the Gate id entry's parenthetical says what a thing is, this one what a run accomplishes (Operator, 2026-10-07).
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadmap system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

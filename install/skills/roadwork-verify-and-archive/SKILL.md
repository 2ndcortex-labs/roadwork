---
name: roadwork-verify-and-archive
description: Verifies one built item against its gates and landing and archives it on the Operator's word.
when_to_use: Use when the user says /roadwork-verify-and-archive <ref>, "archive <item>", "done with <item>", "ship it" for an item.
argument-hint: <ref> [&& <ref> …]
---

# roadwork-verify-and-archive — verify and archive one item

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. Takes **one**
reference (`todo/<item-name>`, `feature/<item-name>`, `main/<kind>/<item-name>`)
— or a **batch** of them, `<ref> && <ref>` (roadwork
register rule) — and acts in the register. **Started or
not, built or not** — an item with no `working.md` entry, no `GATES.md`,
a half-met ledger, or one that only apparently was built may be archived on
the Operator's word: "make sure /roadwork-verify-and-archive allows the operator to archive an
item never (apparently or otherwise) built" (Operator, 2026-09-10). The
`disposition` key records how. Never `spark/`: a spark converts through
`/roadwork-ingest`, which moves it. A **cohort member** whose cohortmeister
is open is not archived alone — offer `/roadwork-verify-and-archive <CM>` instead.

## 1. Evaluate — findings, not decisions

Read the item folder whole. Produce a numbered list of findings:

- **Concerns:** every area of concern in `spec.md` not marked resolved,
  and every open question in `intent.md` or `spec.md` still open.
- **Gates:** every gate in `GATES.md` not met or abandoned, from
  `gate-check --status` (never from the checkboxes alone); if no
  `GATES.md` exists, say the item was never built here. A review gate accepted on the invocation's line (`G<n> accepted and …`) is recorded met in `GATES.md` first, its EVIDENCE the Operator's word, dated.
- **Landing:** for every tracked change the item names (branch commits at
  any path it names), fetch that path's `origin/main` and test
  `git merge-base --is-ancestor <commit> origin/main`. Report each as
  landed, not landed, or **unverified** when the fetch failed — a check
  that did not run is not a check that passed; never report "landed"
  without the fetch.
- **Unlanded branch:** where the config key `versioned` is `yes`, for every tracked branch the item names, the line `node <inventory>/scripts/unlanded.mjs` `--repo <name> --branch <branch>` prints when it prints one that is not `pushed, not landed` — a branch with no upstream or ahead of it and not an ancestor of `origin/main`; the script reads local refs and fetches nothing, so this finding stands beside Landing, never in its place.
- **Dependents:** every item in the register whose `blocked-by` names this
  one, and whether archiving would unblock it.
- **Externalities:** for an item whose `external` is set, one finding per entry the key names with the status read's answer for it (the rule's section "Externalities and their notices"): cleared, open, unmatched, unknown or no status URL; an entry cleared on the item gets none; a finding is put to the Operator as every finding is; this skill clears nothing and posts nothing.

## 2. Interview — the Operator makes the call

**A batch:** one evaluation across the items (§1 per item); one combined round
with the findings numbered per item (`<item>.<n>`); the Operator's answers
cover every item — an item answered "do not archive" (or named as excluded)
stays open and in process; §3 then archives every covered item in
one archiving act, and §4 offers once.

Before asking, append `**Archive interview (<date>):**` to the item file
with the findings of §1 in bullets — the section marks the item "archiving
open" for the back offers until the disposition is written. Put each finding to the Operator as one numbered question with your
recommendation (archive as is / archive with the shortfall recorded / wait
for landing / do not archive), in the roadwork-intentify round form, closed as `/roadwork-intentify` §2 closes a round, and **wait**.
Ask for the disposition if the Operator has not said it: `shipped`,
`withdrawn`, `superseded by <ref>`, `decided`, or `abandoned` (work
started or claimed but not carried through — the shortfall is recorded,
not hidden). The round closes with two blocks in this order — `archive, <disposition>`, the recommended disposition, every finding's recommendation taken; `archive, <disposition> except:`, the same, the findings that differ listed after the colon, per item in a batch (`<item>.<n>`) — then one block per other disposition the findings allow, the word alone; the word is the archive's, the act follows it. Directly above the first block, each finding the word answers is restated simply (reply-form rule). Where §1 found an **Unlanded branch**, the last block printed — after the archive blocks and every other offer, each with an O-number; a git-related offer is always the last in the list (Operator, 2026-10-15) — is the pull-request offer, `open the pull request for <repo> <branch>`, one block per such branch, the Operator's word for one merge handshake on it (`nethub/docs/merge-handshake.md`); a branch `node <inventory>/scripts/unlanded.mjs` printed as `pushed, not landed` gets no offer, its pull request presumed open; the Operator's word still archives, the dispositions unchanged. A disposition typed with the invocation (`archive, shipped` and the reference) is the round's answer. Do not archive on silence.

## 3. Archive — one act, on the Operator's word

- Item file: status line "archived <date> — <disposition>: <resolution in
  one or two sentences, the Operator's words where they decided>";
  unresolved findings the Operator chose to archive over — unmet gates, an
  unbuilt plan, unverified landing — are listed there, dated.
- Frontmatter: `in-process: ""`; `disposition: "<shipped | withdrawn |
  superseded by <ref> | decided | abandoned>"` — the only writer of this
  key.
- Move the folder whole into its destination folder's `archive/`, the sibling of its items.
- `ordering.md`: strike the item's line; a group block left empty is
  struck with it; re-derive the one-clause reason of every line that
  named the archived item or whose state it changed (reason upkeep is part
  of this act — Operator, 2026-09-10, from roadwork-sanity's first run).
- `working.md`: remove the item's line if present.
- Every item in the register whose `blocked-by` names this one: remove the
  reference, re-derive `blocker` on this item's former blockers if any,
  and say which items became unblocked.
- **A cohortmeister archives by cascade:** every member still in its
  `blocking` archives with it in the same act — `shipped` where the
  member's ledger is ALL MET (its folder to `archive/`, its lines struck,
  its `onroad-cohort` kept as the record of how it was built), the CM
  itself `decided`; a member not ALL MET is not archived but reverted (see
  `/roadwork-make` §3b) and reported.
- **Shipped specs graduate.** An item archived `shipped` has its `spec.md`
  copied whole into the register's `docs/context/<item-name>.md`, under one
  added first line and a blank line:
  `_Decision record: <ref>, graduated <date>, disposition shipped; the item's spec.md verbatim below._`
  Verbatim — the verification rounds with it. The skill judges nothing; it
  applies one test: a `spec.md` carrying a line that begins `_Not yet
  specified` is a placeholder and graduates nothing. No other disposition
  graduates, and item names are never reused, so a record is never
  overwritten. The copy rides the same commit as the rest of the act.
- Commit in the register (its commits local). No PR.

## 4. Offer the next step — ordering- and group-aware

Read the home's `ordering.md` top to bottom — its blocks placed by `bucket-list-priority` and its items by `road-level` (the navigation's §5), so nothing is re-sorted here. Candidates are open items
not in process whose `blocked-by` is empty or names only built items
(all gates met) and whose `external` is empty. Offer, as one invocation in its own code block, preceded by its sentence (offer form):

1. the top-most candidate in the archived item's group(s), if any;
2. else the top-most candidate overall;

with the skill that item is ready for (an item with a non-empty
`disposition` is archived and never a candidate): placeholder `intent.md` →
`/roadwork-intentify <ref>`; accepted intent and placeholder spec →
`/roadwork-specplan <ref>`; accepted spec → `/roadwork-make <ref>`; already in process
→ `/roadwork-verify-and-archive <ref>` when its gates are met. Say why the top of the list
was skipped when it was. Offer only — never invoke.
End with the back offers as `/roadwork-ingest` §5b computes them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never archive without the Operator's word; never touch `spark/`; never
report landing without a completed fetch; never strike an ordering line
for an item that stays open; never invoke the next skill.

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
- **Pull-request offer** — the typed phrase `open the pull request for <repo> <branch>`, offered last in the round — the git-related offer always last (Operator, 2026-10-15) — where `node <inventory>/scripts/unlanded.mjs` prints an unlanded line for a tracked branch and the config key `versioned` is `yes`; typing it is the Operator's word for one merge handshake on that branch; the skill offers it, never runs it unasked.
- **Finding** — one evaluated fact (a concern, an unmet gate, a landing state, a dependent) put to the Operator as a question. **Landing** — a tracked commit is an ancestor of the repo's just-fetched `origin/main`; **unverified** when the fetch failed.
- **Disposition** — how an item was archived: `shipped`, `withdrawn`, `superseded by <ref>`, `decided`, `abandoned`. **The six-place act** — status line, frontmatter, move to `archive/`, `ordering.md`, `working.md`, dependents.
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
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never runs; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, the last part of its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names its slugs by their bearer — `<destination-slug>`, `<map-slug>`, `<guidebook-slug>`, `<atlas-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs. Before such an offer, each concern or gate its word answers is restated simply right above it — one bullet, the question in plain words, the options with the recommended one first and its reason, two sentences at most; a gate's bullet says what is approved and where it was shown (Operator, 2026-10-14). Every offer printed as a block carries an id, `O1`, `O2`, … in printing order, in bold at the start of its sentence; the id typed alone is the Operator's word for that offer, read as the whole block, recorded in full with the id after it; nothing changes where the offers go through the question tool (Operator, 2026-10-15). Where typing it makes or changes something, the sentence carries, in parentheses right after the thing acted on, what is to be accomplished — the change or the product itself, as what will exist or be said afterwards, a few words opening "to", specific to the item where the item is known, never a sentence, never the skill's definition, never the reason, the gate, the authority or the item — "runs the map skill on the-lifecycle (to rename its Assets and tools section to Stack)"; a directive phrase the same; a bare listing or a help call, which leaves nothing behind, carries none; the Gate id entry's parenthetical says what a thing is, this one what a run accomplishes (Operator, 2026-10-07).
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

---
name: roadwork-subagentifygroup
description: Finds the cohorts in a group of features that sub-agents can build in parallel and files their cohortmeisters.
when_to_use: Use when the user says /roadwork-subagentifygroup <group>, "which of these can run in parallel", "cohort this group".
argument-hint: <group>
---

# roadwork-subagentifygroup — cohorts, the cohortmeister, a group built in parallel

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the Cohorts
bullet). Takes one group name. Features only — "scope to features not
todos". Output: cohorts named in the members' `onroad-cohort`, one
cohortmeister (CM) per cohort with its intent, spec and plan written
"with subagent ops in mind including results checker", and the group's
block re-ordered "with sa cohorts last" (Operator, 2026-09-11). Sub-agents
are "1 per cohort member". This skill never builds.

## 0. Resolve

A batch (`ref && ref`) is refused here: one group at a time.

Every **feature** member of the group in the register by the `group` key;
todos are ignored. Read each member's `feature.md`, `intent.md`,
`spec.md`, `plan.md`, and the group's block in `ordering.md`.

## 1. The rubric — score every candidate subgroup

A subgroup is a cohort only if **every** criterion passes; score each
pass/fail with the evidence:

1. **No dependency edge** between any two members, in either direction,
   including through an open item outside the subgroup (`blocking` /
   `blocked-by`, and the plans' "needs").
2. **Disjoint file ownership:** the union of paths each member's
   `plan.md` touches, across every path, does not overlap.
3. **Accepted spec and plan with gates:** each member's `spec.md` and
   `plan.md` read accepted and the plan's Gates section is non-empty.
4. **Free:** no member has a non-empty `external` or `in-process`.
5. **Self-contained:** no member's gates read another member's output.

Take the maximal passing subgroups as cohorts (largest first; a member
in no passing subgroup of two or more stays sequential; a cohort of one
is not a cohort).

## 2. Read back — once

One message: the proposed cohorts with their scores; the members left
sequential and the criterion that failed; the resulting order of the
block; the two questions — anything to add? any comments? Wait once.

## 3. File the cohortmeisters

For each cohort, `feature/cm-<group>-<cohort>` in the ingest form
(`/roadwork-ingest` §3 by reference): notes = the member references
verbatim; status "pseudo-feature — conducts the cohort's parallel
build"; the filer's reading; frontmatter `blocker: yes`, `blocking` =
every member, `blocked-by` = the union of the members' blockers,
`group` the same, `onroad-cohort: "<cohort>"`. Then write, yourself:

- `intent.md` — three lines: build these members in parallel; check the
  results as one; archive them together.
- `spec.md` — the **results checker**'s requirements: re-verify every
  member's ledger; the members' interfaces match the contract; no member
  wrote outside its ownership; every lease released; the Operator's
  review of consequential manual outcomes. Status: proposed — the
  Operator accepts it before the CM is onroaded.
- `plan.md` — unlazy's orchestrated `PLAN.md` form: **Contract**
  (interfaces between members; Ownership = each member's path set;
  Dependencies none; Host launch mode = Claude background Agents; Wave
  policy = one wave, one sub-agent per member, concurrency = the cohort size, capped at the host's limit, later
  waves in order; Toolchain; Conventions; Manual review = the Operator); the contract
  inventory; the tree (one leaf per member, ledger
  `gates/leaf-<member>.md`, a copy of that member's `GATES.md` made at
  the go; the CM itself the root, its node ledger the scope's
  `GATES.md`); the **leaf dispatch table** (Owns =
  the member's paths, Needs -, Tier from the member's spec, Planned
  wave 1, State READY); the **Gates** = the node ledger (N1 re-verify
  every member under the approvals' shell, N2 interfaces, N3 ownership audit, N4 leases released,
  N5 the Operator's review); a **Revert** section: a failed member
  reverts to standalone with the dated note sending it through
  `/roadwork-specplan` again — the run resumes through its existing
  ledger, never a restart.

Write the cohort's name into each member's `onroad-cohort` and the CM's
reference into each member's `blocked-by`.

The item file carries its `**Paths:**` line as `/roadwork-ingest` §3 gives it, when the source names paths.

## 4. Re-order the block

In the register's `ordering.md`: the sequential members first, in
their existing order; then each cohort as its CM's line with the members
indented beneath it — cohorts last. Reasons re-derived on every moved
line.

## 5. Commit and hand back

Commit in the register (its commits local). Reply with: the cohorts and their members; the sequential
members and why; the CMs filed; the block's new order. End with the
offer, one invocation in its own code block, preceded by its sentence (offer form), never invoked: the Operator's acceptance of each CM's
`spec.md`, then `/roadwork-make <CM>` (or `/roadwork-navsanity
<group>` first, which now checks cohorts). Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

The specs this skill writes follow `/roadwork-specplan` §0a — the
Operator's spec-writing guidelines — and get its verification rounds.

## Never

Never todos; never a cohort of one; never a member in process or with an
external; never a cohort across homes; never build or onroad anything;
never declare a cohort without the read-back; never delete or archive.

**Text for the Operator.** In text for the Operator, use the plain words of the terms table — `docs/terms.md` in the register, one row per term: the plain word, the agent's word, the meaning; the agent's words stay in the skill.

## Glossary

- **Roadwork** — the Roadwork system by 2nd Cortex Labs — road plans and the skills that work them.
- **Road plans** — the project's `roadwork/`: the one place its work is recorded. Three **sub-registers**: `todo/` (fixes, chores, decisions, findings), `feature/` (new capabilities), `spark/` (ideas; never worked); the test: a todo is done once, a feature is reused when built — the Operator may name the kind against it.
- **Item** — one folder under its destination's folder in a sub-register (`unnavigated/` until a navigation cites it): `todo.md` or `feature.md` (the **item file**) plus `intent.md`, `plan.md`, `spec.md`; a spark holds only `idea.md`.
- **Home** — the register an item lives in: the project's one register, at the path the project's law names; a clone of a remote, fetched and merged, never pushed.
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
- **Stack** — what a destination is built on: environment, framework, tooling, assets and services; chosen per destination from the guidebooks, carried by the requirements file, the map, the spec and the plan.
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
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

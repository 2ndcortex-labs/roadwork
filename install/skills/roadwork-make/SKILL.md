---
name: roadwork-make
description: The Operator's go for one road plans item — puts a todo or feature "on the road": refuses while blocked, writes the in-process date and the working.md line, turns the plan's gates into the item's GATES.md, and runs the build under /unlazy against them. With no argument, lists the make-eligible items with their goes. Use when the user says /roadwork-make <ref>, "build <item>", "start <item>", "go on <item>", or /roadwork-make alone for "what can be built now". Never a group, never a spark; a feature needs an accepted spec and plan first.
---

# roadwork-make — put one item in process and build it

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. An accepted spec is
not a go; this skill is. The acceptance may arrive on the invocation's line — `spec accepted and /roadwork-make <ref>` — and is recorded in `spec.md` and `plan.md`, dated, as the Operator's, before §1. It takes **one** reference (`todo/<item-name>`,
`feature/<item-name>`, `main/<kind>/<item-name>`) and
acts in the register. Never a group ("not accept a
group" — Operator, 2026-09-10); never a spark. A **batch** (`<ref> && <ref>`, Roadwork conventions)
is built one after another, item by item, each under its own ledger, with one handoff:
an item §0 refuses is skipped with its reason and the others are still built;
the handoff lists every item with its result — ALL MET, a handoff of unmet
gates, or refused with the reason.

## 0a. The bare call — what can be built now

`/roadwork-make` with no argument builds nothing and writes nothing — no file,
no line in any register; the list is computed at the call and may differ
next time. Read the register and for each open item (empty
`disposition`): its frontmatter, the status line of `spec.md`, `plan.md`,
and `GATES.md` through `gate-check --status` where one exists.

**Make-eligible** means §0 would not refuse it: accepted spec and plan
with gates; `in-process` empty; `external` empty; `blocked-by` empty or
naming only built items (all gates met); not a member of an open cohort
(one whose cohortmeister's `disposition` is empty). A cohortmeister is
eligible when it passes that test itself and every member's spec is
accepted; its members are listed under it, never offered alone.

A todo whose `plan.md` is "not yet scoped" is refused by nothing in §0,
yet it has no gates to list a go under: it is printed among the
ineligible with `/roadwork-specplan <ref>` — or, on the Operator's word,
the one-gate ledger of §2.

Print a count line (`open items: <n>`; a cohortmeister and
each of its members count one each), then the eligible items in
`ordering.md`'s order and groups (the order carries the levels and the priorities; nothing is re-sorted here), a group's members indented under its
line: one bullet each with a short description in the session agent's
words, never the notes re-quoted. Below each, one sentence — "Typing this
puts `<ref>` in process and builds it under its gates:" — and the go in
its own fenced code block (offer form):

```
/roadwork-make <ref>
```

Eligible items whose plans name the same landing (the same batch
in the plan's "lands as" clause, or the register's local commits) combine
into one go — the sentence "Typing this builds these <n> items, one after
another, each under its own ledger: <refs>:" and one block with the
references joined by ` && `. A plan without a "lands as" clause is its
own go, never combined.

Then the **ineligible** open items, one line each with the reason and the
skill they are ready for instead: a blocked item names its blocker and
the blocker's state; an item in process names its first unmet gate; a
built item (in process, every gate met) reads "to be verified and
archived" with `/roadwork-verify-and-archive <ref>`; a feature without an
accepted spec names `/roadwork-intentify <ref>` or `/roadwork-specplan
<ref>` as §0 does; an item with `external` set names what it waits on.

The empty case — no eligible item in any home — prints the counts and
the ineligible lines and nothing else, so the Operator sees why nothing
is ready. §0's refusal conditions are the test; nothing here changes
them.

## 0. Resolve and refuse

Read the item's frontmatter, `spec.md`, `plan.md`, and `GATES.md` if one
exists. Refuse, naming the reason, and stop when:

- `blocked-by` names an item whose `GATES.md` does not show every gate
  met (`gate-check --status`); a blocker that is built — all gates met —
  counts as cleared even if not yet archived. Name each blocker and its
  state.
- `external` is non-empty — say what it names; only the Operator clears
  it (by emptying the key).
- the item is a feature whose `spec.md` or `plan.md` is a placeholder or
  whose spec status is not accepted — "never a feature" without the
  chain; offer `/roadwork-intentify` or `/roadwork-specplan` as the next step instead.
- `in-process` is already set — the item is on the road; say since when
  and offer `/roadwork-verify-and-archive <ref>` or to continue the existing ledger.
- `blocked-by` names a **cohortmeister** (`feature/cm-…`) — the item is a
  cohort member: refuse and offer `/roadwork-make <CM>`; proceed alone
  only when the Operator says so in words (the override — a low-impact
  decision, not recorded), then treat the member as standalone for this
  run.

## 1. Record

In one edit: `in-process: "<today>"` in the frontmatter; a status line
"in process since <today>" in the item file; one line appended to the
register's `working.md` — `- <ref> — since <date>, by <session agent or sub-agent>, at
<first unmet gate id>`. `working.md` is a dated list of what is in
process, not a history: one line per item, removed at archiving.

## 2. Ledger

Copy `plan.md`'s `## Gates` section into `<item>/GATES.md` under an
`OWNS: **` line and a one-sentence `Scope:`; lint it (`node
<unlazy>/scripts/gate-lint.mjs`). A todo whose `plan.md` is "not yet
scoped" may go on the road on a **one-gate ledger** you write now from
the todo's own claim — the observable outcome, a CHECK that fails
without it, a success-only EXPECT — shown in the reply before any work
starts. Never a feature on a one-gate ledger. Commit the ledger with the
record of step 1 (a local commit in the register).

## 3. Build under /unlazy

Run the build exactly as the unlazy skill prescribes against that
`GATES.md`: inspect every oracle before approving (`--approve` only
commands you wrote or understand), run, work each deliverable in the four
passes, `--reverify` returned work, record evidence; an impossible gate is
`ABANDON`ed with a reason, never deleted. Every commit lands where the
plan says (the register locally; the project's batch branch;
never a PR of its own). Update `working.md`'s "at" as gates are met.

## 3b. A cohortmeister's run

When the item is a CM (`feature/cm-<group>-<cohort>`, `onroad-cohort`
set), the build is orchestrated, not solo:

1. Claim the scope `.unlazy/<cm-name>/` at the register's root
   (ignored by git); write `PLAN.md` from the CM's `plan.md` (the PLAN
   form: contract, inventory, tree, leaf dispatch table); one leaf per
   member, the leaf ledger = that member's `GATES.md`, `OWNS:` = the
   member's paths.
2. **Approve before dispatch:** inspect and `--approve` every member
   ledger's oracles yourself; a sub-agent never approves.
3. Claim every leaf's ownership; open one wave; launch **one background
   sub-agent per member** — a narrow brief: the member's folder, its
   `GATES.md`, its `OWNS:`, "build the deliverable in the four passes,
   run the gates, record evidence; never approve, never archive, never
   post anywhere outside the workspace, never write outside your paths" — record every
   handle; seal the wave; wait.
4. Parent-verify each returned leaf with `--reverify`; release its lease.
5. Run the CM's **node ledger** (re-verify every member; interfaces;
   ownership audit; leases released; the Operator's manual review).
6. **Partial or failed:** each member whose ledger is not ALL MET
   **reverts to standalone** — clear its `onroad-cohort`, remove it from
   the CM's `blocking` and the CM from its `blocked-by`, release its
   lease, and append a dated note to its `feature.md`, `spec.md` and
   `plan.md`: "onroaded <date> as part of cohort <cohort> (CM <ref>) and
   failed at <gate ids>; run `/roadwork-specplan` again (reconsideration)".
   Met members stay with the CM; the CM stays in process with a handoff.
   ALL MET on the node ledger ends with the offer `/roadwork-verify-and-archive <CM>`.

## 4. Hand back

- **ALL MET:** say so with the measured count, name where the commits
  sit, and end with the offer — `/roadwork-verify-and-archive <ref>` — one invocation in its own code block, preceded by its sentence (offer form), never
  invoked.
- **Anything else** (unmet, abandoned, awaiting an owner decision): a
  handoff — the unmet and abandoned ids, what each needs, and who decides. Where a review gate names a demo, the demo is printed whole and verbatim, before the offer (reply-form rule).
  Offer nothing else; the item stays in process. Where the only unmet gates are the Operator's review gates, the one offer is `G<n> accepted and /roadwork-verify-and-archive <ref>` — several gates as `G<n> and G<m> accepted` — the acceptance recorded in the ledger as the Operator's, dated, before the archive skill runs.

Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never a group; never a spark; never a feature without an accepted spec
and plan; never archive an item (that is `/roadwork-verify-and-archive`); never open a PR; never
treat "spec accepted" as the go — the Operator's `/roadwork-make` or word is.

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
- **The go** — the Operator's authorisation to build: this skill or their word. **Blocked** — `blocked-by` names an item whose ledger is not all met, or `external` is non-empty.
- **Ledger / `GATES.md`** — the item's gates in unlazy form, in the item folder. **One-gate ledger** — the minimal ledger a todo may run on. **Handoff** — the hand-back when any gate is unmet or abandoned.
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
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never invocations; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, and its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names one, a destination's `<destination-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a lifecycle skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs. Where typing it makes or changes something, the sentence carries, in parentheses right after the thing acted on, what is to be accomplished — the change or the product itself, as what will exist or be said afterwards, a few words opening "to", specific to the item where the item is known, never a sentence, never the skill's definition, never the reason, the gate, the authority or the item — "runs the map skill on the-lifecycle (to rename its Tools section to Assets and tools)"; a directive phrase the same; a bare listing or a help call, which leaves nothing behind, carries none; the Gate id entry's parenthetical says what a thing is, this one what a run accomplishes (Operator, 2026-10-07).
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadmap system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

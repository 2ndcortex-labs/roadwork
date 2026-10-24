---
name: roadwork-navsanity
description: Runs six sanity checks over one group and fixes what the Operator agrees to.
when_to_use: Use when the user says /roadwork-navsanity <group>, "sanity-check this group", "is this group right".
argument-hint: <group>
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

# roadwork-navsanity — the thorough check of a group

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the Destinations
bullet). Takes one group name. Runs on any group — born of a destination by
`/roadwork-nav-to-destination` or hand-made. "Sanity skill should be Thorough" (Operator,
2026-09-10): every file, never a sample; report what is clean as well as
what is wrong. Every re-write is a proposal until the Operator says so;
"should not delete items only amend or add".

## 0. Resolve the group

A batch (`ref && ref`) is refused here: one group at a time.

Find every member in the register by the `group` key. Find the source: the destination path the
members cite (`destinations/<destination-slug>.prd.md`), else "hand-made: the members' own claims plus the group's
line in `ordering.md`". Refuse a group with no members, naming it.

## 1. Ensure the sanity todo

If `todo/<group>-sanity` does not exist in the owning home, file it
through `/roadwork-ingest` (notes = the group list): the group list with kinds
and homes, the requirement → item and item → source mappings, the
checklist. A hand-made group's sanity todo blocks only members **not yet
in process** (`in-process` empty); a destination's group blocks every member
(that is `/roadwork-nav-to-destination`'s doing). Never create it before reading the
group.

## 2. Read everything — with sub-agents for breadth

Every member's item file, `intent.md`, `plan.md`, `spec.md`, `GATES.md`
if any; the PRD if any; the group's block in the register's
`ordering.md`; every `blocking` / `blocked-by`
among members and to items outside the group.

Thoroughness is breadth, and breadth is what sub-agents are for:
dispatch one sub-agent per sub-register — as one workflow where the harness runs workflows, one agent per sub-register, each reporting its facts in one shape (file, line, one sentence each; no cap — a reader lists what it finds), on the top model of the tier below the session's, or the session's own where no lower tier exists, at an effort the dispatching agent sets for the run; where the harness runs none, or the run is declined, sub-agents as before; the findings stay yours — to read its members and report
facts (files present, frontmatter values, citations, ordering lines), and
for a large group one per check type in step 3 to gather that check's
evidence — in parallel, each with a narrow brief and the file paths it
owns. Sub-agents find; they never judge, never write, never talk to the
Operator. Every finding in step 3 is yours, made from their reports and
your own reading; a report you did not read is not a check that ran.
Record in the run which checks were gathered by sub-agent.

## 3. The six check types

Each ends "clean" or a numbered finding with the file it points at
(evidence gathered by sub-agent where step 2 dispatched one; the finding
itself is yours):

1. **Completeness** — every requirement (the PRD's; or, hand-made, each
   member's own claims and the group's ordering line) maps to an item or
   is named "deliberately dropped: <why>".
2. **Provenance** — every item traces to its source: the PRD cited by
   path with requirement numbers, or a stated reason; the Operator's
   notes present verbatim.
3. **Shape** — kind (todo vs feature) and home right; frontmatter
   well-formed, all seven keys; the group name on every member; no item name
   collision within the register.
4. **Dependencies** — `blocking` and `blocked-by` agree on both sides;
   no cycle; every named
   blocker exists; the sanity todo blocks what it should.
5. **Order** — the block respects the dependencies; parallel items sit
   adjacent; within the block `main` items sit before `secondary` before `side`, dependencies permitting; the block is placed sensibly in the loose ordering — the destinations' blocks by `bucket-list-priority` descending, equal priorities by judgement, a block out of place reported, the order informed and never rewritten by the keys; every line's
   reason still holds.
6. **Scope** — no member duplicates another or an open item elsewhere;
   nothing too large to build as one or too small to stand alone.
7. **Cohorts** — for every cohort in the group (members sharing an
   `onroad-cohort`): the rubric re-applied, dependency above all — no
   edge between members in either direction, none through an open item
   outside; disjoint ownership; one cohortmeister per cohort, every member
   in its `blocking` and naming it in `blocked-by`; the CM's plan in the
   PLAN form; cohorts last in the block.

## 4. Ten checkup questions — one round

Put these to the Operator in the roadwork-intentify round form, closed as `/roadwork-intentify` §2 closes a round, each with the
relevant findings attached and a recommendation, closed after the questions with three blocks in this order: `go with recos` — every recommendation taken; `go with recos except:` — the questions that differ answered after the colon; `go with recos and group is right and /roadwork-verify-and-archive todo/<group>-sanity` — every recommendation taken, the group right, the sanity todo archived in the same turn; the pieces are the ten answers by number, typed, no block — then **wait**:

1. Does the group cover everything the source asks, or is something
   missing?
2. Is anything in the group not asked for by the source?
3. Are the deliberately dropped requirements right to drop?
4. Is each item the right kind, todo or feature?
5. Is each item's Paths line right, where it carries one?
6. Are the dependencies right — anything blocked that should not be, or
   free that should be blocked?
7. Is the order right — what must come first, what may run in parallel?
8. Is any item too big to build as one, or too small to stand alone?
9. Should any item belong to another group as well, and is the group's
   name right?
10. What does the source imply that the split missed — constraints,
    non-functional requirements, external dependencies?
11. Are the cohorts right — anything in a cohort that depends on
    something else, or two members that would write the same files?

## 5. Re-write — on the Operator's word, per change

Apply only what the Operator said yes to, one change at a time:

- **Amend** an item: its reading, "not decided" list, frontmatter, or
  cross-notes — never its verbatim notes.
- **Add** an item through `/roadwork-ingest`, in the group.
- **Re-point** `blocking` / `blocked-by` on both sides, `blocker`
  re-derived.
- **Re-order** the block ("can re-order"), each moved line's reason
  re-derived.

Every amended or added item gains a dated
`**Cross-items (<date>, written by /roadwork-navsanity run on <group>):**`
line naming the change. **Never delete** an item, withdraw one, strike an
ordering line, or touch `spark/`: a duplicate or a dead item is reported
and left to the Operator and `/roadwork-verify-and-archive`.

## 6. Record the run

In the sanity todo, a dated section `## Run <n> — <date>`: the six check
results (clean or findings), the ten answers verbatim, and every change
made as `- change: <ref> — <what>`. The sanity todo is the group's audit
trail; the skill may run again, each run its own section.

Commit in the register (its commits local).

## 7. Hand back

Reply with: the source; the six results in one line each; the changes
made; what remains open. End with the offer, one invocation in its own code block, preceded by its sentence (offer form), never invoked:
`group is right and /roadwork-verify-and-archive todo/<group>-sanity` — the word recorded in the run's section before the archive skill runs — or, once said, `/roadwork-verify-and-archive todo/<group>-sanity` alone;
otherwise the change awaiting their word or the next run; plus the
top-most unblocked item in `ordering.md` with its skill. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never delete, withdraw, or strike; never act without the Operator's
word; never build; never archive (that is `/roadwork-verify-and-archive`); never touch
`spark/`; never a second interview beyond the ten questions; never open
a PR.

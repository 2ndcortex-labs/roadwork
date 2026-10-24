---
name: roadwork-verify-and-archive
description: Verifies one built item against its gates and landing and archives it on the Operator's word.
when_to_use: Use when the user says /roadwork-verify-and-archive <ref>, "archive <item>", "done with <item>", "ship it" for an item.
argument-hint: <ref> [&& <ref> …]
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

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

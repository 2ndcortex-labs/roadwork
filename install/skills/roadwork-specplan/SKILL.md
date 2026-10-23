---
name: roadwork-specplan
description: Writes the spec and plan with gates from an accepted intent, or reconsiders an accepted pair.
when_to_use: Use when the user says /roadwork-specplan, roadwork-specplan, "spec this", "plan this from the intent", or when an item's intent.md is accepted and its spec.md or plan.md is still a stub.
argument-hint: <ref>
---

# roadwork-specplan — from an accepted intent to its spec and plan

A road plans item is a folder of four files: the item (`todo.md` or
`feature.md`), `intent.md`, `plan.md`, `spec.md` (Roadwork conventions: this skill's glossary; in a workspace, its rules file as well). `/roadwork-intentify` produces the intent. This
skill takes an **accepted** intent and produces the other two:

- **`spec.md`** — requirements and design: what exactly changes and how
  it is verified, constrained by the skills and law in force, with
  every area of concern flagged for its policy owner. The product
  owner reviews it and does not write it.
- **`plan.md`** — how the spec gets built: ordered, dependency-aware
  steps, each with an acceptance gate in the unlazy ledger form, so the
  plan is testable before anyone builds and the build can run under
  `/unlazy` against it.

Nothing is built here, and accepting the spec does not start the build
either: the Operator starts it, by `/roadwork-make <ref>` (which runs `/unlazy`
against the plan's gates) or by saying "build" in so many words. "Spec
accepted" means the spec is accepted — nothing more.

## 0a. Spec-writing guidelines (Operator, 2026-09-11)

A batch (`ref && ref`) is refused here: one tree at a time — one spec and plan per run.

The standard every spec written by this skill — in either mode — and by
`/roadwork-nav-to-destination` and `/roadwork-subagentifygroup` follows. Verbatim:

update specplan skill to tighten spec writing - some ideas:

Create a bespoke specification from the supplied intent document. The intent document was developed through a thorough process and is the authoritative statement of the desired outcome. Treat its settled decisions as established; do not repeat discovery or reopen them without identifying a specific contradiction, omission, or feasibility concern.
The work may concern any kind of project, deliverable, process, service, or build. Do not assume software, a repository, particular tools, or a particular execution method.
Preserve intent and prevent assumptions

* Faithfully translate the intent into clear requirements, deliverables, boundaries, and acceptance criteria.
* Preserve distinctions between mandatory requirements, preferences, possibilities, and exclusions.
* Do not silently add scope, constraints, implementation choices, dates, budgets, responsibilities, or success measures.
* Distinguish requirements supported by the intent document from your proposed decisions and unresolved questions.
* Where a requirement follows necessarily from the intent, explain that connection. Where multiple reasonable interpretations or approaches exist, do not present one as settled.

Resolve only specification-level gaps
Identify missing decisions that prevent the intent from becoming actionable or verifiable.
For each material gap, explain what is unresolved, why it matters, and your recommendation or meaningful options. Ask focused questions in small batches. Do not ask questions already answered by the intent document.
Continue drafting sections that do not depend on unresolved answers. Clearly mark affected sections as provisional. An unanswered question is not permission to assume.
Leave execution details open when they can safely be decided during the work. State any boundaries those later decisions must respect.
Specify the outcome precisely
Include the sections relevant to this work, such as:

* Intended outcome and relationship to the intent document.
* Deliverables and their required characteristics.
* Scope, exclusions, and constraints.
* Dependencies and interactions with existing work.
* Acceptance criteria and evidence of completion.
* Execution sequence, review points, and handoff requirements where needed.
* Open decisions and blockers.

Use enough detail for someone to carry out the work without inventing consequential requirements. Avoid prescribing methods that the intent does not require unless they are necessary and explicitly agreed upon.
Make verification appropriate to the work
Define how each important requirement will be assessed and what evidence will establish completion.
Use measurements, inspection, demonstrations, reviews, reference examples, or automated checks as appropriate. For qualitative requirements, specify the review criteria and approval authority where established. Do not manufacture numerical thresholds or assume all verification must be automated.
Keep the specification traceable and consistent
Make it possible to trace important requirements to the intent document or a subsequently approved decision. Use section references or a compact mapping when helpful.
Check both directions: every material commitment in the intent must be addressed, and every consequential requirement in the specification must have a supported basis.
If the specification would require changing the intent, surface the proposed change explicitly rather than quietly rewriting the original objective.
Report readiness honestly
Deliver a self-contained specification in a format proportionate to the work. Clearly identify unresolved decisions and whether they block all execution or only a later stage.
Distinguish drafted, approved, and ready for execution. Do not treat drafting as approval.
Your task is to create the specification. Execution requires separate authorization.
Begin by reading the intent document, checking whether it supports an actionable specification, and identifying only the material gaps that remain. If there are no blocking gaps, proceed directly to drafting.

## 0. Preconditions — stop if unmet

Resolve the item as `/roadwork-intentify` does (item name, folder, file, or the
item touched in this session; ask which only if ambiguous). Then:

- `intent.md` exists and its status line reads **accepted** (or the
  user says in this session that it is accepted — record that as the
  acceptance, with date). A draft intent is not a basis for a spec:
  say so, offer `/roadwork-intentify` to finish it, and stop.
- **Which mode.** If `spec.md` and `plan.md` are placeholders, this is
  the first-time mode. If both exist with an accepted status line, this
  is the **reconsideration mode** (a reconsideration run) — say so in the first line of the reply,
  before any file is written, and follow §1b, §3b and the reconsideration
  paragraphs of §2–§4 as well. "Failed onroad as a cohort member is not
  the only origin case" (Operator, 2026-09-11): a failed or abandoned
  build, a cohort revert note, a changed blocker or dependency, an
  amended intent, a navsanity run's cross-notes, or the Operator's
  plain wish to rethink all arrive here the same way.

## 1. Gather — facts are yours, decisions are the owner's

Read the whole folder and everything the intent cites. Then, before
writing a line of spec, assemble the constraints that will bind it:

- **Workspace law**: the workspace's brief (its `CLAUDE.md`), the path-scoped
  rules that match the files the work will touch, the consulted law
  docs the brief points to, the project scope, as the workspace states it.
- **The canon**: the project's canon, consulted generally for anything the work
  does with a remote (PRs, reviews).
- **Skills in force**: list every skill available in this session by
  name with the commit of the tree that provides it (the skills' tree at `HEAD` for
  workspace skills). Each skill that governs an aspect of the work —
  security, compliance, UX, brand, voice, completion discipline — is
  a constraint on the spec and is named in it.
- **The destination's intent**: when the item file carries a **Destination:** line, read `destinations/<destination-slug>.intent.md` in the register before a line of spec is written, and, where that intent's Atlas line names an atlas, `atlases/<atlas-slug>/intent.md` as well; the spec's header records each reading on its Destination intent line — the file, the date, what it bound — or `none` for an item under no destination. A destination without an intent file (made before the destination skill wrote one): the line reads `none — the destination has no intent file`, the reply says so in one line and offers `/roadwork-destination <destination-slug>` (its update interviews the intent first), and the run proceeds — the reading is enforced by nothing, as the map is.
  Why the intent above: the destination is the level above the item, and its intent says what the destination is for, so the spec is written knowing it — a requirement that serves the item but not its destination is seen before it is built, not after. The destination's intent is read before anything is written; its reading is recorded so the spec says what bound it; one level up is the minimum, not a limitation — the atlas's intent above the destination is read too where the destination names one, and the spec may read further up.
- **The map**: when the item file carries a **Map:** line, read
  `maps/<map-slug>.md` in the register; the plan's steps follow its Process — a
  step that serves a Process step keeps that step's order and names it, a
  step with no counterpart keeps its own place — and the plan names the
  map's Stack. When the item names no map, say so in one line.
- **The referent**: when the item file carries a **Referent:** line, read it; a referent that resolves to a folder on disk from the project's root is a folder referent, named in the spec as a source by that path; any other is a named referent, and the spec names, per item, the listing the check reads for it (`--listing`); an item without the line has `Referent: none`.
- **The standards**: when the settings file names `standards-folders` (`node <config skill>/scripts/config.mjs get standards-folders`, the config skill's read; empty where a project keeps none), read every file in every listed folder, subfolders included — coding standards, brand, styling and the like, in the project's own structure; a file that is not text (an image, a PDF) is named by path as present and not read; each file that bears on the work is a constraint on the spec, named under "Constraints applied" with the file's path and what it constrained; a listed folder that is empty or missing is said there in one line. The intent names the standards that bind; the spec inherits them and adds what the intent did not see.
- **The codebase**: the files, configs, scripts and records the change
  touches; what other items in `roadwork/todo/` and `roadwork/feature/`
  already claim, and the item's own frontmatter — every `blocked-by` and
  `external` is a concern until cleared, every `blocking` a consumer of
  the spec;
  or depend on. Use sub-agents for breadth; never ask the owner for a
  fact you can read.
- **Outside dependencies**: for every step's landing, every tool invoked and every act by another party, what must be true first that this seat cannot make true and that will not come about in the due course — the rule's test (the Frontmatter bullet). A fact, gathered and stated in the spec's Dependencies section, the observed-by part a command where one can decide it, never printing a credential; never asked of the owner as a decision. One entry per out-of-band act — an account on Cloudways is one entry, a token scoped for that account's access another; never one per party or per service.

Where two constraints contradict, or a constraint cannot be satisfied
by this change, that is an **area of concern**: record it with the
policy's owner (the Operator, the canon's keeper, a named rule) — do not
resolve it silently and do not pick a side.

## 1b. Reconsideration — the evidence

In a reconsideration run, gather besides the law and skills **everything
dated after the spec's acceptance**: the item's `GATES.md` (met, unmet
and abandoned gates with their evidence); a cohort revert note; changes
to `blocked-by`, `blocking`, `external`; an amended `intent.md`;
cross-notes from a navsanity run or other items; the Operator's words
in this session. The list is open-ended; the rule is "anything dated
after the spec". Every piece you rely on is cited in the changelog.

## 2. Write `spec.md`

Replace the stub whole. Form:

```
# Spec: <title from intent.md>
Status: proposed. From: intent.md accepted <date>. Author: the session agent for <owner>.
Skills in force: <name@commit, …>. Law in force: <brief@commit, rules matched>.
Destination intent: <destinations/<destination-slug>.intent.md read <date> — what it bound> | none. Atlas intent: <atlases/<atlas-slug>/intent.md read <date> — what it bound> | none.
Referent: <path or name> — <what it bound> | none

## Problem restated
<one paragraph, from the intent, in its terms>

## Requirements
R1. <observable requirement> — satisfies: <intent outcome or constraint>
R2. …
(Every requirement traces to the intent; anything the intent did not
ask for is marked "added — why".)

## Frozen parts
R<n> freezes <part>; left unexamined. <the reason, in the sentence after it>
(A requirement that fixes a part of the product byte-equal to a prior version is written `R<n> freezes <part>; left unexamined`, the reason in the sentence after it; every such requirement is listed here; `None` where none.)

## Design
<what changes, where: files, folders, records, channels, configs; the
shape of each change; interfaces touched; what is explicitly out>

## Constraints applied
<each skill and law that shaped the design, and how — one line each; the destination's and the atlas's intent where either constrained>

## Dependencies
D1. <what must be true> — who acts: <the party or the item> — observed by: `<a command>` | <a named human observation> [supported: …]
D2. …
(Out-of-band dependencies only — the rule's test; a due-course pause stays in the plan's "lands as" clause. Stated flatly: no options, no owner slot. "None" only if true. An entry is never an area of concern unless its clearing is itself contested; then the concern names the entry. One entry per out-of-band act, never per party or per service — an entry that bundles two acts is two entries. Observed by: a command is the whole observed-by part in one backtick span, run as written in the item's folder, exit 0 as pass, bounded by a wait, tested at acceptance and before a make; anything else is prose, the Operator's word, never a failure, a span beside words prose too; an act that is itself the only test names the first real act; a command reads a credential only into its own process, from a file by path or from the environment, prints none, and carries no URL and no value inline — the skill writes no such line.)

## Areas of concern  ← the owner works these first
C1. <concern> — policy: <which>; owner: <who resolves>; options: <a / b>
C2. …
(Contradicting policies, unsatisfiable constraints, risk the
organization classes as higher than routine. "None" only if true.)

## Open questions
<from intent.md: answered here (say how) or carried forward (say why)>

## Acceptance criteria
A1. <how anyone verifies R1 is met — an observable check>
…
```

Rules: ids and hashes machine-read; dated claims; the owner's words
kept where they decided; no implementation steps (those are the plan).

**Tags.** Every requirement line ends with `[supported: <intent
section>]`, `[proposed]` (your decision) or `[open]` (unresolved), and,
where the intent distinguishes, `(mandatory | preference | possibility |
exclusion)`. Nothing is added silently: no scope, constraint,
implementation choice, date, budget, responsibility or success measure
the intent did not give, unless marked `[proposed]`. A Dependencies entry is tagged the same way.

**The optional eighth heading**,
"Execution sequence, review points, handoffs", is written when the work has an order, a review point, or a
handoff between parties that the plan's steps alone would not capture;
state that need in one line under the heading.

**Readiness** on the status line: `proposed (drafted)`; `accepted
(approved)`; `ready for execution` (accepted, no blocking open decision,
the go given). Name which open decisions block all execution and which
only a later stage.

**A settled decision of the intent is reopened only with a named
contradiction, omission, or feasibility concern** — recorded as a
**proposed change to the intent** in the hand-back, never applied in the
spec.

## 2b. Gap round — only when a material gap exists

After the draft, if a specification-level gap remains — a missing
decision that stops the intent being actionable or verifiable — put the
gaps to the Operator as one round in the `/roadwork-intentify` form, closed as `/roadwork-intentify` §2 closes a round: for
each, what is unresolved, why it matters, your recommendation or
options. Never a question the intent already answers. The draft is
written first, with the affected sections marked **provisional**. No
gap, no round. "An unanswered question is not permission to assume."

## 2c. Spec verification round — fresh eyes, once

After the draft (and the gap round if any), dispatch **six fresh
sub-agents in parallel**, one question each, every one given only the
paths of `intent.md` and `spec.md` and its question, with this brief:
"You are a fresh reviewer with no other context. Read these two files:
<paths>. Answer this one question: <question>. Give a numbered list of
findings, each with the file and line it points at; say 'clean' if
none. Do not rewrite anything. Do not read any other file." The six
questions, verbatim:

**Where the harness runs workflows**, the six run as one workflow — one agent per question, given the same two paths and the same brief, each returning its findings in one shape: file, line, one sentence, an empty disposition slot; at most eight; "clean" as none — on the top model of the tier one step below the session's — or the session's own where no lower tier exists — at an effort the dispatching agent sets for the run. The round's record below is still written by the session agent from the run's journal; the dispositions are its own, the journal holds none. Where the harness runs none, or the run is declined, the six run as sub-agents as the brief says, bounded the same way; no round is lost to it.

1. Traceability both ways — does every material commitment in the intent appear in the spec, and does every consequential requirement in the spec trace to the intent or to a line marked [proposed]? List every gap in each direction.
2. Silent additions — does the spec add scope, constraints, implementation choices, dates, budgets, responsibilities, or success measures that the intent did not give, without marking them [proposed]? List each with its line and what in the intent it stretches.
3. Verifiability — for each requirement, can it be verified as the acceptance criteria say (name the criterion, or "uncovered"), and is any threshold or number one the intent did not give? List the uncovered and the invented.
4. Reopened decisions — does the spec reopen, weaken, or contradict a decision the intent states as settled, without naming a specific contradiction, omission, or feasibility concern? An "Areas of concern" entry offering options on a settled point counts unless it names such a concern. List each, quoting both lines.
5. Executability — could someone carry out the work from the spec alone without inventing a consequential requirement? Name each thing they would have to invent or decide, with its section.
6. Out-of-band dependencies — does the spec name, in its Dependencies section, every act by another party or outside event without which the work cannot complete and which will not happen in the due course of the project's own operation, with who acts and how its completion is observed; and is any due-course pause (a push, a merge, a fetch) wrongly listed as one; and is any entry one that bundles two acts, which is two entries; and is every observed-by command one span, printing no credential, carrying no URL or value inline? List each omission and each wrong entry.

Wait for all six. Then work every finding: incorporate what holds,
reject what does not with a one-line reason, and record the round at the
end of `spec.md` as `## Verification round <date> (spec)` — the questions
asked, `Findings: n. Incorporated: n. Rejected: n.`, and each finding's
disposition. One round per document; never re-run.

**In a reconsideration run** the new `spec.md` opens, under its status
line, with a dated `## Reconsidered <date>` changelog — one line per
change: what changed, in which section, why, citing the evidence. A
requirement may change only when `intent.md` changed or the evidence
shows the requirement wrong, and each such line is marked
**requirement change** for the Operator's acceptance; design, concerns,
open questions and acceptance criteria may change freely. The rest of
the file is written whole in the form above; the previous text is not
kept — the register's history holds it. The Dependencies section is re-stated from the evidence since; a cleared or newly set `external` is cited in the changelog. Status: proposed.

## 3. Write `plan.md`

Replace the stub whole (first-time) — or, in a reconsideration run,
rewrite it with the same dated `## Reconsidered <date>` changelog at the
top and **proven work kept proven**: every gate the item's `GATES.md`
shows met is carried with its `EVIDENCE:` line intact and stays checked;
only unmet or abandoned gates are rewritten; new gates are added as
needed; the status line reads "reconsidered <date>; proposed". The plan
is the spec's order of work and its evidence. Form:

```
# Plan: <title>
Status: proposed. From: spec.md <date>. Runs under /unlazy.

## Order of work
1. <step> — needs: <prior steps or nothing>; touches: <paths>; lands
   as: <local commit in the register | part of the project's batch>
2. …

## Stack
Reuses: <the assets relied on, by path — a checker by path and its modes; or "none">
Creates: <the assets written and where they live; or "none">
Invokes: <the tools called — an MCP server, a CLI, a harness tool, a vendor's service; or "none">
(An asset is what the project holds with a path in the tree; a tool is a capability invoked from outside it — committable is an asset, callable only is a tool. Created assets live in the item's folder. Anything missing today is named on its line as a dependency: a `blocked-by` or an item of its own, before the go. A small item-only asset is a step of the plan; a reused one is its own item and a `blocked-by`; the plan says which.)

## Gates
- [ ] G1: <outcome of step 1, observable>
  VERIFY: <measurement | inspection | demonstration | review | reference example | automated check>
  CHECK: <command that fails if the outcome is not met>
  EXPECT: <success-only marker>
  EVIDENCE: pending
- [ ] G2: <a manual outcome no command can decide>
  VERIFY: <the review criteria>
  APPROVER: <the approval authority, where established>
  EVIDENCE: pending
- [ ] G<n>: the document agrees with its folder referent (the reality gate)
  VERIFY: automated check
  CHECK: node <audit skill>/scripts/check-referent.mjs --document <path> --referent <path> [--allow <path>]
  EXPECT: OK referent
  ALLOWED: <path> — <reason>
  EVIDENCE: pending
- [ ] G2: …
(One gate per acceptance criterion at least; manual gates only where no
command can decide. Every gate names its verification kind in `VERIFY:`
— measurement, inspection, demonstration, review, reference example, or
automated check — and a manual gate its `APPROVER:` where established.
Never a numerical threshold the intent did not give. Lint the ledger:
node <unlazy>/scripts/gate-lint.mjs — it accepts both keys.
The reality gate: the plan of an item with a folder referent carries it, written in the plan's Gates by `/roadwork-specplan` — the document the item's product, the referent the spec's folder; no per-item checker is needed for it; each `--allow` path and its reason on an `ALLOWED:` line under the gate, one per path.)

## Batching and governance
<which PR carries what; the register's commits local;
who approves>

## Concerns that block the build
<the spec's areas of concern that must be resolved before step 1>
```

Gates are written to be run with the unlazy checker; copy the `Gates`
section into a `GATES.md` when the build starts. Write the lint result
into the plan's status line.

## 3c. Plan verification round — fresh eyes, once

After the plan is drafted, dispatch **five fresh sub-agents in
parallel**, one question each, given only `spec.md` and `plan.md` and
its question, with the same brief. The five questions, verbatim:

**Where the harness runs workflows**, the five run as one workflow in the same form as the spec's — one agent per question, given `spec.md` and `plan.md`, the same shape and cap, the tier below the session's at an effort the dispatcher sets, the record the session agent's from the journal, sub-agents the fallback. The plan's round is its own run: the plan does not exist when the spec's round runs; both rounds share one run only on a re-run.

1. Coverage both ways — does every acceptance criterion have at least one gate, and does every gate trace to a criterion? List the orphans in each direction.
2. Honest oracles — can each CHECK actually fail? Name any oracle that cannot fail, any EXPECT that copies a supplied number, and any manual gate a command could decide.
3. Order and landing — does each step need only earlier steps, and does every change land where the batching rule allows, nothing shipping alone? List the violations.
4. Ownership and blockers — are the concerns that block the build named before step one, and does any step touch a path outside what the item owns, and is every Dependencies entry named before step one, as a dependency and not as an area of concern? List each.
5. Stack — does the plan name every asset it reuses or creates and every tool it invokes, and is each one missing today a named dependency or item?

Wait for all five; incorporate or reject each finding with a reason;
record `## Verification round <date> (plan)` at the end of `plan.md` with
the counts. One round per document.

## 3b. Ending the previous go (reconsideration only)

A reconsidered spec is proposed, not accepted, and the previous go ends:
clear the item's `in-process`, remove its `working.md` line if present,
and set the item file's status line to "reconsidered <date>; the
previous go ended; awaiting acceptance and a new go". Say so in the
reply.

## 4. Hand back — concerns first

Order of operations: draft `spec.md` → gap round if needed → spec
verification round → incorporate → hand back the spec; draft `plan.md` →
plan verification round → incorporate → hand back both. The hand-back
reports each round's finding count and how many were incorporated, and
names every **requirement change** and every **proposed change to the
intent** before the concerns. It repeats the spec's `## Frozen parts` list and the reality gate's allowed paths, each with its reason, verbatim under the words "Left unexamined". Readiness: drafted is not approved;
approved is not ready for execution; "Execution requires separate
authorization."

Reply with the areas of concern first, each with its owner and the
decision it needs; then the requirements in one line each; then where
the files are; then `spec.md` and `plan.md` printed whole and verbatim (reply-form rule), before the offers. In a reconsideration run, name the mode, the changelog
and every **requirement change** before the concerns. Ask the owner to review the spec against the idea: does
it solve the stated problem, and are the intent's open questions
answered or carried forward? **Do not build. Do not start `/unlazy` on
the plan** until the owner accepts the spec — a human makes that call,
consulting a technical lead for anything classed as higher risk. Record acceptance as a status line change in `spec.md` and `plan.md`, and in the same act write the Dependencies entries' keys as the rule's Frontmatter bullet says (`blocked-by` on both sides for an entry another item satisfies; `external` and the item file's `**External set**` line for an entry another party satisfies), then the observed-by tests, `node <spec skill>/scripts/observed-by.mjs run --item-dir <item folder> --record acceptance` run, its lines said in the hand-back (acceptance stands whatever they say), then, for each Dependencies entry another party acts on, its notice — the notice of the rule's section "Externalities and their notices", made by whatever means the agent chooses — its record written to a folder made by mkdtemp, never under the item — `what`, `who-acts` and `how-observed` from the entry's `D<n>. <what> — who acts: <party> — observed by: <check>` form split at the two ` — ` labels, its trailing tag left out; `atlas` from the `atlas` key of the item's destination's requirements file, `none` where none; `set-date` the clock as ISO 8601 UTC; `cleared-date` and `cleared-words` null — the notice made with that record, its one result line said in the hand-back — and stop there. Acceptance is not the go: the build starts only when the
Operator says build or runs `/roadwork-make` (ruling 2026-09-10, after the session agent
built on "spec accepted" alone). End by offering the next step as one invocation in its own code block, preceded by its sentence (offer form)
— `spec accepted and /roadwork-make <ref>`, the acceptance and the go on one line, or `/roadwork-make <ref>` alone once the spec is accepted — as an offer, never by
invoking it (every skill in the chain ends this way: Roadwork conventions).
Directly above that offer, every area of concern its word settles is restated simply (reply-form rule).
End with the back offers as `/roadwork-ingest` §5b computes them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

**Files the make will touch.** After the two documents and before the restatement and the offers, under the heading "Files the make will touch", one list: every existing file the make will change and every file it will create, one line each — the path, then in parentheses at most eight words, verb first, what is done to that file, never why. Drawn from the spec's Design, the plan's "touches:" clauses, the Stack's "Creates:" line and the files the gates' commands name; a file no document names by path is listed by its function, one line per file where the plan knows them one by one, one line for a group otherwise ("Script(s) to sort and merge the data"). Before printing, compare the list to the plan's lines: every path a "touches:" clause, the "Creates:" line or a gate's command names is in it. The list binds nothing and is printed, never written to a file; the make's hand-back and the archive round do not reprint it.

After writing: no PR; the register's commits are local.

## Provenance

The spec and plan are logged with the skills and law in force at
writing (their commits). The prompt that produced them is this skill
at the skills' tree's `HEAD`. A non-interactive trigger — a job firing when an
intent is accepted, running this pass with the organization's skills
loaded and committing `spec.md` as a PR — is the intended end state;
until it exists, run this skill by hand.

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
- **Area of concern** — a contradiction between policies or an unsatisfiable constraint, recorded with its owner, never resolved silently. **Acceptance** — the Operator accepting the spec; **not a go**.
- **Gate** — one observable outcome with a `CHECK:` command and a success-only `EXPECT:`; the **ledger** is `GATES.md`, run by the unlazy checker.
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

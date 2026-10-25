---
name: roadwork-subagentifygroup
description: Finds the cohorts in a group of features that sub-agents can build in parallel and files their cohortmeisters.
when_to_use: Use when the user says /roadwork-subagentifygroup <group>, "which of these can run in parallel", "cohort this group".
argument-hint: <group>
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

# roadwork-subagentifygroup — cohorts, the cohortmeister, a group built in parallel

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary (the Cohorts
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
<group>` first, which now checks cohorts). Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the host has a question tool, blocks otherwise (the terms table's **Offer form** row).

The specs this skill writes follow `/roadwork-specplan` §0a — the
Operator's spec-writing guidelines — and get its verification rounds.

## Never

Never todos; never a cohort of one; never a member in process or with an
external; never a cohort across homes; never build or onroad anything;
never declare a cohort without the read-back; never delete or archive.

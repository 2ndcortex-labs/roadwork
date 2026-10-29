---
name: roadwork-make
description: Starts the build of one item against its gates when the Operator gives the go.
when_to_use: Use when the user says /roadwork-make <ref>, "build <item>", "start <item>", "go on <item>", or /roadwork-make alone for "what can be built now".
argument-hint: "[<ref> [&& <ref> …]]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

The settings file, `config.json` at the register's root, must be read before this skill acts — the constitution's bullet "The settings file": one run of the config skill's script with no argument, `node <config skill>/scripts/config.mjs`, its lines held in the working context for the run — every key with its value, a secret as "set, <n> characters" or "empty", never its value. The file is read by the script and by nothing else, never opened or printed directly. A key this skill needs that reads "empty" takes the default the schema names for it; a key without a default is not asked for here — the config skill's empty-keys prompt asks it. Where a compaction has removed the lines, read them again before acting, as with the constitution.

Before any sub-agent is dispatched, every `subagent-<type>` value this run may use is checked against the dispatching host: the family must be one the host resolves — a vendor the host serves, a family still offered, spelled as the host knows it. A value the host does not resolve — another vendor's family on a host that serves one vendor, a family retired or renamed, a release number where a family name belongs, a misspelling — is reported to the Operator in one line naming the key, the value and what is wrong with it, with the config skill's line to set it right, and this skill stops before dispatching; it never substitutes a family of its own choosing, never falls back to the default over a set value, and never dispatches on the other keys while one is wrong. An empty key is not wrong: it takes its default. The check is the session agent's reading of the host's model list where the host exposes one, and otherwise the dispatch's own refusal, reported the same way and before any further dispatch.

## Sub-agents

- Six sub-agent types are defined in the constitution's bullet "Sub-agents and their models" — reader, finder, explore, researcher, builder, reviewer — and this skill may dispatch any of them; the three categories there describe the types, they do not limit which a skill uses. Where a step of this skill needs a type the constitution does not name, the step defines it in place — its purpose, what it is given, what it returns, what it may and may not do, and the `subagent-<type>` key it reads for its model family, a key the config skill's schema must carry before the type is dispatched — and the definition holds for this skill alone until the constitution adopts it.
- The type of each dispatch is the session agent's determination at the time of invocation, from what the task asks for — a document read against a question, a fact looked up, files found, outside sources compared, a deliverable built, a change checked — unless a step of this skill names the type itself, in which case that step's type is used. Each dispatch is made as the host's agent of that type's name, so the type's instruction file under `.claude/agents/` (`reader.md`, `finder.md`, `explore.md`, `researcher.md`, `builder.md`, `reviewer.md`) is its standing instructions and the brief carries the task only.
- The model family of each type is the value of its `subagent-<type>` key in `config.json`, read under Prerequisites — a family name the dispatching host resolves, Anthropic's or another vendor's, the newest release of that family assumed at dispatch; a key read "empty" takes the default the config skill's schema names. This skill names no model family and no release itself.
- The effort of each dispatch is the session agent's judgement at the time of invocation, set from the task's difficulty — the depth of reading or building the brief asks for, how much a miss would cost — and set explicitly on every dispatch; no fixed level is prescribed here.
- A sub-agent's return is evidence, not a decision: the session agent reads every finding and claim, accepts or rejects each one by its own judgement, records the disposition and the reason, and reverifies a builder's claim of done by the gates before relying on it. A finding is never incorporated because a sub-agent produced it, nor dropped without the reason said.
- The session agent is the only dispatcher; a sub-agent never dispatches another, never speaks to the Operator, and never approves an oracle.

# roadwork-make — put one item in process and build it

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. An accepted spec is
not a go; this skill is. The acceptance may arrive on the invocation's line — `/roadwork-make <ref> given spec accepted` — and is recorded in `spec.md` and `plan.md`, dated, as the Operator's, before §1, with the Dependencies entries' keys written as the rule's Frontmatter bullet says — so §0 then reads them. It takes **one** reference (`todo/<item-name>`,
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
words, never the notes re-quoted, the line ending with ` · <n> by command`, from `node <spec skill>/scripts/observed-by.mjs count --item-dir <item folder>` — the count of its externality entries whose observed-by part is a command; the bare call runs no test. Below each, one sentence — "Typing this
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
exists.

**The status step** (the rule's section "Externalities and their notices") opens with the tests: for an item with an externality entry (a Dependencies entry another party acts on), in the key or handled, `node <spec skill>/scripts/observed-by.mjs run --item-dir <item folder> --record make` runs first, one line per entry; then, before the refusals: make the status read of the rule's section "Externalities and their notices" for the item, read the item's Dependencies entries from its `spec.md`, and match the answer's elements to the entries by `what` (exact after trimming; an entry no element matches is unmatched, read as open). Then put every entry the key still names to the Operator in one round, each with the receiver's answer — cleared, open, unmatched, unknown or no status URL — a receiver's cleared said and recommended, never acted on, and the word that clears it, `D<n> handled: <what now exists>`, one per entry; an entry already cleared on the item is not in the key and not asked. The round puts every externality entry, its line carrying both answers, `D<n> — <what> — the receiver: <answer> — the test: pass | fail, <answer> | your word`; a handled entry's line opens `handled <date>:` and takes no word, its receiver's answer the status read's element matched by `what`, `unmatched` where none. The round takes the form for a message waiting on more than one word: the first block `/roadwork-make <ref>` first, then all the words joined with " and " (the make's own words, no `given`); then its "except:" twin (the same words joined with " and ", then `except:`, no invocation, the Operator listing after the colon the entries they answer differently); then one block per entry. Each word, in one act, writes `**External cleared (<date>, the Operator):** "<their words>" — <what now exists>` on the item file (their words those typed after the colon), rewrites the `external` key without that entry's sentence (emptied when none remains), and makes the notice of the rule's section for that entry — its record written as the spec skill's §4 writes it on set, with `set-date` the `**External set**` line's date at midnight UTC, `cleared-date` the clock and `cleared-words` their words — its one result line said. The make makes both calls, the status read and the notice, by the config skill's shipped script `scripts/externality.mjs` as its default and says so in one line of the reply; another means where the Operator names one. The make runs in the same turn when the key is empty, and refuses below otherwise.

Refuse, naming the reason, and stop when:

- `blocked-by` names an item whose `GATES.md` does not show every gate
  met (`gate-check --status`); a blocker that is built — all gates met —
  counts as cleared even if not yet archived. Name each blocker and its
  state.
- `external` is non-empty and no handled word has cleared every entry it names — say what it names and the receiver's answer per entry; only the Operator clears it (by the handled word, or by emptying the key).
- an externality entry's test failed at this make — name the entry and what it answered (the line the script wrote on the item file); only a run in which every test passes lifts it; the handled word clears a key entry as today and overrides no test.
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
`ABANDON`ed with a reason, never deleted.

At the end of every run, take the first unmet gate in the ledger's order — never an abandoned one, never a review gate awaiting the Operator's word — and apply the test for a stop outside the build (the constitution's Frontmatter bullet, `gated`): the gate's check names a thing outside the build — a settings key empty, a service not answering, another party's act, a file only the Operator supplies — and a rerun without a change outside the build would fail the same. Where it holds, write `gated: "<today>: G<n> — <what it waits on>"` in the frontmatter, the clause the one-line reason, and the line `**Gated (<date>, by /roadwork-make):** <the key's text>` on the item file; `working.md`'s "at" is unchanged. Where a later run stops outside the build at another gate while the key still names the earlier one, rewrite the key with the new date and gate and add a new `**Gated**` line, the old one standing as history. Where the gate the key names is met at the end of a later run (its box checked in `GATES.md`), write `gated: ""` and the line `**Gated cleared (<date>, by /roadwork-make):** <what now holds>`. Nothing is written for an abandoned gate or a review gate awaiting the Operator. The Operator may clear the key by hand, recorded as `**Gated cleared (<date>, the Operator):** "<their words>" — <what now holds>`.

Every commit lands where the
plan says (the register locally; the project's batch branch;
never a PR of its own). Update `working.md`'s "at" as gates are met.
The builder's line, for a documentary item, in every builder's brief: a thing the referent carries that the document lacks is listed under "Proposed additions", never dropped — "adding would add a rule" is never a reason to leave it out.

## 3b. A cohortmeister's run

When the item is a CM (`feature/cm-<group>-<cohort>`, `onroad-cohort`
set), the build is orchestrated, not solo:

1. Make the scope `.unlazy/<cm-name>/` at the root the members' paths
   are relative to (the project root; `.unlazy/` kept out of every
   repository): write `PLAN.md` from the CM's `plan.md` (the PLAN form:
   contract, inventory, tree, leaf dispatch table), the CM's node ledger
   as the scope's root `GATES.md`, and one leaf ledger per member at
   `gates/leaf-<member>.md`, a copy of that member's `GATES.md` with
   `OWNS:` = the member's paths, relative to that root, never
   traversing; unlazy knows a leaf only by a ledger under the scope and
   claims only ledgers (`--claim --scope <cm-name> --leaf <stem>`).
2. **Approve before dispatch:** inspect and `--approve` every member
   ledger's oracles yourself; a sub-agent never approves.
3. Before each claim, check the leaf's `Owns` row against its ledger's
   `OWNS:` as equal sets, else fail closed. Claim every leaf's
   ownership; open one wave — a cohort larger than the host's
   concurrency limit launches in waves in order, each sealed before the
   next opens; launch **one background sub-agent per member**, dispatched as the
   host's `builder` agent (the constitution's Sub-agents bullet; its family the setting
   `subagent-builder` names; its instruction file `.claude/agents/builder.md`) — a narrow brief: the member's folder, its `GATES.md`, its `OWNS:`,
   "build the deliverable in the four passes, run the gates, record
   evidence; never approve, never archive, never post anywhere outside
   the project, never write outside your paths" — record every handle
   (`dispatch-check start`); seal the wave; wait.
4. For each returned leaf: record its return (`dispatch-check return`),
   parent-verify it with `--reverify` (never `--status`), log it
   verified, release its lease (`--release --leaf`) and log the release.
5. Run the CM's **node ledger** (re-verify every member; interfaces;
   ownership audit; leases released; the Operator's manual review): the
   node ledger is the scope's root `GATES.md`, run as `gate-check
   --scope <cm-name>`, which also folds in the wave's state; ALL MET on
   it, release the whole scope (`--release --scope <cm-name>`) and log
   it; its N1 under the shell the approvals bound.
6. **Partial or failed:** each member whose ledger is not ALL MET
   **reverts to standalone** — clear its `onroad-cohort`, remove it from
   the CM's `blocking` and the CM from its `blocked-by`, release its
   lease, and append a dated note to its `feature.md`, `spec.md` and
   `plan.md`: "onroaded <date> as part of cohort <cohort> (CM <ref>) and
   failed at <gate ids>; run `/roadwork-specplan` again (reconsideration)".
   Met members stay with the CM; the CM stays in process with a handoff.
   A run that failed in part resumes through its existing ledger — the
   scope, its `PLAN.md`, the met members' leaves and their evidence
   kept, the reverted members out of the dispatch table and their leases
   released once their workers have settled — never a restart from a
   fresh scope. The scope reports a handoff until the reverted members'
   leaf ledgers leave it by a logged plan amendment.
   ALL MET on the node ledger ends with the offer `/roadwork-verify-and-archive <CM>`.

## 4. Hand back

- **ALL MET:** say so with the measured count, name where the commits
  sit, and end with the offer — `/roadwork-verify-and-archive <ref>` — one invocation in its own code block, preceded by its sentence (offer form), never
  invoked.
  Where the config key `versioned` is `yes` and `node <inventory>/scripts/unlanded.mjs` `--repo <name> --branch <branch>` prints an unlanded line for the branch the commits sit on, the line says `unpushed on <repo> <branch>` and the pull-request offer — `open the pull request for <repo> <branch>`, in the offer form with its O-number, the Operator's word for one merge handshake on that branch — is printed after the verify-and-archive offer, last of the hand-back's offers (a git-related offer is always the last in the list: Operator, 2026-10-15); the script reads local refs and fetches nothing.
- **Anything else** (unmet, abandoned, awaiting an owner decision): a
  handoff — the unmet and abandoned ids, what each needs, and who decides. Where the run stopped outside the build (§3), the handoff names the stop in one line in the plain word — "a build stopped from outside: G<n>, <what it waits on>" — and says the `gated` key was written. Where a review gate names a demo, the demo is printed whole and verbatim, before the offer. For a documentary item whose product existed before the build (a rewrite), the review gate's hand-back prints the whole document first, the diff after, then "Claims kept unchanged" — the document's lines the diff did not touch, as a list — then "Proposed additions": where the builder found the referent carries something the document does not name, one line each, for the Operator's word, each taken or struck. Every review-gate hand-back repeats the spec's `## Frozen parts` list verbatim under the words "Left unexamined".
  Offer nothing else; the item stays in process. Where the only unmet gates are the Operator's review gates, the one offer is `/roadwork-verify-and-archive <ref> given G<n> accepted` — several gates as `given G<n> and G<m> accepted` — the acceptance recorded in the ledger as the Operator's, dated, before the archive skill runs. Directly above that offer, each gate its word accepts is restated simply.

Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the host has a question tool, blocks otherwise (the terms table's **Offer form** row).

## Never

Never a group; never a spark; never a feature without an accepted spec
and plan; never archive an item (that is `/roadwork-verify-and-archive`); never open a PR; never
treat "spec accepted" as the go — the Operator's `/roadwork-make` or word is.

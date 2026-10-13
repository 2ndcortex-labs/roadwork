# roadwork-guidebook — a guidebook, made with the Operator

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the
Guidebooks bullet). A guidebook is one file, `guidebooks/<guidebook-slug>.md`,
in the register's `guidebooks/`. It is a standardized knowledge base, broad
in application: the standards that hold, the tooling preferred, the
vendors used, the judgements a person makes with them, and the sources it
rests on. It names no destination — a map is the way to one destination,
a guidebook serves any map that draws on it. `/roadwork-map` reads the
guidebooks that apply and copies their relevant parts into the map,
citing a whole guidebook only when the whole applies; no skill enforces
one. A retired guidebook moves to `guidebooks/archive/` by hand; there is
no archive skill.

## 1. Resolve the invocation

A batch (`ref && ref`) is refused here: one guidebook at a time.

- **bare** (no argument): the list of §2. Writes nothing.
- **`<new-slug> <initial description>`**: a kebab-case slug not yet in
  `guidebooks/` or `guidebooks/archive/` of any home (a slug is never
  reused), followed by the Operator's words — the interview of §3, the file
  of §4.
- **`<existing-slug>`**: a slug already in `guidebooks/` — the update of §4.
- **`<new-slug>` with a document** — a pasted document in the message, or a
  path to one: the entrance of §5, then the interview shortened.
- **a document with no slug**, or a path alone: propose a slug in the
  Operator's words and ask once; on their word proceed as above.

## 2. The bare call — the guidebooks

Read the register's `guidebooks/` — `archive/` excluded — and print a count
line (`guidebooks: <n>`) and then one line per guidebook: its slug, its
opening words (the guidebook's own), and the count of maps in `maps/` —
`maps/archive/` excluded — whose **Guidebooks:** line names it. No state
beyond that: a guidebook is never done. With no guidebook in any home —
the empty case — print the count and the offer to start one,
`/roadwork-guidebook <new-slug> <description>`. A bare call writes nothing.

## 3. The interview — the intentify pattern

Read back the Operator's description as given (verbatim), then your
reading of it, marked as yours, and ask the two questions — anything to
add? any comments on the reading? Then the rounds of `/roadwork-intentify`
§2, closed as `/roadwork-intentify` §2 closes a round: the design tree, the
frontier asked whole each round, every question numbered with your
recommendation, the facts found by you, never asked; the decisions the
Operator's. The root branches for a guidebook:

- **What it covers** — the field the guidebook holds knowledge of, and how
  broadly it applies; in one paragraph.
- **Standards** — what must hold: conventions, formats, rules, thresholds
  the Operator has settled on, each with its reason.
- **Preferred tooling** — the tools, services and libraries preferred, and
  what they are preferred over.
- **Vendors** — the providers used, and on what terms.
- **Judgements** — the calls a person makes in this field, and on what.
- **Sources** — where the knowledge comes from: documents, people,
  experience; named so a map can go further.
- **Crossings** — open items, maps and other guidebooks this one touches;
  read, never written into.

Stop when the frontier is empty; say so and ask the Operator to confirm.
Offer `confirm` in its own block. Do not write the file until they
confirm.

## 4. Write the guidebook — the fixed form

On confirm, `guidebooks/<guidebook-slug>.md` in the owning home, in this
form and no other:

```
# Guidebook: <title in the Operator's words>
_Guidebook, made <date> by /roadwork-guidebook; open until retired._

<what it covers: one paragraph>

## Standards
<a paragraph or a list>

## Preferred tooling
<a paragraph or a list>

## Vendors
<a paragraph or a list>

## Judgements
<a paragraph or a list>

## Sources
<a paragraph or a list>

## Changelog
- <date>: made.
```

A guidebook names no destination: no **Destination:** line, no
destination's slug. Its sections are what a map copies from — a map's
excerpt opens with ``_From guidebook `<guidebook-slug>`, § <section>:_``,
so the section names above are the ones a map cites.

**An update** (`<existing-slug>`): read the file back whole, ask what
changes and interview only that, then rewrite the file whole on confirm
and append one dated line under `## Changelog` saying what changed. A
map that copied a part of it is not rewritten here: its own update is
`/roadwork-map <destination-slug>`, on the Operator's word.

## 5. A document arrives

When the Operator pastes a document or names a path — a standards page, a
vendor list, a tooling note, a page of what has been learned — save it
first, verbatim, as `guidebooks/<guidebook-slug>.source.md` in the owning
home (a header line above it: `_Source of <guidebook-slug>, received <date>; verbatim._`).
Then the interview of §3, shortened to what the source leaves open: read
back your reading of the source into the covering paragraph and the five
sections, ask the two questions, then only the rounds the gaps need. The
guidebook is written as §4; its first changelog line names the source.
The source file stays beside it and moves with it to `archive/`.

## 6. Commit and hand back

Commit in the register (its commits local). Reply with: the guidebook's
path (and the source's, if any); its title; the crossings found; then the
guidebook printed whole and verbatim, before the offers (reply-form rule).
End with one offer, one invocation in its own code block, preceded by its
sentence (offer form), never invoked: the open destination first by the inventory's order that has no **Map:** line and no map file —
the highest `bucket-list-priority`, ties by `ordering.md` position, then
slug —

```
/roadwork-map <destination-slug>
```

— else no offer. Then the back offers as `/roadwork-ingest` §5b computes
them — up to five, most recent first, as offers only. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

## Never

Never enforce a guidebook (no skill checks one); never write into a map,
an item or a destination; never file, interview or spec an item (those
are the chain's); never write a guidebook the Operator did not confirm;
never archive or move a guidebook; never a frontmatter key on any item;
never open a PR.

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
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the road plans; offers, never invocations; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, and its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names one, a destination's `<destination-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a lifecycle skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons, `/roadwork-inventory` everything open on one page in the ordering's order; a bare call writes nothing.
- **Offer form** — every command or phrase a reply suggests the Operator type is printed in its own fenced code block (three backticks, no language tag), nothing else in the block, one per block, so it copies in one gesture; invocations that run as one line — a batch invocation with ` && ` — share one block; prose around the block says what it does; an offered invocation is preceded by one sentence saying what typing it does. The copy a skill carries for use outside a workspace; in a workspace the reply-form rule holds it. Where the harness has a question tool, the offers of a hand-back are one list of choices — each the invocation with its sentence — plus "none of these" and a free-text choice; a tick is the Operator's word, run in the same turn; blocks where there is no tool. Where an offer waits on the Operator's word, the block — or the choice's label — carries both, `<word> and <invocation>`; the word is recorded as the Operator's, dated, before the invocation runs. Where typing it makes or changes something, the sentence carries, in parentheses right after the thing acted on, what is to be accomplished — the change or the product itself, as what will exist or be said afterwards, a few words opening "to", specific to the item where the item is known, never a sentence, never the skill's definition, never the reason, the gate, the authority or the item — "runs the map skill on the-lifecycle (to rename its Tools section to Assets and tools)"; a directive phrase the same; a bare listing or a help call, which leaves nothing behind, carries none; the Gate id entry's parenthetical says what a thing is, this one what a run accomplishes (Operator, 2026-10-07).
- **Gate id** — `G<n>`, a gate's name in its ledger. Printed anywhere but the ledger itself, or a line that opens with the gate's own title, the id carries right after it a few words in parentheses saying what the gate is, taken from the gate's title and never a sentence — `G6 (the Operator's review of the four pages)` — the words saying so where the gate is the Operator's to approve; a handoff's list of unmet ids, a status clause and an offer all carry them, in an offer in the sentence before the code block and never inside it (Operator, 2026-10-03); its parenthetical says what a thing is, where the offer form's says what a run accomplishes (2026-10-07).
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: one blank line, a horizontal rule (a run of hyphens on its own line, rendered as a rule, never a literal line of characters), one blank line, then the title line "A 2ndcortex/roadmap system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.

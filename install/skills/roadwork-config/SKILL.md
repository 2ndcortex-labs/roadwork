---
name: roadwork-config
description: Reads and sets the instance's settings file when the Operator asks for the config or a key's value.
when_to_use: Use when the user says /roadwork-config, "config", "settings".
argument-hint: "[<key> <value>]"
---

# roadwork-config — the settings file

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. This skill keeps one file, `roadwork/config.json` at the register's root: the instance's values the other skills read by key. The file is ignored by the register's git and written mode 600. The session agent invokes the script, `node <skill>/scripts/config.mjs`, for every read and write and never opens the file itself. The script finds the register by walking up from the working directory to the first folder holding `roadwork/ordering.md` (or, inside the register, its `ordering.md`); it creates the file `{}` when it is missing.

## 0. The schema

The schema lives here; a key outside it is refused on set and reported on the bare call as "unknown, not in the schema", never deleted. A new key is a change to this skill.

| key | meaning | shape |
|---|---|---|
| org-slug | the organisation's slug | kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$` |
| notify-url | the URL Roadwork posts an externality's record to when it is set and when it is cleared; optional — empty means no notice, never asked for by the empty-keys prompt; any credential the receiver wants rides in the URL itself, so the value is a secret: masked in every reply, set by a route of §2 | an `https://` URL |
| status-url | the URL Roadwork reads an item's externalities' state from, by the make skill at its start and by the inventory's bare call; optional — empty means the Operator is asked, never asked for by the empty-keys prompt; a secret as `notify-url` is | an `https://` URL |
| standards-folders | the project's standards folders, in the project's own structure — coding standards, brand, styling and the like; optional, empty where a project keeps none; a list, in the order given | a list of folder paths relative to the project's root, each an existing folder under that root |
| versioned | the project's changes land by pull request — yes where branches are opened as pull requests, no where the register runs in an unversioned project; unset reads as no; with yes, `/roadwork-inventory`, `/roadwork-verify-and-archive` and `/roadwork-make` print what is not yet landed and offer the pull request (`unlanded.mjs`, the inventory skill's script) | yes or no |

The shape is checked, nothing else: nothing is called to validate a value, and the script makes no network call. A bad shape is refused with the key's meaning and shape printed. The two URL keys are read from the settings file by whatever makes the call (the rule's section "Externalities and their notices"); the skill ships `scripts/externality.mjs` (`notify`, `status`) as one way to make it, required by no skill or gate.

**Instance keys.** A key one instance alone needs — a deploy token of a service only this workspace runs, say — is never added here, since the schema is the primitive's. It is listed in the register's `docs/local/config-keys.json`, instance material ignored by git beside `config.json`: a list of entries `{"key", "meaning", "shape": "non-empty" | "https" | "kebab", "secret": true | false}`. The script merges them after the schema, marked "(instance key)"; a key the schema already has is refused. A secret key — a secret instance key, and the schema's `notify-url` and `status-url` — is masked in every reply — "set, <n> characters" or "empty", never the value — refused on the `set` line, and set by a route of §2.

## 1. The three calls

- **Bare** — `/roadwork-config`: run `node <skill>/scripts/config.mjs` and print its lines: every key of the schema and every instance key with its value or "empty", a secret instance key masked, an unknown key as "unknown, not in the schema".
- **Set one** — `/roadwork-config <key> <value>`: run `node <skill>/scripts/config.mjs set <key> <value>` and print its line, or its refusal (an unknown key, a bad shape with the meaning).
- **The empty keys** — after either call, once per run: run `node <skill>/scripts/config.mjs empty` and list the empty keys numbered, one line each with the meaning (`1. <key> — <meaning>`); when it prints `none`, say nothing more. The Operator answers lines `<n> <value>`, one key per line, several lines in one reply; a blank reply skips all. Each answered line is set as in "Set one"; a number naming a secret instance key gets a route of §2 instead. The keys are asked about once per run, never again in the same run.
- **Set a list** — `/roadwork-config standards-folders <path> [<path> …]`: run `node <skill>/scripts/config.mjs set standards-folders <path> [<path> …]` and print its line, or its refusal (a path that is not an existing folder under the project's root, or one that escapes it). The project's root is the folder that holds `nethub/` in a workspace, where the register sits at `nethub/nexus/roadwork/`; elsewhere the folder that holds the register, roadwork/ at its root. An optional key is never listed by the empty-keys prompt; `node <skill>/scripts/config.mjs get <key>` prints one key's value, or "empty", for a skill that reads it.

## 2. Setting a value outside the chat

A secret instance key, `notify-url`, `status-url`, or any value the Operator prefers not to type into the chat, is set by one of two routes, run in the object, `nethub/nexus/`, the folder that holds the register `roadwork/`; the script lives in nethub's skills folder, `nethub/.claude/skills/roadwork-config/scripts/config.mjs`, one level up from the object. The terminal route, a zsh line:

`read -rs "V?Paste the value of <key>, then Enter: " && CONFIG_KEY=<key> CONFIG_VALUE="$V" node ../.claude/skills/roadwork-config/scripts/config.mjs set-from-env && unset V`

or the file route, from a file the Operator wrote:

`node ../.claude/skills/roadwork-config/scripts/config.mjs set-from-file <key> <path>`

Both print only `<key>: set, <n> characters`; an empty value is refused.

## 3. Hand back

Print the script's lines as they came; offer nothing but the empty-keys prompt.

## Never

Never open, read, parse or print `roadwork/config.json` but through the script; never ask for a secret's value in the chat; never print a secret; never delete a key; never commit the file.

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


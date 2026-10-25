---
paths:
  - "**/roadwork-*/**"
  - "**/roadwork/**"
---
- **One register per project, `roadwork/`, typically and optimally at the Project Root (i.e. the folder where Claude was started) — no path under the project carries a register of its own.**

  - Its top level is nine folders and two files, and nothing else:
    - `todo/`, `feature/`, `spark/` — the three sub-registers, where the work is.
    - `docs/`, `destinations/`, `maps/`, `guidebooks/`, `atlases/` — what outlasts any one item.
    - `install/` — the skills and the rule as the clone brought them from the Roadwork home; a copy, not the register's, never written, never a source.
      - `install/rules/` holds the rule, `install/rules/roadwork-constitution.md`.
      - `install/skills/` holds one folder per skill, each with its `SKILL.md`: the `roadwork-` skills named under Naming, `install/skills/roadwork-make/` among them, and `install/skills/unlazy/`, the unlazy skill copied whole from its own repository, whose files `install/skills/unlazy/<name>` and folders `install/skills/unlazy/<name>/` are its own.
    - `ordering.md` and `working.md` — the order and the in-process list (their own bullet below); beside them the register's own files: `CLAUDE.md`, its anchor; `README.md`; `LICENSE`; `.gitignore`; and `config.json`, the settings file, ignored by git and never committed.
  - Every folder named here, and every `archive/` under one, carries an anchor `CLAUDE.md` saying what it holds and which bullet of this rule governs it.
  - The anchors below the top are `todo/CLAUDE.md`, `todo/unnavigated/CLAUDE.md`, `feature/CLAUDE.md`, `feature/unnavigated/CLAUDE.md`, `spark/CLAUDE.md`, `docs/CLAUDE.md`, `docs/context/CLAUDE.md`, `destinations/CLAUDE.md`, `destinations/archive/CLAUDE.md`, `maps/CLAUDE.md`, `maps/archive/CLAUDE.md`, `guidebooks/CLAUDE.md`, `guidebooks/archive/CLAUDE.md`, `atlases/CLAUDE.md` and `atlases/archive/CLAUDE.md`.
- **The three sub-registers.**
  - `todo/`: fixes, chores, decisions to take, findings to trace; item file `todo.md`; one folder per destination, `todo/<destination-slug>/`.
  - `feature/`: new capabilities; item file `feature.md`; one folder per destination, `feature/<destination-slug>/`.
  - `spark/`: ideas for later, never worked; one folder per spark, `spark/<item-name>/`, holding `idea.md` alone, no frontmatter; `spark/archive/` for the converted, `spark/archive/<item-name>/`. A spark's only exit is conversion into a todo or a feature through `/roadwork-ingest`, on the Operator's word.
  - The test that tells a todo from a feature: a todo is done once and is then over; a feature is built once and reused when built. The Operator may name the kind against the test.
- **Where a work item sits.**
  - Under its destination's folder: `todo/<destination-slug>/<item-name>/`, `feature/<destination-slug>/<item-name>/`.
  - Under `unnavigated/` until a navigation cites it: `todo/unnavigated/<item-name>/`, `feature/unnavigated/<item-name>/`.
  - Each destination's folder, and `unnavigated/`, has its own `archive/`, a sibling of its items; a finished item moves there whole: `todo/<destination-slug>/archive/<item-name>/`, `feature/<destination-slug>/archive/<item-name>/`, and the same under `unnavigated/`.
  - A navigation is made when a destination is established, not later; items filed before it stay in `unnavigated/` unless the navigation cites them, and the cited ones move under the destination's folder in the navigation's own act.
- **The item name.**
  - Kebab-case, in the Operator's words, chosen when filed, never changed.
  - Unique across the whole register, not per folder: the reference `todo/<item-name>` omits the destination's folder, so one name is one item wherever it sits. A name is never reused, archived or not.
  - Never a skill name; an item that builds or changes a skill is named for its outcome, not for the command.
  - Four lines may follow the item file's owner line, in this order: `**Destination:**` (written by the navigation), `**Map:**` (written by the interview, one per item), `**Referent:**` (written by the interview from the read-back's fourth question; what the product describes), `**Paths:**` (the paths the work touches, written when the source names them). None is a frontmatter key.
- **The item folder.**
  - Four files of record: the item file, `intent.md`, `plan.md`, `spec.md`. `GATES.md`, the ledger, joins at the build.
  - `intent.md`: what is wanted and why, in the Operator's words; placeholder until `/roadwork-intentify` writes it.
  - `spec.md`: what exactly changes and how anyone checks it; "not yet specified" is valid until `/roadwork-specplan` writes it.
  - `plan.md`: in what order it is built and the gates the build must pass; "not yet scoped" is valid until the same skill writes it.
  - What the build leaves beside them — a checker, its records, logs, review material — is the item's: it stays in the folder, moves with it to the archive, and is never mistaken for a fifth file of record. Nothing else is written into an item folder.
  - No `specs/` folder anywhere; a spec lives only in its item.
- **The five folders beside the work.**
  - `docs/`: documents that outlast any one item. Fixed members: `docs/teachme.md`, `docs/facts.md`; `docs/context/`, the graduated specs, one `docs/context/<item-name>.md` per item archived shipped, written by `/roadwork-verify-and-archive` and by nothing else; `local/`, instance material (the audit's instance-strings list), ignored by git; `docs/<name>.source.md`, a document a tasksplit was made from.
  - The terms table lives in this constitution alone, its section "Terms — the plain word, the agent's word, the meaning": one row per glossary term and one per git word a skill puts in front of a person. Every glossary term has a row; `/roadwork-audit` is the check. The register keeps no copy.
  - `destinations/`: per destination `destinations/<destination-slug>.intent.md`, written first, and `destinations/<destination-slug>.prd.md`, written from it; `destinations/<destination-slug>.source.md` where a document was given. A destination is built when every item of it is archived; then all its files move together to `destinations/archive/`, as `destinations/archive/<destination-slug>.intent.md`, `destinations/archive/<destination-slug>.prd.md` and `destinations/archive/<destination-slug>.source.md`. Destinations made before the intent step have no intent file; the destination skill's update writes one.
  - `maps/`: one `maps/<destination-slug>.md` per destination, `maps/<map-slug>.source.md` where a document was given; `maps/archive/` for the retired, as `maps/archive/<destination-slug>.md` and `maps/archive/<map-slug>.source.md`.
  - `guidebooks/`: one `guidebooks/<guidebook-slug>.md`, `guidebooks/<guidebook-slug>.source.md` where a document was given; `guidebooks/archive/` for the retired, as `guidebooks/archive/<guidebook-slug>.md` and `guidebooks/archive/<guidebook-slug>.source.md`.
  - `atlases/`: one `atlases/<atlas-slug>/` holding the Operator's `vision.md`, `intent.md`, `architecture.md` verbatim and the skill's `atlas.md`; `atlases/archive/` for the retired, as `atlases/archive/<atlas-slug>/`.
- **The register.**
  - One per project, a clone of a remote Roadwork repository.
  - Never pushed to; its commits local.
  - The remote ships the skeleton with its anchors, the docs, the rule and the skills.
  - The remote never ships a map or an item: maps and items are the project's own.
  - The project's law names the register's path and the alias, if any, of its reference prefix.
  - A spec archived shipped graduates to the register's `docs/context/` as a decision record.
- **The settings file.**
  - `config.json` at the register's root holds the instance's values the skills read by key; its schema is the config skill's (`/roadwork-config`), a key outside it an instance key listed in `docs/local/config-keys.json`.
  - **Every roadwork skill must read `config.json` before it acts** — a mandate, not a convenience: the register's `roadwork/config.json`, read once per run through the config skill's script with no argument, `node <config skill>/scripts/config.mjs`, and its lines held in the working context for the run — every key of the schema and every instance key with its value, a secret as "set, <n> characters" or "empty", never its value. A skill that has not read it does not act, as a skill without the constitution in context does not act: the constitution read and `config.json` read are the two preconditions of every run. The file is read by the script and by nothing else — never opened, parsed or printed directly.
  - A key the run needs that reads empty takes the default the schema names for it; a key without a default is asked of the Operator by the config skill's empty-keys prompt, never by the running skill.
- **Frontmatter**
  - It opens every `todo.md` and `feature.md`: eight keys, always present, empty allowed.
  - A `feature.md` carries nine: `onroad-cohort` eighth (see Cohorts) and `road-level` last.
  - The last key, `road-level`, is the item's level within its destination: `main`, `secondary` or `side`.
  - `road-level` is set by `/roadwork-nav-to-destination` from the destination's requirement, empty until then; the sanity todo is `main`.
  - `road-level` is read with the destination's `bucket-list-priority` to keep the loose order, never to rewrite it.
  - `blocker`: yes iff `blocking` is non-empty — derived, never set by hand.
  - `blocking`: the items this one blocks.
  - `blocked-by`: the items blocking this one; empty means not blocked.
  - `external`: an externality, a dependency that will not be met without something specific and out-of-band happening.
  - An operational pause in the due course — a push, a merge, a fetch, a reboot — is never one, even when its mechanism is known broken.
  - A mechanism known broken is a finding for the archive step and a clause in the ordering reason.
  - `external` counts as blocked until the Operator clears it.
  - The spec skill states each such dependency as a fact in the spec's Dependencies section.
  - In the act that records "spec accepted", the skill recording it writes the key: the spec skill, or `/roadwork-make` when the acceptance arrives on its own line.
  - An entry another register item satisfies is a `blocked-by`, both sides written.
  - An entry another party satisfies is the key's text, one short sentence per entry, joined with "; ".
  - That entry is recorded on the item file as `**External set (<YYYY-MM-DD>, by /roadwork-specplan on spec acceptance):** <the key's text>`.
  - The key is emptied only on the Operator's word, recorded as `**External cleared (<YYYY-MM-DD>, the Operator):** "<their words>" — <what now exists>`.
  - `/roadwork-make` refuses while it is set.
  - `group`: names shared by items that belong together; an item may carry several.
  - Groups are never declared; a name carries its formation date, `<name>-<YYYY-MM-DD>`.
  - `in-process`: the date `/roadwork-make` put the item on the road; empty when not; cleared by `/roadwork-verify-and-archive`, or by `/roadwork-specplan` when a reconsideration ends the previous go.
  - `disposition`: empty while open; set by `/roadwork-verify-and-archive` at archiving.
  - Its values: `shipped`, `withdrawn`, `superseded by <ref>`, `decided`, or `abandoned`.
  - An item never built, partly built, or only apparently built may be archived on the Operator's word with its shortfall recorded.
  
- **References.**
  - `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`.
  - From anywhere, `main/<kind>/<item-name>`.
  - The project's law may alias the prefix.
  - No reference contains ` && `: that is the batch separator.
  
- **Batch invocation.**
  - One skill, many references on one line, separated by ` && ` (space, two ampersands, space).
  - A single reference is the one-element case.
  - Every skill splits its arguments on the separator.
  - Accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, the two that can hold to one round for a whole batch.
  - Every other skill refuses more than one reference and names its reason in one line.
  - `/roadwork-tasksplit` is among them, one source at a time.
  - One carve-out: `/roadwork-ingest` accepts a **spark batch** — sparks only, one home — and converts it into one item.
  - The bare `/roadwork-spark` lists the open sparks grouped for it.
  
- **`ordering.md`**
  - One ordered list; top is next.
  - A line is `- <ref> — <why it sits here>`.
  - A group is an indented block under one line and moves whole.
  - Archived items are struck.
  - Loose by design: an order, not a schedule, maintained by agent judgment.
  - One per register, the project's whole.
  - It is what the session agent answers "what should we do next?" from.
  - **`working.md`** beside it records the items in process, same scope.
  - `working.md` is written by `/roadwork-make` and drained by `/roadwork-verify-and-archive`, a line also removed by `/roadwork-specplan` when a reconsideration ends the previous go.

- **How register items arrive**
  - Everything in the register is filed by a skill and by nothing else — never by hand, never by a sub-agent; each skill saves the source it was given verbatim beside what it writes, under a dated heading or as a `.source.md`.
  - Work items (a todo, a feature) are filed by four skills:
    - `/roadwork-ingest` — one item from the Operator's notes, or from a spark or a spark batch, the spark moved to its archive in the same act;
    - `/roadwork-nav-to-destination` — a destination's group of items from its requirements, its sanity todo last;
    - `/roadwork-tasksplit` — one todo per unit of a document or list;
    - `/roadwork-subagentifygroup` — a cohortmeister for a cohort it found.
  - A spark is filed by `/roadwork-spark` and becomes a work item only through `/roadwork-ingest`.
  - A destination by `/roadwork-destination`; an atlas by `/roadwork-atlas` from the three documents given; a map by `/roadwork-map`; a guidebook by `/roadwork-guidebook`.
  - Whichever skill files it, the item takes its fixed form: a work item its four files, frontmatter and ordering line; the rest the form its skill writes.
  
- **General Register Items Arrival Rules*
  - An item file carries the operator notes **verbatim** under a dated heading.
  - Later notes come as dated addenda, verbatim.
  - Never a paraphrase in place of the notes.
  - Never an interpretation passed off as operator notes.
  - Then comes the filer's (session agent's) reading under its own heading, marked as the filer's and pending the Operator's correction.
  - Then a numbered "not decided by this filing" list: the open questions the notes leave, each with the filer's reading.
  - That list seeds the interview's first round (as per skill).

- **What each skill writes from what it receives — the file it owns, written by it and by no other*
    - `/roadwork-ingest` receives the notes and writes the item file; `intent.md`, `spec.md` and `plan.md` are filed as placeholders.
    - `/roadwork-intentify` receives the Operator's answers and writes `intent.md`; a cohortmeister's `intent.md`, `spec.md` and `plan.md` are written by `/roadwork-subagentifygroup` from the cohort it found.
    - `/roadwork-specplan` receives the accepted intent and writes `spec.md` and `plan.md`; its scripts write the externality entry files.
    - `/roadwork-make` receives the go and writes `GATES.md`, the ledger, from the plan's gates, and the item's line in `working.md`.
    - `/roadwork-verify-and-archive` receives the Operator's word and writes the `disposition` key and the status line; a shipped spec it copies into `docs/context/<item-name>.md`.
    - `/roadwork-spark` receives an idea and writes `spark/<item-name>/idea.md` with its one round.
    - `/roadwork-tasksplit` receives a document and writes `docs/<name>.source.md` and one todo per unit.
    - `/roadwork-destination` receives a description or a document and writes `destinations/<destination-slug>.intent.md` first, then `destinations/<destination-slug>.prd.md`; a document given is saved as `destinations/<destination-slug>.source.md`.
    - `/roadwork-nav-to-destination` receives a destination and writes its items, the sanity todo last, and the `group` and `road-level` keys on each.
    - `/roadwork-navsanity` receives a group and writes a dated run section in the group's sanity todo.
    - `/roadwork-atlas` receives three documents and writes `atlases/<atlas-slug>/atlas.md` beside them, with the destinations it proposes.
    - `/roadwork-map` receives a description or a document and writes `maps/<destination-slug>.md`; a document given is saved as `maps/<map-slug>.source.md`.
    - `/roadwork-guidebook` receives a description or a document and writes `guidebooks/<guidebook-slug>.md`; a document given is saved as `guidebooks/<guidebook-slug>.source.md`.
    - `/roadwork-intent-insights` receives the day's interviews and writes a dated section in `docs/intent-insights.md` when first run and on every run after; the file exists once it has.
    - `/roadwork-audit` receives a document and a kind and writes a dated audit section on the item it names.
    - `/roadwork-config` receives a key and a value and writes the settings file, which is never committed.
    - `/roadwork-help` and `/roadwork-inventory` receive a question or nothing and write nothing.
  
- **Atlases.**
  - An atlas is the highest-order thing in the register, above the destination.
  - It is one folder, `atlases/<atlas-slug>/`.
  - It holds the Operator's `vision.md`, `intent.md` and `architecture.md`, verbatim.
  - It holds the skill's `atlas.md`: title, dated status, each document's source, a description derived from the vision and marked so.
  - It is made by `/roadwork-atlas <atlas-slug> vision: … intent: … architecture: …` from documents by path, paste or URL.
  - All three are required; nothing is written on a refusal.
  - Bare, `/roadwork-atlas` lists the atlases with the destinations naming each.
  - A destination names its atlas by the frontmatter key `atlas`: one atlas per destination, or empty.
  - The key is asked by `/roadwork-destination`.
  - The atlas skill suggests the atlas's destinations in `atlas.md`; a slug call derives them for an existing atlas.
  - The atlas skill never writes a destination.
  - No interview, no update: a changed document is replaced by hand.
  - A retired atlas moves to `atlases/archive/` by hand.
  
- **Destinations.**
  - A programme of work is a destination: two files in the register.
  - Its intent, `destinations/<destination-slug>.intent.md`, in the item intent's form, interviewed and written first.
  - Its product requirements document, `destinations/<destination-slug>.prd.md`, written from the intent.
  - Both are made by `/roadwork-destination`.
  - Bare, `/roadwork-destination` lists the destinations with their navigation state.
  - `<new-slug> <description>`: an interview in `/roadwork-intentify`'s pattern, writing the intent and then the fixed form — a frontmatter block with `bucket-list-priority`, 1–10, 10 the highest, and `atlas`; the destination, a Stack section (the architecture read, the guidebooks drawn on, the changes to their stacks), numbered requirements, Out, Success.
  - `<existing-slug>`: an update of both files — the intent revisited, a destination without one gaining it — with a dated changelog line.
  - A pasted document or path: saved verbatim as `destinations/<destination-slug>.source.md`, then interviewed.
  - `/roadwork-nav-to-destination <destination-slug>` (a slug only; anything else refused) turns it into a group.
  - Every derived item cites the destination by path.
  - Every derived item carries the line **Destination:** `<destination-slug>`: one destination per item, the group's; no frontmatter key.
  - Every derived item carries the group `<destination-slug>-<YYYY-MM-DD>`.
  - Every derived item is `blocked-by` the sanity todo `todo/<destination-slug>-sanity`, which the skill creates last.
  - The sanity todo is the Operator's check of the decomposition and its completeness, worked by `/roadwork-navsanity`, archived on the Operator's word.
  - Nothing in the group starts before that.
  - A built destination's two files move to `destinations/archive/` by hand, together.
  - `/roadwork-tasksplit <source>` is the small sibling: any document or list into a dated group of todos.
  - One todo per unit the source delineates, the source's words verbatim.
  - No sanity todo.

- **Maps.**
  - A map is the way to one destination, one map per destination: before agents, process, stack, judgements, inputs.
  - One `maps/<destination-slug>.md` per map in the register, the destination's own slug, in the fixed form `/roadwork-map` writes; a map that keeps a name of its own, `the-lifecycle`, is the one exception.
  - Bare, `/roadwork-map` lists the maps with the count of items naming each.
  - `<destination-slug> <description>`: the interview; a slug that is not an open destination's, or whose destination already has a map, is refused.
  - `<existing-slug>`: an update with a dated changelog line.
  - A pasted document or path: saved verbatim as `maps/<destination-slug>.source.md`, then interviewed.
  - An item names its map by one line, **Map:** `<map-slug>`, under its owner line: one map per item, no frontmatter key, the Referent line after it where one is named.
  - The line is written by `/roadwork-intentify` when the Operator names one, or by `/roadwork-nav-to-destination` when the destination names one (its optional Map line, inherited by the group).
  - `/roadwork-intentify` and `/roadwork-specplan` read the item's map.
  - No skill enforces one.
  - A retired map moves to `maps/archive/` by hand.
  
- **Naming.**
  - Every roadwork register skill's name begins with `roadwork`: `roadwork-ingest`, `roadwork-spark`, `roadwork-destination`, `roadwork-nav-to-destination`, `roadwork-help`, `roadwork-map`, `roadwork-navsanity`, `roadwork-intentify`, `roadwork-specplan`, `roadwork-verify-and-archive`, `roadwork-tasksplit`, `roadwork-subagentifygroup`, `roadwork-atlas`, `roadwork-intent-insights`, `roadwork-audit`, `roadwork-config`, `roadwork-guidebook`, `roadwork-inventory`.
  - Every lifecycle skill begins with `roadwork-`, the go included: `/roadwork-make`.
  - `unlazy` is not one.
- **Cohorts.**
  - `/roadwork-subagentifygroup <group>` finds subgroups of a group's features that can be built in parallel by sub-agents.
  - It finds them by a **rubric** every criterion of which must pass: no dependency edge between members, disjoint file ownership, accepted spec and plan with gates, no external and not in process, self-contained builds.
  - The rubric is read back before any cohort is declared.
  - Each cohort gets a **cohortmeister** `feature/cm-<group>-<cohort>`: a pseudo-feature the skill files itself, blocking every member.
  - The cohortmeister's plan is unlazy's orchestrated PLAN form: one sub-agent per member, the CM's ledger as the results checker.
  - `onroad-cohort` (features only) names the cohort.
  - `/roadwork-make <CM>` runs the cohort.
  - A member alone is refused unless the Operator says proceed: the **override**, unrecorded.
  - A failed member **reverts** to standalone, with a dated note sending it through `/roadwork-specplan` again.
  - `/roadwork-verify-and-archive <CM>` archives the met members with it: the **cascade**, members `shipped`, the CM `decided`.
  - Cohorts sit last in the group's block.
  - The skill sits after `/roadwork-nav-to-destination`, before `/roadwork-navsanity`, which checks cohorts.
- **Lifecycle skills, in order:**
  - `/roadwork-atlas` (three documents into an atlas, above a destination).
  - `/roadwork-destination` (a destination: its intent and its product requirements document).
  - `/roadwork-nav-to-destination <destination-slug>` (a destination into a group, a sanity todo last).
  - `/roadwork-ingest` (ingest: kind decided, duplicates refused by judgment across the register, item placed in `ordering.md`; never archives an item — a converted spark's move into `spark/archive/` is its one archiving).
  - `/roadwork-intentify <ref>` (read-back first — its four questions: the notes, the interpretation, the map, the referent — then the prepared round, then the design tree).
  - `/roadwork-intentify` is roadwork-register-aware across the register and writes cross-notes and frontmatter into related items.
  - `/roadwork-specplan <ref>` (`spec.md` with concerns first, `plan.md` with gates).
  - On an existing accepted spec and plan, `/roadwork-specplan` runs a reconsideration: dated changelog, proven gates kept, the previous go ended, the spec proposed again.
  - Every spec is written under the Operator's spec-writing guidelines, with tagged requirements and two verification rounds of fresh readers, one on the spec and one on the plan.
  - `/roadwork-make <ref>` (the Operator's go: one item, refused while blocked).
  - `/roadwork-make` writes `in-process`, the `working.md` line and the item's `GATES.md` from the plan, then builds under `/unlazy`.
  - `/roadwork-verify-and-archive <ref>` (archiving: evaluates concerns, unmet gates and landing by ancestry, then interviews the Operator).
  - On their word, the six-place act: resolution and `disposition`, move to `archive/`, strike from `ordering.md`, `working.md` and `in-process` cleared, dependents' `blocked-by` cleared.
  - `/roadwork-verify-and-archive` then offers the next item, group first.
  - Beside the chain, not a step: `/roadwork-help [<skill> | <ref> | <term>]` answers, and `/roadwork-intent-insights` learns from the day's interviews.
  - `/roadwork-help` gives the overview with no argument, one thing with one.
  - It reads live from `docs/teachme.md`, this constitution's terms table and glossary, and the register, and writes nothing.
  - Each stops and hands back; none starts the next.
  - An accepted spec is not a go: only `/roadwork-make` or the Operator's word is.
  - **Every skill in the chain ends by offering the next logical skill and item**: the next step for this item, or, after archiving, the next item from `ordering.md`.
  - It is an offer in one line, never an invocation.
  - It is printed as the invocation itself, in its own fenced code block (three backticks, no language tag), so the Operator may copy and run it.
  - Every offered block is preceded by one plain sentence naming the item, what is waiting on it, and what typing the block does.
  - The state is folded into the sentence, never a heading.
  - One sentence for a batch, every item named.
  - Related offers combine into one invocation with the separator ` && `; the skill still never invokes it.
  - The interrupting skills — `/roadwork-ingest`, `/roadwork-spark`, `/roadwork-verify-and-archive`, `/roadwork-specplan` — also end with the **back offers**, as do `/roadwork-atlas`, `/roadwork-destination`, `/roadwork-map`, `/roadwork-guidebook`, `/roadwork-tasksplit`, `/roadwork-audit` and `/roadwork-intent-insights`.
  - The back offers: up to five open lifecycle steps in flight, most recent first, read from the road plans at that moment, never from memory.
  - A spark's exit is conversion only, on the Operator's word.

- **Externalities and their notices**
  - An externality is a dependency of a work item that will not be met without something specific happening outside the project — e.g. an account opened, a key issued, a third party acting. A pause in the project's own course (a push, a merge, a fetch, a reboot) is never one.
  - The spec names each externality as a Dependencies entry: what must be true, who acts, how its completion is observed. On `/roadwork-specplan` spec acceptance the entry is written on the item: a `blocked-by` where another item acts, the `external` key where another party does. `/roadwork-make` refuses while the key is set; only the Operator clears it.
  - An externality may be reported to a notification service: any receiver that accepts a webhook — an HTTP endpoint that takes a `POST` of a JSON record. The service is optional and is not part of Roadwork; the project chooses one, or none.
 - Four settings keys in the register's `config.json` name the service, all optional: `notify-url`, the address a notice is posted to; `status-url`, the address an item's externalities' state is read from; `notify-token` and `status-token`, the credential each address wants, sent as the header `Authorization: Bearer <token>` when set and omitted when empty. The URLs are public addresses, set with `/roadwork-config <key> <value>`; the tokens are secrets, set by the config skill's file or environment route and never typed in chat, printed or committed.
  - Nothing is sent or read while a key is empty. An empty `notify-url` means no notice, said in one line. An empty `status-url` means the state is asked of the Operator.
  - The notice: one `POST` to `notify-url`, the record as JSON. The record's nine fields: `what`, `who-acts`, `how-observed`, `state` (`open` | `cleared`), `item` (the item's reference), `set-date`, `cleared-date` (ISO 8601 UTC, null while open), `cleared-words` (the words that cleared it, null while open), `atlas` (the item's destination's atlas slug, `none` where none). Only the response's status code is read; a code outside 200–299, or no answer within a bounded wait, is a failure said in one line and blocks nothing.
  - The status read: one `GET` of `status-url` with `item=<ref>` appended as a query parameter. The answer is a JSON array of `{what, state}`, one per externality, matched to the item's Dependencies entries by `what`. The state is `unknown` on no answer, another form or a code outside 200–299, and `empty` on `[]`.
  - When each is made: the notice once per entry when `/roadwork-specplan` sets it on acceptance, and once per entry when `/roadwork-make` clears it; the status read by `/roadwork-make` at its start, by `/roadwork-inventory` on its bare call, and by `/roadwork-verify-and-archive` in its evaluation.
  - How the call is made is the agent's choice — curl, a script, anything that speaks the wire above. The config skill ships `scripts/externality.mjs` (`notify`, `status`) as one way; no skill or gate requires it. The two URLs are read from the settings file by whatever makes the call and are not printed in replies or records.

- **Sub-agents and their models**
  - The session agent is the lead and the only dispatcher: it plans, assigns work and accepts the result; it is never a worker, and a sub-agent never dispatches another.
  - Six sub-agent types, defined below and grouped in three categories — Readers, Finders, Builders — each tied to one settings key of the `subagent-` group (the config skill's schema), whose value is the model family the type runs on — a family name the dispatching host resolves, Anthropic's (`haiku`, `sonnet`, `opus`, `fable`) or another vendor's, never a release: the newest release of the named family the host offers is assumed at every dispatch, so a key never goes stale; a key read empty takes its default. Any skill may dispatch any of the six; the type of a dispatch is the session agent's determination at invocation, from the task, unless the skill's step names it. A skill may define a further type in its own text, in the same terms as the six and with its own `subagent-<type>` key added to the schema first; such a type is the skill's until this bullet adopts it:
    - **reader** (a Reader) — fresh eyes on a document against one question: the verification rounds of `/roadwork-specplan`, the readers of `/roadwork-audit`, the checks of `/roadwork-navsanity`. Given: the documents' paths, one question, the return shape, nothing else. Returns: findings as file, line, one sentence and an empty disposition slot, at most the cap the skill sets, "clean" as none. May read the named files. May not read beyond them, rewrite anything, decide anything, or fill the disposition slot. Key `subagent-reader`, default `sonnet`.
    - **finder** (a Finder) — one fact for the session agent from inside the project or its records: a file's content, a commit, a config value, what another item says — `/roadwork-intentify`'s environmental facts, `/roadwork-specplan`'s gathering. Given: the question, where to look, the output wanted back. Returns: the fact with its source by path or commit, or "not found" with where it looked. May read and search. May not write, recommend, decide, or widen the question. Key `subagent-finder`, default `haiku`.
    - **explore** (a Finder) — discovery across the project when the place is not known: which files, folders or naming conventions carry a thing, swept broadly and reported as locations. Given: what is sought, the breadth (medium, very thorough), the output wanted back. Returns: the locations with one line each on what each holds, not the files' contents. May read excerpts and search. May not write, review or audit what it finds. Key `subagent-explore`, default `sonnet`.
    - **research** (a Finder) — outside sources: documentation, changelogs, interfaces, published facts, compared and summarised with links. Given: the question, any sources to start from, the output wanted back. Returns: a short summary with its sources' addresses, disagreements between sources named. May read, search and fetch outside the project. May not write in the project, decide, or present one source's claim as settled where sources differ. Key `subagent-research`, default `sonnet`.
    - **builder** (a Builder) — a deliverable built under a ledger once the files, approach and done criteria are clear: `/roadwork-make`'s build steps, one per cohort member under `/unlazy`. Given: the item folder, the ledger, the owned paths, the spec's Design, the plan's step, the acceptance checks, the output wanted back. Returns: the work in place, a report naming every write, the gates' output, and what it could not do. May write inside the owned paths, run the gates, record evidence, commit where the plan says. May not approve an oracle, archive, open a pull request, push, post outside the workspace, write outside its paths, or lower or delete a gate; the session agent approves oracles before dispatch and reverifies after return. Key `subagent-builder`, default `opus`.
    - **reviewer** (a Builder) — a finished change checked against its original brief, independently of whoever built it: finds the diff, runs the checks itself, returns concrete findings with evidence; its findings go back to the builder and the change is rechecked. Given: the brief, the change (branch, diff or paths), the checks to run, the output wanted back. Returns: findings with evidence, each tied to a line of the brief, "none" where the change meets it. May read and run the checks. May not implement, rewrite, approve, or decide whether the change is accepted. Key `subagent-reviewer`, default `opus`.
  - Every worker's brief carries the goal, the relevant paths, the allowed changes, the acceptance checks and the output wanted back; paths, not pasted content, and the brief is the worker's whole world.
  - Effort: the session agent's judgement at the time of each dispatch, set explicitly from the task's difficulty — the depth of reading or building the brief asks for, how much a miss would cost; no level is fixed by this rule or by a skill.
  - A sub-agent's return is evidence, not a decision: the session agent reads every finding and claim, accepts or rejects each by its own judgement, records the disposition and the reason, and reverifies a builder's claim of done by the gates before relying on it. A finding is never incorporated because a sub-agent produced it, nor dropped without the reason said.
  - Tiny changes are handled directly; no role is spawned for every task. No sub-agent speaks to the Operator, posts to a relay or touches a key; a sub-agent's handle never appears in a reply.
  - Where a skill runs its sub-agents as one workflow, the model family above binds every agent of the workflow the same, and the effort is the session agent's one judgement for that run, set once for all of them.

### N. Offers — the next step, the ways back, the batch

#### N.1 What this section is
- Every final hand-back (i.e. when the instant skill functionality is complete) should end with one list of offers.
- The list is read from the register at that moment, never from memory.
- Printing the list runs nothing: an offer is a proposal the Operator may type; no skill, command or write happens until the Operator types it.
- Three parts, fixed order:
  1. The **next-step offer** the skill's own text mandates.
  2. The **back offers**: the open lifecycle steps in flight.
  3. Where the situation calls for one, a **git offer**; then one **batch offer**, or the sentence that none applies.
- Every offer is printed in a code box.
- Every offer carries an id.
- An id typed alone is the Operator's word for its whole box.

#### N.2 Form of an invocation
- Order: skill first, then its input, then the word it waits on, if any.
- Pattern: `/<skill> <ref> <word>`.
- Examples:
  - `/roadwork-make todo/x spec accepted`
  - `/roadwork-verify-and-archive todo/x archive, shipped`
- Several words for one invocation: joined with ` and ` after the input.
  - `/roadwork-make todo/x G7 accepted and spec accepted`
- The skill reads the words from its own invocation.
- The skill records each word, dated, as the Operator's, before it acts.
- A directive phrase that is not a skill keeps its own wording.

#### N.3 Form of a batch (multi-invocation)
- Invocations joined with ` && `.
- Order: the order they run, left to right.
- Each unit is one invocation of the N.2 form.
  - `/roadwork-make todo/a spec accepted && /roadwork-verify-and-archive todo/b archive, shipped && /roadwork-specplan feature/c`
- One box.
- A unit's words bind to its own unit only.
- The chain is the session agent's sequence; each unit is one skill call.
- A skill that refuses batches still sees one reference.
- A unit that stops for the Operator's word (a round, a review gate) ends the chain there.
- The rest of the chain is re-offered in that hand-back.

#### N.4 The code box
- Every offer — next step, back, git, batch — is printed in its own fenced code box.
- The box: a line of three backticks, no language tag; the offer's text alone; a line of three backticks.
- Nothing else in the box.
- One offer per box.
- No offer is ever printed inline, indented or in prose.

#### N.5 The next-step offer
- Whatever the skill's text mandates.
- This section never changes, adds to or reorders it.
- Always O1.

#### N.6 The back offers
- **What qualifies:** the open items in flight, by the six states of `/roadwork-ingest` §5b:
  - interview open
  - intent accepted
  - awaiting the go
  - built, to be verified and archived
  - archive interview open
  - a spark's round open
- **Excluded:** the instant item; the item O1 names.
- **Order — navigation first, `ordering.md` second:**
  - The Operator works one navigation at a time.
  - First: items of the instant item's destination (the destination named on its item file; `unnavigated` counts as one).
  - Then: the rest.
  - Within each part: `ordering.md` position, top first.
  - An item absent from `ordering.md` (a spark): last.
- **Count:** following the next offer, at most 4 back offers, plus the git offer and the batch offer.

#### N.7 The git offer
- Situational: printed only when the session agent knows of something of this item's or the session's to land.
  - an unlanded branch
  - a pull request awaiting its merge
  - a mirror waiting on a slot
- Read from the records and the session, never assumed.
- One box per thing.
- Each box the phrase the procedure in force names.
- Place: after the back offers, before the batch offer.
- Nothing to land: no git offer and no sentence about it.

#### N.8 The batch offer
- **What it is:** one box joining, in run order, every offer above that can run through to its end without the Operator mid-run.
- **A unit qualifies when all three hold:**
  - it waits on no word, or its word is in the box;
  - its item is not blocked at the moment the unit would run: `blocked-by` empty or naming only built items, `external` empty, no open cohort holding it;
  - its skill would not refuse it at §0 for any other reason the agent can read now (a placeholder spec, `in-process` already set).
- **Blocking across units:**
  - A unit that clears another unit's block (a verify-and-archive of its blocker, a make that builds it) runs before the unit it unblocks; the box is ordered so.
  - A unit still blocked after every unit before it has run is left out of the box and stays as its own offer above.
  - A unit whose item would be blocked by a unit in the same box that has not yet run is placed after it, never before.
- **Stopping:** a unit that stops for the Operator's word, or that a skill refuses when run, ends the chain there; the units after it are re-offered in that hand-back, nothing skipped silently.
- **Omitted** when fewer than two units qualify, with one sentence:
  - "No batch offer: every offer above waits on a word of its own."
  - "No batch offer: the offers above block one another."
  - or "No batch offer: one offer only."
- The last offer; carries the last id.

#### N.9 Ids
- `O1`, `O2`, … in printing order.
- One sequence per hand-back.
- Bold, at the start of the sentence before the box.
- The Operator may type the id alone.
  - The agent reads it as the whole box, word and invocation together.
  - The agent names the offer in full before acting.
  - The agent records "typed as O<n>" with the verbatim box.
- An id with text after it: that box with the text as completion.
- Refused, with the offers re-listed:
  - an id matching no offer of the last hand-back
  - two ids in one message

#### N.10 The sentence before each box
- One sentence: the id in bold; "typing this …"; the parenthetical "(to …)" saying what will happen and or exist afterwards.
- Then the box.
- A word-bearing offer: its restatement bullet directly above its sentence (reply-form rule).

#### N.11 The fact suffix
- By the clock, after the last offer.
- Never after `/roadwork-help`.

#### N.12 Step by step
1. Write the next-step offer the skill's text mandates, in its box. Id O1.
2. Read `working.md` and every open item's four files and `GATES.md`; classify each into one of the six states or none.
3. Drop the instant item and O1's item.
4. Split: the instant item's destination first, the rest after; within each, `ordering.md` position; sparks last.
5. Take the first four. Write each as `/<skill> <ref> <word>` in its box with its sentence; ids O2 onward.
6. Where the session knows of something to land, append the git offer(s) in their boxes, next ids. Otherwise none.
7. Test every offer above against N.8; order the qualifying units so each unblocker runs before what it unblocks. Two or more: one box joined with ` && `, the last id. Fewer: the "No batch offer" sentence.
8. Fact suffix if the minute is a multiple of six.
9. On the Operator's reply: an id → the full box; run; record "typed as O<n>".     

# Terms — the plain word, the agent's word, the meaning

- In all text for the Operator, use the plain words from the following terms table; (to maintain usage continuity)

| Plain word | Agent's word | Meaning |
|---|---|---|
| the work-plans system | Roadwork | The work-plans system by 2nd Cortex Labs: the plans and the skills that work them. |
| work-plans folder | Road plans | Your project's `roadwork/` folder, the one place its work is recorded; todos, features and sparks each in their own sub-folder. |
| a work item | Item | One folder holding a todo or feature file plus its intent, plan and spec; a spark holds one idea file only. |
| where an item lives | Home | The work-plans folder (Road plans) seen from an item, the one it lives in — your project's one such folder, at the path its law names; a copy of a remote, never updating it. |
| an item's name-with-path | Reference (ref) | How an item is pointed at: `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`, or `main/<kind>/<item-name>` from anywhere. |
| the item's header keys | Frontmatter | The block at the top of an item file: blocker, blocking, blocked-by, external, group, in-process, disposition, road-level; a feature's onroad-cohort before the last. |
| something out-of-band we wait on | External | A dependency that will not be met without something specific and out-of-band happening; a wait in the due course, such as a merge, is not one. The spec names it, one entry per act outside the project, never one per party or per service; the key records it; only you clear it; its observed-by test runs at acceptance and before a make, a command where one is written, your word where not. |
| the order file | `ordering.md` | The loose list of what comes next, top first; beside it `working.md` lists what is in process now. |
| you, the owner | Operator (user) | The human owner of the project; every decision is yours. |
| the agent in your session | Session agent | The agent running the session that typed the command. |
| everything in the project | Project scope | Everything at and under the root the project's law names; an item's Paths line says which of it the item touches. |
| one shipment | Batch | The coherent bundle a project's changes ship in as one pull request; the work-plans' own records stay local. |
| the chain of steps | Lifecycle | Destination, then group, then filing, then interview, then spec and plan, then the go, then verify and archive; the help skill answers beside it. |
| product requirements document | PRD | A document that says what a destination is, written from the destination's intent: a header with its priority and its atlas, the destination, numbered requirements, what is out, how success is seen. |
| a destination | Destination | Two files per destination, made with you: its intent, written first, and its product requirements document, written from it, carrying the stack it builds on, and later broken into a group of items; both archived together. |
| a way to a destination | Map | The way to one destination, one map per destination: the process, the stack, the judgements, the inputs, and how it was done before agents. |
| an atlas | Atlas | The highest-order thing in the plans, above a destination: a folder holding three documents of yours — the vision, the intent and the architecture — verbatim, and the skill's `atlas.md`; several destinations serve it, each naming it by its atlas key or leaving the key empty; the skill proposes the destinations that would serve it, in its file, for you to make or strike. |
| a vision | `vision.md` | One of the atlas's three documents, yours verbatim; the atlas's description is derived from it and marked so. |
| an architecture | `architecture.md` | One of the atlas's three documents, yours verbatim; the skill reads it as given. |
| a guidebook | Guidebook | A standardized knowledge base broad in application — standards, stack, vendors, judgements, sources, an Architectures line saying which architectures its stack fits, or none — one file in `guidebooks/`; a map copies the parts it needs. |
| a stack | Stack | What a destination is built on: environment, framework, tooling, assets and services; chosen per destination from the guidebooks, carried by the requirements file, the map, the spec and the plan. |
| the group's check item | Sanity todo | The todo created last for a group, holding the group list; nothing in the group starts until you say the group is right. |
| the kinds of check | Check types | The six checks run over a group: completeness, provenance, shape, dependencies, order, scope; a seventh over any cohort in it. |
| one check pass | Run | One pass of the checks over a group, recorded as a dated section in the group's check item. |
| a group made by hand | Hand-made group | A group with no destination document behind it; its requirements are its members' own claims and the group's line in the order file. |
| a build-together set | Cohort | Features in one group that helper agents can build at the same time: the five tests all pass. |
| the stand-in for a cohort | Cohortmeister (CM) | A stand-in feature that blocks its cohort's members, is put on the road in their place while helper agents build them, and archives with it the members that pass; one that fails goes back to standing alone. |
| the five tests | Rubric | The five pass-or-fail tests a set of features must meet to be built together. |
| a rethink | Reconsideration | Running the spec skill again on an item whose spec and plan were accepted — after a failed build, a changed dependency, an amended intent, or your wish to rethink; the old go ends. |
| the fresh-eyes review | Verification round | Seven fresh readers on a spec and five on a plan, one question each, before you see it. |
| a reading helper | reader | A helper given a document and one question, returning findings only; the fresh-eyes review's readers. Runs on the family the setting `subagent-reader` names. |
| a lookup helper | finder | A helper that fetches one fact from inside the project — a file, a commit, a setting, what another item says — with its source. Runs on the family `subagent-finder` names. |
| a search helper | explore | A helper that sweeps the project to find where something lives, returning locations. Runs on the family `subagent-explore` names. |
| an outside-sources helper | research | A helper that reads documentation and other outside sources and returns a short summary with links. Runs on the family `subagent-research` names. |
| a building helper | builder | A helper that builds one deliverable inside its allowed files under the item's gates and reports every write. Runs on the family `subagent-builder` names. |
| a checking helper | reviewer | A helper that checks a finished change against its brief and returns findings with evidence; it changes nothing. Runs on the family `subagent-reviewer` names. |
| the helper's model | model family | The vendor's line a helper runs on — sonnet, opus, haiku, or another vendor's — never a release number; the newest release is assumed. Set per helper type with the config skill. |
| the way-back offers | Back offers | After an interruption, up to five open steps offered, most recent first. |
| the item's folder name | Item name | The kebab-case name chosen when the item is filed, in your words, never reused. |
| several at once | Batch invocation | Several references on one line joined with ` && `, run as one command where the skill allows it. Nothing to do with a shipment (Batch): this batch is of references. |
| a list-only call | Bare call | A skill typed with nothing after it lists instead of acting and writes nothing; the help skill prints its overview, the config skill asks its empty keys. |
| how offers look | Offer form | Anything you are invited to type is printed in its own code box with one sentence saying what typing it does, or offered as a choice to tick. |
| the fact at the end | Fact suffix | Now and then a hand-back ends with one fact about the system and a box holding the command that explains it. |
| a list into todos | Tasksplit | Any document or list turned into a dated group of todos, one per unit, the source's words kept. |
| your notes, word for word | Notes verbatim | Your words quoted exactly under a dated heading, never paraphrased; the agent's reading is marked as its own. |
| an item already filed | Duplicate | An open item that already carries the ask; judged, never matched by string. |
| the read-back | Read-back | Before any question, your notes and the agent's reading are read back to you and two questions asked — a third, which map, when the item names none. |
| a related item | Crossing / cross-note | Another item this one overlaps, shares a group with, or depends on; noted in that item's file, dated. |
| a concern | Area of concern | A clash between rules or a constraint that cannot be met, recorded with who decides it; never settled silently. |
| a pass-or-fail check | Gate | One observable outcome, checked by a command that fails without it or, where no command can decide, by a named reviewer; the file that lists them is the ledger. |
| a gate's name | Gate id | `G<n>`, a gate's name in its ledger; printed outside the ledger with a few words in parentheses saying what the gate is. |
| the go | The go | Your authorisation to build: the make command or your word; accepting a spec is not it. |
| the ledger | Ledger / `GATES.md` | The item's gates in the checker's form, the file `GATES.md` in the item folder; a handoff is the hand-back when any gate is unmet or abandoned, or waits on your decision. |
| the pull-request offer | Pull-request offer | The phrase `open the pull request for <repo> <branch>`, offered last where a branch has not landed; typing it is your word for one merge handshake on it. |
| the inventory page | Inventory | The one page the inventory skill prints, computed by its script: a dated title and a counts line, then each atlas as a heading with its description and counts, its destinations as headings each with its navigation state and counts (open, ready), their work items two lines each — the reference, level and state, then the title — each state read from the item's own files (awaiting interview, intent drafted, intent accepted, awaiting the go, in process, blocked with its blocker's state in parentheses, external), a destination shown built when every item of it is archived; then the destinations under no atlas, the items not yet navigated, the ideas, then what has not yet landed; each work item's next step offered under its lines, nothing offered after the page; read live, nothing written. |
| not yet landed | Not yet landed | The inventory page's last block, where the project is versioned: every branch of its repositories not yet in `origin/main`, read from local refs. |
| one evaluated fact | Finding | One fact found at archiving (a concern, an unmet gate, a landing state, a dependent) put to you as a question. |
| how it was closed | Disposition | How an item was archived: shipped, withdrawn, superseded by another item, decided, or abandoned. |
| an idea parked for later | Spark | One folder holding one idea file, never worked; nothing waits on it; its only exit is conversion on your word. |
| a spark becoming work | Conversion | The one move a spark makes: turned into a todo or a feature on your word, the spark moved to its archive. |
| a spark's related line | Related | The one line of references written when a spark is filed; the only cross-item note a spark gets. |
| a saved record | commit | One saved snapshot of files with a message: one recorded change. |
| a line of work | branch | A named line of saved records that can be worked apart from the main one. |
| a request to merge | PR | A pull request: asking that a line of work be brought into the main one; a shipment travels as one. |
| bringing lines together | merge | Bringing one line of work into another so both sets of records are in it. |
| getting the remote's records | fetch | Downloading the remote's records without changing your own files. |
| a local copy of a remote | clone | A full copy of a remote's records on your machine, linked to that remote. |
| sending records to the remote | push | Uploading your saved records to the remote; the work plans never do this. |
| the latest record | tip | The newest saved record on a line of work. |
| descends from | ancestry | Whether one record is in the history of another; how landing is proven. |
| a project's record store | repo | A folder whose history git keeps; a project, its work plans, or a remote. |
| the insights | intent-insights | What the interviews taught about how you decide, one section per day in the plans' docs folder, written by the end-of-day skill on your word and read by the interview before it reads your notes back. |


## Glossary

- **Roadwork register** — the project's `roadwork/`: the one place its work is recorded. Three **sub-registers**: `todo/` (fixes, chores, decisions, findings), `feature/` (new capabilities), `spark/` (ideas; never worked); the test: a todo is done once, a feature is reused when built — the Operator may name the kind against it. Should be located in the session startup directory (i.e. project home directory)
- **Item** — one folder under its destination's folder in a sub-register (`unnavigated/` until a navigation cites it): `todo.md` or `feature.md` (the **item file**) plus `intent.md`, `plan.md`, `spec.md`; a spark holds only `idea.md`.
- **Home** — the register an item lives in: the project's one register.
- **Reference (ref)** — `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`; from anywhere, `main/<kind>/<item-name>` — the project's law may alias the prefix.
- **Frontmatter** — the YAML block opening an item file: `blocker`, `blocking`, `blocked-by`, `external`, `group`, `in-process`, `disposition`, `road-level` (the item's level within its destination — `main`, `secondary`, `side` — or empty), a feature's `onroad-cohort` before it.
- **External** — the `external` key: an externality, a dependency that will not be met without something specific and out-of-band happening an operational pause in the due course — a push, a merge, a fetch, a reboot — is never one. Stated by the spec skill as a fact in the spec's Dependencies section (what, who acts, how observed) — one entry per out-of-band act, never per party or per service — and written on spec acceptance: a `blocked-by` where another item acts, the key's text where another party does, with the item file's dated `**External set**` line; emptied only by the Operator, with the dated `**External cleared**` line; `/roadwork-make` refuses while it is set; its observed-by part run as a test at acceptance and before a make, a command deciding it where one is written, the Operator's word where not; notified where the workspace names an address.
- **`ordering.md`** — the register's loose priority list; top is next. **`working.md`** — the register's dated list of items in process.
- **Operator** — the human owner; every decision is theirs. **Session agent** — the agent running the session that invokes the skill.
- **Project scope** — everything at and under the root the project's law names; the paths an item touches are its **Paths:** line.
- **Batch** — the coherent bundle a project's changes ship in as one PR; the register's own commits are local and never a PR.
- **Lifecycle** — `/roadwork-atlas` (three documents into an atlas, above a destination) → `/roadwork-destination` → `/roadwork-nav-to-destination` (a destination into a group) → `/roadwork-ingest` (or `/roadwork-tasksplit`, many at once) → `/roadwork-intentify` → `/roadwork-specplan` → `/roadwork-make` (the go — the skill or the Operator's word; builds under `/unlazy`) → `/roadwork-verify-and-archive`. Every skill ends by offering the next. Beside the chain, `/roadwork-help` answers and `/roadwork-intent-insights` learns from the day's interviews.
- **PRD** — a product requirements document, `destinations/<destination-slug>.prd.md`, made by `/roadwork-destination` and the source of a group of items made by `/roadwork-nav-to-destination`; cited by path in every derived item.
- **Destination** — two files beside each other in `destinations/`: `<destination-slug>.intent.md`, what is wanted and why in the Operator's words, in the item intent's form, interviewed and written first; and `<destination-slug>.prd.md`, written from it, in a fixed form (a frontmatter block with `bucket-list-priority`, 1–10, 10 the highest, and `atlas`; the destination, a Stack section — the architecture read, the guidebooks drawn on, the changes to their stacks — numbered requirements, Out, Success); its slug categorises the register's items — one destination per item, the group's, written on the item by `/roadwork-nav-to-destination`; both files archived to `destinations/archive/` by hand when built.
- **Map** — one `maps/<map-slug>.md`: a primitive of the way to a destination — before agents, process, tools, judgements, inputs — in a fixed form, made by `/roadwork-map`; named on an item by its **Map:** line, one per item, read by `/roadwork-intentify` and `/roadwork-specplan`; a pattern to follow or improve, enforced by nothing; retired to `maps/archive/` by hand.
- **Sanity todo** — the todo `/roadwork-nav-to-destination` creates last, `todo/<destination-slug>-sanity`: the group list and the requirement↔item mapping both ways; blocks every other item in the group until the Operator says the group is right.
- **Check types** — the six sanity checks `/roadwork-navsanity` runs over a group: completeness, provenance, shape, dependencies, order, scope.
- **Run** — one pass of `/roadwork-navsanity` over a group: six checks, ten questions, the changes made; recorded as a dated section in the group's sanity todo.
- **Hand-made group** — a group not born of a PRD; its requirements are its members' own claims plus the group's line in `ordering.md`.
- **Cohort** — a subgroup of a group's features that can be built in parallel by sub-agents: the rubric passes on every criterion; named in each member's `onroad-cohort`.
- **Cohortmeister (CM)** — `feature/cm-<group>-<cohort>`: the pseudo-feature that blocks a cohort's members, is onroaded in their place, and whose ledger is the results checker; archives them by cascade.
- **Rubric** — the five pass/fail criteria a subgroup must meet to be a cohort: no dependency edge, disjoint ownership, accepted spec and plan with gates, no external and not in process, self-contained builds.
- **Reconsideration** — `/roadwork-specplan`'s second mode: on an item whose accepted spec and plan already exist, re-read them against everything dated since; a dated `Reconsidered` changelog, proven gates carried, the previous go ended, the spec proposed again.
- **Verification round** — `/roadwork-specplan`'s fresh-eyes check: seven predefined questions on the spec, five on the plan, one fresh reader each — run as one workflow where the harness runs workflows, each a reader on the model family the setting `subagent-reader` names at the effort the session agent judges for the documents, findings in one bounded shape (file, line, one sentence, an empty disposition slot; at most eight; "clean" as none), sub-agents the fallback — findings incorporated or rejected with a reason and recorded in the document by the session agent; one round per document.
- **Back offers** — the second offer line of the four interrupting skills: up to five open lifecycle steps in flight, most recent first, read from the roadwork register; offers, never runs; each preceded by one sentence saying what typing it does.
- **Item name** — the kebab-case folder name of an item, chosen at ingest in the Operator's words, the last part of its reference (`todo/<item-name>`, `main/<kind>/<item-name>`); never reused; never a skill name. "Slug" is a generic word, not the register's term; the register names its slugs by their bearer — `<destination-slug>`, `<map-slug>`, `<guidebook-slug>`, `<atlas-slug>`.
- **Batch invocation** — one skill, many references on one line, separated by ` && `; accepted by `/roadwork-verify-and-archive` and `/roadwork-make`, and by `/roadwork-ingest` for a spark batch only (sparks of one home, converting into one item — the bare `/roadwork-spark` lists them grouped), refused by the rest with a reason; offers are printed as invocations in code blocks, related ones combined.
- **Bare call** — a skill invoked with no argument lists instead of acting — `/roadwork-spark` the open sparks grouped for conversion, `/roadwork-destination` the destinations with their navigation state, `/roadwork-make` the make-eligible items with their goes and the ineligible with their reasons; a bare call writes nothing.
- **Sub-agent types** — the six helpers a skill may dispatch, defined in the bullet "Sub-agents and their models": **reader** (a document against one question), **finder** (one fact from the project), **explore** (where a thing lives), **research** (outside sources), **builder** (a deliverable under a ledger), **reviewer** (a change against its brief); each runs on the model family its `subagent-<type>` setting names, the type chosen by the session agent at invocation unless a skill's step names it, the effort the session agent's judgement, the return evidence the session agent accepts or rejects.
- **Model family** — a vendor's line of models named without a release — `haiku`, `sonnet`, `opus`, `fable`, or another vendor's; the value of a `subagent-<type>` setting; the newest release the host offers is assumed at dispatch.
- **Fact suffix** — after the last offer of a lifecycle hand-back, when the machine's minute is a multiple of six: two blank lines, then the title line "A 2ndcortex/roadwork system detail you should know about:" plain, then one fact from `docs/facts.md`, picked by the seconds modulo the count of its numbered facts — never a heading, then "Typing this explains it:" and `/roadwork-help <term>` in its own code block; never after `/roadwork-help`; no state, no script.
- **Tasksplit** — `/roadwork-tasksplit <source>`: any document or list into a dated group of todos, one per unit the source delineates, the source's words verbatim and no reading added; no sanity todo, no cohort.
- **Easteregg** — Always believe!

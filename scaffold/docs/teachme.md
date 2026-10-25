# Teach me the road plans

This file is a walk-through of how work is planned and recorded in this project, written for a person first. It uses plain names; the word the session agent [Session agent — the agent running the session in which you typed the command] uses for the same thing follows in brackets the first time. When you type `/roadwork-help` with nothing after it, this file is what the session agent reads to answer you. If you want one thing explained, type `/roadwork-help <thing>`.

## Where work is recorded

Your project has one work-plans folder [road plans, the `roadwork/` folder — the register], at the path your project's law names; no folder under the project carries its own. It is a copy of the Roadwork home's `scaffold/` [a copy, made once by the init (`roadwork-init`): never pushed, never updating the home and never updated from it; its commits stay local]; the home supplies the folder's skeleton and its two docs, never a map and never an item — maps and items are yours; the rule and the skills are installed into your project's `.claude/` folders by the same init and refreshed by re-running it. Inside, three sub-folders: `todo/` for fixes, chores, decisions to take and findings to trace; `feature/` for new capabilities; `spark/` for ideas parked for later, never worked. In `todo/` and `feature/`, each item's folder sits under the folder of the destination it serves — `todo/<destination-slug>/<item-name>/` — or under `unnavigated/` until a navigation cites it; each destination's folder, and `unnavigated/`, has its own `archive/`, where finished items go, whole, never deleted. `spark/` holds one folder per idea and one `archive/`. Beside them: `docs/` for documents that outlast any one item (this file lives there), and `destinations/` for the larger aims — one product requirements document [a destination, `<destination-slug>.prd.md`] per destination, made with you and later broken into items. Beside them too, `maps/` holds the ways destinations are reached, one map per destination [a map: the process, the stack, the judgements, the inputs, and how it was done before agents were in the picture], `guidebooks/` the knowledge a map copies its parts from, and `atlases/` what sits above the destinations.

Above a destination sits an atlas: a folder holding three documents you wrote — the vision, the intent and the architecture — verbatim, and one file the skill writes, `atlas.md`; made by `/roadwork-atlas` from the three, never interviewed. A destination names the atlas it serves by its `atlas` key, or leaves it empty. The pages do not yet group destinations by atlas; that is a later item's. The skill proposes the destinations that would serve it, in its file, for you to make or strike.

## One item, four files

A todo or a feature is a folder of four files; a fifth, `GATES.md`, the ledger, joins them when the build starts. The item file (`todo.md` or `feature.md`) holds your notes as you gave them, word for word, the session agent's reading of them marked as its own, and a numbered list of what the filing did not decide. `intent.md` says what is wanted and why, in your words, after an interview. `spec.md` says exactly what changes and how anyone checks it. `plan.md` says in what order it is built and the gates the build must pass. A spark is one folder holding one file, `idea.md`, and nothing else.

## The lifecycle

Work moves through skills, each one a command you type. In order:

- `/roadwork-destination` — makes a destination with you: a bare call lists the destinations you have; with a name and a description it interviews you and writes the document; a pasted document is saved as it came and interviewed from.
- `/roadwork-map` — makes a map with you: how one destination is reached — the process, the stack, the judgements, the inputs, and how it was done before agents; the interview and spec skills follow the map an item names.
- `/roadwork-nav-to-destination <slug>` — turns one destination into a group of items and a sanity todo you check before anything in the group starts. `/roadwork-navsanity <group>` is that check, on any group, thorough: six kinds, and a seventh over any cohort in the group.
- `/roadwork-ingest` — files one item from your notes: decides todo or feature and says why, places it in the order, prepares the first questions. `/roadwork-tasksplit` files many todos from a list at once.
- `/roadwork-intentify <ref>` — the interview. It reads your notes back, asks two questions — a third, which map, when the item names none — then works the design tree in rounds until nothing is left assumed. Writes `intent.md` when you confirm.
- `/roadwork-specplan <ref>` — writes `spec.md` and `plan.md` from the accepted intent, has fresh reviewers check both, and hands them back. Accepting a spec is not a go.
- `/roadwork-make <ref>` — the go. Only this, or your word "build", starts work. It puts the item in process and builds under the gates, one after another; a bare call lists what could be built now.
- `/roadwork-verify-and-archive <ref>` — evaluates what was built, asks you what to do with anything short, and on your word moves the item to `archive/` with its resolution recorded.

Beside the chain, `/roadwork-help` answers: with nothing after it, the overview; with a skill, an item or a term, that one thing. It writes nothing. At the day's end, `/roadwork-intent-insights` reads the day's interviews and, on your word, writes what they taught into the insights document, which the next interview reads first.

Every skill in the chain ends by offering the next step as a command you can copy, never by running it; the help and config skills offer nothing, and the inventory page offers each work item's next step under its line and nothing after the page, and a map or guidebook call may have nothing left to offer.

## The loose order and the in-process list

`ordering.md` is the list of what comes next, top first, kept loose by judgement, with one clause per line saying why it sits there. Groups are indented blocks. `working.md` lists what is in process right now, one line per item, dated; a line is removed when the item is archived.

## The kind test

A todo is done once and is then over. A feature is built once and reused when built. That is the test, generally; your naming overrides it.

## How to name a thing

In the plans: `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`; from anywhere, `main/<kind>/<item-name>` [the register's prefix; your project's law may alias it]. Item names are kebab-case, in your words, chosen at filing, never reused.

## How offers look

Anything the session agent suggests you type is printed in its own code box, nothing else in the box, so you copy it in one gesture. One plain sentence before the box says what typing it does. Several references to one skill that run as one line share one box, joined with ` && `, where that skill takes a batch. In a workspace the reply-form rule holds this; the glossary entry **Offer form** in every skill is the copy for use outside one. Where your session can show a list you tick, the offers come as that list instead, with a free-text choice for anything else; a tick is the same as typing the command.

## The bare calls

A skill typed with nothing after it lists instead of acting. `/roadwork-spark` lists the open ideas, grouped by which could become one item together. `/roadwork-destination` lists the destinations and whether each has been turned into items. `/roadwork-make` lists what could be built now. `/roadwork-inventory` prints everything open on one page, computed by a script: a counts line, then each destination (navigated, built with every item archived, or not yet navigated) with its work items, each shown by its title and its state (a drafted intent counts as awaiting interview), a blocked item with its blocker's state. A bare call writes nothing.

## One item, start to finish

Say a thought crosses your mind: the greeting the tool prints is stale. You type `/roadwork-spark the greeting is stale, fix the wording`. A spark is filed as `spark/greeting-is-stale`, your words kept, one round of questions asked, and it rests.

A week later the bare `/roadwork-spark` lists it. You type the ingest command it offers. `/roadwork-ingest spark/greeting-is-stale` files `todo/fix-the-greeting-wording` — a todo, because it is done once, under `todo/unnavigated/` since no navigation cites it — places it in `ordering.md`, and moves the spark to its archive as converted. It offers the interview.

`/roadwork-intentify todo/fix-the-greeting-wording` reads your notes back, asks whether you have anything to add and any comment on its reading, and which map, if any; then a round: which wording, where it prints, whether the old text is referenced anywhere else. You answer; you confirm the shared understanding; `intent.md` is written and accepted.

`/roadwork-specplan todo/fix-the-greeting-wording` writes the spec — one requirement: the new wording, printed at start, nowhere else — and the plan with one gate that checks it. Five reviewers read the spec, five the plan; what holds is folded in. You say "spec accepted".

`/roadwork-make todo/fix-the-greeting-wording` is your go. The item goes on `working.md`, that one gate is its whole ledger, the build runs, the gate is met, the change sits on the project's batch branch. It offers the archive.

`/roadwork-verify-and-archive todo/fix-the-greeting-wording` reports the gate met and the change landed or not yet, asks whether to archive now or wait for landing, and on your word moves the folder to `todo/unnavigated/archive/`, the archive beside it, with "shipped" recorded. It offers the next item ready in the archived item's group, else the top-most ready item in the order.

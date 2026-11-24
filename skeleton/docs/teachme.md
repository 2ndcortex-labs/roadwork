# Teach me the road plans

This file is a walk-through of how work is planned and recorded in this project, written for a person first. It uses plain names; the word the session agent [Session agent — the agent running the session in which you typed the command] uses for the same thing follows in brackets the first time. When you type `/roadwork-help` with nothing after it, this file is what the session agent reads to answer you. If you want one thing explained, type `/roadwork-help <thing>`.

## Where work is recorded

Your project has one roadwork folder [road plans, the `roadwork/` folder — the register], at the path your project's law names; no folder under the project carries its own. It is a copy of the Roadwork repository's `skeleton/` [a copy, made once by hand: never updating that source, and updated from it only in its two docs]; the Roadwork repository supplies the folder's skeleton and its two docs, never a map and never an item — maps and items are yours; the rule and the skills are copied into your project's `.claude/` folders by hand and refreshed by copying the newer ones over the old. Inside, three sub-folders: `todo/` for fixes, chores, decisions to take and findings to trace; `feature/` for new capabilities; `spark/` for ideas parked for later, never worked. In `todo/` and `feature/`, each item's folder sits under the folder of the destination it serves — `todo/<destination-slug>/<item-name>/` — or under `unnavigated/` until `/roadwork-nav-to-destination` places it under a destination; each destination's folder, and `unnavigated/`, has its own `archive/`, where finished items go, whole, never deleted. `spark/` holds one folder per idea and one `archive/`. Beside them: `docs/` for documents that outlast any one item (this file lives there), and `destinations/` for the larger aims — one product requirements document [a destination, `<destination-slug>.prd.md`] per destination, made with you and later broken into items. Beside them too, `maps/` holds the ways destinations are reached, one map per destination [a map: the process, the stack, the judgements, the inputs, and how it was done before agents were in the picture], `guidebooks/` the guidance the later steps build on and a map copies its parts from [a guidebook, made with you from a description, from a document, or from a template: a guidebook your organization keeps in one store for many projects, copied into yours and adapted with you; the part "Guidebooks" below explains them], and `atlases/` what sits above the destinations.

Above a destination sits an atlas: a folder holding three documents you wrote — the vision, the intent and the architecture — verbatim, and one file the skill writes, `atlas.md`; made by `/roadwork-atlas` from the three, never interviewed. A destination names the atlas it serves by its `atlas` key, or leaves it empty. The skill proposes the destinations that would serve it, in its file, for you to make or strike.

## One item, four files

A todo or a feature is a folder of four files; a fifth, `GATES.md`, the ledger, joins them when the build starts. The item file (`todo.md` or `feature.md`) holds your notes as you gave them, word for word, the session agent's reading of them marked as its own, and a numbered list of what the filing did not decide. `intent.md` says what is wanted and why, in your words, after an interview. `spec.md` says exactly what changes and how anyone checks it. `plan.md` says in what order it is built and the gates the build must pass. A spark is one folder holding one file, `idea.md`, and nothing else.

## The lifecycle

Work moves through skills, each one a command you type. In order:

- `/roadwork-destination` — makes a destination with you: a bare call lists the destinations you have; with a name and a description it interviews you and writes the document; a pasted document is saved as it came and interviewed from.
- `/roadwork-map` — makes a map with you: how one destination is reached — the process, the stack, the judgements, the inputs, and how it was done before agents; the interview and spec skills follow the map an item names.
- `/roadwork-nav-to-destination <slug>` — turns one destination into a group of items and a sanity todo you check before anything in the group starts. `/roadwork-navsanity <group>` is that check, on any group, thorough: six kinds, and a seventh over any cohort in the group.
- `/roadwork-ingest` — files one item from your notes: decides todo or feature and says why, places it in the order, prepares the first questions. `/roadwork-tasksplit` files many todos from a list at once.
- `/roadwork-intentify <ref>` — the interview. It reads your notes back, asks two questions — a third, which map, when the item names none — then works the design tree — every decision branching into the decisions that depend on it — in rounds until nothing is left assumed. Writes `intent.md` when you confirm.
- `/roadwork-specplan <ref>` — writes `spec.md` and `plan.md` from the accepted intent, has fresh reviewers check both, and hands them back. Accepting a spec is not a go.
- `/roadwork-make <ref>` — the go. Only this, or your word "build", starts work. It puts the item in process and builds under the gates, one after another; a bare call lists what could be built now.
- `/roadwork-verify-and-archive <ref>` — evaluates what was built, asks you what to do with anything short, and on your word moves the item to `archive/` with its resolution recorded.

Beside the chain, `/roadwork-help` answers: with nothing after it, the overview; with a skill, an item or a term, that one thing. It writes nothing. At the day's end, `/roadwork-intent-insights` reads the day's interviews and, on your word, writes what they taught into `docs/intent-insights.md` in the register, which the next interview reads first.

Every skill in the chain ends by offering the next step as a command you can copy, never by running it; the help and config skills offer nothing, and the inventory page offers each work item's next step under its line and nothing after the page, and a map or guidebook call may have nothing left to offer.

## Guidebooks

A guidebook [Guidebook, one file in `guidebooks/`] is a building block for architecture: guidance you settle once — where things are hosted, which tools the agents call, how code is written — so that every later step of the work it applies to builds on it. This part explains what a guidebook holds, its kinds, when to make one, how it meets your own standards, and how it leaves the project.

Every guidebook says at its top what kind it is and what it belongs to [its header block: the keys `kind`, `atlas` and `destination`]. There are three kinds. An atlas's guidebook belongs to one atlas and applies to every destination under it and to their work items. A destination's guidebook belongs to one destination and applies to it and to its work items. A template belongs to nothing here: it is made to leave the project and be reused elsewhere. One atlas or one destination may have as many guidebooks as you like, one per topic reading better than one large file. A guidebook made before kinds existed has no such top [unscoped, made earlier]; it is listed and drawn on as before, and its next update asks you its kind and scope once.

Nobody keeps a list of which guidebooks apply to what: the kind and the scope decide it [reach, computed by the guidebook skill's script, `guidebooks.mjs reach`]. A destination is reached by its atlas's guidebooks and by its own; each work item under it, by the same. Each later step reads the guidebooks that reach its work and names the ones it read: the destination before its stack is chosen, the navigation before it cuts the destination into items, the map, and each work item's interview, spec and plan. A work item under no destination reads a guidebook only if you name one when the interview reads your notes back. Nothing enforces a guidebook: a step that departs from one says so, with its reason, and you decide; nothing stops or warns because a guidebook is missing.

A guidebook can be made whenever guidance is settled, and it may be wise to make it before the work that follows it: a destination's guidebook before the destination is navigated, an atlas's before its destinations, a template even before any atlas exists. This is always optional. When you make an atlas or a destination, one line offers to make its guidebooks first; nothing waits on it.

`/roadwork-guidebook` makes a guidebook by interviewing you. Its first question is the kind and the scope. Its second is which items the guidebook includes: hosts, MCPs (the Model Context Protocol servers the agents call), coding standards per language, SOPs (standard operating procedures) and best practices, and any item you add. Each item you choose becomes one part of the guidebook; an item you leave out leaves nothing behind. Beside them stand the parts every guidebook has: standards, stack, vendors, judgements and sources.

Coding standards may sit in two places: in a guidebook, and in your project's own standards folders [the setting `standards-folders`]. The two are presumed to complement each other, and both are read. Where they seem to differ on one point, the interview or the spec asks you for a ruling, quoting both. Your ruling is written on that work item, dated, in your words, and holds for that item alone; neither source is changed by it. A lasting fix is your own edit to one of them.

An organization may keep templates in one store [the setting `guidebook-templates`] for many projects to start from; the guidebook skill lists them and copies one into your project, to be adapted with you. The skill also makes templates in your project: from scratch, by the same interview, or by converting one of your guidebooks into a template. It can also convert a guidebook for another project, under the kind and scope you name for that project. A conversion takes out your destination's name, your project's paths and names, and anything true of your project alone, such as an address or a person; you see the result whole, with any line still holding one of them, before it is written, and the guidebook converted from stays as it was. Every template made here and every converted guidebook waits in `guidebooks/outgoing/`, drawn on by nothing. The skill never writes into the store or into another project: placing the file there is yours to do. When a destination's guidebook is confirmed, one line offers its conversion to a template; the conversion for another project is made only when you ask.

## The loose order and the in-process list

`ordering.md` is the list of what comes next, top first, kept loose by judgement, with one clause per line saying why it sits there. Groups are indented blocks. `working.md` lists what is in process right now, one line per item, dated; a line is removed when the item is archived.

## The kind test

A todo is done once and is then over. A feature is built once and reused when built. That is the test, generally; your naming overrides it.

## How to name a thing

In the plans: `todo/<item-name>`, `feature/<item-name>`, `spark/<item-name>`; from anywhere, `main/<kind>/<item-name>` [the register's prefix; any other prefix resolves the same, everything before the kind read as the prefix]. Item names are kebab-case, in your words, chosen at filing, never reused.

## How offers look

Anything the session agent suggests you type is printed in its own code box, nothing else in the box, so you copy it in one gesture. One plain sentence before the box says what typing it does. Several references to one skill that run as one line share one box, joined with ` && `, where that skill takes a batch. The glossary entry **Offer form** in every skill states this form. Where your session can show a list you tick, the offers come as that list instead, with a free-text choice for anything else; a tick is the same as typing the command.

## The bare calls

A skill typed with nothing after it lists instead of acting. `/roadwork-spark` lists the open ideas, grouped by which could become one item together. `/roadwork-destination` lists the destinations and whether each has been turned into items. `/roadwork-make` lists what could be built now. `/roadwork-inventory` prints everything open on one page, computed by a script: a counts line, then each destination (navigated, built with every item archived, or not yet navigated) with its work items, each shown by its title and its state (a drafted intent counts as awaiting interview), a blocked item with its blocker's state. A bare call writes nothing.

## One item, start to finish

Say a thought crosses your mind: the greeting the tool prints is stale. You type `/roadwork-spark the greeting is stale, fix the wording`. A spark is filed as `spark/greeting-is-stale`, your words kept, one round of questions asked, and it rests.

A week later the bare `/roadwork-spark` lists it. You type the ingest command it offers. `/roadwork-ingest spark/greeting-is-stale` files `todo/fix-the-greeting-wording` — a todo, because it is done once, under `todo/unnavigated/` since no navigation cites it — places it in `ordering.md`, and moves the spark to its archive as converted. It offers the interview.

`/roadwork-intentify todo/fix-the-greeting-wording` reads your notes back, asks whether you have anything to add and any comment on its reading, and which map, if any; then a round: which wording, where it prints, whether the old text is referenced anywhere else. You answer; you confirm the shared understanding; `intent.md` is written and accepted.

`/roadwork-specplan todo/fix-the-greeting-wording` writes the spec — one requirement: the new wording, printed at start, nowhere else — and the plan with one gate that checks it. Eight reviewers read the spec, seven the plan; what holds is folded in. You say "spec accepted".

`/roadwork-make todo/fix-the-greeting-wording` is your go. The item goes on `working.md`, that one gate is its whole ledger, the build runs, the gate is met, the change sits where the plan's lands-as line says, in the project's own flow. It offers the archive.

`/roadwork-verify-and-archive todo/fix-the-greeting-wording` reports the gate met, asks whether to archive now or wait, and on your word moves the folder to `todo/unnavigated/archive/`, the archive beside it, with "shipped" recorded. It offers the next item ready in the archived item's group, else the top-most ready item in the order.

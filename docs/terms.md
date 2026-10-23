# Terms — the plain word, the agent's word, the meaning

_One row per term in the skills' glossaries, then one per git word the skills' text puts in front of a person — those rows' meanings are plain git and have no home in the skills. The plain word is yours; the agent's word is the one in the skills' glossaries; the meaning is one line._

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
| the fresh-eyes review | Verification round | Six fresh readers on a spec and five on a plan, one question each, before you see it. |
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

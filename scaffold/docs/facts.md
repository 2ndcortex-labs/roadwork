# Facts — the fact suffix's list
One fact per numbered line, in plain words, ending with the term `/roadwork-help` opens; the seconds of the clock, modulo the count of numbered facts, pick one.

1. The Roadwork system is the work plans and the skills that work them, from the first note to the archive, with a skill (/roadwork-make) that builds each item under its gates. — Roadwork
2. A project's work plans live in one folder whose work sits in three sub-folders, todos, features and sparks, beside its docs, destinations, maps, guidebooks and atlases; a todo or a feature sits under the folder of its destination, each such folder with its own archive, and the sparks have one. — Road plans
3. A todo or a feature is a folder of four files: the item file, the intent, the plan and the spec; the ledger, GATES.md, joins them when the build starts. — Item
4. Your project has one work-plans folder, at the path its law names; no folder under the project carries its own. — Home
5. An item is named by its kind and folder, like todo/fix-the-greeting-wording; from anywhere, main/<kind>/<item-name>, a prefix your project's law may alias. — Reference (ref)
6. Every item file opens with eight keys — blocker, blocking, blocked-by, external, group, in-process, disposition, road-level — empty until something sets them; a feature carries a ninth, onroad-cohort. — Frontmatter
7. The order file lists what comes next, top first, with one clause per line saying why; the working file lists what is in process now. — `ordering.md`
8. Every decision is the Operator's; the session agent finds the facts and asks. — Operator (user)
9. The session agent is whichever agent runs the session in which you typed the command. — Session agent
10. The project scope is everything at and under the root the project's law names. — Project scope
11. Changes ship as one coherent batch, never one at a time; the work plans' own commits stay local. — Batch
12. The chain runs destination, navigate, ingest, interview, spec and plan, the go, then verify and archive; beside it, the help skill answers. — Lifecycle
13. A product requirements document is a destination: one file per destination, made with you, then broken into a group of items. — PRD
14. A destination has a fixed shape: a header with its priority and its atlas, the destination in a paragraph, numbered requirements, what is out, and how success is seen. — Destination
15. Navigating to a destination creates a sanity todo last; nothing in the group starts until you say the group is right. — Sanity todo
16. The sanity check runs six kinds of check over a group — completeness, provenance, shape, dependencies, order, scope — and a seventh over any cohort in it. — Check types
17. One pass of the sanity check is recorded as a dated section in the group's sanity todo; it may run again. — Run
18. A group made by hand has no destination document behind it; its requirements are its members' own claims and the group's line in the order. — Hand-made group
19. A cohort is a set of features in one group that can be built in parallel by helper agents. — Cohort
20. A cohortmeister is a stand-in feature that blocks its cohort's members, is put on the road in their place while helper agents build them, and archives with it the members that pass; one that fails goes back to standing alone. — Cohortmeister (CM)
21. Five tests make a cohort: no dependency between members, no shared files, accepted specs with gates, nothing external or in process, builds that stand alone. — Rubric
22. When an accepted spec is overtaken by events, the spec skill runs again in reconsideration mode and the old go ends. — Reconsideration
23. Every spec is read by six fresh reviewers and every plan by five, one question each, before you see it. — Verification round
24. After an interruption, a skill offers the way back: up to five open steps, most recent first, read from the plans at that moment. — Back offers
25. An item name is kebab-case, in your words, chosen when filed, and never reused. — Item name
26. Several references joined with ` && ` run as one command where the skill allows a batch: the go and the archive do, and the filing for a batch of sparks. — Batch invocation
27. Some skills typed with nothing after them list instead of act: sparks, destinations, and what can be built now. — Bare call
28. Anything you are invited to type is printed in its own code box, with one sentence before it saying what typing it does — or, where your session can show a list, one choice you tick. — Offer form
29. Any list or document can become a dated group of todos, one per unit, the source's words kept verbatim. — Tasksplit
30. Beside todos, features and sparks sit docs, for documents that outlast any one item, and destinations, maps, guidebooks and atlases. — Road plans
31. The item file keeps your notes word for word; the reading of them is marked as the agent's and stays separate. — Item
32. Accepting a spec is not a go; only the go command or your word "build" starts work. — Lifecycle
33. The order is loose and kept by judgement; groups are indented blocks under their line. — `ordering.md`
34. A todo is done once and is then over; a feature is built once and reused when built; your naming overrides the test. — Item
35. An item is todo/<name> or feature/<name>; from anywhere, main/<kind>/<name>, or the alias your project's law gives the prefix. — Reference (ref)
36. Offers are never run for you: every skill in the chain ends by offering the next step, and you type it. — Offer form
37. A bare call writes nothing; the list it prints is computed at the call and may differ next time. — Bare call
38. A spark is one file, an idea parked for later; its only exit is conversion into a todo or a feature on your word. — Road plans
39. Now and then, when the clock's minute is a multiple of six, a hand-back ends with one fact like this, under its title line, and a box holding the command that explains it; the seconds pick the fact. — Fact suffix
40. A map is the way to one destination, one map per destination — the process, the stack, the judgements, the inputs, and how it was done before agents. — Map
41. The work plans are a copy of the Roadwork home's scaffold, made once by its init tool and never pushed; the rule and the skills are installed into your project's .claude folders and refreshed by re-running the init, and no map or item ever comes from the home. — Home
42. Above the destinations sits the atlas: three documents of yours — vision, intent, architecture — verbatim in one folder with the skill's atlas.md; a destination names the atlas it serves by its atlas key, or leaves it empty. — Atlas
43. An externality is what will not happen without something specific and out-of-band happening; a merge that is merely slow is a pause, not one. The spec names it, the key records it, only the Operator clears it. — External

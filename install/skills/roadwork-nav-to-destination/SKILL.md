---
name: roadwork-nav-to-destination
description: Navigates one destination into a group of items with a sanity todo last.
when_to_use: Use when the user says /roadwork-nav-to-destination <destination-slug>, "navigate to this destination", "break this destination into items".
argument-hint: <destination-slug>
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

# roadwork-nav-to-destination — a destination becomes a trustworthy group of items

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well (the Destinations
bullet). Input: only a destination slug — the destination is
`destinations/<destination-slug>.prd.md` in the register's
`destinations/`, made by
`/roadwork-destination`. Anything else — a path, a pasted document, no
argument — is refused in one line, with the offer of `/roadwork-destination
<slug>` (which saves a document as `destinations/<slug>.source.md` and
interviews it into a destination). Output: a
group of items, a block in `ordering.md`, and a sanity todo. "Always
creates a sanity todo … to allow operater to validate prd group"
(Operator, 2026-09-10).

## 1. Read the destination

A batch (`ref && ref`) is refused here: one destination at a time; a
non-slug argument refused as above.

**The intent above.** The destination is the level above every item this
skill files, and its intent, `destinations/<destination-slug>.intent.md`, is read
first — before the PRD, before anything is written — because the group is cut
from the PRD's requirements but judged against what the destination is for; the
sanity todo records the reading on its **Destination intent read:** line, and
every filed item says on its Destination line that the intent was read;
one level up is the minimum, not a limitation: the atlas's intent the destination's
names may be read as well. A destination without an intent file (made before
the destination skill wrote one): the sanity todo's line reads
`none — the destination has no intent file`, the reply says so in one line and
offers `/roadwork-destination <destination-slug>` (its update interviews the intent
first), and the navigation proceeds — the reading is enforced by nothing.
Then the PRD, `destinations/<destination-slug>.prd.md`, whole.

Read it whole. Its requirements are its numbered list (the fixed form
`/roadwork-destination` writes); where a destination made by hand lacks one,
number them yourself and say so. A
requirement is one thing the programme must deliver or must not do.

## 2. Decompose

One item per coherent deliverable: a new capability is a **feature**; a
fix, chore, decision to take, or finding to trace is a **todo** (the road plans test (the glossary's **Road plans** entry): done once, or reused when built). For each
item: title in the PRD's words, kind, the paths it is relevant to ("ord seeds
whatever it is relevant to" — its Paths line, where the PRD names them), the requirement numbers it
covers, and its dependencies on other items where the PRD's own ordering
words imply them. Where an existing open item already covers a
requirement, cite it instead of filing a duplicate. Where the paths are in
doubt, mark the item "paths: ask" — "can confirm with operator if any
doubt".

## 3. Read back — once

One message: the numbered requirements as you read them; the proposed
items (title, kind, home, requirement numbers, dependencies); the
proposed order; every "home: ask" as a question with your
recommendation; then the two questions — anything to add to the notes?
any comments on the reading? Wait once. Fold what comes back ("answers
not required"); a "no" or silence means proceed as proposed.

Close with three blocks in this order: `go with recos` — nothing to add,
proceed as proposed; `go with recos except:` — proceed except as listed
after the colon; `no, no` — the pair alone, the proposals answered by
hand.

## 4. File every item through `/roadwork-ingest`

For each item, in dependency order, follow `/roadwork-ingest` §1–§4 exactly (the
one item form; this skill adds nothing to it), with:

- notes = the destination's words for that item, verbatim, opened by the
  citation: `From <home>/destinations/<destination-slug>.prd.md,
  requirements <n, n>:` ("prd doc name with path included in every
  derived feature and todo");
- the line **Destination:** `<destination-slug>` (the destination's intent read) under the item's owner
  line — the item's one destination, the group's, its intent read at §1; no frontmatter key;
- the line **Map:** `<map-slug>` under it when the destination names one —
  inherited by every item of the group; no frontmatter key;
- the filer's reading and the numbered "not decided" list as `/roadwork-ingest` requires; an answer by number
  lands on the derived item's file as `/roadwork-ingest` records it — the same heading, the pairs,
  each answer a summary that loses no meaning, a question back carried in its
  pair (Operator, 2026-09-23);
- frontmatter: `group: [<destination-slug>-<YYYY-MM-DD>]` (today's date;
  one group per destination), `road-level` (`main`, `secondary` or `side` — the item's level within the destination, the session agent's reading of the requirement's weight, put in the read-back of §3 for the Operator's correction, changeable by hand after),`blocked-by` = the items it depends on **plus the
  sanity todo's reference** (filled in at step 6), `blocking` on the
  other side, `blocker` re-derived;
- The item file carries its `**Paths:**` line as `/roadwork-ingest` §3 gives it, when the source names paths.
- the item's folder under `<kind>/<destination-slug>/`; an existing item cited from `unnavigated/` — or from another destination's folder, on the Operator's word [proposed: a re-navigation's move, the same act] — is moved there in the same act, by `git mv`, history kept.

A navigation should generally exist immediately after a destination is established. Where unnavigated items exist — filed before the navigation existed — they should helpfully inform the navigation, to a degree: read them for the requirements they already answer, cite them, never file them twice (the Operator, 2026-09-18).

## 5. The block in `ordering.md`

In the register's `ordering.md`, one line for the sanity todo, carrying
the destination (`— destination: <destination-slug>`), with the group's
indented block beneath it — the items in execution order
(dependencies first, then `road-level` — `main` before `secondary` before `side` — then your judgment, parallel items adjacent; the block among the other destinations' by `bucket-list-priority` descending, informing the judgement that places it) — placed
whole where you judge the programme belongs. "Section in ordering.md to order group
execution."

## 6. The sanity todo — created last

`todo/<destination-slug>-sanity` in the destination's home, filed through `/roadwork-ingest` with
notes = the group list; its `todo.md` carries, after the notes:

- **Destination intent read:** `destinations/<destination-slug>.intent.md`, <date> — the
  reading of §1, recorded; or `none — the destination has no intent file`.
- **Group:** every reference with kind and home.
- **Requirement → item:** each numbered requirement and the item(s)
  covering it, or "deliberately dropped: <why>".
- **Item → requirements:** each item and its numbers.
- **Checklist** (for `/roadwork-navsanity` and the Operator): completeness —
  every requirement covered or dropped on purpose; no item without a source;
  kinds and homes right; dependencies consistent (both sides agree, no
  cycle, nothing points up); order workable; group name on every member.

Frontmatter: `group` the same; `road-level: main`; `blocking` = every other item in the
group; `blocker: yes`. Then write the sanity todo's reference into every
other item's `blocked-by`. It archives only on the Operator's word, through
`/roadwork-verify-and-archive`; "sanity check also for completness" — `/roadwork-navsanity` works
it. Nothing in the group starts before it is verified and archived.

## 7. Commit and hand back

Commit in the register (its commits local). Reply with: the destination's path; the group name; the group list
with kinds and homes; the requirement → item mapping's gaps, if any; the
block's place in `ordering.md`; the sanity todo's reference. End with the
offer, one invocation in its own code block, preceded by its sentence (offer form), never invoked: `/roadwork-navsanity <group>` (until that
skill exists: the Operator reads the sanity todo and archives it by
`/roadwork-verify-and-archive`), and the top-most unblocked item in `ordering.md` with its
skill as the next logical item now. Then the fact suffix, by the clock (the glossary's **Fact suffix** entry). As a checkbox list where the harness has a question tool, blocks otherwise (the glossary's **Offer form** entry).

The specs this skill writes follow `/roadwork-specplan` §0a — the
Operator's spec-writing guidelines — and get its verification rounds.

## Never

Never build; never interview beyond the one read-back (each item's
`/roadwork-intentify` is its own); never file an item outside `/roadwork-ingest`'s form;
never read a PRD from anywhere but `destinations/`; never make or amend a destination (that is `/roadwork-destination`); never create the sanity todo
first; never archive, move, or strike anything; never open a PR.

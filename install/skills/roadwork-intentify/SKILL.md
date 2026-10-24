---
name: roadwork-intentify
description: Interviews the Operator on one item until nothing is assumed and writes its intent in their words.
when_to_use: Use when an item in todo/ or roadwork/ has no intent.md, has a placeholder one, or the user says /roadwork-intentify, "write the intent", "what do we actually want here".
argument-hint: <ref>
---
# roadwork-intentify — from a road plans item to its intent

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

## Purpose and deliverable

- A road plans item is a folder containing four files:
  - The item file: `todo.md` or `feature.md`.
  - `intent.md`.
  - `plan.md`.
  - `spec.md`.
- For Roadwork conventions, lifecycle and glossary consult roadwork-constitution.md glossary.
- This skill produces **`intent.md`**: the originator’s proto-spec, expressed in the originator’s own terms:
  - What is wanted.
  - Why it is wanted.
  - Under which constraints.
  - etc.
- The intent belongs to the user; finding the facts is your responsibility.
- The accepted intent consists of frontmatter, a brief description, and mandated sections containing discrete bulleted facts:
  - Each bullet states a desired or required fact about the fulfilled embodiment of the intent.
  - Each fact is followed by a brief description of no more than two sentences.
  - Taken together, the bullets must fully capture the desired intent.
- Do not write `plan.md` or `spec.md` here:
  - `plan.md` addresses how.
  - `spec.md` addresses what exactly.
  - `intent.md` addresses what is wanted.

## Scope and operating rules

- Run this procedure for one item at a time:
  - `todo.md` items in `roadwork/todo/`.
  - `feature.md` items in `roadwork/feature/`.
- Use the same procedure for both kinds of item; for feature items, the root branches read “feature” for “todo.”
- Refuse batch arguments such as `ref && ref`.
- If asked to handle several items, conduct their interviews sequentially, never in parallel: the Operator can hold one design tree in their head, not five.
- Read sparks in `roadwork/spark/` for crossings, but never interview them here:
  - `/roadwork-spark` gives sparks their one round.
- In all text for the Operator, use the plain words from the roadwork-constitution.md
  - Each row contains the plain word, the agent’s word, and the meaning.
  - The agent’s words stay in the skill.

## Step 1 — Locate the item and read its context

### Resolve the item

- Resolve the argument as one of:
  - An item name.
  - A folder path.
  - A path to the item file.
- If no argument is supplied, use the item whose file is open or was last touched in this session.
- If the item remains ambiguous:
  - List the candidates in the nearest `roadwork/todo/` and `roadwork/feature/`.
  - Ask which item to use.
- Asking which item to use is the only question permitted before reading.

### Read the whole item folder and current hierarchical context

- Read the item file in this order:
  - Its frontmatter first, including `blocked-by`, `blocking`, `external`, `group`.
  - Its notes.
  - The filer’s reading.
  - Its “not decided” list, which is the prepared first round.
- Critical; Determine the current hierarchical context as per the process in roadwork-constitution.md
- Read any existing `intent.md`:
  - A placeholder or thin intent is the normal case.
- Read any `plan.md` and `spec.md`.
- Read everything the item cites, including:
  - Files.
  - Commits.
  - Other items.

### Read the register and identify crossings

- Read the register’s:
  - `ordering.md`.
  - `working.md`.
- Then read its other open items in:
  - `todo/`.
  - `feature/`.
  - `spark/`, for reading only.
- Note every item that crosses the current item through:
  - Overlapping scope.
  - A shared group.
  - A dependency in either direction.
  - The same home decision.
- Carry these crossings forward:
  - As questions in the interview rounds.
  - As cross-notes when writing.

## Step 2 — Prepare and conduct the initial read-back

### Read the insights before any read-back

- If the register’s `docs/intent-insights.md` exists, read it before reading anything back to the Operator.
- Start the following from the insights, shaped by every insight that bears on them:
  - Any filer’s reading this skill writes or revises.
  - Every recommended answer in every round.
- Mark each recommendation shaped by an insight with:
  - `(from insight <date>-<n>)`
  - Place the mark after the recommendation.
- Insights shape recommendations, never answers:
  - Still ask every question.
  - If an insight answers a question in kind, carry that answer as the recommendation.
  - Never skip the question.
  - The Operator may overrule an insight-shaped recommendation like any other recommendation.

### Read the map before the read-back

- If the item file carries a **Map:** line:
  - Read `maps/<map-slug>.md` in the register before the read-back.
  - Follow that map’s Process and Judgements during the interview rounds.
- If the item file has no **Map:** line:
  - Say so in one line.
  - Continue with the procedure below.
  - Add a third read-back question: “which map, if any?”
  - Use the Operator’s answer as the item’s Map line.

### Read back the notes and interpretation

- An item filed from the Operator’s notes carries:
  - Those notes verbatim.
  - The filer’s interpretation of them, according to Roadwork conventions.
- Before asking any design question:
  - Read the notes back exactly as recorded.
  - Then read the interpretation back as it stands.
- If the item file has no interpretation:
  - Write one from the notes now.
  - Read it back, marked as yours.

### Ask the initial read-back questions and wait

- Ask:

```text
❓ **Q1** - **Anything to add to the notes?**

❓ **Q2** - **Any comments on the interpretation?**

❓ **Q4** - **Consistent with what?**
```

- When no Map line exists, also ask Q3:
  - “which map, if any?”
- Ask Q4 for every item:
  - Identify what the item’s product describes:
    - A folder, by path from the project’s root.
    - A system, by name.
    - Or `none`.
  - Give the session agent’s recommendation.
- Wait for the Operator’s answers.

### Close the initial read-back with response offers

- Always close with these three blocks, in this order.
- Precede each block with one sentence explaining it.

- Nothing to add, the reading stands, and the map’s and referent’s recommendations are taken:

```text
no, no and go with recos
```

- The same, with the map and referent answered after the colon:

```text
no, no and go with recos except:
```

- The notes and interpretation alone are accepted; the map and referent are answered by hand:

```text
no, no
```

- Where the harness has a question tool:
  - Present the questions with “nothing” first.
  - If the tool cannot take one choice, use the blocks above.

### Update the item before round 1

- Fold the read-back answers into the item file:
  - Put additions to the notes under a dated addendum heading, in the user’s words.
  - Revise the interpretation to reflect comments.
  - Keep the interpretation marked as the filer’s.
- Start the design tree from this corrected pair of notes and interpretation, never from the original alone.
- Open round 1 from the item’s prepared “not decided by this filing” list:
  - This list was written at ingest with fresh context.
  - If numbered, preserve its numbers as the round’s question numbers.
  - If an earlier filing used a prose list, number it for the round, as today.
  - Re-check the list against the read-back answers.
  - Never use the list instead of those answers.

## Step 3 — Interrogate the intent through design-tree rounds

### Establish the design tree

- Interview the user relentlessly until you reach a shared understanding.
- Map the intent as a **design tree**:
  - Every decision branches into the decisions that depend on it.
- Always use these root branches:
  - **Problem** — what is actually wrong or missing, for whom, how often, at what cost; what the item file asserts versus what is evidenced.
  - **Proposed outcome** — the state of the world when this is done; how anyone would observe it; what is explicitly out.
  - **Affected users and systems** — who and what changes, who must be told, which path the work lands in.
  - **Constraints** — the law that binds, including the brief, rules, and canon; project standards; keys and secrets; loci; batching; what must not change; what must happen outside the project, out of band, before completion; and who makes it happen.
  - **Open questions** — what remains unknown and who can settle it.
- Use the Open questions branch to manage the interview:
  - Resolve decisions needed to define and accept the intent.
  - Do not create an open-questions or undecided-items section in `intent.md`.
  - Where a remaining uncertainty can be bounded by an agreed requirement, responsibility, or external dependency, ask the Operator to decide that boundary and record the resulting fact in the appropriate section.
  - Do not disguise an unresolved decision as an accepted fact.

### Cover the required dimensions of intent

- Use the following as coverage checks throughout the interview:
  - Purpose and the need being addressed.
  - Functions and required behavior.
  - Audience and affected users.
  - Constraints and requirements.
  - Criteria for success: how the outcome will be evaluated.
  - Scope of work: what is included in and excluded from the final deliverable.
  - Context or environment: where and how the outcome will be used.
  - Stakeholder expectations: the desires and preferences of those invested in the project.
  - Metrics for evaluation: quantifiable data used to measure performance.
  - Timeline and deadlines: schedule constraints for delivery.
  - Resource allocation: available budget, tools, and personnel.
  - Compliance and legal standards: applicable regulatory rules.
  - Aesthetic or stylistic guidelines: look, feel, and branding requirements.
  - Usability and accessibility: how different groups can interact with the outcome.
  - Sustainability or lifecycle: how the outcome will be maintained, scaled, or retired.
- Determine which dimensions impose requirements for this item:
  - Do not invent a requirement because a topic appears in the coverage checks.
  - Ask the Operator about consequential choices that the existing evidence and decisions do not settle.
  - Treat an explicit absence of a requirement as an intent fact only when the Operator confirms it and it meaningfully defines the intent’s boundaries.

### Read and apply the project’s standards

- For the Constraints branch:
  - Read the settings key `standards-folders` as `/roadwork-specplan` reads it.
  - Read every file in every listed folder.
  - Name the binding files by path.
- Establish outside dependencies:
  - What must happen outside the project, out of band, before this work can complete.
  - Who makes each outside action happen.
  - Apply the rule’s test for `external`.

### Determine the current frontier

- The **frontier** consists of every decision whose prerequisites are already settled:
  - These are the questions you can ask now without guessing answers you have not heard.
- Ask the whole frontier in one round:
  - Number every question.
  - Give one recommended answer per question.
  - Wait for the user’s answers before the next round.
- Put any question that depends on another question still open in this round into a later round.

### Find facts yourself

- Finding facts is your job, never the user’s.
- If a frontier question needs an environmental fact, look it up yourself or dispatch a sub-agent:
  - A file.
  - A commit.
  - A channel record.
  - A configuration value.
  - What another item already says.
  - Any other fact you could look up.
- Never ask the user for a fact you could find.
- Do not block the whole round on an exploration:
  - A running exploration is an unsettled prerequisite.
  - Only its downstream questions wait for its report.
  - Ask the rest of the frontier now.
- Decisions belong to the user:
  - Put each decision to them.
  - Wait for their answer.

### Format each round

- Use this format:

```text
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

- State recommendations plainly:
  - One recommendation per question.
  - Let the user overrule them.
  - Never convert silence into agreement.
  - Mark insight-shaped recommendations as required above.

### Close ordinary rounds with response offers

- Close each ordinary round with two offers in the offer form:
  - One sentence, followed by `go with recos` in its own block, taking every recommendation as given.
  - One sentence, followed by `go with recos except:` in its own block, for the Operator to complete with the questions that differ.

```text
go with recos
```

```text
go with recos except:
```

- A plain answer list is also an answer.
- Where the harness has a question tool:
  - Put one question per item.
  - Put the recommendation first, labelled `(recommended)`.
  - Follow it with the round’s alternatives.
  - Provide the free-text choice for anything else.
  - Present all questions together so one answer submits the round.
  - If the tool cannot take the whole round, use the blocks above.
  - Never split a round across a second submission.
  - Treat a tick on the recommendation as `go with recos` for that item.
- Record whatever comes back verbatim:
  - Follow it with the recommendations the answer took.
  - Record those recommendations one per question.

### Recompute the tree after every answered round

- Let the user’s answers reshape the tree:
  - Settled decisions move the frontier outward.
  - They unblock questions that depended on them.
- Recompute the frontier.
- Ask the next round of currently answerable questions.
- Continue until:
  - Every branch has been visited.
  - Nothing remains silently assumed.
  - The frontier is empty.
- An empty decision frontier does not waive the section read-back:
  - Every identified intent fact must still be presented for approval under Step 5.
  - Final confirmation must cover the complete approved understanding.

## Step 4 — Construct the intent facts for read-back

### Use the mandated document structure

- Construct `intent.md` in this order:
  - YAML frontmatter.
  - A brief description.
  - The six mandated sections below.
- Each mandated section must contain at least two discrete bulleted facts.
- Use these exact section headlines:

| Section | Required coverage |
|---|---|
| **Purpose and intended outcome** | The need being addressed, purpose, and desired fulfilled state. |
| **Audience, stakeholders, and use context** | Intended users, stakeholder expectations, affected systems, environment, circumstances of use, and which path the work lands in. |
| **Scope and required capabilities** | Included and excluded deliverables, functions, and required behavior. |
| **Constraints and delivery conditions** | Binding constraints, what must not change, deadlines, resources, external dependencies and their responsible parties, and applicable compliance or legal standards. |
| **Experience and lifecycle** | Usability, accessibility, aesthetic or stylistic requirements, maintenance, scaling, sustainability, and retirement expectations. |
| **Success criteria and evaluation** | Observable criteria for success and applicable qualitative or quantitative measures. |

### Define each bullet as a discrete fact

- Each bullet must state one desired or required fact about the fulfilled embodiment of the intent.
- State what the outcome must:
  - Achieve.
  - Support.
  - Include or exclude.
  - Satisfy.
  - Remain within.
- Use a concise, complete fact statement:
  - Make it understandable without its description.
  - Preserve the Operator’s terms where they decided something.
  - Avoid headings or topic labels that do not state a fact.
- Follow each fact statement with a brief description:
  - Explain its meaning, boundaries, or relevant context.
  - Use no more than two sentences.
  - Do not hide an independently meaningful requirement in the description; give that requirement its own bullet.
- Determine the number of bullets by identifying discrete facts:
  - Split a bullet when it contains independently decidable requirements.
  - Split a bullet when adequately describing it would require more than two sentences.
  - Two bullets per section is the minimum, not a target or cap.
- Taken together, the bullets must fully capture the desired intent:
  - Include every substantive decision.
  - Avoid duplicating the same requirement across sections.
  - Place each fact in the section where its meaning is clearest.

### Keep the intent distinct from a plan or specification

- Include no:
  - Implementation or plan steps.
  - Verification procedures — "decided by one command" is one.
  - Change lists.
  - Means: the technologies, structures, formats, file internals, tools or commands by which the outcome is made or checked, unless the Operator named one as a constraint in their own words; then it goes in Constraints, as the Operator's choice.
- Those belong in `plan.md` and `spec.md`.
- Before any section is read back, test every constructed fact: does it say what is wanted, or how it is made or verified? A "how" fact is left out, whatever its source — an earlier answer, a recommendation taken, the filer's reading, a map — and the outcome it served is stated instead. A recommendation taken is the Operator's answer to the question asked, not their choice of means.

### Meet the section minimum without padding

- Check that every mandated section has at least two meaningful, distinct facts supported by the interview.
- If a section lacks sufficient facts:
  - Identify the missing decisions.
  - Return them to the design tree.
  - Ask them when their prerequisites are settled.
- Never:
  - Invent requirements.
  - Duplicate facts.
  - Split one inseparable fact into artificial fragments.
  - Add generic filler to meet the minimum.
- An explicit absence of a constraint or requirement may count only when:
  - The Operator has confirmed it.
  - It meaningfully defines the intent’s boundaries.

### Prepare the frontmatter and description

- Put document metadata in YAML frontmatter:
  - Short title in the user’s words.
  - Originator, by name or role.
  - Accepted status and acceptance date.
  - Item file.
  - Road plans home.
  - Interview date.
  - Map and referent where applicable.
- Use the brief description to summarize:
  - What is wanted.
  - Why it is wanted.
- Ensure every substantive requirement expressed in the description is also captured in the bullets.
- Prepare the structure and wording for review without writing `intent.md` before confirmation.

## Step 5 — Read back every section for approval

### Present all identified intent facts

- Expand the initial read-back with a complete read-back of the constructed intent facts.
- Present the facts compactly, section by section:
  - Show the mandated section headline.
  - Show its fact statements as bullets.
  - Preserve the wording intended for the final document.
  - Omit the descriptions unless the Operator requests them.
- Read back all identified intent facts:
  - Do not omit a fact because it came from an earlier answer, an insight, a map, or a binding source.
  - Approval of the original notes or interpretation does not replace approval of these sections.

### Obtain approval for each section

- Give the Operator the opportunity to:
  - Accept the section.
  - Add a fact.
  - Modify any bullet.
- Use clear section and bullet references so the Operator can identify changes compactly.
- Where the harness has a question tool:
  - Offer acceptance first.
  - Allow additions or modifications through free text.
  - Present independent section approvals together where the tool supports them.
- Otherwise, use the offer form:
  - A sentence followed by `confirm` (and, before it, `confirm and /roadwork-specplan <ref>`), the acceptance block.
  - A sentence followed by `sections except:`, the modifications block — the three blocks as Step 6 names them.
- Treat only an explicit answer as approval:
  - Never interpret silence as acceptance.

### Revise and read back changed sections

- If the Operator requests additions or modifications:
  - Incorporate their decision.
  - Re-check the facts for discreteness, completeness, and the section minimum.
  - Read back the entire revised section for approval, with descriptions omitted unless requested.
- If a change raises dependent decisions:
  - Return those decisions to the design tree.
  - Ask the newly available frontier.
  - Resume section read-back after the decisions are settled.
- If a change affects another previously approved section:
  - Revise that section.
  - Read it back for renewed approval.
- Continue until every section is explicitly approved.

## Step 6 — Obtain final confirmation before writing

### Confirm the complete shared understanding

- Once the decision frontier is empty and every section has been read back under Step 5:
  - Say so in one line.
  - Ask the user to confirm the complete shared understanding.
- Offer each of these in its own block:

```text
confirm and /roadwork-specplan <ref>
```

```text
confirm
```

- On `confirm`:
  - Write and accept the intent.
- On `confirm and /roadwork-specplan <ref>`:
  - Write and accept the intent as on `confirm` alone.
  - Then run the spec skill in the same turn.
- **Do not write `intent.md` until the user confirms.**

### Never offer confirmation beside an open round

- A round's closing is the two ordinary blocks of Step 3, `go with recos` and `go with recos except:`, and nothing more — even when taking every recommendation would empty the frontier.
- The section read-back of Step 5 is its own message, sent only after the last round's answers are recorded in the item file; it never shares a message with an unanswered question, and its facts are built from recorded answers, never from recommendations not yet taken.
- The section read-back message closes with three blocks, in this order: `confirm and /roadwork-specplan <ref>`, `confirm`, `sections except:`. `confirm` approves every section as read back and confirms the complete shared understanding in one word; `sections except:` takes the sections as read back but the bullets amended, added or struck after the colon, after which the changed sections are read back again with the same three blocks. These are Step 5's acceptance and modification blocks; no other word approves a section.
- A message that carries a question carries no `confirm` block. The forms `go with recos and confirm` and `go with recos and confirm and /roadwork-specplan <ref>` are retired: a recommendation taken and a confirmation given are two answers to two messages.

## Step 7 — Write and accept `intent.md`

### Use the required file format

- Write the file in the item’s folder.
- Use this general form:
  - Replace placeholders with approved facts.
  - Add as many bullets as the intent requires.
  - Include at least two bullets in each mandated section.
  - Omit optional frontmatter fields when they do not apply.

```markdown
---
title: "<short title in the user's words>"
author: "<originator — the Operator, by name or role>"
status: accepted
accepted: "<date>"
item: "<todo.md or feature.md>"
road-plans-home: "<road plans home>"
interview: "<date>"
map: "<map-slug, when applicable>"
referent: "<project-root-relative folder path or system name, when applicable>"
---

<Brief description of what is wanted and why, based upon the originator's terms.>

## Purpose and intended outcome

- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>
- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>

## Audience, stakeholders, and use context

- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>
- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>

## Scope and required capabilities

- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>
- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>

## Constraints and delivery conditions

- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>
- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>

## Experience and lifecycle

- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>
- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>

## Success criteria and evaluation

- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>
- **<Discrete desired or required fact>.** <Brief description, no more than two sentences.>
```

### Apply the text and completeness rules

- Date claims wherever a claim is made.
- Machine-read IDs and hashes from what you looked up:
  - Never supply them from memory.
- Preserve the Operator’s words where they decided something.
- Keep the final fact statements consistent with the approved read-back:
  - Do not introduce new requirements during writing.
  - If drafting a description reveals a new decision or substantive ambiguity, return to the interview and obtain the necessary approval before writing.
- Include no open-questions or undecided-items section.
- Check the completed document for:
  - Frontmatter, description, and mandated sections in the required order.
  - At least two meaningful, discrete facts in each section.
  - A description following every fact.
  - No description longer than two sentences.
  - Full coverage of the desired intent across the bullets.
  - No requirements hidden only in descriptions or introductory prose.
  - No plan steps, verification procedures, or change lists.
  - Approval of every section and final confirmation.
- If `intent.md` already exists:
  - Replace it whole.
  - Explain in your reply what changed.

### Record the referent

- When the Operator named a referent:
  - Record the same referent in the intent’s frontmatter and the item file.
  - Make the first bullet in **Constraints and delivery conditions** state the requirement for consistency with that referent.
  - Follow it with a brief description defining what that consistency means for this intent.
  - Read back and obtain approval for that fact like every other fact.
- If the Operator chose `none`:
  - Record `referent: none` in the intent’s frontmatter.
  - Do not invent a consistency requirement.

### Write crossings in both directions

- In the same act, for every related item with a crossing established by the interview:
  - Append a dated section to its item file:

```markdown
**Cross-items (<date>, written by /roadwork-intentify of <ref>):**
```

- Explain in that section how the current item bears on the related item.
- If the crossing is a dependency:
  - Update the related item’s frontmatter:
    - `blocked-by` or `blocking`.
    - Re-derive `blocker`.
  - Update the current item’s frontmatter to match.
  - Use the Roadwork conventions’ reference forms:

```text
main/<kind>/<item-name>
```

### Update the register and item metadata

- If the interview changed the item’s weight or group:
  - Revise its line in the register’s `ordering.md`.
- Set the item file’s status line to:

```text
intent accepted <date>
```

- If the Operator named a map:
  - Write a `**Map:** <map-slug>` line in the item file.
  - Place it under the Owner line, after the Destination line where both exist.
  - Use one map per item.
  - Do not use a frontmatter key in the item file.
- If the Operator named a referent:
  - Write a `**Referent:**` line in the item file:
    - Directly after the Map line.
    - After the Owner line if there is no Map line.
- Commit in the register:
  - Its commits remain local.
  - Do not create a PR.

## Step 8 — Present the accepted intent and offer the next step

### Print the accepted file

- Print `intent.md` whole and verbatim in the reply:
  - Include the frontmatter, description, every section, every fact, and every description.
  - The compact facts-only read-back does not replace this full-file reply.
- Place the file before the offers, following the reply-form rule.
- If an existing intent was replaced, say what changed.

### Surface item-file corrections explicitly

- If the interview surfaced facts that belong in the item file, such as:
  - A wrong claim.
  - A new observation.
- Say so and offer to amend the item file.
- Never silently use the intent to correct the item.

### Offer the next skill

- End by offering the next step:
  - Precede the invocation with its sentence.
  - Put the single invocation in its own code block, following the offer form.

```text
/roadwork-specplan <ref>
```

- Present this as an offer; do not invoke it from the closing offer.
- Every skill in the chain ends this way under the road plans rule.
- When the Operator explicitly included `/roadwork-specplan <ref>` in their confirmation:
  - Follow that authorization.
  - Run the spec skill in the same turn after writing and accepting the intent.

  ### Present the back offers, other offers and possibly fact-suffix per roadwork-constitution.md

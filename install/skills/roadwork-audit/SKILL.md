---
name: roadwork-audit
description: Audits one document with fresh readers for writing, truth or continuity when the Operator asks, and records the findings.
when_to_use: Use when the user says /roadwork-audit <document> <kind>, "audit this document", "check this for writing, truth and continuity", or /roadwork-audit alone for the kinds and the known pairs.
argument-hint: <document> <kind> [<path> …] [--item <ref>]
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

# roadwork-audit — one document, five fresh readers, three kinds of audit

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. This skill sits beside the lifecycle chain: it reads one document, dispatches readers, records their findings, and offers the work. It never edits the document it reads, never rules on a finding (the Operator does), and never runs a second round of readers on its own.

## 1. Invocation and kinds

`/roadwork-audit <document> <kind> [<path> …] [--referent <folder>] [--item <ref>]` — `<document>` a path from the workspace root; `<kind>` one of `writing`, `truth`, `continuity`, `all`; the paths after the kind are extra sources (truth) or counterparts (continuity); `--referent <folder>` names a folder referent, an input of the truth kind: the folder the document describes, its listing a source (§4); `--item <ref>` names the register item the findings land on.

- With no kind the skill asks which kind and does nothing else. With a document that does not exist it says so and stops. A bare `/roadwork-audit` prints the kinds and the known pairs (§4) and writes nothing.
- *writing* tests how the document reads: the Operator's four rules and the paths-and-instance-strings question, the document alone.
- *truth* tests whether the document agrees with the homes it points at: contradiction, unsupported claim, stale pointer, altered restatement, homeless fact.
- *continuity* tests whether the document agrees with the documents that must agree with it: divergence, missing counterpart, orphaned statement, naming, version.
- `all` runs writing, truth, continuity in that order, fifteen readers in three waves of five; paths after `all` go to truth as sources and to continuity as counterparts; one audit section per kind, one report folder per kind, one holder todo for the run.

## 2. The reader form (every kind)

Five fresh sub-agents, launched in parallel through the harness's Agent tool, model opus at effort xhigh — fixed; the dispatcher may not lower them (the Operator's standing word on sub-agents, 2026-10-12). One question each; each reader is given the document's path and, for truth and continuity, the sources' paths, and nothing else; each writes its report verbatim to its file. Findings are line-numbered, at most ten per reader; a reader with none writes "clean".

The five prompts come from `scripts/dispatch-plan.py --doc <document> --kind <kind> [--sources <path>…] --report-dir <dir> [--root <root>] [--copy <repo>=<commons|main|working-tree>…]`: run it, read its VERSION lines (truth, continuity — §4; a COPY QUESTION means stop and ask, nothing dispatched), send its five prompts as five Agent calls in one turn, wait for all five, then read the five reports from `<dir>/q1.md` … `q5.md`. The reader brief, `texts/reader-brief.md`, verbatim (the bracketed clause for truth and continuity only):

> You are a fresh reviewer with no other context. Read this one file: <document>. [truth, continuity: Then read these source files, and nothing else: <sources>. The version of each, in that order: <versions>. Open your report with those lines, verbatim, before your findings.] Answer this one question: <question>. Give a numbered list of findings, each with the line it points at and one sentence; at most ten; say 'clean' if none. Write your report, exactly as you return it, to the file <report path> (create it; it does not exist). Do not rewrite anything else. Do not read any other file.

## 3. writing

The four rules, the Operator's (2026-10-13), their home the brief's archived audit items `todo/next-workspace-standup/archive/fix-the-nethub-claude-md` and `…/implement-the-audit-findings` in the register:

1. Definition before use — every term is defined in a clause before its first use, or pointed at its defining file at or before that use.
2. No forward references — no line depends on something stated only later in the document.
3. Explicit premises — every rule states the premise it rests on: why it holds, or what fact makes it apply.
4. Implicit knowledge audited — nothing the reader must already know is left unstated and unpointed.

The five questions are `texts/questions-writing.md`: one per rule, then paths and instance strings. Before the readers, run the mechanical checker and print its result with the readers' findings as a sixth set:

```
python3 <skill>/scripts/check-writing.py --doc <document> --paths --instance-free [--root-prefix nethub/] [--strings <list>]
```

`--paths`: every path token (a backticked span containing `/`, outside fenced blocks, that is not a slash command or a git ref) starts with the root prefix, default `nethub/`; none opens with `/` or `...`. `--instance-free`: the strings of the list file are absent; the default list is the register's `docs/local/instance-strings.txt`, this workspace's own names, kept by the Operator and ignored by git (instance material).

## 4. truth and continuity

**The version lines and the copy question** — every truth and continuity audit; writing prints none. Terms: a *commons copy* is a path under `nethub/reference/repos/<repo>/`; a *seated clone* is `<root>/<repo>/`, a git repository beside `nethub/` (the root: the folder holding `nethub/`); a path is *twinned* when it lies under a commons copy whose repository has a seated clone, or under a seated clone whose repository has a commons copy. Before any reader runs, `scripts/dispatch-plan.py` prints one version line per source or counterpart — `VERSION: <path>@<commit>`, the path from the root, the commit the short HEAD of the repository holding the path, `<path>@unversioned` for a path in no repository — and for a twinned path compares the three copies by commit: the commons copy (the commons clone's HEAD), the clone's `main` (its local ref, never fetched — the audit fetches nothing) and the clone's working tree (its checked-out branch's HEAD and the file on disk). Equal, the file unmodified: one line, `commons and seated clone both at <commit>`, and the commons copy is read. Differing by any of the three commits, or the file modified in the working tree: the script prints `COPY QUESTION: <repo>` and the three copies as choices, each by its version line — `<path>@<commit>, the commons copy`; `<path>@<commit>, the main copy`; `<path>@<branch> <commit>[ modified], the working-tree copy` — and exits 2 with no prompt; nothing is written on the item until the Operator answers. The session agent puts the question as three offers in the reply form, blocks with O-numbers, each the audit invocation re-typed with `--copy <repo>=<commons|main|working-tree>` appended — every repository whose copies differ named in each block, a mixed answer typed by hand with one `--copy` per repository; no default: the skill never picks a copy. The answer re-runs the audit; the script prints the version lines with the chosen copies and the five prompts: `commons` reads the commons path; `working-tree` the clone's file; `main` the file as `git show main:<path>` gives it, written to `<report-dir>/sources/<repo>-main-<commit>-<file name>`, the reader given that path and the version line naming the clone's path and the `main` commit. `--root <root>` names the root where the skill is not run from under `nethub/`. Every version line goes three places: the prompts (the brief's clause), the item's audit section (§5) and the head of each reader's report.

*truth* — the sources: every pointer the document carries — a backticked path, resolved from the workspace root, or a document named in prose, resolved by file name against `nethub/docs/`, `nethub/.claude/rules/` and the commons' `docs/` folders — plus the constitution at `nethub/reference/repos/buzz-agentic-architecture/docs/constitution.md` always — a twinned path wherever the store is seated, read through the copy question above like any other source — plus the paths given on the invocation. A pointer that resolves to nothing is reported as a stale pointer before dispatch. With a folder referent (`--referent <folder>`), the listing made by `scripts/list-referent.mjs` is among every reader's sources. The skill prints the source list before dispatch. The questions: `texts/questions-truth.md` — the five, then a sixth: "Omission — what exists in the referent listing that the document does not name? List each path, with the document section that should name it." The reader form is unchanged — model opus at effort xhigh, fixed — with one reader more, the sixth question's.

*continuity* — the counterparts, from this table, matched by the document's path:

| document | counterpart |
|---|---|
| the brief `nethub/CLAUDE.md` | the constitution (the path above; its copy by the copy question above) |
| any `reference/CLAUDE.md` anchor | the brief `nethub/CLAUDE.md` |
| a file of the seed (`nexus/`, cloned beside nethub) | the same file in the object `nethub/nexus/`, and the other way |

A pair the table lacks is given as paths on the invocation; with neither, the skill asks for the counterparts. The questions: `texts/questions-continuity.md`.

## 5. Where the findings land

On the item named by `--item` (`--item <ref>`): a dated section `**Audit (<date>, <kind>, written by /roadwork-audit):**` appended to its item file: the invocation line, then one version line per source as the script printed it (truth, continuity), then every reader's findings listed, each citing its report at `audit/<date>-<kind>/q<n>.md` in that item's folder — each report's first lines are the version lines of the sources that reader was given, in the order given, as the brief instructs. A folder referent's listing is kept at `<report-dir>/sources/referent-<folder's last segment>.txt`, and its VERSION line, `VERSION: referent <folder> listing sha256 <first twelve hex digits>`, is among the version lines. With no item: a new todo filed in the full ingest form (frontmatter, placeholders, an ordering line) under `unnavigated/`, named `audit-of-<document path, slashes as hyphens, the extension dropped>-<date>`, its notes the invocation line verbatim, its reading the findings' summary, the reports in its `audit/` folder. The act is committed in the register, local. The skill never edits the document it audits and writes only in the register's item folders and the files the invocation names.

## 6. Hand back

Print every reader's findings whole, the checker's set first for writing. Then one offer, in the offer form: an ingest of a todo that implements the findings, its notes prefilled —

```
/roadwork-ingest implement the audit findings recorded at <ref>
```

— where `<ref>` is the holder todo or the named item; when the findings sit on a named item, offer that item's next lifecycle step instead. Then the back offers as `/roadwork-ingest` §5b computes them, and the fact suffix, by the clock.

## Never

Never edits the document; never lowers the readers' model or effort; never files on a bare call; never a second round of readers on its own; never rules a finding out (the Operator does, on the holder item); never posts anywhere outside the workspace.

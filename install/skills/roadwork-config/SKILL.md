---
name: roadwork-config
description: Reads and sets the instance's settings file when the Operator asks for the config or a key's value.
when_to_use: Use when the user says /roadwork-config, "config", "settings".
argument-hint: "[<key> <value>]"
---

## Prerequisites

The constitution, `roadwork-constitution.md`, must be in the working context before this skill acts — the whole document, verbatim: its rule bullets, its guidance sections (the hierarchy, the offers, the back offers, the fact suffix, the externalities), its terms table and its glossary; a mention of the file, a summary of it, or a loaded fragment does not count. If it is not, find the file by walking up from the working directory: at each folder, look for `.claude/rules/roadwork-constitution.md`; stop at the first found, or at the filesystem root. Read that one file with the Read tool, once. If no folder on the way holds it, tell the Operator this vital information is missing and refuse to run this skill. Do not read it again in the same session unless a compaction has removed it or even altered it.

# roadwork-config — the settings file

Roadwork conventions: `roadwork-constitution.md`, its terms table and its glossary. This skill keeps one file, `roadwork/config.json` at the register's root: the instance's values the other skills read by key. The file is ignored by the register's git and written mode 600. The session agent invokes the script, `node <skill>/scripts/config.mjs`, for every read and write and never opens the file itself. The script finds the register by walking up from the working directory to the first folder holding `roadwork/ordering.md` (or, inside the register, its `ordering.md`); it creates the file `{}` when it is missing.

## 0. The schema

The schema lives here; a key outside it is refused on set and reported on the bare call as "unknown, not in the schema", never deleted. A new key is a change to this skill.

| key | meaning | shape |
|---|---|---|
| org-slug | the organisation's slug | kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$` |
| notify-url | the URL Roadwork posts an externality's record to when it is set and when it is cleared; optional — empty means no notice, never asked for by the empty-keys prompt; any credential the receiver wants rides in the URL itself, so the value is a secret: masked in every reply, set by a route of §2 | an `https://` URL |
| status-url | the URL Roadwork reads an item's externalities' state from, by the make skill at its start and by the inventory's bare call; optional — empty means the Operator is asked, never asked for by the empty-keys prompt; a secret as `notify-url` is | an `https://` URL |
| standards-folders | the project's standards folders, in the project's own structure — coding standards, brand, styling and the like; optional, empty where a project keeps none; a list, in the order given | a list of folder paths relative to the project's root, each an existing folder under that root |
| versioned | the project's changes land by pull request — yes where branches are opened as pull requests, no where the register runs in an unversioned project; unset reads as no; with yes, `/roadwork-inventory`, `/roadwork-verify-and-archive` and `/roadwork-make` print what is not yet landed and offer the pull request (`unlanded.mjs`, the inventory skill's script) | yes or no |
| subagent-reader | the model family the reader sub-agent runs on — a fresh reader of a document against one question (the verification rounds, the audit, the sanity checks); optional, unset reads as sonnet (the rule's Sub-agents bullet) | one of haiku, sonnet, opus, fable |
| subagent-finder | the model family the finder sub-agent runs on — a fact lookup for the dispatcher (a file, a commit, a config value, what another item says); optional, unset reads as haiku (the rule's Sub-agents bullet) | one of haiku, sonnet, opus, fable |
| subagent-explore | the model family the explore sub-agent runs on — local file discovery across the project; optional, unset reads as sonnet (the rule's Sub-agents bullet) | one of haiku, sonnet, opus, fable |
| subagent-research | the model family the research sub-agent runs on — outside documents and facts, compared and summarised; optional, unset reads as sonnet (the rule's Sub-agents bullet) | one of haiku, sonnet, opus, fable |
| subagent-builder | the model family the builder sub-agent runs on — a deliverable built under a ledger (the make, a cohort member); optional, unset reads as opus (the rule's Sub-agents bullet) | one of haiku, sonnet, opus, fable |
| subagent-reviewer | the model family the reviewer sub-agent runs on — a finished change checked against its brief; optional, unset reads as opus (the rule's Sub-agents bullet) | one of haiku, sonnet, opus, fable |

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

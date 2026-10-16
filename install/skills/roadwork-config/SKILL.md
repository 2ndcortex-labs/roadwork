---
name: roadwork-config
description: Reads and sets the instance's settings file, roadwork/config.json at the register's root — with no argument, prints every key of the schema with its value; with `<key> <value>`, sets one key after checking its shape; after either, the empty keys asked about once per run, numbered, answered `<n> <value>`, blank to skip; a value may also be set from a terminal line or a file the Operator writes, never typed into the chat. Use when the user says /roadwork-config, "config", "settings". Writes only roadwork/config.json, only through its script.
---

# roadwork-config — the settings file

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. This skill keeps one file, `roadwork/config.json` at the register's root: the instance's values the other skills read by key. The file is ignored by the register's git and written mode 600. The session agent invokes the script, `node <skill>/scripts/config.mjs`, for every read and write and never opens the file itself. The script finds the register by walking up from the working directory to the first folder holding `roadwork/ordering.md` (or, inside the register, its `ordering.md`); it creates the file `{}` when it is missing.

## 0. The schema

The schema lives here; a key outside it is refused on set and reported on the bare call as "unknown, not in the schema", never deleted. A new key is a change to this skill.

| key | meaning | shape |
|---|---|---|
| org-slug | the organisation's slug | kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$` |
| externality-add-endpoint | the externality service's add address | an `https://` URL |
| externality-update-endpoint | the externality service's update address | an `https://` URL |
| externality-status-endpoint | the externality service's status address | an `https://` URL |
| externality-inventory-endpoint | the externality service's inventory address | an `https://` URL |
| externality-key | the externality service's key, one static key per org; low security by the Operator's ruling of 2026-10-13, set as any key | non-empty |
| standards-folders | the project's standards folders, in the project's own structure — coding standards, brand, styling and the like; optional, empty where a project keeps none; a list, in the order given | a list of folder paths relative to the project's root, each an existing folder under that root |

The shape is checked, nothing else: nothing is called to validate a value, and the script makes no network call. A bad shape is refused with the key's meaning and shape printed.

**Instance keys.** A key one instance alone needs — a deploy token of a service only this workspace runs, say — is never added here, since the schema is the primitive's. It is listed in the register's `docs/local/config-keys.json`, instance material ignored by git beside `config.json`: a list of entries `{"key", "meaning", "shape": "non-empty" | "https" | "kebab", "secret": true | false}`. The script merges them after the schema, marked "(instance key)"; a key the schema already has is refused. A secret instance key is masked in every reply — "set, <n> characters" or "empty", never the value — refused on the `set` line, and set by a route of §2.

## 1. The three calls

- **Bare** — `/roadwork-config`: run `node <skill>/scripts/config.mjs` and print its lines: every key of the schema and every instance key with its value or "empty", a secret instance key masked, an unknown key as "unknown, not in the schema".
- **Set one** — `/roadwork-config <key> <value>`: run `node <skill>/scripts/config.mjs set <key> <value>` and print its line, or its refusal (an unknown key, a bad shape with the meaning).
- **The empty keys** — after either call, once per run: run `node <skill>/scripts/config.mjs empty` and list the empty keys numbered, one line each with the meaning (`1. <key> — <meaning>`); when it prints `none`, say nothing more. The Operator answers lines `<n> <value>`, one key per line, several lines in one reply; a blank reply skips all. Each answered line is set as in "Set one"; a number naming a secret instance key gets a route of §2 instead. The keys are asked about once per run, never again in the same run.
- **Set a list** — `/roadwork-config standards-folders <path> [<path> …]`: run `node <skill>/scripts/config.mjs set standards-folders <path> [<path> …]` and print its line, or its refusal (a path that is not an existing folder under the project's root, or one that escapes it). The project's root is the folder that holds `nethub/` in a workspace, where the register sits at `nethub/nexus/roadwork/`; elsewhere the folder that holds the register, roadwork/ at its root. An optional key is never listed by the empty-keys prompt; `node <skill>/scripts/config.mjs get <key>` prints one key's value, or "empty", for a skill that reads it.

## 2. Setting a value outside the chat

A secret instance key, or any value the Operator prefers not to type into the chat, is set by one of two routes, run in the object, `nethub/nexus/`, the folder that holds the register `roadwork/`; the script lives in nethub's skills folder, `nethub/.claude/skills/roadwork-config/scripts/config.mjs`, one level up from the object. The terminal route, a zsh line:

`read -rs "V?Paste the value of <key>, then Enter: " && CONFIG_KEY=<key> CONFIG_VALUE="$V" node ../.claude/skills/roadwork-config/scripts/config.mjs set-from-env && unset V`

or the file route, from a file the Operator wrote:

`node ../.claude/skills/roadwork-config/scripts/config.mjs set-from-file <key> <path>`

Both print only `<key>: set, <n> characters`; an empty value is refused.

## 3. Hand back

Print the script's lines as they came; offer nothing but the empty-keys prompt.

## Never

Never open, read, parse or print `roadwork/config.json` but through the script; never ask for a secret's value in the chat; never print a secret; never delete a key; never commit the file.

**Text for the Operator.** In text for the Operator, use the plain words of the terms table — `docs/terms.md` in the register, one row per term: the plain word, the agent's word, the meaning; the agent's words stay in the skill.


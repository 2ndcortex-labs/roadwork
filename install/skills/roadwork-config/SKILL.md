---
name: roadwork-config
description: Reads and sets the instance's settings file, roadwork/config.json at the register's root — with no argument, prints every key of the schema with its value (the two secrets masked); with `<key> <value>`, sets one key after checking its shape; after either, the empty keys asked about once per run, numbered, answered `<n> <value>`, blank to skip; a secret is never typed into the chat but set from a terminal line or a file the Operator writes. Use when the user says /roadwork-config, "config", "settings". Writes only roadwork/config.json, only through its script.
---

# roadwork-config — the settings file

Roadwork conventions: this skill's glossary; in a workspace, its rules file as well. This skill keeps one file, `roadwork/config.json` at the register's root: the instance's values the other skills read by key. The file is ignored by the register's git and written mode 600. The session agent invokes the script, `node <skill>/scripts/config.mjs`, for every read and write and never opens the file itself, so a secret never crosses the agent's context. The script finds the register by walking up from the working directory to the first folder holding `roadwork/ordering.md` (or, inside the register, its `ordering.md`); it creates the file `{}` when it is missing.

## 0. The schema

The schema lives here; a key outside it is refused on set and reported on the bare call as "unknown, not in the schema", never deleted. A new key is a change to this skill.

| key | meaning | shape | secret |
|---|---|---|---|
| org-slug | the organisation's slug | kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$` | no |
| externality-add-endpoint | the externality service's add address | an `https://` URL | no |
| externality-update-endpoint | the externality service's update address | an `https://` URL | no |
| externality-status-endpoint | the externality service's status address | an `https://` URL | no |
| externality-inventory-endpoint | the externality service's inventory address | an `https://` URL | no |
| externality-key | the externality service's key, one static key per org | non-empty | yes |
| RAILWAY_TOKEN | the service's deploy token on Railway | non-empty | yes |

The shape is checked, nothing else: nothing is called to validate a value, and the script makes no network call. A bad shape is refused with the key's meaning and shape printed.

## 1. The three calls

- **Bare** — `/roadwork-config`: run `node <skill>/scripts/config.mjs` and print its lines: every key of the schema with its value, a secret as "set, <n> characters" or "empty", an unknown key as "unknown, not in the schema".
- **Set one** — `/roadwork-config <key> <value>`: run `node <skill>/scripts/config.mjs set <key> <value>` and print its line, or its refusal (an unknown key, a bad shape with the meaning). A secret key is never set this way (§2).
- **The empty keys** — after either call, once per run: run `node <skill>/scripts/config.mjs empty` and list the empty keys numbered, one line each with the meaning (`1. <key> — <meaning>`); when it prints `none`, say nothing more. The Operator answers lines `<n> <value>`, one key per line, several lines in one reply; a blank reply skips all. Each answered line is set as in "Set one"; a number naming a secret gets the terminal line of §2 instead. The keys are asked about once per run, never again in the same run.

## 2. Secrets

`externality-key` and `RAILWAY_TOKEN` are secrets. A secret is never typed into the chat and is masked in every reply: "set, <n> characters" or "empty", never the value. When asked to set a secret, or when the empty-keys prompt reaches one, the skill prints this terminal line with the key filled in and the path of the folder holding `roadwork/` (here `/Users/baa/Projects/baa-workspace/nethub`), a zsh line to run there as the register's owner:

`read -rs "V?Paste the value of <key>, then Enter: " && CONFIG_KEY=<key> CONFIG_VALUE="$V" node .claude/skills/roadwork-config/scripts/config.mjs set-from-env && unset V`

or the file route, from a file the Operator wrote:

`node .claude/skills/roadwork-config/scripts/config.mjs set-from-file <key> <path>`

Both print only `<key>: set, <n> characters`. `set` refuses a secret on the command line ("set <key> from the terminal line the skill prints"); an empty value is refused.

## 3. Hand back

Print the script's lines as they came; offer nothing but the empty-keys prompt and, for a secret, its terminal line.

## Never

Never open, read, parse or print `roadwork/config.json` but through the script; never ask for a secret's value in the chat; never print a secret; never delete a key; never commit the file.

**Text for the Operator.** In text for the Operator, use the plain words of the terms table — `docs/terms.md` in the register, one row per term: the plain word, the agent's word, the meaning; the agent's words stay in the skill.


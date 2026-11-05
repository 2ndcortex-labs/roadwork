The todo sub-register. One subfolder per todo, named by a kebab-case item name (no
numbers; an item name is never reused), holding exactly four files: `todo.md` — the
item: frontmatter (`blocker`, `blocking`, `blocked-by`, `external`, `group`,
`in-process`, `disposition`, `road-level` — the level within its destination: `main`, `secondary`, `side`, or empty),
then what was observed or asked, dated claims, owner, a status line (an item
filed from the Operator's notes keeps the notes verbatim, then the filer's
interpretation marked as such, pending the Operator's word); `intent.md` — the
outcome wanted and why (a placeholder until the roadwork-intentify interview fills it);
`plan.md` — how it will be done and verified ("not yet scoped" is a valid
plan); `spec.md` — the buildable unit, written when the plan scopes the work
("not yet specified" is a valid spec). A todo archives by moving its folder
whole into its destination folder's `archive/`, resolution recorded in its `todo.md`. Nothing here is
ever deleted. New capabilities live in `../feature/`; ideas in `../spark/`.

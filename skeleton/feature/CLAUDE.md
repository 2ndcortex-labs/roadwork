The feature sub-register. One subfolder per feature, named by a kebab-case
item name (no numbers; an item name is never reused), holding exactly four files:
`feature.md` — frontmatter (`blocker`, `blocking`, `blocked-by`, `external`,
`group`, `in-process`, `disposition`, `onroad-cohort` — on features
only: the cohort a feature is built in, empty when none — and `road-level`, the level within its destination: `main`, `secondary`, `side`, or empty), then what the feature is and for whom, dated claims, owner, a status
line (a feature filed from the Operator's notes keeps the notes verbatim, then
the filer's interpretation marked as such, pending the Operator's word);
`intent.md` — the outcome wanted and why (a placeholder until the roadwork-intentify
interview fills it); `plan.md` — how it will be built and verified ("not yet
scoped" is a valid plan); `spec.md` — the buildable unit, written when the
plan scopes the work ("not yet specified" is a valid spec). A feature archives
by moving its folder whole into its destination folder's `archive/` when it has shipped, resolution
recorded in its `feature.md`. Nothing here is ever deleted. Fixes and chores
are not features — they live in `../todo/`; ideas in `../spark/`.

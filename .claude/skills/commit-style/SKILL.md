---
name: commit-style
description: Use before creating any git commit or doing history cleanup in this repo — enforces the adopted commit-message format, one-change-per-commit rule, and fixup/autosquash rebase workflow
---

# Commit style — andreimuntean.dev

## Message format

```
type: Subject line in sentence case
                                      <- blank line
Body wrapped at 90 chars explaining WHY, not how (diff shows how).
Markdown OK; space before list markers.
```

- Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build`
  `ci` `chore` `revert` `config` `sub(type)`.
- Header (type + subject) ≤ 72 chars. Imperative-ish, capitalized subject.
- Issue refs `(#123)` at end of subject once GitHub issues exist — omit
  until then.
- **No attribution trailers of any kind** — no Co-Authored-By, no
  "Generated with" lines. Global user rule; always wins.

## History rules

- One commit = one logical change. Never "fixed X and added Y".
- Never a "fix review comments" commit — amend the actual commit:

```bash
git add -p
git commit --fixup=<sha-of-commit-being-fixed>
git rebase -i $(git merge-base origin/main HEAD) --autosquash
```

- Rebase off the merge-base, not main's tip, unless there's a real
  conflict.
- Formatting-only changes get their own commit, never mixed with
  functional changes.

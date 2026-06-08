---
description: 'Conventional Commit rules for SKY UX. Used by GitHub Copilot commit message generation (see .vscode/settings.json) and by any agent authoring commits or pull request titles.'
---

# Commit Messages

Commit messages follow the Conventional Commits standard:
https://www.conventionalcommits.org/en/v1.0.0/#specification

They drive changelog generation and semantic versioning, so the format is
enforced. The same rules apply to pull request titles (validated by
[validate-pr.yml](../workflows/validate-pr.yml)).

## Format

```
<type>(<scope>): <subject>
```

- **type** — required. Use one of the types in the `types:` section of
  [validate-pr.yml](../workflows/validate-pr.yml): `feat`, `fix`, `docs`,
  `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`,
  `deprecation`.
- **scope** — use a scope from the `scopes:` section of
  [validate-pr.yml](../workflows/validate-pr.yml) that matches the component or
  module being changed (e.g. `components/forms`, `sdk/testing`, `release`). If
  multiple scopes are affected, omit the scope entirely.
- **subject** — must match the `subjectPattern:` in
  [validate-pr.yml](../workflows/validate-pr.yml): do not start with a capital
  letter, do not include an exclamation point, and do not end with a period.
  (This applies only to the subject text after the `type(scope): ` prefix.)

## Rules

- Keep the commit to a single line. Do NOT include an extended body unless it
  describes a breaking change.
- For a breaking change, append `!` after the type/scope, before the colon
  (e.g. `feat(components/forms)!: change default input behavior`), and add a
  body explaining the break. The `!` marker is part of the header, not the
  subject, so it does not conflict with the `subjectPattern`.

## Examples

```
fix(components/forms): correct input box label alignment
feat(components/lookup): add async search support
docs(components/avatar): clarify size input options
chore(release): publish 12.4.0
```

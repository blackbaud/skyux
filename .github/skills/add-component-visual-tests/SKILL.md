---
name: add-component-visual-tests
description: 'Workflow for adding Storybook visual-test stories for a @skyux/* component in this Nx monorepo, used for Percy visual regression snapshots. Use when asked to "add visual tests", "add a story", "create a storybook story", or set up Percy/visual coverage for a component. Covers the @skyux-sdk/e2e-schematics:story generator, the component-e2e generator when no storybook app exists yet, the wrapper component + .stories.ts conventions, and the build/lint/format gate. For unit tests use the add-component-unit-tests skill; for harnesses use the add-component-harness skill.'
argument-hint: '<library> <ComponentName> (e.g. avatar Avatar)'
---

# Add Visual Tests (Storybook stories) for a Component

Use this skill to add Storybook stories that drive Percy visual-regression
snapshots for a component in a published `@skyux/*` library. The file-level
conventions live in
[visual-testing.instructions.md](../../instructions/visual-testing.instructions.md)
(it auto-applies to `**/apps/e2e/*-storybook/src/app/**/*.stories.ts`) — read
it before writing code rather than guessing.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions (Nx tasks, the e2e/storybook app layout, and
Conventional Commits).

## When to Use

- A component needs visual-regression coverage (a new story), or an existing
  story needs to cover a new visual state.

Do NOT use this skill for:

- **Unit tests** — use
  [add-component-unit-tests](../add-component-unit-tests/SKILL.md).
- **Test harnesses** — use
  [add-component-harness](../add-component-harness/SKILL.md).
- Creating a brand-new library — use
  [add-skyux-library](../add-skyux-library/SKILL.md), which creates the
  storybook app via the `component-e2e` generator.

## Procedure

Work top to bottom. **Always mirror an existing sibling story** in the same
storybook app (or the closest analog) for exact style; do not invent new
patterns.

1. **Confirm the storybook app exists.** Look for
   `apps/e2e/<library>-storybook/`. If it does not exist, create it first:

   ```bash
   npx nx g @skyux-sdk/e2e-schematics:component-e2e <library>
   ```

   This creates `apps/e2e/<library>-storybook` (tag `component-e2e`) and
   `apps/e2e/<library>-storybook-e2e`. The app intentionally uses the
   **webpack** builder (`@angular-devkit/build-angular:browser`) — that is the
   source of truth; do **not** migrate it to `@angular/build:application`. The
   generator already emits the SKY-standard `eslint.config.js` for both apps
   and the `eslint-disable` comment in `.storybook/manager.ts`, so no eslint
   reconciliation is needed. You only need to revert the unrelated churn it
   makes: it re-orders `tags` in many other `project.json` files and edits
   `.prettierignore`. Keep only the two new `<library>-storybook*` projects.

2. **Generate the story scaffold.** Run the `story` generator, which creates
   the wrapper component, its module, and the `*.stories.ts` file under
   `apps/e2e/<library>-storybook/src/app/<name>/`:

   ```bash
   npx nx g @skyux-sdk/e2e-schematics:story <ComponentName> --project=<library>-storybook
   ```

3. **Fill in the wrapper and stories.** Edit the generated wrapper component
   (`app-<name>`) to embed the real SKY UX component and supply demo data,
   then author the named stories per
   [visual-testing.instructions.md](../../instructions/visual-testing.instructions.md).
   Add a distinct story or args permutation for each meaningful visual state
   (default, key inputs, selected/disabled/error/empty/loading) the snapshot
   should capture. Do not add assertions or interaction logic.

4. **Verify.** Build the storybook app to confirm it compiles, then lint and
   format:

   ```bash
   npx nx build <library>-storybook
   npm run lint:affected
   nx format --files=<changed-file-paths>
   ```

5. **Commit.** Use a Conventional Commit with the `components/<library>` scope
   per
   [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- A wrapper component, its module, and a `*.stories.ts` exist under
  `apps/e2e/<library>-storybook/src/app/<name>/` and mirror a sibling story.
- The story's `Meta` has a stable `id`, a `Components/<DisplayName>` title, and
  a `moduleMetadata` decorator; each meaningful visual state is captured as a
  named story or args permutation, with no assertion/interaction logic.
- `npx nx build <library>-storybook` compiles, lint is clean, and changed
  files are formatted.

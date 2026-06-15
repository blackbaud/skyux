---
name: add-component-harness
description: 'Workflow for adding a test harness to an existing @skyux/* component in this Nx monorepo. Use when asked to "add a harness", "write a test harness", "create a SkyXHarness", or backfill harness coverage for a component that already ships without one. Covers locating the component and its public API, mirroring a sibling harness, writing the harness + filters + spec, wiring the testing/src/public-api.ts barrel and documentation.json, and the test/lint/format gate. For brand-new components, use the add-skyux-component skill instead (its step 6 creates the harness).'
argument-hint: '<library> <ComponentName> (e.g. forms SkyCheckbox)'
---

# Add a Test Harness to an Existing Component

Use this skill to backfill or add a CDK component test harness for a component
that already lives in a published `@skyux/*` library. The detailed conventions
live in
[component-harnesses.instructions.md](../../instructions/component-harnesses.instructions.md)
(it auto-applies to `**/libs/components/**/testing/src/modules/**`) — read it
before writing code rather than guessing.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions (Nx tasks, public API discipline, the `sky`/`Sky`
export prefix, the Karma vs. Jest split, and Conventional Commits).

## When to Use

- A consumer needs a harness for an existing component that doesn't have one.
- Extending an existing harness to cover newly added component inputs/outputs.

Do NOT use this skill to:

- Create a brand-new component — use the
  [add-skyux-component](../add-skyux-component/SKILL.md) skill, which creates
  the harness as part of its flow.
- Author harnesses outside `libs/components/*` (the harness base classes and
  `documentation.json` wiring are specific to those libraries).

## Procedure

Work top to bottom. Follow the canonical patterns in
[component-harnesses.instructions.md](../../instructions/component-harnesses.instructions.md)
for all code-level detail; open a sibling harness only to look up **facts**
(which sub-harness a child component exposes, the template's CSS classes), not
to copy its structure or naming.

1. **Locate the component and read its public API.** Find the component under
   `libs/components/<library>/src/lib/modules/<module>/`. Note its tag/selector
   (the `hostSelector`), every public `input()`/`@Input()`, `output()`,
   `model()`, the relevant template CSS classes, and any child SKY UX
   components (candidates for sub-harness composition). The harness should
   expose this surface and nothing internal.

2. **Choose a base class** (`SkyComponentHarness` or
   `SkyQueryableComponentHarness`) per the instruction file's
   "Choosing a base class".

3. **Create the harness, filters, and spec** under
   `libs/components/<library>/testing/src/modules/<module>/`
   (`<component>-harness.ts`, `<component>-harness-filters.ts`, and
   `<component>-harness.spec.ts`) following
   [component-harnesses.instructions.md](../../instructions/component-harnesses.instructions.md)
   for the class structure, locators, filters, and spec conventions. The
   harness must expose the public API surface identified in step 1, and the
   spec must cover every public method and thrown-error path (most projects
   enforce **100% coverage**).

4. **Wire the public API.** Export the harness **and** its filters from
   `libs/components/<library>/testing/src/public-api.ts`, using the `sky`/`Sky`
   prefix.

5. **Update documentation.** Add both doc IDs to the library's
   `documentation.json` under the matching group's `testing.docsIds`
   (e.g. `["SkyExampleHarness", "SkyExampleHarnessFilters"]`).

6. **Verify.** Run the testing project's specs headless, then lint and format:

   ```bash
   npx nx test <library>-testing --browsers=ChromeHeadless
   npm run lint:affected
   nx format --files=<changed-file-paths>
   ```

7. **Commit.** Use a Conventional Commit with the `components/<library>` scope
   per
   [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- Harness, filters, and harness spec exist under the library's `testing/`
  tree and follow the patterns in the instruction file.
- The harness exposes the component's public API (inputs/outputs/models, key
  interactions, child harnesses) with JSDoc on the class and every public
  member; `hostSelector` is `@internal`.
- Harness and filters are exported (with the `sky`/`Sky` prefix) from
  `testing/src/public-api.ts` and listed in `documentation.json`'s
  `testing.docsIds`.
- `npx nx test <library>-testing` passes at the project's coverage threshold,
  lint is clean, and changed files are formatted.

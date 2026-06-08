---
name: add-skyux-code-example
description: 'Workflow for authoring a code example (demo) component for a @skyux/* component in this Nx monorepo, published from @skyux/code-examples and shown in the docs. Use when asked to "add a code example", "create a demo", "add a documentation example", or showcase a component for consumers. Covers the example.component.ts/.html authoring conventions, the src/index.ts barrel + auto-generated routes (code-examples:prebuild), documentation.json wiring, the example.component.spec.ts (per the code-examples instruction), and the test/lint/format gate. For the spec only, see code-examples-unit-testing.instructions.md.'
argument-hint: '<library> <Component> [example-name] (e.g. avatar Avatar basic)'
---

# Add a Code Example for a Component

Use this skill to author a documentation code example (a runnable demo) for a
component in a published `@skyux/*` library. Examples live in the
`@skyux/code-examples` package and are rendered in the docs and StackBlitz.

The **spec** for the example follows
[code-examples-unit-testing.instructions.md](../../instructions/code-examples-unit-testing.instructions.md)
(it auto-applies to `libs/components/code-examples/**`) — read it before
writing the spec rather than guessing. This skill covers authoring the example
component itself plus the barrel/route/docs wiring the instruction does not.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions (Nx tasks, public API discipline, the Karma vs.
Jest split, and Conventional Commits).

## When to Use

- A component needs a new documentation example, or an existing example needs
  to demonstrate additional capability.

Do NOT use this skill for:

- The library component itself — use
  [add-skyux-component](../add-skyux-component/SKILL.md).
- Test harnesses — use
  [add-component-harness](../add-component-harness/SKILL.md).

## Conventions at a Glance

- **Location**:
  `libs/components/code-examples/src/lib/modules/<library>/<component>/<example-name>/`.
- **Files**: `example.component.ts`, `example.component.html` (and
  `example.component.spec.ts`); add `example.service.ts` or other files only
  if a sibling example needs them. Use `example.*`, never `demo.*`.
- **Component class name**: `<Library><Component><ExampleName>ExampleComponent`
  (e.g. `FormsInputBoxBasicExampleComponent`,
  `ListsRepeaterInlineFormExampleComponent`). When a library has a single
  example, the segments may collapse (e.g. `avatar/avatar/` →
  `AvatarExampleComponent`); follow the sibling you are mirroring.
- The component is **standalone** (no `standalone: true` in the decorator),
  uses `ChangeDetectionStrategy` defaults of a sibling, imports the SKY UX
  module(s) it demonstrates, and carries a `/** @title ... */` JSDoc above the
  class describing the example.

## Procedure

Work top to bottom. **Always mirror an existing sibling example** in the same
library (or the closest analog) for exact style; do not invent new patterns.

1. **Pick a sibling example to mirror.** Open an existing example under
   `libs/components/code-examples/src/lib/modules/` and copy its structure.

2. **Author the example component.** Create `example.component.ts` and
   `example.component.html` (plus any service the example needs) following
   Angular best practices in
   [angular.instructions.md](../../instructions/angular.instructions.md). Add
   the `/** @title ... */` JSDoc and name the class
   `<Library><Component><ExampleName>ExampleComponent`. Keep it a clear,
   realistic showcase of the component's public API.

3. **Export from the barrel.** Add the example to
   `libs/components/code-examples/src/index.ts`:

   ```ts
   export { <Class> } from './lib/modules/<library>/<component>/<example-name>/example.component';
   ```

4. **Regenerate the routes.** The route registry at
   `libs/components/code-examples/routes/src/index.ts` is **auto-generated**
   from the barrel — do not edit it by hand. Regenerate it:

   ```bash
   npx nx run code-examples:prebuild
   ```

5. **Wire documentation.** Add the example class name to the owning library's
   `documentation.json` under `groups.<library>.codeExamples.docsIds`.

6. **Write the example spec.** Add `example.component.spec.ts` following
   [code-examples-unit-testing.instructions.md](../../instructions/code-examples-unit-testing.instructions.md).
   The spec should be a thorough showcase of the component's test harness
   (all public methods, filters, and relevant sub-harnesses), not a smoke
   test, and reach the project's coverage threshold.

7. **Verify.** Run the code-examples specs headless, then lint and format:

   ```bash
   npx nx test code-examples --browsers=ChromeHeadless
   npm run lint:affected
   nx format --files=<changed-file-paths>
   ```

8. **Commit.** Use a Conventional Commit with the `components/<library>` scope
   per
   [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- `example.component.ts`/`.html` (+ spec) exist under
  `libs/components/code-examples/src/lib/modules/<library>/<component>/<example-name>/`,
  mirror a sibling, and the class is named
  `<Library><Component><ExampleName>ExampleComponent` with a `@title` JSDoc.
- The example is exported from `code-examples/src/index.ts`, the routes file
  has been regenerated via `code-examples:prebuild`, and the class is listed
  in the library's `documentation.json` `codeExamples.docsIds`.
- `npx nx test code-examples` passes at the project's coverage threshold, lint
  is clean, and changed files are formatted.

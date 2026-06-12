---
name: add-skyux-code-example
description: 'Workflow for authoring a code example (demo) component for a @skyux/* component in this Nx monorepo, published from @skyux/code-examples and shown in the docs. Use when asked to "add a code example", "create a demo", "add a documentation example", or showcase a component for consumers. Covers the end-to-end workflow: the src/index.ts barrel, auto-generated routes (code-examples:prebuild), documentation.json wiring, and the test/lint/format gate. Component-authoring and spec conventions live in component-code-examples.instructions.md.'
argument-hint: '<library> <Component> [example-name] (e.g. avatar Avatar basic)'
---

# Add a Code Example for a Component

Use this skill to author a documentation code example (a runnable demo) for a
component in a published `@skyux/*` library. Examples live in the
`@skyux/code-examples` package and are rendered in the docs and StackBlitz.

The conventions for **both the example component and its spec** live in
[component-code-examples.instructions.md](../../instructions/component-code-examples.instructions.md)
(it auto-applies to `libs/components/code-examples/**`) — read it before writing
code rather than guessing. This skill covers the workflow around those
conventions: picking a sibling, wiring the barrel/routes/docs, and the
verification gate.

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

All file-layout, naming, `@title`, standalone, barrel, route, and
`documentation.json` conventions are defined in
[component-code-examples.instructions.md](../../instructions/component-code-examples.instructions.md).
The steps below are the workflow that applies them.

## Procedure

Work top to bottom. Follow the conventions in the instruction file; open a
sibling example only to look up facts (which module to import, the route/docs
wiring), not to copy its structure.

1. **Pick a sibling example for reference.** Open an existing example under
   `libs/components/code-examples/src/lib/modules/` to confirm the current
   layout and which module(s) to import.

2. **Author the example component.** Create `example.component.ts` and
   `example.component.html` (plus any service the example needs) per the
   component conventions in the instruction file (class name, `@title` JSDoc,
   standalone, imports) and Angular best practices in
   [angular.instructions.md](../../instructions/angular.instructions.md).

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
   [component-code-examples.instructions.md](../../instructions/component-code-examples.instructions.md).
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
  `libs/components/code-examples/src/lib/modules/<library>/<component>/<example-name>/`
  and follow the instruction file's conventions (class named
  `<Library><Component><ExampleName>ExampleComponent`, `@title` JSDoc).
- The example is exported from `code-examples/src/index.ts`, the routes file
  has been regenerated via `code-examples:prebuild`, and the class is listed
  in the library's `documentation.json` `codeExamples.docsIds`.
- `npx nx test code-examples` passes at the project's coverage threshold, lint
  is clean, and changed files are formatted.

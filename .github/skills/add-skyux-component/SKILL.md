---
name: add-skyux-component
description: 'End-to-end workflow for adding a new component (or directive/service) to an existing @skyux/* library in this Nx monorepo. Use when asked to "add a component", "create a new SKY UX component", scaffold a component with its module, harness, code example, tests, and docs, or wire a new component into a library''s public API. Covers file layout, the src/index.ts barrel and sky/Sky prefix rules, SCSS compat overrides, test harness, code-example unit tests, documentation.json, and the test/lint/format/commit gate.'
argument-hint: '<library> <ComponentName> (e.g. indicators MyThing)'
---

# Add a SKY UX Component (end-to-end)

Use this skill to take a new component from scaffold to a fully wired,
tested, and documented addition to a published `@skyux/*` library. It ties
together the repo's scoped instruction files; read each referenced
instruction file when you reach that step rather than guessing.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar
with the monorepo's conventions (Nx tasks, public API discipline, the
`sky`/`Sky` export prefix, Karma vs. Jest split, and Conventional Commits).

## When to Use

- Adding a new component, directive, or service to an existing library under
  `libs/components/<library>/`.
- Wiring a new public type/component into a library's `src/index.ts` barrel.

Do NOT use this skill to create a brand-new library/package (that requires an
Nx generator and project scaffolding) or to modify build tooling.

## Conventions at a Glance

- Library source lives at
  `libs/components/<library>/src/lib/modules/<module>/`.
- Component files follow the pattern:
  - `<name>.component.ts`, `.html`, `.scss`, `.spec.ts`
  - a `NgModule` (`<name>.module.ts`) that imports the standalone component
    and `exports` the public-facing one.
- Components are **standalone**; do NOT set `standalone: true` explicitly in
  the decorator. Use `ChangeDetectionStrategy.OnPush`, `input()`/`output()`,
  and signals. Follow
  [angular.instructions.md](../../instructions/angular.instructions.md).
- The public API is the `src/index.ts` barrel. Public exports MUST be
  prefixed with `sky`/`Sky` (e.g. `SkyThingComponent`, `SkyThingModule`,
  `SkyThingHarness`). Export a new component or directive by its own name
  (e.g. `export { SkyThingComponent } from './lib/.../thing.component';`).
  Some existing libraries export older components/directives under obscured
  aliases (e.g. `as λ1`); that is a legacy pattern — do NOT use it for new
  exports.

## Procedure

Work top to bottom. Mirror an existing sibling component in the same library
for exact style; do not invent new patterns.

1. **Confirm placement.** Identify the target `<library>` (directory name,
   not package name) and the `<module>` folder. Inspect a sibling component
   in that library and copy its structure.
2. **Scaffold the component.** Create the `.ts`, `.html`, `.scss`, and
   `.module.ts` files following Angular best practices in
   [angular.instructions.md](../../instructions/angular.instructions.md).
3. **Set up SCSS compat overrides.** If the component has a `.scss` file,
   add the empty compat override mixin per
   [scss-override-mixins.instructions.md](../../instructions/scss-override-mixins.instructions.md),
   and add any CSS variables per
   [add-scss-override.instructions.md](../../instructions/add-scss-override.instructions.md).
4. **Export from the barrel.** Add the module and any public types to
   `libs/components/<library>/src/index.ts`, using the `sky`/`Sky` prefix.
   Export a new component or directive by its own name (not an obscured
   `as λN` alias).
5. **Write the component spec.** Add `<name>.component.spec.ts`. Most
   `libs/components/*` projects enforce 100% coverage and run on
   **Karma + Jasmine** (SKY UX styles are loaded, so computed styles are
   assertable).
6. **Add a test harness.** Create the harness, filters, and harness spec
   under `libs/components/<library>/testing/src/modules/<module>/` per
   [skyux-copilot-harnesses.instructions.md](../../instructions/skyux-copilot-harnesses.instructions.md).
   Export the harness and filters from `testing/src/public-api.ts`.
7. **Add a code example + tests.** Create an example under
   `libs/components/code-examples/src/lib/modules/<library>/<component>/`
   and its `example.component.spec.ts` per
   [code-examples-unit-testing.instructions.md](../../instructions/code-examples-unit-testing.instructions.md).
8. **Update documentation.** Add the new doc IDs to the library's
   `documentation.json` (`development`, `testing`, and `codeExamples`
   sections) so the manifest picks them up.
9. **Verify.** Run the affected tests, lint, and format before committing:
   ```bash
   npx nx test <library> --browsers=ChromeHeadless
   npx nx test <library>-testing --browsers=ChromeHeadless
   npx nx test code-examples --browsers=ChromeHeadless
   npm run lint:affected
   nx format --files=<changed-file-paths>
   ```
10. **Commit.** Use a Conventional Commit with the matching
    `components/<library>` scope per
    [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- Component, module, spec, harness (+ spec), and code example (+ spec) exist
  and follow a sibling component's structure.
- Public types are exported with the `sky`/`Sky` prefix from `src/index.ts`
  and `testing/src/public-api.ts`.
- `documentation.json` lists the new development, testing, and code-example
  doc IDs.
- Affected tests pass at the project's coverage threshold, lint is clean, and
  files are formatted.

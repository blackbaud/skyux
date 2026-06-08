---
name: add-skyux-library
description: 'Workflow for creating a brand-new published @skyux/* component library (a new component suite) in this Nx monorepo. Use when asked to "create a new library", "add a new component suite", "scaffold a new @skyux package", or stand up a new publishable package under libs/components/. Covers the @nx/angular:library generator, the SKY-specific project.json/ng-package.json/package.json wiring mirrored from a sibling library, the src/index.ts barrel and testing/ entry point, documentation.json, the e2e/storybook app, i18n resources, and the test/lint/format/commit gate. For adding a component to a library that already exists, use the add-skyux-component skill instead.'
argument-hint: '<library> (e.g. my-suite)'
---

# Create a New SKY UX Library (component suite)

Use this skill to stand up a brand-new publishable `@skyux/<library>` package
under `libs/components/<library>/`. This is the prerequisite step before
[add-skyux-component](../add-skyux-component/SKILL.md) can add components to it.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions (Nx tasks, public API discipline, the `sky`/`Sky`
export prefix, the Karma vs. Jest split, and Conventional Commits).

## When to Use

- Creating a brand-new component suite / publishable `@skyux/*` package.

Do NOT use this skill to:

- Add a component, directive, or service to a library that already exists —
  use [add-skyux-component](../add-skyux-component/SKILL.md).
- Create build tooling or a non-published app.

## Key Facts

- **There is no custom library generator.** New libraries use the stock Nx
  generator (its defaults live in [nx.json](../../../nx.json)); the
  SKY-specific wiring afterward is **manual** and must mirror an existing
  sibling library exactly. `avatar` is a good, small reference.
- A complete library is actually **two Nx projects**: the library itself
  (`<library>`) and its testing entry point (`<library>-testing`), which
  produces the `@skyux/<library>/testing` secondary entry point.
- A library also gets a companion **e2e/storybook app** for visual tests,
  created by the `@skyux-sdk/e2e-schematics:component-e2e` generator.

## Procedure

Work top to bottom. **Always mirror an existing sibling library** (e.g.
`avatar`) for exact file structure and config; do not invent new patterns.

1. **Pick a sibling to mirror.** Choose the closest existing library under
   `libs/components/` and open its `project.json`, `ng-package.json`,
   `package.json`, `tsconfig*.json`, `karma.conf.js`, `src/index.ts`,
   `documentation.json`, and `testing/` folder. You will copy this structure.

2. **Scaffold the library.** Generate the base project, then reconcile it to
   match the sibling:

   ```bash
   npx nx g @nx/angular:library <library> --directory=libs/components/<library>
   ```

   Then update the generated files to match the sibling exactly:
   - `project.json` — `build` uses the `@nx/angular:package` executor pointing
     at `ng-package.json`; `test` uses the Karma executor with the theme
     styles (`libs/components/theme/src/lib/styles/sky.scss` and
     `.../themes/modern/styles.scss`) and `codeCoverageExclude` for
     `**/fixtures/**`; `lint` lints `src/**/*.ts` and `src/**/*.html`.
   - `ng-package.json` — `dest` points to `dist/libs/components/<library>`,
     `entryFile` is `src/index.ts`, `styleIncludePaths` includes the
     workspace root.
   - `package.json` — name is `@skyux/<library>`, `version` and every
     `@skyux/*`/`@skyux-sdk/*` peer dependency are pinned to
     `0.0.0-PLACEHOLDER`; `sideEffects` is `false`.

3. **Create the public API barrel.** Add `src/index.ts`. Every public export
   MUST be prefixed with `sky`/`Sky`. Export new components and directives by
   their own name
   (e.g. `export { SkyThingComponent } from './lib/.../thing.component';`), not
   under an obscured `as λN` alias. Some existing libraries still export older
   components/directives under `λ` aliases; that is a legacy pattern — do NOT
   replicate it for new exports.

4. **Create the testing entry point.** Mirror the sibling's `testing/`
   folder: its `project.json` (project name `<library>-testing`, tag
   `testing`), `ng-package.json`, `tsconfig*.json`, `karma.conf.js`, and
   `src/public-api.ts` barrel. This produces `@skyux/<library>/testing`.

5. **Add documentation metadata.** Create `documentation.json` with a
   `groups.<library>` entry containing `development`, `testing`, and
   `codeExamples` sections (each with a `docsIds` array), mirroring the
   sibling.

6. **Generate i18n resources (only if the library needs them).** If the
   library ships translatable strings, set up `src/assets/locales` like the
   sibling, then regenerate the resources module:

   ```bash
   npm run dev:create-library-resources
   ```

   Skip this step for libraries with no localized strings.

7. **Create the e2e / visual-test app.** Stand up the companion storybook +
   Cypress/Percy app for the suite:

   ```bash
   npx nx g @skyux-sdk/e2e-schematics:component-e2e <library>
   ```

   This creates `apps/e2e/<library>-storybook` (tag `component-e2e`). Adding
   individual stories later is handled by the
   [add-component-visual-tests](../add-component-visual-tests/SKILL.md) skill.

8. **Verify the empty library builds, tests, lints, and formats.** Before
   adding components, confirm the scaffold is sound:

   ```bash
   npx nx build <library>
   npx nx test <library> --browsers=ChromeHeadless
   npx nx test <library>-testing --browsers=ChromeHeadless
   npm run lint:affected
   nx format --files=<changed-file-paths>
   ```

9. **Add the first component.** Hand off to
   [add-skyux-component](../add-skyux-component/SKILL.md) to add the suite's
   first component, harness, unit tests, visual tests, and code example.

10. **Commit.** Use a Conventional Commit with the `components/<library>`
    scope per
    [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- `libs/components/<library>/` exists with `project.json`, `ng-package.json`,
  `package.json`, `tsconfig*.json`, `karma.conf.js`, `src/index.ts`, and a
  `testing/` entry point, all mirroring a sibling library.
- `package.json` is `@skyux/<library>` with `0.0.0-PLACEHOLDER` versions and
  `@skyux/*` peers; the barrel exports use the `sky`/`Sky` prefix.
- `documentation.json` has a `groups.<library>` entry with `development`,
  `testing`, and `codeExamples` sections.
- The companion `apps/e2e/<library>-storybook` app exists.
- `npx nx build <library>`, both test projects, lint, and format all pass.

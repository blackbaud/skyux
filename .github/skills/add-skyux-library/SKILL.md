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

- **Use the stock Nx `@nx/angular:library` generator as the source of truth**
  for what it can produce, then reconcile the SKY-specific gaps. There is no
  custom library generator. `avatar` is a good, small sibling to compare
  against when reconciling.
- **`--publishable --importPath=@skyux/<library>` does most of the wiring.**
  It generates `ng-package.json`, a publishable `package.json`,
  `tsconfig.lib.prod.json` (partial compilation), and adds the
  `@skyux/<library>` path mapping to [tsconfig.base.json](../../../tsconfig.base.json).
- **The generator cannot scaffold Karma.** Its `--unitTestRunner` only accepts
  `vitest-angular | vitest-analog | jest | none` — there is no `karma` value.
  Pass `--unitTestRunner=none` and add the Karma `test` target + `karma.conf.js`
  - `tsconfig.spec.json` by mirroring the sibling (these libraries run Karma).
- **The generator leaves churn to revert.** It reformats
  [nx.json](../../../nx.json), [.prettierignore](../../../.prettierignore), and
  expands the arrays in [tsconfig.base.json](../../../tsconfig.base.json), and
  it creates a stray **root** `project.json`. Revert all of these; keep only
  the `@skyux/<library>` path mapping.
- A complete library is actually **two Nx projects**: the library itself
  (`<library>`) and its testing entry point (`<library>-testing`), which
  produces the `@skyux/<library>/testing` secondary entry point. The testing
  entry point is **not** produced by the generator — author it by hand from the
  sibling.
- A library also needs a companion **e2e/storybook app** for visual tests, but
  that app is created by
  [add-component-visual-tests](../add-component-visual-tests/SKILL.md) when the
  first component's stories are added — not by this skill.
- **Use the repo's Node version.** `.npmrc` sets `engine-strict=true` and
  [.nvmrc](../../../.nvmrc) pins the required Node version; `npm install` and
  every `nx` command fail under a mismatched Node. Run `nvm use` (which reads
  [.nvmrc](../../../.nvmrc)) before anything else.

## Procedure

Work top to bottom. **Always mirror an existing sibling library** (e.g.
`avatar`) for exact file structure and config; do not invent new patterns.

1. **Pick a sibling to mirror.** Choose the closest existing library under
   `libs/components/` and open its `project.json`, `ng-package.json`,
   `package.json`, `tsconfig*.json`, `karma.conf.js`, `src/index.ts`,
   `documentation.json`, and `testing/` folder. You will copy this structure.

2. **Scaffold the library.** Run the generator (note: `--name` is required;
   the generator rejects a positional name):

   ```bash
   npx nx g @nx/angular:library \
     --name=<library> \
     --directory=libs/components/<library> \
     --publishable \
     --importPath=@skyux/<library> \
     --prefix=sky \
     --unitTestRunner=none \
     --tags=component,npm \
     --standalone=false \
     --skipModule \
     --skipFormat \
     --no-interactive
   ```

   This produces `project.json`, `ng-package.json`, `package.json`,
   `tsconfig.json`, `tsconfig.lib.json`, `tsconfig.lib.prod.json`,
   `src/index.ts`, the `@skyux/<library>` path mapping, and an
   `eslint.config.cjs`. Then reconcile it to the sibling:
   - **Revert generator churn first.** `git checkout -- nx.json .prettierignore`,
     delete the stray **root** `project.json` the generator created, and undo
     the array reformatting it applied to `tsconfig.base.json` (keep only the
     new `@skyux/<library>` mapping).
   - **`project.json`** — add the Karma `test` target (Karma executor, theme
     styles `libs/components/theme/src/lib/styles/sky.scss` and
     `.../themes/modern/styles.scss`, `codeCoverage: true`,
     `codeCoverageExclude: ["**/fixtures/**"]`, and the `ci` configuration);
     give `lint` the `lintFilePatterns` for `src/**/*.ts` and `src/**/*.html`;
     hardcode `outputs` to `dist/libs/components/<library>`; add the build
     `dependsOn` peers as needed. Remove the generator's `release` and
     `nx-release-publish` blocks (siblings do not use them).
   - **`ng-package.json`** — add `styleIncludePaths: ["../../.."]` and
     `inlineStyleLanguage: "scss"`. Add `allowedNonPeerDependencies` for any
     third-party runtime dependency (see step 2a).
   - **`package.json`** — change `version` to `0.0.0-PLACEHOLDER`; pin every
     `@skyux/*`/`@skyux-sdk/*` peer dependency to `0.0.0-PLACEHOLDER`; add the
     `author`, `keywords`, `license`, `repository`, `bugs`, and `homepage`
     fields and the `tslib` dependency from the sibling. `sideEffects` stays
     `false`.
   - **`karma.conf.js`** and **`tsconfig.spec.json`** — copy from the sibling
     (the generator omits these because `--unitTestRunner=none`).
   - **`eslint.config.cjs`** — replace with `eslint.config.js` containing
     `const config = require('../../../eslint-libs.config'); module.exports = config;`.

2a. **Declare third-party dependencies (e.g. a charting or formatting lib).**

- A **runtime** dependency goes in the library `package.json`
  `dependencies`, must be listed in `allowedNonPeerDependencies` in
  `ng-package.json` (ng-packagr blocks non-peer `dependencies` otherwise),
  and must be pinned to an exact version in the **root**
  [package.json](../../../package.json) so it installs. Precedents:
  `autonumeric`, `validator`.
- Otherwise prefer a **peerDependency** (precedent: `ag-grid-community` /
  `ag-grid-angular`). Run `npm install` afterward and confirm the package
  resolves.

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

5. **Defer `documentation.json` to the first component.** Do **not** create it
   for the empty scaffold. Its schema
   ([documentation-schema.json](../../../libs/components/manifest-generator/documentation-schema.json))
   requires `development.docsIds` (at least one entry) and a `primaryDocsId`,
   so a valid file cannot exist until the suite has a documented type. The
   [add-skyux-component](../add-skyux-component/SKILL.md) skill creates it
   alongside the first component.

6. **Generate i18n resources (only if the library needs them).** If the
   library ships translatable strings, set up `src/assets/locales` like the
   sibling, then regenerate the resources module:

   ```bash
   npm run dev:create-library-resources
   ```

   Skip this step for libraries with no localized strings.

7. **Verify the empty library builds, lints, and formats.** Before adding
   components, confirm the scaffold is sound:

   ```bash
   npx nx build <library>
   npx nx lint <library>
   npx nx lint <library>-testing
   npx nx format:write --projects=<library>,<library>-testing
   ```

   Do **not** gate on `nx test <library>` yet: an empty library has no spec
   files, so Karma exits with "Executed 0 of 0". The test gate becomes
   meaningful once the first component (with a spec) lands in the next step.

8. **Add the first component.** Hand off to
   [add-skyux-component](../add-skyux-component/SKILL.md) to add the suite's
   first component, harness, unit tests, visual tests, and code example. The
   companion e2e/storybook app is created during the visual-tests step via
   [add-component-visual-tests](../add-component-visual-tests/SKILL.md).

9. **Commit.** Use a Conventional Commit with the `components/<library>`
   scope per
   [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- `libs/components/<library>/` exists with `project.json`, `ng-package.json`,
  `package.json`, `tsconfig*.json`, `karma.conf.js`, `src/index.ts`, and a
  `testing/` entry point, all mirroring a sibling library.
- `package.json` is `@skyux/<library>` with `0.0.0-PLACEHOLDER` versions and
  `@skyux/*` peers; the barrel exports use the `sky`/`Sky` prefix.
- Any third-party runtime dependency is in the library `package.json`
  `dependencies`, listed in `ng-package.json` `allowedNonPeerDependencies`,
  and pinned in the root `package.json`.
- `npx nx build <library>`, lint (library + testing), and format all pass.
  (`documentation.json`, the companion e2e/storybook app, and the `nx test`
  gate are deferred to the first component.)

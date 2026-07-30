---
name: convert-module-to-standalone
description: 'Workflow for converting a @skyux/* library''s existing module-based components and directives into directly-consumable standalone components and directives in this Nx monorepo. Use when asked to "convert a library to standalone", "make these components standalone", "drop the Component/Directive suffix", "rename off the module pattern", or deprecate a library''s NgModules in favor of standalone items. Renames each component/directive file and class to remove the .component/.directive fragment and the Component/Directive suffix, exports the new class name from the barrel while keeping the lambda (λN) aliases for backward compatibility, and marks the owning NgModule as @deprecated. Updates specs, harnesses, code examples, storybook stories, and documentation.json to match. For adding a brand-new standalone component use the add-skyux-component skill instead.'
argument-hint: '<library> (e.g. avatar)'
---

# Convert a Library's Components/Directives to Standalone

Use this skill to migrate an existing `@skyux/*` library away from the
NgModule-consumption pattern toward directly-consumable standalone components
and directives. Some items are already standalone at the Angular level (they use
an `imports` array); others are still module-based (`standalone: false`, listed
in the module's `declarations`). This skill makes each item standalone if it is
not already, renames it to the standalone-first convention, and deprecates the
owning `NgModule` so consumers import the item directly.

> **Breaking change.** SKY UX only deprecates public types in a major version.
> Marking the module `@deprecated` makes this a breaking change, so this skill
> must only be run against a major-version release.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions (Nx tasks, **public API discipline**, the `sky`/`Sky`
export prefix, the lambda (`λN`) alias pattern, the Karma vs. Jest split, and
Conventional Commits). Also follow
[angular.instructions.md](../../instructions/angular.instructions.md) for any
component/directive code you touch.

## When to Use

- A library owner wants consumers to import standalone components/directives
  directly instead of importing the `Sky<Name>Module`.
- Renaming a library's public components/directives to drop the
  `.component`/`.directive` filename fragment and the `Component`/`Directive`
  class suffix, while keeping existing consumers working.

Do NOT use this skill to:

- Add a brand-new standalone component — use the
  [add-skyux-component](../add-skyux-component/SKILL.md) skill.
- Delete a module. The module stays and is kept functional; it is only marked
  `@deprecated`.

## The Rename, at a Glance

For a component `SkyAvatarComponent` in `avatar.component.ts`:

| Before                     | After             |
| -------------------------- | ----------------- |
| `avatar.component.ts`      | `avatar.ts`       |
| `avatar.component.html`    | `avatar.html`     |
| `avatar.component.scss`    | `avatar.scss`     |
| `avatar.component.spec.ts` | `avatar.spec.ts`  |
| class `SkyAvatarComponent` | class `SkyAvatar` |

For a directive `SkyHrefDirective` in `href.directive.ts`:
`href.directive.ts` → `href.ts`, `href.directive.spec.ts` → `href.spec.ts`,
class `SkyHrefDirective` → `SkyHref`.

Inner/private files that are NOT exported from the module (e.g.
`avatar.inner.component.ts`) are out of scope — leave them as-is unless the
library owner asks otherwise.

## Public API Rules (treat as blocking)

- **Deprecation is a breaking change — major versions only.** SKY UX only
  deprecates public types in a major release. Adding the `@deprecated` tag to a
  module (step 7) is therefore a breaking change: confirm the work targets a
  major-version branch before proceeding, and commit it with the Conventional
  Commit `!` breaking-change marker (step 11). If the work is not on a major
  release, stop and confirm with the user.
- **Never remove the lambda (`λN`) alias.** It is the existing public-API
  surface and dropping it is a breaking change. After the rename, the barrel
  must export the item **twice**: once by its new class name (the new,
  self-documenting public export) and once keeping the original `λN` alias for
  backward compatibility. Both point at the renamed class/file.
- **Keep the module exported and functional.** `Sky<Name>Module` continues to
  `imports`/`exports` the renamed standalone item; it only gains an
  `@deprecated` JSDoc tag. Removing it would break consumers.
- New public class names keep the `sky`/`Sky` prefix (`SkyAvatar`, `SkyHref`).

## Procedure

Work top to bottom, one component/directive at a time. Mirror the existing
files in the same library for style; do not invent new patterns.

1. **Scope the work.** Identify the target `<library>` (directory name, not
   package name). List every component/directive the library's modules
   `declare`/`import`/`export` by reading `src/index.ts` and each
   `*.module.ts`. These are the items to rename (skip inner/private ones not
   surfaced by a module).

2. **Plan the renames and detect conflicts.** For each item, compute the new
   filename and class name using the table above. **Before renaming, check for
   collisions** — the new filename or class name may already be taken. Common
   cases:
   - A component and a directive share a base name (e.g.
     `ag-grid-row-delete.component.ts` and `ag-grid-row-delete.directive.ts`
     would both become `ag-grid-row-delete.ts`; `SkyAgGridRowDeleteComponent`
     and `SkyAgGridRowDeleteDirective` would both become
     `SkyAgGridRowDelete`).
   - A file named `<name>.ts` already exists in the folder.

   When a conflict exists, **stop and ask the user** which filenames and class
   names to use (via the ask-questions tool). Do not guess a disambiguating
   name.

3. **Rename files and the class.** For each item:
   - Rename the `.ts`, `.html`, `.scss`, and `.spec.ts` files (use `git mv` so
     history is preserved; do not rename via terminal unless the user asks —
     `git mv` is the exception because it is a file move, not a file edit).
   - Rename the class (prefer the rename-symbol capability so every reference
     updates), dropping the `Component`/`Directive` suffix.
   - Update the decorator's `templateUrl` and `styleUrls`/`styleUrl` to the new
     filenames. Keep the existing form (array vs. single) to minimize churn.

4. **Make the item standalone (if it isn't already).** Many items are still
   module-based (`standalone: false`, declared in the module). Convert each:
   - In the component/directive decorator, remove `standalone: false` and add
     an `imports` array containing everything the template and host bindings
     use (mirror what the companion module imported — e.g. `SkyIconModule`,
     the library's resources module). Standalone is the default, so do **not**
     add `standalone: true`.
   - Import the **specific** `@angular/common` declarables the template
     actually uses (e.g. `NgClass`, `NgTemplateOutlet`, `AsyncPipe`) rather
     than the whole `CommonModule`, per Angular's recommendation. Prefer the
     built-in control flow (`@if`/`@for`/`@switch`) over `NgIf`/`NgFor`/
     `NgSwitch`.
   - Remove any explicit `changeDetection` (including legacy
     `Eager`/`Default`). `ChangeDetectionStrategy.OnPush` is the repo default,
     so **omit** the property entirely rather than setting it explicitly, and
     drop the now-unused `ChangeDetectionStrategy` import. If a component
     genuinely cannot work under `OnPush`, stop and confirm with the user
     rather than silently opting it onto another strategy.
   - In the companion module, move the item from `declarations` into `imports`
     (a standalone item cannot be declared), and keep it in `exports`.
   - **Remove the now-unused module imports.** Once the standalone item brings
     its own dependencies, the companion module usually only needs to import
     and export the item itself. Delete any module `imports` (and their
     top-of-file `import` statements) that are no longer referenced.

5. **Modernize the component/directive API.** Bring the item in line with
   [angular.instructions.md](../../instructions/angular.instructions.md).
   Preserve the public API shape — same input/output **names** and the same
   `selector` — so template consumers are unaffected:
   - Add a JSDoc comment to the class and to **every** input and output
     describing its purpose. Preserve any existing `@default`/`@deprecated`
     tags.
   - Convert `@Input()` decorators to signal inputs (`input()` /
     `input.required()`), and update every read in the class and template to
     call the signal (e.g. `alertType` → `alertType()`).
   - Do **not** add `| undefined` to a no-default `input()`/`model()` type
     argument — the no-initial-value overload already widens the type to
     include `undefined` (`input<boolean>()` is `InputSignal<boolean | undefined>`),
     so `input<boolean | undefined>()` is redundant.
   - Convert `@Output()` decorators to the `output()` function **where
     possible**. If an output is driven by a subject/observable stream that
     `output()` cannot express, leave it as-is and note why.
   - When an input **and** its `<name>Change` output form a two-way binding
     (a consumer or fixture binds `[(<name>)]`), replace the pair with a single
     `model()` — it recreates both the input and the `<name>Change` output.
   - Replace imperative setter side effects and derived fields with
     `computed()`; a signal-input migration usually lets you delete the
     matching `ngOnInit`/`ngOnDestroy` and manual subscriptions.
   - Make members that exist only to support the template `protected` (inputs
     and outputs stay accessible as the component's public API). Convert
     private members to native `#private` fields.
   - Signal inputs and `#private` fields change how values are read inside the
     class, so update the component, its template, and its spec together.
   - **Two async gotchas** when the specs use `OnPush` + synchronous
     `fixture.detectChanges()`:
     - `toSignal(toObservable(...))` emits one change-detection tick late, so a
       template read of that value is stale on the first `detectChanges()`. If a
       value is resolved from an async source (e.g. an i18n resource
       observable), prefer resolving it **in the template** with the existing
       pipe (e.g. `| skyLibResources`) over `toObservable`, or update the spec
       to await stability.
     - A `computed()` that is only read from a truthy template branch leaves its
       other branch uncovered (100% branch coverage is enforced). Structure the
       `computed()` and template so every branch is exercised by an existing
       test, rather than guarding a value the template never reads while unset.

6. **Update the barrel (`src/index.ts`).** Replace the single aliased export
   with two exports pointing at the renamed file, e.g.:

   ```ts
   // Before
   export { SkyAvatarComponent as λ1 } from './lib/modules/avatar/avatar.component';

   // After — new public name, plus the λ alias kept for backward compat.
   export { SkyAvatar, SkyAvatar as λ1 } from './lib/modules/avatar/avatar';
   ```

   Keep the existing `λN` numbers exactly as they were. The `Sky<Name>Module`
   export stays unchanged.

7. **Deprecate the module.** Add an `@deprecated` JSDoc tag to each affected
   `Sky<Name>Module`, telling consumers to use the standalone item(s) directly.
   Keep it exported and functional (now importing/exporting the renamed class):

   ```ts
   /**
    * @deprecated Import the standalone `SkyAvatar` component directly instead
    * of importing this module.
    */
   @NgModule({
     imports: [SkyAvatar],
     exports: [SkyAvatar],
   })
   export class SkyAvatarModule {}
   ```

   If a module exposes several items, list them all in the message (e.g.
   "Import the standalone `SkyFoo` and `SkyBar` directly instead").

8. **Update every reference.** Find all usages of each old class name and old
   file path and update them (rename-symbol handles most `.ts` imports; use a
   text search to catch the rest). Cover:
   - Other library source files under `libs/components/<library>/src/**`.
   - The renamed component/directive **specs** (`.spec.ts`).
   - **Test harnesses** and harness specs under
     `libs/components/<library>/testing/**` (harness class names like
     `SkyAvatarHarness` do not change, but their imports/paths might).
   - **Storybook stories** under `apps/e2e/<library>-storybook/**`.
   - **`documentation.json`** — update the old class name in `docsIds`
     (e.g. `SkyAvatarComponent` → `SkyAvatar`). Leave the module's
     `primaryDocsId` (`Sky<Name>Module`) in place.

9. **Update the code examples.** The examples under
   `libs/components/code-examples/**` are the public-facing demonstration of
   recommended usage, so they must model importing the **standalone item**, not
   the deprecated module. For each example that imports the `Sky<Name>Module`:
   - Replace the module import with the standalone component/directive
     (e.g. `import { SkyAvatar } from '@skyux/indicators';`) and swap it in the
     example component's `imports` array. Remove the module import entirely if
     nothing else uses it.
   - The template needs no changes — the selector and input/output names are
     unchanged.
   - Follow
     [component-code-examples.instructions.md](../../instructions/component-code-examples.instructions.md);
     the example spec drives the component through its harness, so it usually
     needs no change.

10. **Verify.** Run affected tests, lint, and format:

    ```bash
    npx nx test <library> --browsers=ChromeHeadless --watch=false
    npx nx test <library>-testing --browsers=ChromeHeadless --watch=false
    npx nx test code-examples --browsers=ChromeHeadless --watch=false
    npx nx build <library>-storybook
    npm run lint:affected
    nx format --files=<changed-file-paths>
    ```

11. **Commit.** Use a Conventional Commit with the `components/<library>` scope
    per
    [commit-message.instructions.md](../../instructions/commit-message.instructions.md).
    Deprecating the module is a breaking change, so use the `!` breaking-change
    marker (e.g. `feat(components/<library>)!: ...`) and only land it on a
    major-version release.

## Definition of Done

- Each in-scope component/directive file and class is renamed to drop the
  `.component`/`.directive` fragment and the `Component`/`Directive` suffix;
  `templateUrl`/`styleUrls` point at the renamed files.
- Each in-scope item is standalone (has an `imports` array, no
  `standalone: false`) and relies on the default `OnPush` change detection (no
  explicit `changeDetection` property).
- Each companion module lists the item in `imports`/`exports` (not
  `declarations`) and no longer imports dependencies the standalone item now
  provides for itself.
- The class and every input/output have JSDoc comments; `@Input()`/`@Output()`
  decorators are migrated to signal `input()`/function `output()` (unless an
  output cannot be expressed with `output()`); template-only members are
  `protected` and private members use `#private` fields.
- `src/index.ts` exports each item by its new `Sky`-prefixed class name **and**
  keeps the original `λN` alias for backward compatibility.
- Every owning `Sky<Name>Module` is still exported and functional, and carries
  an `@deprecated` JSDoc directing consumers to the standalone item(s).
- All references (library source, specs, harnesses, storybook stories,
  `documentation.json`) are updated to the new names.
- The `code-examples` demos import the standalone item directly and no longer
  import the deprecated `Sky<Name>Module`.
- Filename/class-name conflicts were resolved by asking the user, not guessed.
- Affected tests pass at the project's coverage threshold, lint is clean, and
  changed files are formatted.
- The change lands on a major-version release and is committed with the
  Conventional Commit `!` breaking-change marker.

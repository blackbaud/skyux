# Available Modernization Schematics

**Load this reference when:** deciding which schematics to run and in what order during project modernization.

## SKY UX Schematics (`@skyux/packages`)

| Command                                                                    | Purpose                                                                    | Verify After                  |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------- |
| `npx ng g @skyux/packages:standalone`                                      | Convert NgModule-based components to standalone with SKY UX module imports | `npx ng build && npx ng test` |
| `npx ng g @skyux/packages:convert-definition-list-to-description-list`     | Migrate `<sky-definition-list>` → `<sky-description-list>`                 | `npx ng build`                |
| `npx ng g @skyux/packages:convert-page-summary-to-page-header`             | Migrate `<sky-page-summary>` → `<sky-page-header>`                         | `npx ng build`                |
| `npx ng g @skyux/packages:convert-progress-indicator-wizard-to-tab-wizard` | Migrate progress indicator wizard → tabset wizard                          | `npx ng build`                |
| `npx ng g @skyux/packages:remove-compat-stylesheets`                       | Remove legacy backward-compatibility stylesheets                           | `npx ng build`                |

## Angular Core Schematics (`@angular/core`)

| Command                                            | Purpose                                                       | Verify After                  |
| -------------------------------------------------- | ------------------------------------------------------------- | ----------------------------- |
| `npx ng generate @angular/core:control-flow`       | Migrate `*ngIf`/`*ngFor`/`*ngSwitch` → `@if`/`@for`/`@switch` | `npx ng build && npx ng test` |
| `npx ng generate @angular/core:ngclass-to-class`   | Migrate `[ngClass]` → native class bindings                   | `npx ng build`                |
| `npx ng generate @angular/core:inject-migration`   | Migrate constructor injection → `inject()` function           | `npx ng build && npx ng test` |
| `npx ng generate @angular/core:route-lazy-loading` | Migrate lazy-loaded routes to newer syntax                    | `npx ng build`                |

## Recommended Execution Order

```text
1. @skyux/packages:standalone          ← Most impactful; other schematics build on standalone
2. @angular/core:control-flow          ← Template modernization
3. @angular/core:ngclass-to-class      ← Template cleanup
4. @angular/core:inject-migration      ← DI modernization
5. @angular/core:route-lazy-loading    ← Router modernization
6. @skyux/packages:convert-*           ← SKY UX component migrations (if applicable)
7. @skyux/packages:remove-compat-*     ← Cleanup (last — after everything else is stable)
```

## Workflow for Each Schematic

```text
1. Run the schematic command
2. Review changes: git diff
3. Verify build: npx ng build
4. Verify tests: npx ng test
5. If failures → fix before continuing (use skyux-migration-debugger skill)
6. Stage changes: git add <changed-files>
7. Inform your human partner the step is ready for review
8. Proceed to next schematic
```

## What the Standalone Schematic Does

The `@skyux/packages:standalone` schematic is SKY UX-aware and handles cases that Angular's built-in `standalone-migration` does not:

- Maps individual SKY UX components/directives to their containing NgModule
- Handles legacy service replacements (`SkyDynamicComponentLegacyService` → `SkyDynamicComponentService`)
- Cleans up unused imports after conversion
- Works with both `@Component` declarations and `TestBed.configureTestingModule` imports

## What Schematics Do NOT Fix

These require manual intervention (see Phase 3 of the modernization skill):

- `Sky*Fixture` → `Sky*Harness` test migration
- `HttpClientTestingModule` → `provideHttpClientTesting()` in tests
- `RouterTestingModule` → `provideRouter([])` in tests
- `ng-mocks` removal
- Direct DOM queries → harness methods
- Missing `data-sky-id` attributes
- Low test coverage

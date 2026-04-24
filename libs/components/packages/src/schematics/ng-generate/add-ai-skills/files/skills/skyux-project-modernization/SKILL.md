---
name: skyux-project-modernization
description: Use when modernizing an older Angular/SKY UX project, improving test coverage, replacing deprecated APIs, running migration schematics, or fixing anti-patterns. Activate when a project has outdated patterns (NgModule-based components, Sky*Fixture tests, ng-mocks, direct DOM queries, HttpClientTestingModule, RouterTestingModule), low test coverage, or hasn't been updated in multiple major versions. Also use when asked to "clean up", "modernize", or "bring up to standards".
---

# SKY UX Project Modernization

## Overview

Older projects accumulate outdated patterns: NgModule-based components, deprecated test utilities, direct DOM queries, and low test coverage. Modernizing systematically prevents regressions and builds confidence.

**Core principle:** Modernize incrementally, verify after each step, and never skip assessment.

**Violating the letter of this process is violating the spirit of modernization.**

## The Iron Law

```text
ONE SCHEMATIC AT A TIME. VERIFY BUILD AFTER EACH. STAGE CHANGES BETWEEN STEPS.
```

Do NOT run multiple schematics at once. If one breaks the build, you won't know which.

## When to Use

- Project hasn't been updated in multiple major versions
- Components still use `@NgModule` instead of standalone
- Tests use `Sky*Fixture` classes instead of `Sky*Harness`
- Tests import `HttpClientTestingModule` or `RouterTestingModule`
- Codebase uses `ng-mocks`
- Tests query internal CSS classes (`.sky-modal-content`, etc.) instead of harnesses
- Templates use `*ngIf`/`*ngFor` instead of `@if`/`@for`
- Templates use `[ngClass]` instead of class bindings
- Test coverage is low or missing for key components
- Asked to "clean up", "modernize", "bring up to date", or "fix technical debt"

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Assessment

**BEFORE changing anything, understand what needs modernizing:**

1. **Check Angular and SKY UX Versions**

   ```bash
   npx ng version
   npm ls @skyux/core
   ```

   - How many major versions behind?
   - What migration schematics are available for this version gap?

2. **Scan for NgModule-Based Components**

   ```bash
   # Count components still using NgModule
   grep -r "@NgModule" --include="*.ts" -l | wc -l
   # Count already standalone
   grep -r "standalone: true\|standalone," --include="*.ts" -l | wc -l
   ```

3. **Scan for Deprecated Test Patterns**

   ```bash
   # Sky*Fixture usage (should be Sky*Harness)
   grep -r "Fixture" --include="*.spec.ts" -l | grep -i sky
   # HttpClientTestingModule (should be provideHttpClientTesting)
   grep -r "HttpClientTestingModule" --include="*.spec.ts" -l
   # RouterTestingModule (should be provideRouter)
   grep -r "RouterTestingModule" --include="*.spec.ts" -l
   # ng-mocks (should not be used)
   grep -r "ng-mocks\|MockComponent\|MockModule\|ngMocks" --include="*.spec.ts" -l
   # Direct DOM queries when harness likely exists
   grep -r "By.css.*sky-" --include="*.spec.ts" -l
   ```

4. **Check Test Coverage**

   ```bash
   npx ng test --code-coverage --watch=false
   ```

   - Note files with 0% or low coverage
   - Prioritize components with user-facing behavior

5. **Scan for Deprecated Template Syntax**

   ```bash
   # Old structural directives (should be @if/@for)
   grep -r "\*ngIf\|\*ngFor\|\*ngSwitch" --include="*.html" -l | wc -l
   # ngClass (should be class bindings)
   grep -r "\[ngClass\]" --include="*.html" -l | wc -l
   ```

6. **Document Findings**
   - List each category with file count
   - Present the assessment to your human partner before proceeding
   - Let them decide which phases to prioritize

### Phase 2: Run Modernization Schematics

**Available schematics in recommended order:**

See `references/available-schematics.md` for the complete reference.

**Critical workflow:**

```text
For EACH schematic:
  1. Run the schematic
  2. Review the changes (git diff)
  3. Run: npx ng build
  4. Run: npx ng test
  5. If build/tests fail → fix issues before continuing
  6. Stage the changes: git add <changed-files>
  7. Inform your human partner the step is ready for review
  8. THEN proceed to next schematic
```

**Recommended order:**

1. **Standalone migration** (most impactful, other schematics build on this)

   ```bash
   npx ng g @skyux/packages:standalone
   ```

2. **Control flow migration** (template modernization)

   ```bash
   npx ng generate @angular/core:control-flow
   ```

3. **NgClass to class bindings**

   ```bash
   npx ng generate @angular/core:ngclass-to-class
   ```

4. **Constructor injection to inject()**

   ```bash
   npx ng generate @angular/core:inject-migration
   ```

5. **Route lazy loading migration**

   ```bash
   npx ng generate @angular/core:route-lazy-loading
   ```

6. **SKY UX component migrations** (if applicable)
   ```bash
   npx ng g @skyux/packages:convert-definition-list-to-description-list
   npx ng g @skyux/packages:convert-page-summary-to-page-header
   ```

**Do NOT skip the verification step.** A schematic that produces a green build but breaks a test is worse than no schematic — it hides the problem.

### Phase 3: Fix Deprecated APIs and Anti-Patterns

**Manual fixes the schematics don't cover:**

See `references/deprecated-patterns.md` for the complete lookup table.

**Priority order (fix the most impactful patterns first):**

1. **Replace `Sky*Fixture` → `Sky*Harness`**
   - This is a sync-to-async conversion — tests must become `async`
   - See the [skyux-migration-debugger](../skyux-migration-debugger/SKILL.md) reference `angular-debugging.md` for the Fixture-to-Harness migration guide

2. **Replace deprecated testing modules with provider functions**
   - `HttpClientTestingModule` → `provideHttpClient()` + `provideHttpClientTesting()`
   - `RouterTestingModule` → `provideRouter([])`

3. **Remove ng-mocks**
   - Replace `MockComponent(X)` → simple `@Component({ template: '' }) class StubX {}`
   - Replace `ngMocks.find(X)` → `fixture.debugElement.query(By.directive(X)).componentInstance`

4. **Replace direct DOM queries with harnesses**
   - Replace `By.css('.sky-internal-class')` → `loader.getHarness(SkyXxxHarness)`
   - If no harness exists, use `By.css('[data-sky-id="xxx"]')` instead of internal classes

5. **Replace `jasmine.createSpyObj` for SKY UX services → testing controllers**
   - `SkyModalService` → `SkyModalTestingController` + `SkyModalTestingModule`
   - `SkyConfirmService` → `SkyConfirmTestingController` + `SkyConfirmTestingModule`
   - See the [skyux-test-driven-development](../skyux-test-driven-development/SKILL.md) reference `angular-testing-patterns.md` for the full list

6. **Add `data-sky-id` attributes** to templates that lack stable test selectors

**For each fix:**

- Change ONE pattern at a time across the file
- Run `npx ng test --include="path/to/file.spec.ts"` after each change
- If the test fails, use the [skyux-migration-debugger](../skyux-migration-debugger/SKILL.md) skill to investigate

### Phase 4: Build Test Coverage

**Systematic approach for undertested code:**

1. **Start with the highest-impact, lowest-coverage components**
   - Components with user-facing behavior first
   - Internal utilities and pipes can wait

2. **Use the [skyux-test-driven-development](../skyux-test-driven-development/SKILL.md) skill**
   - Write the test FIRST (even for existing code)
   - Use the harness-first approach
   - Use testing controllers for SKY UX services

3. **Test structure for each component:**

   ```typescript
   async function setupTest(): Promise<{
     fixture: ComponentFixture<TestComponent>;
     harness: SkyExampleHarness;
   }> {
     const fixture = TestBed.createComponent(TestComponent);
     const loader = TestbedHarnessEnvironment.loader(fixture);
     const harness = await loader.getHarness(
       SkyExampleHarness.with({ dataSkyId: 'test-example' }),
     );
     return { fixture, harness };
   }
   ```

4. **Coverage target:** 100% (per CONTRIBUTING.md requirements)

5. **Verify coverage after adding tests:**
   ```bash
   npx ng test --include="path/to/file.spec.ts" --code-coverage
   ```

## Red Flags — STOP and Reassess

If you catch yourself:

- Running multiple schematics without verifying between each
- Skipping the assessment phase ("I already know what needs fixing")
- Making manual changes that a schematic could handle
- Fixing deprecated patterns without running tests after each fix
- Adding tests that use deprecated patterns (ng-mocks, direct DOM queries, Sky\*Fixture)
- Committing on behalf of the developer without their explicit request

**STOP. Return to the current phase and follow the process.**

## Common Rationalizations

| Excuse                                              | Reality                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------- |
| "I'll run all schematics at once to save time"      | If one breaks the build, you won't know which. ONE at a time.                   |
| "This pattern is too widespread to fix properly"    | Fix one file at a time. Partial progress is still progress.                     |
| "The tests pass, so the deprecated pattern is fine" | Passing tests with deprecated patterns will break on the next upgrade. Fix now. |
| "I'll skip assessment — I can see the problems"     | Assessment reveals problems you can't see. Run the scans.                       |
| "ng-mocks is fine for this test"                    | It replaces Angular's real behavior with stubs. You test a fiction.             |
| "I'll add data-sky-id later"                        | Without stable selectors, every test is fragile. Add them now.                  |

## Supporting References

These references are available in this directory:

- **`references/available-schematics.md`** — Complete list of SKY UX and Angular schematics with commands and verification steps
- **`references/deprecated-patterns.md`** — Lookup table of deprecated patterns and their modern replacements

**Related skills:**

- **[skyux-migration-debugger](../skyux-migration-debugger/SKILL.md)** — For debugging issues that arise during modernization
- **[skyux-test-driven-development](../skyux-test-driven-development/SKILL.md)** — For Phase 4 test coverage work and harness-first testing
- **[skyux-verification-before-completion](../skyux-verification-before-completion/SKILL.md)** — For verifying each modernization step

## Attribution

Based on [superpowers](https://github.com/obra/superpowers) by Jesse Vincent, licensed under [MIT](https://github.com/obra/superpowers/blob/main/LICENSE).

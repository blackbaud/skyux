---
name: skyux-update-debugger
description: Use when encountering any bug, test failure, build error, compilation failure, or unexpected behavior in Angular or SKY UX code, before proposing fixes. Also use when performing Angular migrations (NgModule to standalone, *ngIf to @if, control flow syntax, fixture to harness). Especially useful after running ng update, upgrading Angular major versions, or migrating SKY UX breaking changes. Covers TypeScript compilation errors (TS2339, TS2305), template errors (NG8001, NG0303), NullInjectorError, inject() context errors (NG0203), harness test failures, overlay rendering problems, flaky tests, standalone component migration, and deprecated API removal. Activate when something works in the browser but fails in tests, or when a test passes locally but fails in CI. Use this skill even if the fix seems obvious.
---

# SKY UX Migration Debugger

## The Iron Law

```text
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Random fixes waste time and create new bugs. ALWAYS find root cause before attempting fixes.

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read error messages carefully** — don't skip past errors. Note error codes, file paths, line numbers. They often contain the exact solution.

2. **Reproduce consistently** — can you trigger it reliably? If not reproducible, gather more data instead of guessing.

3. **Check recent changes** — git diff, recent commits, new dependencies, config changes.

4. **Gather evidence** — in multi-component systems, add diagnostic logging at each component boundary to identify WHERE it breaks before investigating WHY.

5. **Trace data flow** — where does the bad value originate? What called this with bad data? Keep tracing backward until you find the source. Fix at the source, not at the symptom.

6. **Migration-specific investigation:**
   - `NG8001`/`NG0303` (unknown element/property) → standalone component missing an `imports` entry
   - `NG0203` (inject() context) → `inject()` called outside constructor or field initializer
   - `TS2305` (no exported member) → deprecated API removed in new version (e.g. `HttpClientTestingModule`, `RouterTestingModule`)
   - Test uses `Sky*Fixture` → class was removed, replace with `Sky*Harness`
   - Overlay component (modal, flyout, popover) not found in test → use `TestbedHarnessEnvironment.documentRootLoader(fixture)` instead of `.loader(fixture)`

### Phase 2: Pattern Analysis

1. **Find working examples** — search the codebase for similar working code, or check `@skyux/*/testing` packages for canonical harness test patterns
2. **Compare against references** — read reference implementations completely, don't skim
3. **Identify differences** — list every difference between working and broken code (standalone vs module imports, `data-sky-id` presence, provider configuration)
4. **Understand dependencies** — what services, overlay containers, or module imports does the component require?

### Phase 3: Hypothesis and Testing

1. **Form a single hypothesis** — "I think X is the root cause because Y"
2. **Test minimally** — make the SMALLEST change to test the hypothesis. One variable at a time.
3. **Verify or pivot** — if it worked, proceed to Phase 4. If not, form a NEW hypothesis. Don't stack fixes.

### Phase 4: Implementation

1. **Write a failing test** that reproduces the bug using component harnesses
2. **Implement a single fix** addressing the root cause — ONE change, no bundled refactoring
3. **Verify** — test passes, no other tests broken, issue resolved
4. **If 3+ fixes have failed** — STOP. This is likely an architectural problem, not a bug. Discuss with your human partner before attempting more fixes.

## Replacing ng-mocks

The `ng-mocks` package (`MockComponent`, `MockModule`, `ngMocks`) hijacks Angular's test environment and masks real DI and template binding issues. Do not use it.

**Instead of `ngMocks.find(Component)`:**

Use `fixture.debugElement.query(By.directive(Component)).componentInstance`

**Instead of `MockComponent(Child)`:**

Create a simple stub: `@Component({ template: '' }) class StubChildComponent {}`

**Instead of `jasmine.createSpyObj` for SKY UX services:**

Use official testing controllers from `@skyux/*/testing`:

- `SkyModalTestingController` / `SkyModalTestingModule` — mock modals
- `SkyConfirmTestingController` / `SkyConfirmTestingModule` — mock confirm dialogs
- `SkyMediaQueryTestingController` / `provideSkyMediaQueryTesting()` — mock breakpoints
- `SkyHelpTestingController` / `SkyHelpTestingModule` — mock help panel

## Fixture-to-Harness Migration

`Sky*Fixture` classes have been replaced by `Sky*Harness` classes. Key changes:

1. Replace `Sky*Fixture` import with `Sky*Harness` from the same `@skyux/*/testing` package
2. Add `import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'`
3. Change the test function to `async`
4. Create a loader: `TestbedHarnessEnvironment.loader(fixture)` (or `documentRootLoader` for overlays)
5. Get the harness: `await loader.getHarness(SkyXxxHarness.with({ dataSkyId: 'xxx' }))`
6. Replace synchronous property access with `await harness.method()` calls

## Anti-Patterns

| Anti-Pattern                                             | Why It Fails                                          | What to Do Instead                                   |
| -------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **ng-mocks** (`MockComponent`, `MockModule`)             | Hijacks Angular's test environment, masks real issues | See "Replacing ng-mocks" above                       |
| **Direct DOM queries** (`By.css('.sky-internal-class')`) | Internal CSS classes change across versions           | Use `Sky*Harness` or `By.css('[data-sky-id="xxx"]')` |
| **Deprecated `Sky*Fixture` classes**                     | Removed in newer SKY UX versions                      | Migrate to `Sky*Harness` (see above)                 |
| **`setTimeout`/`sleep` in tests**                        | Flaky — passes on fast machines, fails in CI          | Use `fakeAsync`/`tick` or harness `await` patterns   |

## Red Flags — STOP and Return to Phase 1

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)
- Each fix reveals a new problem in a different place

## Quick Reference

| Phase                 | Key Activities                                                          | Success Criteria            |
| --------------------- | ----------------------------------------------------------------------- | --------------------------- |
| **1. Root Cause**     | Read errors, reproduce, check changes, gather evidence, trace data flow | Understand WHAT and WHY     |
| **2. Pattern**        | Find working examples in codebase or `@skyux/*/testing`, compare        | Identify differences        |
| **3. Hypothesis**     | Form theory, test minimally, verify or pivot                            | Confirmed or new hypothesis |
| **4. Implementation** | Write failing test, single fix, verify                                  | Bug resolved, tests pass    |

## Attribution

Based on [superpowers](https://github.com/obra/superpowers) by Jesse Vincent, licensed under [MIT](https://github.com/obra/superpowers/blob/main/LICENSE).

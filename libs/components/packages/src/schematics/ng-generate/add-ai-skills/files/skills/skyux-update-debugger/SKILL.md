---
name: skyux-update-debugger
description: Use when encountering any bug, test failure, build error, or unexpected behavior in Angular or SKY UX code, before proposing fixes. Especially useful after ng update, major version upgrades, or migrating breaking changes. Also activate when something works in the browser but fails in tests, or when performing migrations like standalone conversion or fixture-to-harness. Use this skill even if the fix seems obvious.
---

# SKY UX Update Debugger

## The Iron Law

```text
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Random fixes waste time and create new bugs. ALWAYS find root cause before attempting fixes.

Narrate your thinking as you go — what you notice, what surprises you, what you're suspicious of. Be candid and unfiltered.

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read error messages carefully** — don't skip past errors. Note error codes, file paths, line numbers. They often contain the exact solution.
2. **Reproduce consistently** — can you trigger it reliably? If not reproducible, gather more data instead of guessing.
3. **Check recent changes** — git diff, recent commits, new dependencies, config changes.
4. **Trace to the source** — where does the bad value originate? In multi-component systems, add diagnostic logging at each boundary to identify WHERE it breaks. Keep tracing backward until you find the source. Fix at the source, not at the symptom.

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

If you're proposing fixes before completing Phase 1, stop and go back.

## Attribution

Based on [superpowers](https://github.com/obra/superpowers) by Jesse Vincent, licensed under [MIT](https://github.com/obra/superpowers/blob/main/LICENSE).

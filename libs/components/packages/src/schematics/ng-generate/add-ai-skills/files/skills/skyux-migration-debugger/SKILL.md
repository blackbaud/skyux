---
name: skyux-migration-debugger
description: Use when encountering any bug, test failure, build error, compilation failure, or unexpected behavior in Angular or SKY UX code, before proposing fixes. Also use when performing Angular migrations (NgModule to standalone, *ngIf to @if, control flow syntax, fixture to harness). Especially useful after running ng update, upgrading Angular major versions, or migrating SKY UX breaking changes. Covers TypeScript compilation errors (TS2339, TS2305), template errors (NG8001, NG0303), NullInjectorError, inject() context errors (NG0203), change detection issues, ExpressionChangedAfterItHasBeenCheckedError, harness test failures, overlay rendering problems, flaky tests, standalone component migration, and deprecated API removal. Activate when something works in the browser but fails in tests, or when a test passes locally but fails in CI. Use this skill even if the fix seems obvious.
---

# SKY UX Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```text
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue:

- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures or compilation errors
- Integration issues
- Works in browser but fails in test
- Passes locally but fails in CI
- Proactive migrations (NgModule → standalone, `*ngIf` → `@if`, fixture → harness)

**Angular/SKY UX-specific triggers:**

- Harness test failures
- `ExpressionChangedAfterItHasBeenCheckedError`
- Change detection not triggering (stale template bindings)
- `NullInjectorError` or circular dependency errors
- Lifecycle hook ordering issues (`ngOnInit`, `ngAfterViewInit`)
- Overlay/modal/flyout not rendering in test environment
- TypeScript compilation errors after `ng update` (`TS2305` no exported member, `TS2339` property does not exist, `TS2304` cannot find name, `TS2345` type mismatch)
- Template compilation errors (`NG8001` unknown element, `NG8002` unknown property, `NG0303` can't bind)
- `inject()` context errors (`NG0203: inject() must be called from an injection context`)
- Standalone component migration errors (missing `imports` on standalone components)
- Deprecated API errors after major version upgrade (`RouterTestingModule`, `HttpClientTestingModule`, class-based interceptors/guards)

**Use this ESPECIALLY when:**

- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

**Don't skip when:**

- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)
- Manager wants it fixed NOW (systematic is faster than thrashing)

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Don't skip past errors or warnings
   - They often contain the exact solution
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - Does it happen every time?
   - If not reproducible → gather more data, don't guess

3. **Check Recent Changes**
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes
   - Environmental differences

4. **Gather Evidence in Multi-Component Systems**

   **WHEN system has multiple components (service → component → template, or module → provider → consumer):**

   **BEFORE proposing fixes, add diagnostic instrumentation:**

   ```text
   For EACH component boundary:
     - Log what data enters component
     - Log what data exits component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to gather evidence showing WHERE it breaks
   THEN analyze evidence to identify failing component
   THEN investigate that specific component
   ```

5. **Trace Data Flow**

   **WHEN error is deep in call stack:**

   See `references/root-cause-tracing.md` in this directory for the complete backward tracing technique.

   **Quick version:**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

6. **Angular-Specific Investigation**

   **Change Detection:**
   - Is the component using `OnPush`? Does the input change by reference or just mutation?
   - Is `markForCheck()` or `detectChanges()` missing after an async operation?
   - Is the component using signals? Check that computed signals depend on the right reactive sources.

   **Dependency Injection:**
   - Trace the provider tree. Is the service provided at the right level (`root`, component, module)?
   - Is there an unexpected singleton vs. per-component instance?
   - Is a `providedIn: 'root'` service being accidentally overridden by a module provider?

   **Lifecycle Hooks:**
   - `ngOnInit` fires after first `detectChanges()`. `@ViewChild`/`@ContentChild` refs are `undefined` here — use `ngAfterViewInit` for those.
   - `ngAfterViewInit` fires after child views initialize. `@ViewChild` is `undefined` before this.
   - `ngOnChanges` fires before `ngOnInit` and on every input change.

   **Zone.js:**
   - Is the code running outside NgZone (e.g., third-party callback, `requestAnimationFrame`, WebSocket)?
   - Does wrapping in `NgZone.run()` fix it?

   **Harness Environment:**
   - For overlay-based components (modals, flyouts, popovers), use `TestbedHarnessEnvironment.documentRootLoader(fixture)` not `.loader(fixture)`.
   - Harness methods are async — are you awaiting them?

   See `references/angular-debugging.md` in this directory for detailed guidance.

### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

1. **Find Working Examples**
   - Locate similar working code in same codebase
   - Search your project for a working component similar to yours, or check SKY UX documentation and `node_modules/@skyux/` for reference implementations
   - Harness tests in `@skyux/*/testing` packages demonstrate the canonical interaction pattern

2. **Compare Against References**
   - If implementing pattern, read reference implementation COMPLETELY
   - Read the corresponding harness class to understand what DOM structure the component exposes for testing
   - Don't skim — read every line
   - Understand the pattern fully before applying

3. **Identify Differences**
   - What's different between working and broken?
   - List every difference, however small
   - Pay attention to: standalone vs. non-standalone components, module imports vs. standalone imports, `data-sky-id` attribute presence
   - Don't assume "that can't matter"

4. **Understand Dependencies**
   - What other components does this need?
   - Check if the component requires a service, an overlay container, or specific module imports
   - What settings, config, environment?
   - What assumptions does it make?

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. **Test Minimally**
   - Make the SMALLEST possible change to test hypothesis
   - One variable at a time
   - Don't fix multiple things at once

3. **Angular Isolation Techniques**
   - Use `TestBed.configureTestingModule()` to create a minimal reproduction with only the modules/components needed
   - For change detection hypotheses: toggle between `ChangeDetectionStrategy.Default` and `OnPush` in the test component
   - For DI hypotheses: provide a spy service to verify calls
   - For timing hypotheses: use `fakeAsync`/`tick` to control time precisely
   - For harness hypotheses: verify harness finds the element with `loader.getHarness()` before testing behavior

4. **Verify Before Continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DON'T add more fixes on top

5. **When You Don't Know**
   - Say "I don't understand X"
   - Don't pretend to know
   - Ask for help
   - Research more

### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create Failing Test Case**
   - Use component harnesses for the regression test:
     1. Set up `TestBed` with the component under test
     2. Create harness loader: `TestbedHarnessEnvironment.loader(fixture)` (or `documentRootLoader` for overlays)
     3. Get the harness: `const harness = await loader.getHarness(SkyXxxHarness)`
     4. Write the assertion that fails: `await expectAsync(harness.getSomething()).toBeResolvedTo(expected)`
     5. Watch the test fail
   - Use the `skyux-test-driven-development` skill for writing proper failing tests

2. **Implement Single Fix**
   - Address the root cause identified
   - ONE change at a time
   - No "while I'm here" improvements
   - No bundled refactoring

3. **Verify Fix**
   - Test passes now?
   - No other tests broken?
   - Issue actually resolved?

4. **If Fix Doesn't Work**
   - STOP
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - **If ≥ 3: STOP and question the architecture (step 5 below)**
   - DON'T attempt Fix #4 without architectural discussion

5. **If 3+ Fixes Failed: Question Architecture**

   **Pattern indicating architectural problem:**
   - Each fix reveals new shared state/coupling/problem in different place
   - Fixes require "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   **STOP and question fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we "sticking with it through sheer inertia"?
   - Should we refactor architecture vs. continue fixing symptoms?

   **Discuss with your human partner before attempting more fixes**

   This is NOT a failed hypothesis — this is a wrong architecture.

## Red Flags - STOP and Follow Process

If you catch yourself thinking:

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "Pattern says X but I'll adapt it differently"
- "Here are the main problems: [lists fixes without investigation]"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (when already tried 2+)**
- **Each fix reveals new problem in different place**

**ALL of these mean: STOP. Return to Phase 1.**

**If 3+ fixes failed:** Question the architecture (see Phase 4.5)

## Angular/SKY UX Anti-Patterns

| Anti-Pattern                                            | Why It Fails                                                                                      | What to Do Instead                                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **ng-mocks** (`MockComponent`, `MockModule`)            | Hijacks Angular's test environment, masks real DI/template issues, adds an unnecessary dependency | Use `fixture.debugElement.query(By.directive(Component))` to access child instances, simple stub components, or the real component |
| **Mocking SKY UX services with `jasmine.createSpyObj`** | Couples tests to SKY UX service internals; breaks when the service API changes                    | Use official testing controllers from `@skyux/*/testing` (e.g., `SkyModalTestingController`, `SkyConfirmTestingController`)        |
| **Over-mocking services**                               | When everything is mocked, the test only tests your mocks                                         | Mock at boundaries (HTTP, external services), use real SKY UX services and testing controllers                                     |
| **`setTimeout`/`sleep` in tests**                       | Arbitrary waits are flaky; pass on fast machines, fail in CI                                      | Use `fakeAsync`/`tick`, harness `await` patterns, or condition-based waiting                                                       |
| **Direct DOM queries on internal classes**              | Internal CSS classes (`sky-modal-content`, etc.) can change across versions                       | Use component harnesses which provide stable APIs                                                                                  |
| **Skipping `detectChanges()`**                          | Template bindings not evaluated, harness sees stale DOM                                           | Always call `detectChanges()` after changing inputs; harnesses handle this internally for interactions                             |

## Your Human Partner's Signals You're Doing It Wrong

**Watch for these redirections:**

- "Is that not happening?" — You assumed without verifying
- "Will it show us...?" — You should have added evidence gathering
- "Stop guessing" — You're proposing fixes without understanding
- "Ultrathink this" — Question fundamentals, not just symptoms
- "We're stuck?" (frustrated) — Your approach isn't working

**When you see these:** STOP. Return to Phase 1.

## Common Rationalizations

| Excuse                                                   | Reality                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| "Issue is simple, don't need process"                    | Simple issues have root causes too. Process is fast for simple bugs.          |
| "Emergency, no time for process"                         | Systematic debugging is FASTER than guess-and-check thrashing.                |
| "Just try this first, then investigate"                  | First fix sets the pattern. Do it right from the start.                       |
| "I'll write test after confirming fix works"             | Untested fixes don't stick. Test first proves it.                             |
| "Multiple fixes at once saves time"                      | Can't isolate what worked. Causes new bugs.                                   |
| "Reference too long, I'll adapt the pattern"             | Partial understanding guarantees bugs. Read it completely.                    |
| "I see the problem, let me fix it"                       | Seeing symptoms ≠ understanding root cause.                                   |
| "One more fix attempt" (after 2+ failures)               | 3+ failures = architectural problem. Question pattern, don't fix again.       |
| "ng-mocks makes setup easier"                            | It replaces Angular's real behavior with stubs. You end up testing a fiction. |
| "I'll query the DOM directly, harness is too much setup" | Harnesses are the contract. Direct DOM queries break on internal refactors.   |

## Quick Reference

| Phase                 | Key Activities                                                                         | Success Criteria            |
| --------------------- | -------------------------------------------------------------------------------------- | --------------------------- |
| **1. Root Cause**     | Read errors, reproduce, check changes, gather evidence, Angular-specific investigation | Understand WHAT and WHY     |
| **2. Pattern**        | Find working examples in your codebase or `@skyux/*/testing`, compare harness tests    | Identify differences        |
| **3. Hypothesis**     | Form theory, test minimally, use Angular isolation techniques                          | Confirmed or new hypothesis |
| **4. Implementation** | Create harness-based regression test, fix, verify                                      | Bug resolved, tests pass    |

## When Process Reveals "No Root Cause"

If systematic investigation reveals issue is truly environmental, timing-dependent, or external:

1. You've completed the process
2. Document what you investigated
3. Implement appropriate handling (retry, timeout, error message)
4. Add monitoring/logging for future investigation

**But:** 95% of "no root cause" cases are incomplete investigation.

## Supporting Techniques

These techniques are part of systematic debugging and available in this directory:

- **`references/root-cause-tracing.md`** — Trace bugs backward through call stack to find original trigger
- **`references/defense-in-depth.md`** — Add validation at multiple layers after finding root cause
- **`references/condition-based-waiting.md`** — Replace arbitrary timeouts with condition polling; includes Angular `fakeAsync`/`tick` patterns
- **`references/angular-debugging.md`** — Angular-specific debugging: change detection, DI, lifecycle hooks, zone.js, overlay testing

**Related skills:**

- **[skyux-test-driven-development](../skyux-test-driven-development/SKILL.md)** — For creating failing test case (Phase 4, Step 1)
- **[skyux-verification-before-completion](../skyux-verification-before-completion/SKILL.md)** — Verify fix worked before claiming success

## Real-World Impact

From debugging sessions:

- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
- New bugs introduced: Near zero vs common

## Attribution

Based on [superpowers](https://github.com/obra/superpowers) by Jesse Vincent, licensed under [MIT](https://github.com/obra/superpowers/blob/main/LICENSE).

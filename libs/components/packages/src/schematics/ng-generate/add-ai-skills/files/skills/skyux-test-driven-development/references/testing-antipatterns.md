# Testing antipatterns

**Load this reference when:** writing or changing tests, adding mocks, or tempted to add test-only methods to production code.

## Overview

Tests must verify real behavior, not mock behavior. Mocks are a means to isolate, not the thing being tested.

**Core principle:** Test what the code does, not what the mocks do.

**Following strict TDD prevents these anti-patterns.**

## The Iron Laws

```text
1. NEVER test mock behavior
2. NEVER add test-only methods to production classes
3. NEVER mock without understanding dependencies
4. NEVER use ng-mocks — use simple mocks and real components
5. NEVER query internal DOM when a harness exists
```

## Anti-Pattern 1: Testing Mock Behavior

**The violation:**

```typescript
// ❌ BAD: Testing that the mock exists
it('should render sidebar', () => {
  const fixture = TestBed.createComponent(PageComponent);
  fixture.detectChanges();
  const sidebar = fixture.debugElement.query(By.css('app-sidebar-mock'));
  expect(sidebar).toBeTruthy();
});
```

**Why this is wrong:**

- You're verifying the mock works, not that the component works
- Test passes when mock is present, fails when it's not
- Tells you nothing about real behavior

**The fix:**

```typescript
// ✅ GOOD: Test real component or don't mock it
it('should render sidebar', () => {
  const fixture = TestBed.createComponent(PageComponent);
  fixture.detectChanges();
  // Don't mock sidebar — test Page's behavior with real sidebar
  const nav = fixture.debugElement.query(By.css('[role="navigation"]'));
  expect(nav).toBeTruthy();
});
```

### Gate Function

```text
BEFORE asserting on any mock element:
  Ask: "Am I testing real component behavior or just mock existence?"

  IF testing mock existence:
    STOP - Delete the assertion or unmock the component

  Test real behavior instead
```

## Anti-Pattern 2: Test-Only Methods in Production

**The violation:**

```typescript
// ❌ BAD: destroy() only used in tests
@Injectable({ providedIn: 'root' })
export class SessionService {
  async destroy() {
    // Looks like production API!
    await this.workspaceManager?.destroyWorkspace(this.id);
  }
}

// In tests
afterEach(() => sessionService.destroy());
```

**Why this is wrong:**

- Production class polluted with test-only code
- Dangerous if accidentally called in production
- Violates YAGNI and separation of concerns

**The fix:**

```typescript
// ✅ GOOD: Test utilities handle test cleanup
// SessionService has no destroy() — it's stateless in production

// In test-utils/
export function cleanupSession(sessionService: SessionService): void {
  const workspace = sessionService.getWorkspaceInfo();
  if (workspace) {
    workspaceManager.destroyWorkspace(workspace.id);
  }
}

// In tests
afterEach(() => cleanupSession(sessionService));
```

### Gate Function

```text
BEFORE adding any method to production class:
  Ask: "Is this only used by tests?"

  IF yes:
    STOP - Don't add it
    Put it in test utilities instead

  Ask: "Does this class own this resource's lifecycle?"

  IF no:
    STOP - Wrong class for this method
```

## Anti-Pattern 3: Mocking Without Understanding

**The violation:**

```typescript
// ❌ BAD: Mock prevents behavior the test depends on
it('should detect duplicate configuration', () => {
  const catalogSpy = jasmine.createSpyObj('ToolCatalog', ['discoverAndCache']);
  catalogSpy.discoverAndCache.and.returnValue(Promise.resolve());

  // Mocked method had a side effect test depends on (writing config)
  await addServer(config);
  await addServer(config); // Should throw — but won't!
});
```

**Why this is wrong:**

- Mocked method had side effect test depended on
- Over-mocking to "be safe" breaks actual behavior
- Test passes for wrong reason or fails mysteriously

**The fix:**

```typescript
// ✅ GOOD: Mock at correct level
it('should detect duplicate configuration', () => {
  // Mock the slow part, preserve behavior test needs
  spyOn(serverManager, 'startServer').and.returnValue(Promise.resolve());

  await addServer(config); // Config written
  await addServer(config); // Duplicate detected ✓
});
```

### Gate Function

```text
BEFORE mocking any method:
  STOP - Don't mock yet

  1. Ask: "What side effects does the real method have?"
  2. Ask: "Does this test depend on any of those side effects?"
  3. Ask: "Do I fully understand what this test needs?"

  IF depends on side effects:
    Mock at lower level (the actual slow/external operation)
    OR use test doubles that preserve necessary behavior
    NOT the high-level method the test depends on

  IF unsure what test depends on:
    Run test with real implementation FIRST
    Observe what actually needs to happen
    THEN add minimal mocking at the right level

  Red flags:
    - "I'll mock this to be safe"
    - "This might be slow, better mock it"
    - Mocking without understanding the dependency chain
```

## Anti-Pattern 4: Incomplete Mocks

**The violation:**

```typescript
// ❌ BAD: Partial mock — only fields you think you need
const mockResponse = {
  status: 'success',
  data: { userId: '123', name: 'Alice' },
  // Missing: metadata that downstream code uses
};

// Later: breaks when code accesses response.metadata.requestId
```

**Why this is wrong:**

- **Partial mocks hide structural assumptions** - You only mocked fields you know about
- **Downstream code may depend on fields you didn't include** - Silent failures
- **Tests pass but integration fails** - Mock incomplete, real API complete
- **False confidence** - Test proves nothing about real behavior

**The Iron Rule:** Mock the COMPLETE data structure as it exists in reality, not just fields your immediate test uses.

**The fix:**

```typescript
// ✅ GOOD: Mirror real API completeness
const mockResponse = {
  status: 'success',
  data: { userId: '123', name: 'Alice' },
  metadata: { requestId: 'req-789', timestamp: 1234567890 },
  // All fields real API returns
};
```

### Gate Function

```
BEFORE creating mock responses:
  Check: "What fields does the real API response contain?"

  Actions:
    1. Examine actual API response from docs/examples
    2. Include ALL fields system might consume downstream
    3. Verify mock matches real response schema completely

  Critical:
    If you're creating a mock, you must understand the ENTIRE structure
    Partial mocks fail silently when code depends on omitted fields

  If uncertain: Include all documented fields
```

## Anti-Pattern 5: Integration Tests as Afterthought

**The violation:**

```
✅ Implementation complete
❌ No tests written
"Ready for testing"
```

**Why this is wrong:**

- Testing is part of implementation, not optional follow-up
- TDD would have caught this
- Can't claim complete without tests

**The fix:**

```
TDD cycle:
1. Write failing test
2. Implement to pass
3. Refactor
4. THEN claim complete
```

## Anti-Pattern 6: Using ng-mocks

**The violation:**

```typescript
// ❌ BAD: ng-mocks hijacks the Angular test environment
import { MockComponent, MockModule } from 'ng-mocks';

TestBed.configureTestingModule({
  declarations: [
    MyComponent,
    MockComponent(SkyModalComponent),
    MockComponent(SkyInputBoxComponent),
  ],
  imports: [MockModule(SkyModalModule)],
});
```

**Why this is wrong:**

- **Hijacks the Angular test environment** — ng-mocks replaces Angular's real compilation and rendering pipeline with its own abstraction
- **Masks real integration issues** — template binding errors, DI failures, and lifecycle hook problems are hidden behind mock boundaries
- **Adds unnecessary complexity** — another dependency to learn, configure, and debug when tests behave unexpectedly
- **This repo does not use it** — the entire SKY UX codebase uses simple mocks and real components; ng-mocks is a foreign pattern here

**The fix:**

```typescript
// ✅ GOOD: Use simple mock components, testing controllers, and Angular's debugElement
@Component({ template: '' })
class MockChildComponent {}

TestBed.configureTestingModule({
  imports: [SkyModalTestingModule, MyComponent, MockChildComponent],
});

// Use SKY UX testing controllers instead of mocking services directly
const modalController = TestBed.inject(SkyModalTestingController);

// Use Angular's debugElement to access child component instances
const childDebugEl = fixture.debugElement.query(By.directive(ChildComponent));
const childInstance = childDebugEl.componentInstance;
```

**Accessing child components — ng-mocks vs. Angular:**

```typescript
// ❌ BAD: ng-mocks to access a child component instance
import { ngMocks } from 'ng-mocks';
const child = ngMocks.find(SomeComponent).componentInstance;

// ✅ GOOD: Angular's debugElement does the same thing natively
const child = fixture.debugElement
  .query(By.directive(SomeComponent))
  .componentInstance;
```

**Mocking SKY UX services — avoid `jasmine.createSpyObj`:**

```typescript
// ✅ GOOD: Use the official testing controller from @skyux/modals/testing
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

// ❌ BAD: Hand-rolling a mock couples your test to SkyModalService internals
const mockService = jasmine.createSpyObj('SkyModalService', ['open', 'close']);
TestBed.configureTestingModule({
  providers: [{ provide: SkyModalService, useValue: mockService }],
});

TestBed.configureTestingModule({
  imports: [SkyModalTestingModule, MyComponent],
});

const modalController = TestBed.inject(SkyModalTestingController);
fixture.componentInstance.openModal();
fixture.detectChanges();

modalController.expectOpen(MyModalComponent);
modalController.closeTopModal({ data: {}, reason: 'save' });
modalController.expectNone();
```

### Gate Function

```
BEFORE mocking a SKY UX service:
  Ask: "Does @skyux/*/testing provide a testing controller or module for this?"

  Check: `@skyux/*/testing` packages for *TestingController or *TestingModule (e.g., `import { SkyModalTestingController } from '@skyux/modals/testing'`)

  IF testing utility exists:
    STOP — Use the official testing controller
    It handles the mock wiring and provides a purpose-built assertion API

  IF no testing utility exists:
    Use jasmine.createSpyObj + provider override as a fallback

BEFORE accessing a child component instance:
  Ask: "Am I reaching for ng-mocks?"

  IF yes:
    STOP — Use fixture.debugElement.query(By.directive(Component)).componentInstance
    Angular provides this natively. No extra library needed.
```

## Anti-Pattern 7: Direct DOM Queries When Harness Exists

**The violation:**

```typescript
// ❌ BAD: Querying internal CSS classes
it('should show initials', () => {
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  const initialsEl = fixture.debugElement.query(
    By.css('.sky-avatar-initials-inner'),
  );
  expect(initialsEl.nativeElement.textContent.trim()).toBe('JD');
});
```

**Why this is wrong:**

- **Internal CSS classes are not a public API** — they can change in any release without notice
- **Harnesses provide a stable contract** — `SkyAvatarHarness.getInitials()` will work across versions
- **Fragile tests** — refactoring component markup breaks every test that queries internal selectors

**The fix:**

```typescript
// ✅ GOOD: Use the component harness
it('should show initials', async () => {
  const { fixture, harness } = await setupTest();

  fixture.componentRef.setInput('name', 'Jane Doe');

  await expectAsync(harness.getInitials()).toBeResolvedTo('JD');
});
```

### Gate Function

```
BEFORE writing fixture.debugElement.query(By.css('...')):
  Ask: "Does a harness exist for this component?"

  Check: `@skyux/*/testing` packages for harness exports (e.g., `import { SkyAvatarHarness } from '@skyux/avatar/testing'`)

  IF harness exists:
    STOP — Use the harness method instead
    Harness = stable API, CSS class = implementation detail

  IF no harness exists:
    Use data-sky-id attributes for targeting: By.css('[data-sky-id="my-id"]')
    NEVER query internal sky- prefixed CSS classes
```

## Anti-Pattern 8: Using Deprecated Fixture Classes

**The violation:**

```typescript
// ❌ BAD: Using deprecated fixture class
import { SkyAvatarFixture } from '@skyux/avatar/testing';

const avatarFixture = new SkyAvatarFixture(fixture, 'test-avatar');
const initials = avatarFixture.initials;
```

**Why this is wrong:**

- **Deprecated** — `Sky*Fixture` classes are being replaced by `Sky*Harness` classes
- **Inconsistent API** — fixtures use synchronous property access, harnesses use async methods matching CDK patterns
- **No CDK integration** — fixtures don't participate in the Angular CDK testing infrastructure

**The fix:**

```typescript
// ✅ GOOD: Use the harness
import { SkyAvatarHarness } from '@skyux/avatar/testing';

const loader = TestbedHarnessEnvironment.loader(fixture);
const harness = await loader.getHarness(
  SkyAvatarHarness.with({ dataSkyId: 'test-avatar' }),
);
const initials = await harness.getInitials();
```

## When Mocks Become Too Complex

**Warning signs:**

- Mock setup longer than test logic
- Mocking everything to make test pass
- Mocks missing methods real components have
- Test breaks when mock changes

**Consider:** Integration tests with real components often simpler than complex mocks

## TDD Prevents These Anti-Patterns

**Why TDD helps:**

1. **Write test first** → Forces you to think about what you're actually testing
2. **Watch it fail** → Confirms test tests real behavior, not mocks
3. **Minimal implementation** → No test-only methods creep in
4. **Real dependencies** → You see what the test actually needs before mocking

**If you're testing mock behavior, you violated TDD** - you added mocks without watching test fail against real code first.

## Quick Reference

| Anti-Pattern                    | Fix                                           |
| ------------------------------- | --------------------------------------------- |
| Assert on mock elements         | Test real component or unmock it              |
| Test-only methods in production | Move to test utilities                        |
| Mock without understanding      | Understand dependencies first, mock minimally |
| Incomplete mocks                | Mirror real API completely                    |
| Tests as afterthought           | TDD — tests first                             |
| Over-complex mocks              | Consider integration tests                    |
| ng-mocks                        | Use simple inline mocks + jasmine spies       |
| Direct DOM queries              | Use component harness methods                 |
| Deprecated `Sky*Fixture`        | Use `Sky*Harness` from `@skyux/*/testing`     |

## Red Flags

- Assertion checks for `*-mock` test IDs
- Methods only called in test files
- Mock setup is >50% of test
- Test fails when you remove mock
- Can't explain why mock is needed
- Mocking "just to be safe"
- Importing `ng-mocks`, `MockComponent`, or `MockBuilder`
- Using `By.css('.sky-internal-class')` when a harness exists
- Instantiating deprecated `Sky*Fixture` classes

## The Bottom Line

**Mocks are tools to isolate, not things to test.**

If TDD reveals you're testing mock behavior, you've gone wrong.

Fix: Test real behavior or question why you're mocking at all.

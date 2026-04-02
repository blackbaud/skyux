# Angular testing patterns for SKY UX

**Load this reference when:** setting up a new test file, creating a component harness, or unsure which testing utility to use.

## TestBed Configuration

### Minimal Setup

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('My component', () => {
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
});
```

### Key Principles

- Import only what the test needs — don't import entire library modules when a single component suffices
- Use `fixture.componentRef.setInput()` for signal inputs (not direct property assignment)
- Call `fixture.detectChanges()` after programmatic changes when not using harness methods

## Component Harness Architecture

### Base Class: `SkyComponentHarness`

All SKY UX harnesses extend `SkyComponentHarness` from `@skyux/core/testing`, which extends Angular CDK's `ComponentHarness`.

```typescript
import { SkyComponentHarness } from '@skyux/core/testing';

export class SkyExampleHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-example';

  public static with(
    filters: SkyExampleHarnessFilters,
  ): HarnessPredicate<SkyExampleHarness> {
    return SkyExampleHarness.getDataSkyIdPredicate(filters);
  }

  public async getText(): Promise<string> {
    const el = await this.locatorFor('.sky-example-text')();
    return el.text();
  }
}
```

### Key Harness Methods

| Method                         | Purpose                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| `locatorFor(selector)`         | Find a required child element                                |
| `locatorForOptional(selector)` | Find an optional child element                               |
| `locatorForAll(selector)`      | Find all matching child elements                             |
| `host()`                       | Get the host element                                         |
| `documentRootLocatorFactory()` | Create locator for elements outside component DOM (overlays) |

### Targeting Instances with `data-sky-id`

```typescript
// In template
<sky-avatar data-sky-id="user-avatar" />

// In test
const harness = await loader.getHarness(
  SkyAvatarHarness.with({ dataSkyId: 'user-avatar' }),
);
```

## Overlay Testing

Modals, flyouts, popovers, and dropdowns render in the document root, **outside** the component's DOM tree.

```typescript
// ❌ WRONG: loader() only searches within the component
const loader = TestbedHarnessEnvironment.loader(fixture);
const modal = await loader.getHarness(SkyModalHarness); // Will NOT find it

// ✅ CORRECT: documentRootLoader() searches the entire document
const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
const modal = await rootLoader.getHarness(SkyModalHarness);
```

## SKY UX Testing Utilities

### `@skyux/core/testing`

| Export                          | Purpose                                                |
| ------------------------------- | ------------------------------------------------------ |
| `SkyComponentHarness`           | Base class for all SKY UX harnesses                    |
| `SkyHarnessUtility`             | Shared harness helpers (e.g., `getBackgroundImageUrl`) |
| `SkyInputHarness`               | Harness for input elements                             |
| `provideSkyMediaQueryTesting()` | Mock media query breakpoints in tests                  |
| `SkyHelpTestingController`      | Control help panel behavior in tests                   |

### `@skyux-sdk/testing`

| Export                   | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `expect` / `expectAsync` | Extended Jasmine matchers for SKY UX                   |
| `SkyAppTestUtility`      | DOM utilities (`getText`, `isVisible`, `fireDomEvent`) |

## Accessing Components and Directives with `debugElement`

Angular's `fixture.debugElement` provides native access to child components and directives — no extra library needed.

### Query by Directive

```typescript
import { By } from '@angular/platform-browser';

// Find a child component instance
const childDebugEl = fixture.debugElement.query(By.directive(ChildComponent));
const childInstance = childDebugEl.componentInstance;

// Find a directive on an element
const highlightEl = fixture.debugElement.query(
  By.directive(HighlightDirective),
);
const directive = highlightEl.injector.get(HighlightDirective);
```

### Query by CSS (when no harness exists)

```typescript
// Prefer data-sky-id over internal CSS classes
const el = fixture.debugElement.query(By.css('[data-sky-id="my-element"]'));

// Access native element when needed
const nativeEl: HTMLElement = el.nativeElement;
```

### Query All

```typescript
// Find all instances of a component
const allItems = fixture.debugElement.queryAll(By.directive(ItemComponent));
expect(allItems.length).toBe(3);
```

**This replaces ng-mocks patterns:**

```typescript
// ❌ ng-mocks
const comp = ngMocks.find(SomeComponent).componentInstance;

// ✅ Angular native
const comp = fixture.debugElement.query(By.directive(SomeComponent)).componentInstance;
```

## Mocking Without ng-mocks

### SKY UX Testing Controllers (preferred for SKY UX services)

SKY UX provides purpose-built testing utilities in `@skyux/*/testing`. Always prefer these over hand-rolling mocks with `jasmine.createSpyObj`.

```typescript
// ✅ GOOD: Use testing controller for modals
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

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

**Available testing controllers and modules:**

| Package                 | Testing Utility                                                    | Purpose                                     |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| `@skyux/modals/testing` | `SkyModalTestingController` / `SkyModalTestingModule`              | Mock modal service, assert modal open/close |
| `@skyux/modals/testing` | `SkyConfirmTestingController` / `SkyConfirmTestingModule`          | Mock confirm dialogs, assert open/close     |
| `@skyux/core/testing`   | `SkyMediaQueryTestingController` / `provideSkyMediaQueryTesting()` | Mock responsive breakpoints                 |
| `@skyux/core/testing`   | `SkyHelpTestingController` / `SkyHelpTestingModule`                | Control help panel behavior                 |
| `@skyux/core/testing`   | `provideSkyFileReaderTesting()`                                    | Mock file reader                            |
| `@skyux/forms/testing`  | `provideSkyFileAttachmentTesting()`                                | Mock file attachment behavior               |

### Service Mocking (fallback for non-SKY UX services)

```typescript
// Use jasmine.createSpyObj only for services without a testing controller
const mockService = jasmine.createSpyObj('MyCustomService', ['getData']);

TestBed.configureTestingModule({
  providers: [{ provide: MyCustomService, useValue: mockService }],
});
```

### Component Mocking

```typescript
// Simple stub component (standalone is the default in Angular 19+)
@Component({ template: '' })
class StubChildComponent {}
```

### Spy on Existing Methods

```typescript
// Spy on a real service method
const service = TestBed.inject(MyService);
spyOn(service, 'getData').and.callThrough();
```

## Deprecated Patterns

### Fixture Classes → Harnesses

```typescript
// ❌ DEPRECATED
import { SkyAvatarFixture } from '@skyux/avatar/testing';
const fixture = new SkyAvatarFixture(componentFixture, 'test-avatar');
const initials = fixture.initials;

// ✅ CURRENT
import { SkyAvatarHarness } from '@skyux/avatar/testing';
const loader = TestbedHarnessEnvironment.loader(componentFixture);
const harness = await loader.getHarness(
  SkyAvatarHarness.with({ dataSkyId: 'test-avatar' }),
);
const initials = await harness.getInitials();
```

### Testing Modules → Provider Functions

```typescript
// ❌ DEPRECATED
import { SkyCoreTestingModule } from '@skyux/core/testing';
// ✅ CURRENT
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';

TestBed.configureTestingModule({
  imports: [SkyCoreTestingModule],
});

TestBed.configureTestingModule({
  providers: [provideSkyMediaQueryTesting()],
});
```

## Quick Decision Tree

```
Need to test a SKY UX component?
├── Harness exists in @skyux/*/testing?
│   ├── Yes → Use the harness
│   └── No → Use fixture.debugElement with data-sky-id
├── Component renders in overlay (modal, flyout)?
│   └── Use documentRootLoader
├── Need to mock a SKY UX service?
│   ├── Testing controller exists? → Use it (SkyModalTestingController, etc.)
│   └── No controller? → Use jasmine.createSpyObj + provider override
├── Need to mock a non-SKY UX service?
│   └── Use jasmine.createSpyObj + provider override
├── Need to access a child component instance?
│   └── Use fixture.debugElement.query(By.directive(Component)).componentInstance
└── Need to mock a child component?
    └── Use simple @Component({ template: '' }) stub
```

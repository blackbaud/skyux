# Angular Debugging for SKY UX

**Load this reference when:** debugging Angular-specific issues like change detection, dependency injection, lifecycle hooks, or overlay rendering.

## Change Detection Issues

### Symptoms

- Template shows stale data
- Binding doesn't update after async operation
- Component works with `Default` strategy but breaks with `OnPush`

### Investigation

1. **Check the change detection strategy.** `OnPush` components only re-render when:
   - An input reference changes (not just content mutation)
   - An event fires from the component or a child
   - `markForCheck()` or `detectChanges()` is called manually
   - An `async` pipe emits a new value

2. **Check if input objects are mutated vs. replaced:**

   ```typescript
   // ❌ Mutation — OnPush won't detect this
   this.items.push(newItem);

   // ✅ New reference — OnPush detects this
   this.items = [...this.items, newItem];
   ```

3. **Check signal usage.** If using signals, verify that computed signals depend on the correct reactive sources. A computed that reads a plain property (not a signal) won't re-evaluate.

### In Tests

- Always call `fixture.detectChanges()` after programmatic changes
- Harness methods handle their own change detection for interactions

## Dependency Injection Issues

### Symptoms

- `NullInjectorError: No provider for XxxService`
- Service has unexpected state (wrong instance)
- Circular dependency errors

### Investigation

1. **Trace the provider tree:**
   - `providedIn: 'root'` → singleton across app
   - `providers: [...]` in `@Component` → new instance per component
   - `providers: [...]` in `@NgModule` → shared within module

2. **Check for accidental overrides.** A module-level provider can shadow a `providedIn: 'root'` service, creating a second instance.

3. **In tests:** Verify `TestBed.configureTestingModule` providers match what the component expects:
   ```typescript
   TestBed.configureTestingModule({
     providers: [
       // Must provide everything the component injects
       { provide: SkyModalService, useValue: mockService },
     ],
   });
   ```

## Lifecycle Hook Issues

### Execution Order

```text
constructor → ngOnChanges → ngOnInit → ngAfterContentInit → ngAfterViewInit → ngOnDestroy
```

### Common Mistakes

- **Accessing `@ViewChild` in `ngOnInit`** — it's `undefined` until `ngAfterViewInit`
- **Heavy logic in constructor** — DI is available, but inputs are not yet set
- **Forgetting `ngOnChanges` fires before `ngOnInit`** — and fires again on every input change

### In Tests

- `fixture.detectChanges()` triggers `ngOnInit` on first call
- Subsequent calls trigger `ngOnChanges` if inputs changed
- Use `fixture.componentRef.setInput()` to change inputs cleanly

## Zone.js and Async Issues

### Symptoms

- UI doesn't update after callback
- `setTimeout` or `requestAnimationFrame` callback doesn't trigger change detection
- Third-party library events don't update the view

### Investigation

1. **Is the code running outside NgZone?** Common causes:
   - Third-party library callbacks
   - `requestAnimationFrame`
   - WebSocket message handlers
   - `addEventListener` called outside Angular

2. **Fix:** Wrap in `NgZone.run()`:
   ```typescript
   this.ngZone.run(() => {
     this.data = newData;
   });
   ```

### In Tests

- `fakeAsync` + `tick()` controls the virtual clock
- `tick(debounceTime)` for debounced inputs
- `flush()` drains all pending async tasks

## Overlay / Portal Component Testing

### The Problem

Modals, flyouts, popovers, and dropdowns render in the **document root**, outside the component's DOM tree. The standard `TestbedHarnessEnvironment.loader(fixture)` only searches within the component.

### The Fix

```typescript
// ❌ WRONG — overlay content is NOT inside the component
const loader = TestbedHarnessEnvironment.loader(fixture);
const modal = await loader.getHarness(SkyModalHarness); // Throws!

// ✅ CORRECT — search the entire document
const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
const modal = await rootLoader.getHarness(SkyModalHarness);
```

### Pattern for Modal/Flyout Tests

```typescript
async function setupTest(): Promise<{
  fixture: ComponentFixture<TestComponent>;
  modalHarness: SkyModalHarness;
  loader: HarnessLoader;
}> {
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  // Open the modal
  fixture.componentInstance.openModal();
  fixture.detectChanges();

  const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  const modalHarness = await loader.getHarness(SkyModalHarness);

  return { fixture, modalHarness, loader };
}
```

## SKY UX Harness Hierarchy

```text
ComponentHarness (Angular CDK)
  └── SkyComponentHarness (@skyux/core/testing)
        ├── SkyAvatarHarness
        ├── SkyModalHarness
        ├── SkyTabsetHarness
        └── ... all other Sky*Harness classes
```

- **`SkyComponentHarness`** adds `data-sky-id` support via `getDataSkyIdPredicate()`
- Use `.with({ dataSkyId: 'xxx' })` to target specific instances
- All methods are async — always `await` them

## Major Version Migration Issues

**Load this section when:** running `ng update`, upgrading Angular major versions, or encountering errors after a version bump.

### Standalone Component Migration (Angular 14+)

Components are standalone by default in Angular 19+. Common errors:

- **`NG8001: 'sky-foo' is not a known element`** — The standalone component is missing `imports: [SkyFooModule]` (or the standalone component itself).
- **`NG0303: Can't bind to 'skyFoo' since it isn't a known property`** — Same cause — missing import on the standalone component.
- **Test failures after removing NgModule** — `TestBed.configureTestingModule` must import the standalone component directly and all its dependencies.

```typescript
// ❌ BEFORE: NgModule-based
@NgModule({
  declarations: [MyComponent],
  imports: [SkyInputBoxModule],
})
export class MyModule {}

// ✅ AFTER: Standalone
@Component({
  imports: [SkyInputBoxModule],
  // ...
})
export class MyComponent {}
```

### `inject()` Context Errors (Angular 14+)

**`NG0203: inject() must be called from an injection context`**

The `inject()` function only works in:

- Constructor body
- Field initializers (class property declarations)
- Factory functions passed to `InjectionToken`, `@Injectable`, etc.

It does NOT work in:

- Lifecycle hooks (`ngOnInit`, `ngAfterViewInit`)
- Callback functions (event handlers, `setTimeout`)
- `effect()` callbacks (use the constructor to call `inject()`, store the result, then reference it in the effect)

```typescript
// ❌ WRONG — inject() in ngOnInit
ngOnInit() {
  const service = inject(MyService); // NG0203!
}

// ✅ CORRECT — inject() in field initializer
readonly #service = inject(MyService);
```

### New Control Flow (Angular 17+)

`@if`, `@for`, `@switch` replace structural directives. Common issues:

- **`@for` requires `track`** — `@for (item of items; track item.id)` — omitting `track` is a compile error.
- **`@defer` blocks need async test handling** — Use `fixture.whenStable()` or `fakeAsync`/`tick` to trigger deferred loading.
- **Harness timing differences** — `@defer` blocks may not render immediately; harness locators may need to wait for the deferred content.

### Router Migration (Angular 15+)

- **`RouterTestingModule` is deprecated** — Use `provideRouter([])` in test providers. For route-level testing (navigation assertions), use `RouterTestingHarness`.
- **Class-based guards deprecated** — `CanActivate` interface replaced by `CanActivateFn` functions.
- **Route input binding** — `withComponentInputBinding()` enables route params as component inputs.

### Signal Queries (Angular 17+)

- **`viewChild()` / `contentChild()` signal queries** — Return `Signal<T | undefined>`, accessible immediately (no need to wait for `ngAfterViewInit` for the signal itself, but the value may be `undefined` until the view initializes).
- **`viewChildren()` / `contentChildren()`** — Return `Signal<ReadonlyArray<T>>`.
- **In tests** — Use `fixture.detectChanges()` to populate signal queries before asserting.

### HTTP Client Migration (Angular 15+)

- **Class-based `HttpInterceptor` deprecated** — Use functional `HttpInterceptorFn` with `withInterceptors()`.
- **`HttpClientTestingModule` deprecated** — Use `provideHttpClientTesting()`.

```typescript
// ❌ DEPRECATED
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});

// ✅ CURRENT
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
```

### SKY UX Fixture-to-Harness Migration

`Sky*Fixture` classes have been replaced by `Sky*Harness` classes. This changes the test from **synchronous** to **async**.

```typescript
// ❌ DEPRECATED: Fixture (synchronous)
// ✅ CURRENT: Harness (async)
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SkyAvatarFixture } from '@skyux/avatar/testing';
import { SkyAvatarHarness } from '@skyux/avatar/testing';

it('should show initials', () => {
  const avatar = new SkyAvatarFixture(fixture, 'test-avatar');
  expect(avatar.initials).toBe('JD'); // Synchronous access
});

it('should show initials', async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const avatar = await loader.getHarness(
    SkyAvatarHarness.with({ dataSkyId: 'test-avatar' }),
  );
  await expectAsync(avatar.getInitials()).toBeResolvedTo('JD');
});
```

**Key conversion steps:**

1. Replace `Sky*Fixture` import with `Sky*Harness`
2. Add `TestbedHarnessEnvironment` import
3. Change test function to `async`
4. Create a loader and get the harness with `await`
5. Replace synchronous property access with `await harness.method()` calls

## Common Test Setup Pattern

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  imports: [SkyExampleModule],
  template: `<sky-example data-sky-id="test-example" [value]="value()" />`,
})
class TestComponent {
  protected value = input<string>();
}

describe('Example', () => {
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

  it('should display the value', async () => {
    const { fixture, harness } = await setupTest();
    fixture.componentRef.setInput('value', 'Hello');
    await expectAsync(harness.getText()).toBeResolvedTo('Hello');
  });
});
```

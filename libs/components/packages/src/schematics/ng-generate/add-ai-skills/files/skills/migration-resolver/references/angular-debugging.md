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

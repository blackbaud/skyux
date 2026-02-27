# Angular Animation Migration Plan

## Goal

Fully remove `@angular/animations` from SKY UX in accordance with Angular's deprecation guidance
([angular.dev/guide/animations/migration](https://angular.dev/guide/animations/migration)).
The end state is:

- Zero imports from `@angular/animations` in production code
- Zero imports of `BrowserAnimationsModule`, `NoopAnimationsModule`, `provideAnimations()`, or
  `provideNoopAnimations()` from `@angular/platform-browser/animations` in any code
- All enter/leave animations use `animate.enter`/`animate.leave` (Angular compiler feature,
  no runtime dependency) or plain CSS class toggling
- All state/transition animations use native CSS `transition` or `@keyframes`
- `@angular/animations` removed from `package.json`

## Progress

- [x] Step 1 — Fix `lookup-fixtures.module.ts`: remove `BrowserAnimationsModule`, use `animationsEnabled: true`
- [ ] Step 2 — Keep `skyAnimationSlide`/`skyAnimationEmerge` as deprecated; schedule removal for a future major version
- [ ] Step 3 — Audit existing CSS animation implementations (see 3a–3d)
- [ ] Step 4 — Remove `NoopAnimationsModule`/`BrowserAnimationsModule` from all test fixtures
- [ ] Step 5 — Migrate any remaining component `animations: [...]` arrays to CSS
- [ ] Step 6 — Remove `provideNoopAnimations()`/`provideAnimations()` from all test and production files
- [ ] Step 7 — Remove `@angular/animations` from `package.json` and library peer dependencies
- [ ] Step 8 — Update `provideNoopSkyAnimations()` JSDoc
- [ ] Step 9 — Resolve bare `animate.enter`/`animate.leave` in `inline-form`

## Key Concepts (from Angular docs)

### `animate.enter` / `animate.leave`

These are **Angular compiler features**, not directives, and not backed by `@angular/animations`.
They apply CSS classes at the right moment:

- `animate.enter="my-enter-class"` — adds class when element enters the DOM, removes it when
  animation completes
- `animate.leave="my-leave-class"` — adds class when element is about to be removed from the DOM,
  then removes the element once the animation completes
- When using `animate.leave` with an event binding (`(animate.leave)="fn($event)"`), you
  **must call `$event.animationComplete()`** for Angular to remove the element

### Testing with `animate.enter` / `animate.leave`

TestBed **disables animations by default**. With animations disabled:

- `animate.enter`/`animate.leave` classes are never applied
- Elements controlled by `animate.leave` are removed from the DOM immediately (no wait for animation)
- `animationend`/`transitionend` events do **not** fire

To enable animations in tests:

```typescript
TestBed.configureTestingModule({ animationsEnabled: true });
```

> Note: jsdom (the Jest test environment) does not fire `animationend` or `transitionend` events —
> these are real browser events. Tests that depend on those callbacks must dispatch them manually
> or be run in a real browser (e2e). `animationsEnabled: true` is required for `animate.enter`/
> `animate.leave` class handling to occur at all.

### Disabling animations without suppressing events

The Angular docs recommend setting animation durations to `1ms` rather than `none` when you
need events to still fire. `provideNoopSkyAnimations()` (from `@skyux/theme`) already does this —
it injects a `<style>` tag that sets all `animation-duration` and `transition-duration` to
`0.01ms` via CSS custom properties. This is the correct approach for unit tests that depend on
`animationend`/`transitionend` callbacks.

`BrowserAnimationsModule` and `NoopAnimationsModule` are only relevant to the **legacy DSL**
(`trigger`, `transition`, `animate`, etc. from `@angular/animations`). Once all DSL usage is
removed, those modules become no-ops and should be deleted.

---

## Current State Inventory

### Production code still using `@angular/animations`

| File                                           | What                                                 | Plan                                                       |
| ---------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| `libs/components/animations/src/lib/slide.ts`  | `skyAnimationSlide` trigger (already `@deprecated`)  | Retain for compatibility; remove in a future major version |
| `libs/components/animations/src/lib/emerge.ts` | `skyAnimationEmerge` trigger (already `@deprecated`) | Retain for compatibility; remove in a future major version |

### Already migrated to native CSS (`animate.enter` / `animate.leave`)

| Component                         | Notes                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `SkyTokenComponent` (`sky-token`) | Uses `animate.enter="sky-token-enter"` / `animate.leave="sky-token-leave"`, `(animationend)="animationDone()"`     |
| `SkyInlineFormComponent`          | Uses `animate.enter` / `animate.leave` without CSS class (bare form — applies a class auto-named from the element) |
| `SkySectionedFormComponent`       | Migrated last session — CSS class toggling + `(animationend)`                                                      |
| `SkyVerticalTabsetComponent`      | Migrated last session — CSS class toggling + `(animationend)`                                                      |

### Already using plain CSS (no Angular animation engine involved)

| Component                        | Notes                                                               |
| -------------------------------- | ------------------------------------------------------------------- |
| `SkyTextExpandComponent`         | `(transitionend)="animationEnd($event)"` — pure CSS transition      |
| `SkyTextExpandRepeaterComponent` | `(transitionend)="animationEnd($event)"` — pure CSS transition      |
| `SkySearchComponent`             | `(transitionend)="inputAnimationEnd($event)"` — pure CSS transition |

### Consumers of `skyAnimationSlide` (deprecated, retained for compatibility)

Both exports are already marked `@deprecated` with links to the CSS animations guide.
They are retained to avoid breaking existing consumers and will be removed in a future major version.

### Consumers of `skyAnimationEmerge` (deprecated, retained for compatibility)

Same as above.

---

## Migration Steps

### Step 1 — Fix `lookup-fixtures.module.ts` (immediate)

The `BrowserAnimationsModule` we added is wrong. It only worked because it happened to set Angular
into "animations enabled" mode as a side effect. The correct fix is:

1. Remove `BrowserAnimationsModule` from `lookup-fixtures.module.ts`
2. Also remove it from `lookup-harness-test.module.ts` if present
3. Add `animationsEnabled: true` to the relevant `TestBed.configureTestingModule` calls **in the
   spec files** that test animation-dependent behavior
4. Keep `provideNoopSkyAnimations()` to make CSS durations near-zero so tests run fast

```typescript
// lookup.component.spec.ts
TestBed.configureTestingModule({
  animationsEnabled: true, // enables animate.leave class application
  providers: [provideNoopSkyAnimations()], // keeps durations near-zero
});
```

Also update `lookup-harness-test.module.ts` (same fix — remove `NoopAnimationsModule`).

### Step 2 — Keep `skyAnimationSlide` and `skyAnimationEmerge` as deprecated (do not delete yet)

Both exports are already marked `@deprecated`. They must be retained to avoid breaking existing
consumers who may be using them. No action is required in this step other than ensuring the
deprecation JSDoc stays in place.

These will be removed in a future major version once consumers have had time to migrate. At that
point, `slide.ts`, `emerge.ts`, their spec files, and the `libs/components/animations` library
can be evaluated for removal entirely.

### Step 3 — Audit existing CSS animation implementations

Before removing legacy test infrastructure, verify that every component's CSS animation
implementation is complete, correct, and follows the recommended patterns. Use
`libs/components/ANIMATION_USAGE_REPORT.md` as the authoritative inventory.

#### 3a — Verify `animate.enter` / `animate.leave` implementations

| Component                    | Template usage                                                                                             | Concern                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SkyTokenComponent`          | `animate.enter="sky-token-enter"` / `animate.leave="sky-token-leave"` / `(animationend)="animationDone()"` | ✅ Correct pattern                                                                                                                                                                                                                                                                                                                                                                    |
| `SkyInlineFormComponent`     | `animate.enter` / `animate.leave` (no class name)                                                          | ⚠️ No CSS class name provided — Angular derives one from the element tag. Verify the generated class name matches the SCSS keyframe classes (`sky-slide-dissolve-first`, `sky-slide-dissolve-last`). If they don't match, add explicit class names. Also note the SCSS still references `.ng-leave` (an AngularJS naming convention) — rename to match the new `animate.leave` class. |
| `SkySectionedFormComponent`  | CSS class toggling + `(animationend)`                                                                      | ✅ Correct pattern (migrated)                                                                                                                                                                                                                                                                                                                                                         |
| `SkyVerticalTabsetComponent` | CSS class toggling + `(animationend)`                                                                      | ✅ Correct pattern (migrated)                                                                                                                                                                                                                                                                                                                                                         |

#### 3b — Verify `@starting-style` implementations

Components using `@starting-style` + `transition:` for enter animations require no Angular
involvement at all, but verify browser compatibility is acceptable for each:

| Component                      | Pattern                                                           | Notes                                    |
| ------------------------------ | ----------------------------------------------------------------- | ---------------------------------------- |
| Split View                     | `@starting-style` + `transition: transform 150ms ease-in`         | ✅ Modern pattern, no callbacks needed   |
| Flyout                         | `@starting-style` + `transition: transform 250ms ease-in`         | ✅ Modern pattern, no callbacks needed   |
| Phone Field                    | `@starting-style` + `transition: opacity 200ms ease-in`           | ✅ Modern pattern, no callbacks needed   |
| Inline Delete                  | `@starting-style` + `transition: opacity/scale 300ms ease-in-out` | ✅ Modern pattern, no callbacks needed   |
| `sky-animation-emerge()` mixin | `@starting-style` + `opacity` + `scale`                           | ✅ Correct, currently used by toast only |

#### 3c — Review CSS mixin adoption opportunities (from ANIMATION_USAGE_REPORT.md recommendations)

These are not blockers for the `@angular/animations` removal, but should be tracked:

- **`sky-animation-emerge()` underutilized** — only 1 consumer (toast). Popover content and phone
  field both have independent `opacity` fade transitions that serve the same purpose. Consider
  aligning them to `sky-animation-emerge()` or a new fade-only variant.
- **Slide-in-from-side duplication** — Flyout and Split View each duplicate the
  `@starting-style` + `transition: transform` pattern with different durations (250ms vs 150ms).
  A parameterized `sky-animation-slide-in()` mixin could unify them — low priority, DRY win only.

#### 3d — Verify `prefers-reduced-motion` coverage

The global `prefers-reduced-motion: reduce` rule in the theme's `_animations.scss` collapses all
`animation-duration` and `transition-duration` to `var(--sky-animation-duration-noop)`.
Confirm this covers all newly added CSS animations and `animate.enter`/`animate.leave` keyframes.

### Step 4 — Remove `NoopAnimationsModule` and `BrowserAnimationsModule` from all test files

These modules only affect the legacy DSL engine. Once step 2 is complete, they serve no purpose.
Go through all files listed below and remove the import and usage:

**Files to clean up:**

- `libs/components/flyout/testing/src/modules/flyout/flyout-harness.spec.ts`
- `libs/components/data-manager/src/lib/modules/data-manager/fixtures/data-manager.module.fixture.ts`
- `libs/components/data-manager/testing/src/modules/data-manager/data-manager-harness.spec.ts`
- `libs/components/split-view/testing/src/modules/split-view/split-view-harness.spec.ts`
- `libs/components/help-inline/testing/src/modules/help-inline/help-inline-harness.spec.ts`
- `libs/components/filter-bar/testing/src/modules/filter-bar/filter-bar-harness.spec.ts`
- `libs/components/help-inline/src/lib/modules/help-inline/help-inline.component.spec.ts`
- `libs/components/inline-form/testing/src/modules/inline-form/inline-form-harness.spec.ts`
- `libs/components/colorpicker/src/lib/modules/colorpicker/fixtures/colorpicker-fixtures.module.ts`
- `libs/components/colorpicker/testing/src/modules/colorpicker/colorpicker-harness.spec.ts`
- `libs/components/phone-field/testing/src/modules/phone-field/phone-field-harness.spec.ts`
- `libs/components/phone-field/testing/src/legacy/phone-field/phone-field-testing.module.ts`
- `libs/components/phone-field/src/lib/modules/phone-field/phone-field.component.spec.ts`
- `libs/components/select-field/src/lib/modules/select-field/select-field.component.spec.ts`
- `libs/components/progress-indicator/src/lib/modules/progress-indicator/progress-indicator.component.spec.ts`
- `libs/components/progress-indicator/testing/src/modules/progress-indicator/progress-indicator-harness.spec.ts`
- `libs/components/list-builder-view-grids/testing/src/legacy/list-view-grid-fixture.spec.ts`
- `libs/components/modals/testing/src/modules/modal/modal-harness.spec.ts`
- `libs/components/lookup/src/lib/modules/selection-modal/selection-modal.component.spec.ts`
- `libs/components/grids/src/lib/modules/grid/fixtures/grid-fixtures.module.ts`
- `libs/components/lookup/testing/src/legacy/search/search-testing.module.ts`
- `libs/components/lookup/testing/src/legacy/search/search-fixture.spec.ts`
- `libs/components/tiles/testing/src/modules/tiles/tile-harness.spec.ts`
- `libs/components/tiles/testing/src/modules/tiles/tile-dashboard-harness.spec.ts`
- `libs/components/tiles/src/lib/modules/tiles/tile-content/tile-content-section.component.spec.ts`
- `libs/components/tiles/src/lib/modules/tiles/tile-dashboard/tile-dashboard.service.spec.ts`
- `libs/components/tiles/src/lib/modules/tiles/tile-dashboard/tile-dashboard.component.spec.ts`
- `libs/components/tiles/src/lib/modules/tiles/tile/tile.component.spec.ts`
- `libs/components/toast/testing/src/modules/toast/toaster-harness.spec.ts`
- `libs/components/lookup/testing/src/modules/selection-modal/fixtures/selection-modal-harness-test.module.ts`
- `libs/components/lookup/testing/src/modules/lookup/fixtures/lookup-harness-test.module.ts`
- `libs/components/lookup/testing/src/modules/autocomplete/fixtures/autocomplete-harness-test.module.ts`
- `libs/components/docs-tools/src/lib/modules/code-example-viewer/code-example-viewer.component.spec.ts`
- (and all `ag-grid` spec files using `provideNoopAnimations`)

**Important:** For each file removed, run the affected test suite to confirm nothing broke. If tests
start failing because a component relied on the DSL engine being present (e.g., a component's
`animations: [...]` array), that component itself still needs migration (see Step 4).

### Step 5 — Migrate any remaining DSL-based components

If step 3 reveals test failures caused by components that still use `animations: [...]` in their
`@Component` decorator, those components need to be migrated to CSS. The migration pattern is:

**Old (legacy DSL):**

```typescript
@Component({
  animations: [trigger('myTrigger', [
    state('open', style({ height: '*' })),
    state('closed', style({ height: 0 })),
    transition('open <=> closed', animate('150ms')),
  ])],
})
```

```html
<div [@myTrigger]="isOpen ? 'open' : 'closed'"></div>
```

**New (native CSS):**

```typescript
@Component({})
```

```html
<div [class.my-component-open]="isOpen"></div>
```

```scss
.my-component {
  height: 0;
  overflow: hidden;
  transition: height 150ms ease-in;

  &.my-component-open {
    height: auto; // or specific value
  }
}
```

For enter/leave (`:enter`/`:leave` DSL patterns), use `animate.enter`/`animate.leave`:

```html
<div animate.enter="my-enter-class" animate.leave="my-leave-class">...</div>
```

```scss
.my-enter-class {
  animation: my-enter-animation 150ms ease-in;
}

.my-leave-class {
  animation: my-leave-animation 150ms ease-out;
}
```

### Step 6 — Remove `provideNoopAnimations()` and `provideAnimations()` from `@angular/platform-browser/animations`

These are wrappers for `BrowserAnimationsModule`/`NoopAnimationsModule`. Files to clean up:

- `libs/components/filter-bar/src/lib/modules/filter-bar/filter-bar.component.spec.ts`
- `libs/components/docs-tools/src/lib/modules/code-example-viewer/code-example-viewer.component.spec.ts`
- `libs/components/docs-tools/src/lib/modules/code-example-viewer/stackblitz.service.ts` —
  **production code**, needs care; this generates an Angular bootstrap config for StackBlitz
- `libs/components/docs-tools/src/lib/modules/code-snippet/code-snippet-wrapper.component.spec.ts`
- All `ag-grid` spec files using `provideNoopAnimations()`

### Step 7 — Remove `@angular/animations` from `package.json`

Once all usages of the legacy DSL are gone from production code (steps 2–5), run:

```bash
npx nx run-many --target=test --all  # verify all tests pass
```

Then remove from `package.json`:

```json
"@angular/animations": "21.x.x"   // remove
```

Check `peer dependencies` in library `package.json` files under `libs/components/*/package.json`
and remove `@angular/animations` from `peerDependencies`/`dependencies` where present.

### Step 8 — Update `provideNoopSkyAnimations()` in `@skyux/theme`

`provideNoopSkyAnimations()` currently works by injecting CSS that sets `animation-duration` and
`transition-duration` to `0.01ms`. It has **no dependency on `@angular/animations`** and is the
correct approach going forward. However, its JSDoc example should be updated to use
`animationsEnabled: true` alongside it:

````typescript
/**
 * Use in unit tests alongside `animationsEnabled: true` to speed up
 * CSS animations while still allowing `animationend`/`transitionend` events to fire.
 *
 * @example
 * ```typescript
 * TestBed.configureTestingModule({
 *   animationsEnabled: true,
 *   imports: [MyComponent],
 *   providers: [provideNoopSkyAnimations()],
 * });
 * ```
 */
````

### Step 9 — Update `inline-form` `animate.enter`/`animate.leave` (no class name)

The `inline-form` template currently uses bare `animate.enter` / `animate.leave` without CSS class
names:

```html
<div class="sky-slide-dissolve-first" animate.enter animate.leave></div>
```

When no class name is provided, Angular applies a class derived from the element's tag. This is
unclear and fragile. Confirm how this resolves in practice and either supply explicit class names or
switch to `@starting-style` + CSS transitions if no post-animation callback is needed.

---

## Testing Rules (going forward)

| Scenario                                                                 | How to handle                                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Component uses pure CSS `transition`/`@keyframes`, no callback needed    | No animation config needed in tests — animations are off by default, element state is instant       |
| Component uses `animate.leave` and needs `animationend` for logic        | `animationsEnabled: true` + `provideNoopSkyAnimations()` + manually dispatch `animationend` in spec |
| Component uses `animate.leave` and you want the element removal to delay | `animationsEnabled: true` + `provideNoopSkyAnimations()` — element will be removed after `0.01ms`   |
| No animation-related behavior tested                                     | No config needed (default `animationsEnabled: false`)                                               |

### Manually dispatching `animationend` for `animate.leave` (critical)

Angular defers `animate.leave` class application via a fake timer (captured by `fakeAsync`). When
testing that `animationend` callbacks fire after a leave animation:

1. Trigger the removal (click, keyup, etc.)
2. Call `tick()` **before** `fixture.detectChanges()` — this is required for Angular to apply the
   `animate.leave` CSS class and set up its `animationend` listener
3. Call `fixture.detectChanges()`
4. Query for the leaving element **after** the tick: `element.querySelector('sky-token.sky-token-leave')`
5. Dispatch `animationend` on that element — Angular's animate.leave listener and the template
   `(animationend)` binding both fire synchronously within `dispatchEvent`
6. Call `fixture.detectChanges()` then `tick()` to process any deferred removal

```typescript
triggerButton.click();
tick(); // ← required: applies animate.leave class
fixture.detectChanges();

(
  element.querySelector('sky-token.sky-token-leave') as HTMLElement
)?.dispatchEvent(
  new AnimationEvent('animationend', {
    animationName: 'sky-token-leave-animation',
  }),
);
fixture.detectChanges();
tick();
```

**Do not** pre-capture the element before the removal — capture it after `tick()` using
the `.sky-token-leave` selector, which guarantees the element is in leave state and
Angular's listener is active.

**Never use:**

- `BrowserAnimationsModule` or `NoopAnimationsModule`
- `provideAnimations()` or `provideNoopAnimations()` from `@angular/platform-browser/animations`

---

## Checklist Summary

- [x] Step 1 — Fix `lookup-fixtures.module.ts`: remove `BrowserAnimationsModule`, use `animationsEnabled: true`
- [ ] Step 2 — Keep `skyAnimationSlide`/`skyAnimationEmerge` as deprecated; schedule removal for a future major version
- [ ] Step 3 — Audit existing CSS animation implementations (see 3a–3d above)
- [ ] Step 4 — Remove `NoopAnimationsModule`/`BrowserAnimationsModule` from all test fixtures (audit each test suite)
- [ ] Step 5 — Migrate any remaining component `animations: [...]` arrays to CSS
- [ ] Step 6 — Remove `provideNoopAnimations()`/`provideAnimations()` from all test and production files
- [ ] Step 7 — Remove `@angular/animations` from `package.json` and library peer dependencies
- [ ] Step 8 — Update `provideNoopSkyAnimations()` JSDoc
- [ ] Step 9 — Resolve bare `animate.enter`/`animate.leave` in `inline-form` (Step 3a)

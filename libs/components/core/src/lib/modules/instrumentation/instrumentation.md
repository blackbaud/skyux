# Component Instrumentation

How a SKY UX component that emits a user event finds the context a consumer
attached to it.

## Adding Context

### Option 1: Only certain SKY UX components get instrumentation context

The directive is applied via `hostDirectives` on each component we choose to
instrument, and its input is re-exposed on that component's selector.

```typescript
@Component({
  selector: 'sky-box',
  hostDirectives: [
    {
      directive: SkyInstrumentationContext,
      inputs: ['skyInstrumentationContext'],
    },
  ],
})
export class SkyBoxComponent {}
```

```html
<!-- Consumer imports SkyBoxComponent only. -->
<sky-box [skyInstrumentationContext]="{ foo: 'bar' }" />
```

Limitations:

- Consumers can only apply context on specific components, never on their own
  elements or on a wrapper describing a whole page region.
- Every instance pays for the directive whether or not anyone instruments it.
  The cost is an allocation and a node-injector slot per host — signal inputs
  are not dirty-checked, so there is no per-change-detection work — but it is
  unconditional, unlike options 2 and 3. It only matters at high instance
  counts such as grid rows and long repeaters.
- The input becomes part of each component's documented public API and cannot
  be removed within a major version. Rolling it out component by component also
  reads as arbitrary to consumers ("why `sky-box` but not `sky-button`?").
- `skyInstrumentationContext` must be an optional input. A host directive is
  always instantiated, so a required input that a consumer never binds throws
  NG0950 the moment we read it.

### Option 2: Anything can have instrumentation context, node injector

The directive keeps its selector and consumers apply it themselves. Angular's
node injector walks up the logical declaration tree, so the emitting component
sees any context declared at or above it:

```html
<!-- Same element as the emitter. -->
<some-button [skyInstrumentationContext]="{ foo: 'bar' }" />

<!-- Ancestor element. -->
<div [skyInstrumentationContext]="{ foo: 'bar' }"><some-button /></div>

<!-- Projected content — resolution follows where the content was declared. -->
<sky-box [skyInstrumentationContext]="{ foo: 'bar' }"><some-button /></sky-box>
```

Limitations:

- Consumers must add `SkyInstrumentationContext` to their own `imports`, and
  nothing at the call site hints that a given SKY UX component emits events.
- Context placed on a _descendant_ of the emitter is not visible. This is the
  non-obvious failure mode, and it is the inverse of what the examples above
  suggest.

### Option 3: Anything can have instrumentation context, DOM queries

The directive registers its element, and the emitter walks up from its own
element to find the nearest registered ancestor.

```typescript
@Component({
  imports: [SkyInstrumentationContext],
  selector: 'some-button',
  template: `<button type="button" [skyInstrumentationContext]="{ foo: 'bar' }">
    Click me
  </button>`,
})
export class SomeButton {}
```

Limitations:

- We would need to register DOM elements and do DOM traversal to find the
  nearest context. The registry must be a `WeakMap`, or keyed entries must be
  released on destroy, or it leaks.
- The emit call site needs its originating element, so the emitter has to
  inject `ElementRef` or `emit()` has to take the DOM event.
- From an Angular developer's perspective, it isn't obvious how it works and
  might confuse.

### Option 4: Options 1 and 2 together

The same directive can be applied via `hostDirectives` on high-value components
_and_ remain importable for arbitrary elements. Consumers get the zero-import
path on the components we instrument and an escape hatch everywhere else.

Limitations:

- Inherits the `input.required` constraint from option 1 and the silent-failure
  constraint from option 2.
- Two supported spellings to document and keep consistent.

## Constraints that apply to every option

Each of these needs an answer regardless of which option we pick.

### Overlays break the ancestor chain

`SkyOverlayService` creates overlay content with only an `EnvironmentInjector`
(see [overlay.service.ts](../overlay/overlay.service.ts) and
[overlay.component.ts](../overlay/overlay.component.ts)), so there is no
node-injector link back to the code that opened the overlay. The overlay is also
appended at the body level, so it is not a DOM descendant of the opener either.

Anything rendered through an overlay — modals, flyouts, dropdowns, tooltips,
autocomplete panels, lookup results — therefore resolves no context under any
option above. Covering them means explicitly handing context across the
boundary, most likely through `SkyOverlayConfig`.

### Nearest context only, no merging

Every option resolves a single nearest context. A page-level `{ tenantId }` and
a button-level `{ productId }` will not combine unless the directive walks up
and merges. Decide this before shipping: adding merge semantics later changes
what every existing listener receives.

### Missing context fails silently

Context is resolved optionally, so a consumer who forgets it gets events with no
context rather than an error. Decide whether that is acceptable, warned about in
dev mode, or reported to the listener as a distinct value.

### Context is typed `unknown`

Listeners must cast to do anything useful. Decide on a documented shape or a
generic before the first listener ships.

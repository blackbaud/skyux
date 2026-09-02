---
applyTo: '**/libs/components/**/*.directive.ts, **/libs/components/**/*.component.ts'
description: 'Pitfalls when adding `@angular/forms/signals` (`FormValueControl`/`FormCheckboxControl`) support to an existing custom form control directive or component.'
---

# SKY UX Instructions: Signal Forms Support on Existing Custom Controls

## Background

`blackbaud/skyux#4629` (support for `@angular/forms/signals`' `Field`
directive) introduced this pattern once already, in
`colorpicker-input.directive.ts`, and broke text-editor's toolbar
(`text-editor:test:ci`) in the process. Read this before adding
`FormValueControl`/`FormCheckboxControl` support to another directive or
component that already implements `ControlValueAccessor`.

## The pitfall: dropping `ControlValueAccessor` breaks existing consumers, silently

Do **not** replace an existing `ControlValueAccessor` (`NG_VALUE_ACCESSOR` /
`NG_VALIDATORS` providers) with `FormValueControl`-only support (`value`/
`disabled`/`touch` as `model()`/`input()`/`output()`, plus the `ngNoCva` host
attribute). `FormValueControl` is designed for the new `[field]` (`Field`)
directive from `@angular/forms/signals` — it is **not** a drop-in replacement
for classic reactive (`[formControl]`, `formControlName`) or template-driven
(`[ngModel]`) forms.

Consumers using the classic form directives on a `FormValueControl`-only
control do not error. They silently stop syncing (or, worse, partially sync
and corrupt state — see the reentrancy gotcha below). No exception, no
console warning. The only way this surfaced was a downstream consumer's own
test suite (`text-editor.component.spec.ts`) failing on an assertion about
rendered DOM state, days/commits removed from the actual regression.

**Before removing a CVA, grep the whole repo for consumers of the directive
first** (`grep -rn '<yourDirectiveSelector>' libs/ apps/`). A component's own
spec suite is not sufficient evidence of safety — this PR's own colorpicker
spec suite exercised `[formControl]` and `[field]`, but never `[ngModel]`,
and passed 99/99 while the regression was live.

## The fix: implement both, side by side

Keep the existing `ControlValueAccessor`/`Validator` implementation
(`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`,
`validate`) and _add_ the `FormValueControl` surface (`value` as a
`model()`, `touch` as an `output()`) alongside it. Do not add `ngNoCva`.

This works because Angular already has a well-established dual-support
mechanism for exactly this case:

- A directive's own `NG_VALUE_ACCESSOR` is preferred over the native
  `DefaultValueAccessor` that would otherwise match the host element
  (`selectValueAccessor` in `@angular/forms` picks the custom accessor over
  any built-in one), so `formControlName`/`[formControl]`/`[ngModel]` keep
  working unchanged.
- `@angular/forms/signals`' `Field` directive checks for a
  `ControlValueAccessor` first (`ɵngControlCreate`) and, when present, uses
  `cvaControlCreate` to bridge it to the field automatically — it only falls
  back to the `FormValueControl` (`customControlCreate`) path when no CVA is
  registered.

In other words: once a CVA is present, it becomes the single source of sync
for _all three_ form flavors. The `value`/`touch` (and any other
`FormUiControl` inputs) mainly exist to satisfy `FormValueControl`'s TypeScript
contract for callers that inspect it directly; the CVA methods do the real
work.

## Gotchas hit while doing this

1. **A `value`-mirroring `effect()` in the constructor can clobber a
   CVA-applied value.** If you keep an `effect(() => applyIncomingValue(this.value()))` from before the CVA existed, it still fires once
   with the model's default (usually `undefined`) — but only _after_
   `writeValue` has already applied the real starting value, because effects
   flush after the constructor runs, not during it. Delete this effect once
   a CVA exists; `writeValue` now owns applying incoming values for every
   form flavor.

2. **An `input()` named exactly `disabled` collides with classic
   `FormControlName`/`FormGroupDirective` setup.** With a CVA _and_ a
   sibling `disabled = input(false)` on the same directive, `_FormGroupDirective.addControl`/`FormControlName._setUpControl` can call
   `setDisabledState(true)` during initial setup, before the test or
   consumer ever calls `.disable()` — silently starting the control
   disabled. Once a CVA exists, drop the `disabled` input(); `setDisabledState`
   (called for every form flavor once a CVA is registered, including signal
   forms' `cvaControlCreate`) is sufficient.

3. **Eagerly injecting `@Self() NgControl` in the constructor plus providing
   `NG_VALUE_ACCESSOR` creates a circular dependency for `[field]` (signal
   forms) bindings.** `[field]`'s `NgControl` compatibility shim itself
   depends on resolving the host's value accessor first, so constructing
   both at once deadlocks (`NG0200: Circular dependency detected for
NgControl`). Resolve `NgControl` lazily instead — inject `Injector` in
   the constructor and call `injector.get(NgControl, null, { optional: true, self: true })` from within the method that needs it (e.g. inside
   `writeValue`), not as an eagerly-injected field.

## Test coverage to add

When adding `FormValueControl` support to an existing control, add (or
verify) test coverage for **all three** form flavors it must still support:
reactive (`[formControl]`/`formControlName`), template-driven (`[ngModel]`),
and signal forms (`[field]`). Passing signal-forms and reactive-forms tests
alone is not sufficient evidence that template-driven forms still work.

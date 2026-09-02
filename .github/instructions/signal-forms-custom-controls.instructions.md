---
applyTo: '**/libs/components/**/*.directive.ts, **/libs/components/**/*.component.ts'
description: 'Pitfalls when adding `@angular/forms/signals` (`FormField`) support to an existing custom form control directive or component.'
---

# SKY UX Instructions: Signal Forms Support on Existing Custom Controls

## Background

`blackbaud/skyux#4629` (support for `@angular/forms/signals`' `FormField`
directive) introduced this pattern once already, in
`colorpicker-input.directive.ts`, and broke text-editor's toolbar
(`text-editor:test:ci`) in the process. Read this before adding signal-forms
support to another directive or component that already implements
`ControlValueAccessor`.

All line references below are to `@angular/forms`'
`fesm2022/signals.mjs`/`fesm2022/_validation_errors-chunk.mjs` as shipped in
`22.1.2`; re-check them against the installed version if behavior seems off.

## The pitfall: dropping `ControlValueAccessor` breaks existing consumers, silently

Do **not** replace an existing `ControlValueAccessor` (`NG_VALUE_ACCESSOR` /
`NG_VALIDATORS` providers) with `FormValueControl`-only support (`value`/
`disabled`/`touch` as `model()`/`input()`/`output()`, plus the `ngNoCva` host
attribute). `FormValueControl` is designed for controls with no pre-existing
CVA — it is **not** a drop-in replacement for classic reactive
(`[formControl]`, `formControlName`) or template-driven (`[ngModel]`) forms.

Consumers using the classic form directives on a `FormValueControl`-only
control do not error. They silently stop syncing (or, worse, partially sync
and corrupt state — see the dirty-on-write gotcha below). No exception, no
console warning. The only way this surfaced was a downstream consumer's own
test suite (`text-editor.component.spec.ts`) failing on an assertion about
rendered DOM state, days/commits removed from the actual regression.

**Before removing a CVA, grep the whole repo for consumers of the directive
first** (`grep -rn '<yourDirectiveSelector>' libs/ apps/`). A component's own
spec suite is not sufficient evidence of safety — this PR's own colorpicker
spec suite exercised `[formControl]` and `[formField]`, but never `[ngModel]`,
and passed 99/99 while the regression was live.

## The fix: keep the CVA; do not also implement `FormValueControl`

Keep the existing `ControlValueAccessor`/`Validator` implementation
(`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`,
`validate`) untouched. Do **not** add `FormValueControl`'s `value`/`touch`
surface alongside it, and do not add `ngNoCva`.

This works because Angular already has a well-established dual-support
mechanism for exactly this case:

- A directive's own `NG_VALUE_ACCESSOR` is preferred over the native
  `DefaultValueAccessor` that would otherwise match the host element
  (`selectValueAccessor` in `@angular/forms` picks the custom accessor over
  any built-in one), so `formControlName`/`[formControl]`/`[ngModel]` keep
  working unchanged.
- `@angular/forms/signals`' `FormField` directive checks for a
  `ControlValueAccessor` first (`FormField.ɵngControlCreate`,
  `signals.mjs:1381-1394`): `if (this.controlValueAccessor) →
cvaControlCreate(...)`. It only falls back to the `FormValueControl` path
  (`customControlCreate`) when no CVA is registered.

Once a CVA is present, it becomes the single source of sync for _all three_
form flavors, through `cvaControlCreate` (`signals.mjs:990-1043`): it calls
`registerOnChange`/`registerOnTouched`, bridges `NG_VALIDATORS` (including
`registerOnValidatorChange`), calls `writeValue` when the field's value
changes, and calls `setDisabledState` when `disabled` changes.

**Do not additionally implement `FormValueControl`/`FormCheckboxControl` on a
class that has a CVA.** It has no effect and is actively misleading:
`cvaControlCreate` never calls `listenToCustomControlModel`,
`listenToCustomControlOutput('touch', …)`, or `setCustomControlModelInput` —
those only exist inside `customControlCreate` (`signals.mjs:958-968`), the
no-CVA branch. A `value = model()` or `touch = output()` added next to a CVA
is simply dead: `value` is never read by the framework (nothing sets it
under signal forms), and `touch` never fires from `[formField]`. Treat any such
member found during review as public-API debt to remove, not as
signal-forms support.

The **only** legitimate use of `FormValueControl`/`FormCheckboxControl` is a
control with no pre-existing CVA at all.

## Gotchas hit while doing this

1. **`onChange` unconditionally marks a signal-forms field dirty — never call
   it from a write path that isn't user-driven.** `cvaControlCreate`'s
   registered `onChange` feeds `state().controlValue`, and that signal's
   `set`/`update` always calls `markAsDirty()` before syncing
   (`_validation_errors-chunk.mjs:1539-1553` in the underlying field-node
   implementation) — there is no "silent" `onChange` under signal forms, unlike
   reactive forms' `{ emitEvent: false }`. Calling `onChange` (or the
   registered callback) from `writeValue`, `setDisabledState`, or any other
   externally-driven code path will mark the field dirty as soon as it loads.
   Only call it in response to an actual user action (typed input, selection,
   blur-triggered normalization the user caused, etc.).

2. **A `value`-mirroring `effect()` in the constructor can clobber a
   CVA-applied value.** If you keep an `effect(() => applyIncomingValue(this.value()))` from before the CVA existed, it still fires once
   with the model's default (usually `undefined`) — but only _after_
   `writeValue` has already applied the real starting value, because effects
   flush after the constructor runs, not during it. Delete this effect once
   a CVA exists; `writeValue` now owns applying incoming values for every
   form flavor, and (per the previous section) there is no `value` model to
   mirror in the first place once `FormValueControl` is dropped.

3. **An `input()` named exactly `disabled` collides with classic
   `FormControlName`/`FormGroupDirective` setup — not with signal forms.**
   With a CVA _and_ a sibling `disabled = input(false)` on the same directive,
   `FormGroupDirective.addControl`/`FormControlName._setUpControl` can call
   `setDisabledState(true)` during initial setup, before the test or consumer
   ever calls `.disable()` — silently starting the control disabled. This is a
   classic-forms-only hazard: under signal forms, `cvaControlCreate` reads the
   field's `disabled` state and calls both `setInputOnDirectives('disabled',
value)` and `setDisabledState(value)` symmetrically
   (`signals.mjs:1037-1041`), so a `disabled` input alongside a CVA is not
   itself a problem there. Still, once a CVA exists, prefer dropping the
   `disabled` input(); `setDisabledState` (called for every form flavor once a
   CVA is registered) is sufficient and avoids the classic-forms collision
   entirely.

4. **Eagerly injecting `@Self() NgControl` in the constructor plus providing
   `NG_VALUE_ACCESSOR` creates a circular dependency for `[formField]` (signal
   forms) bindings.** `FormField`'s `controlValueAccessor` getter itself
   calls `_selectValueAccessor(this.interopNgControl, ...)`
   (`signals.mjs:1311-1315`) to resolve the host's value accessor, so
   constructing both at once deadlocks (`NG0200: Circular dependency detected
for NgControl`). Resolve `NgControl` lazily instead — inject `Injector` in
   the constructor and call `injector.get(NgControl, null, { optional: true, self: true })` from within the method that needs it (e.g. inside
   `writeValue`), not as an eagerly-injected field.

## Consuming field state without reaching through `NgControl`

For state you need to _read_ (errors, touched, dirty, required, disabled, and
more — the full list is `signals.mjs`'s `FIELD_STATE_KEY_TO_CONTROL_BINDING`),
`cvaControlCreate` already pushes it to the host as directive inputs via
`host.setInputOnDirectives(name, value)` for every key in that map
(`signals.mjs:1035-1041`). Declaring an `input()` with a matching name
(`errors`, `touched`, `dirty`, `required`, `invalid`, `readonly`, `min`,
`max`, `minLength`, `maxLength`, `pattern`, `name`, `hidden`, `pending`) is
often simpler and more idiomatic than injecting `NgControl`, duck-typing it
with `skyIsAbstractControl`, and manually triggering change detection with
`skyWatchFormFieldChanges` — reach for the latter only when the control
already has established imperative logic built around `NgControl` that isn't
worth restructuring.

When you do need to distinguish a real `AbstractControl` from the read-only
interop object `[formField]` provides through `NgControl`
(`InteropNgControl`, `signals.mjs:717-777`): that object does not extend
`AbstractControl` and simply has no `markAsTouched`, `markAsDirty`,
`markAsPristine`, `setValue`, or `setErrors` methods (it does not throw when
you call one that doesn't exist — the property is `undefined`, so calling it
throws a plain `TypeError`, not something specific to signal forms).
`skyIsAbstractControl` (`@skyux/forms`) checks this with `instanceof
AbstractControl`, which is exact — prefer it over duck-typing on any one
method.

## Test coverage to add

When adding signal-forms support to an existing control, add (or verify)
test coverage for **all three** form flavors it must still support:
reactive (`[formControl]`/`formControlName`), template-driven (`[ngModel]`),
and signal forms (`[formField]`). Passing signal-forms and reactive-forms tests
alone is not sufficient evidence that template-driven forms still work.

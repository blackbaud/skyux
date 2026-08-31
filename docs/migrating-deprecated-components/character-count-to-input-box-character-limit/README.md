# Migrating character count to the input box character limit

This guide covers how to replace the deprecated character count components with
the `characterLimit` input on `sky-input-box`. The input box renders the
character count label, adds the max length validator to the form control, and
displays the over-the-limit error message for you.

## 🔍 Workspace search requirements

**Before making any changes**, search the workspace for all usages of the
deprecated API. Only process files that are not excluded by the project's
`.gitignore`.

Search patterns:

- `skyCharacterCounter` — covers the directive and its `skyCharacterCounterIndicator`
  and `skyCharacterCounterLimit` inputs.
- `sky-character-counter-indicator` — the indicator component in templates.
- `SkyCharacterCounterModule` — module imports in `*.module.ts` and standalone
  `@Component` `imports` arrays.
- `SkyCharacterCounterIndicatorComponent`, `SkyCharacterCounterInputDirective`,
  `SkyCharacterCounterScreenReaderPipe` — direct class references.
- `SkyCharacterCounterIndicatorHarness` and `getCharacterCounter` — deprecated
  harness usage in `*.spec.ts` files.

## Deprecated API

Everything below is deprecated in `@skyux/forms` and is replaced by a single
input:

| Deprecated                             | Replacement                                 |
| -------------------------------------- | ------------------------------------------- |
| `SkyCharacterCounterModule`            | `SkyInputBoxModule`                         |
| `skyCharacterCounter` directive        | `sky-input-box` `characterLimit` input      |
| `[skyCharacterCounterLimit]`           | `[characterLimit]` on `sky-input-box`       |
| `[skyCharacterCounterIndicator]`       | Nothing — the input box renders the count   |
| `<sky-character-counter-indicator />`  | Nothing — the input box renders the count   |
| `SkyCharacterCounterScreenReaderPipe`  | Nothing — the input box announces the count |
| `skyCharacterCounter` validation error | Angular's `maxlength` error                 |

## Prerequisites

1. The input must be inside a `sky-input-box`. If the deprecated character
   counter was used outside an input box, wrap the input in one first.
2. The `sky-input-box` must specify `labelText`. The built-in error message
   ("Limit {labelText} to {limit} characters.") uses it.
3. The input must be bound to an Angular form control (`formControlName`,
   `[formControl]`, or `ngModel`). The input box adds `Validators.maxLength` to
   that control.

## Migration steps

### 1. Move the limit to the input box

Set `characterLimit` on `sky-input-box` and delete the `skyCharacterCounter`
directive, its inputs, and the `sky-character-counter-indicator` element.

```html
<!-- Before -->
<sky-input-box labelText="Transaction description">
  <sky-character-counter-indicator #descriptionIndicator />

  <input
    class="sky-form-control"
    formControlName="description"
    skyCharacterCounter
    type="text"
    [skyCharacterCounterIndicator]="descriptionIndicator"
    [skyCharacterCounterLimit]="50"
  />
</sky-input-box>
```

```html
<!-- After -->
<sky-input-box characterLimit="50" labelText="Transaction description">
  <input formControlName="description" type="text" />
</sky-input-box>
```

Notes:

- `characterLimit` accepts a number or a numeric string, so both
  `characterLimit="50"` and `[characterLimit]="maxCharacterCount"` work.
- Remove `class="sky-form-control"` from the input. The input box adds it
  automatically. Keep any other classes on the element.
- Remove the template reference variable that pointed at the indicator
  (`#descriptionIndicator` above) and any component code that read it.

### 2. Delete the custom error markup

The deprecated directive required consumers to render their own error message.
The input box renders it, so delete the hand-written error element, the
`skyId`/`aria-describedby` wiring that supported it, and any check for the
`skyCharacterCounter` error key.

```html
<!-- Before -->
<sky-input-box labelText="Transaction description">
  <sky-character-counter-indicator #descriptionIndicator />

  <input
    class="sky-form-control"
    formControlName="description"
    skyCharacterCounter
    skyId
    type="text"
    [attr.aria-describedby]="characterCountError.id"
    [skyCharacterCounterIndicator]="descriptionIndicator"
    [skyCharacterCounterLimit]="maxDescriptionCharacterCount"
  />

  <span #characterCountError="skyId" class="sky-error-indicator" skyId>
    @if (description.errors?.['skyCharacterCounter']) {
    <sky-status-indicator descriptionType="error" indicatorType="danger">
      Limit Transaction description to {{ maxDescriptionCharacterCount }}
      characters.
    </sky-status-indicator>
    }
  </span>
</sky-input-box>
```

```html
<!-- After -->
<sky-input-box
  labelText="Transaction description"
  [characterLimit]="maxDescriptionCharacterCount"
>
  <input formControlName="description" type="text" />
</sky-input-box>
```

If your application inspected the validation error directly, update the key.
The input box uses Angular's max length validator:

```typescript
// Before
const invalid = control.errors?.['skyCharacterCounter'];

// After
const invalid = control.errors?.['maxlength'];
```

### 3. Update imports

Remove `SkyCharacterCounterModule` and add `SkyInputBoxModule` if it isn't
already imported. Only change the modules or standalone components that
actually declared the migrated template.

```typescript
// Before
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';

@Component({
  imports: [ReactiveFormsModule, SkyCharacterCounterModule, SkyInputBoxModule],
  // ...
})
```

```typescript
// After
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  imports: [ReactiveFormsModule, SkyInputBoxModule],
  // ...
})
```

Also drop any imports that existed only to support the deleted error markup,
such as `SkyStatusIndicatorModule` from `@skyux/indicators` or `SkyIdModule`
from `@skyux/core`. Verify they aren't used elsewhere in the same template
before removing them.

### 4. Update unit tests

`SkyInputBoxHarness.getCharacterCounter()` and
`SkyCharacterCounterIndicatorHarness` are deprecated. Use the character limit
methods on `SkyInputBoxHarness` instead.

```typescript
// Before
const counter = await inputBoxHarness.getCharacterCounter();

await expectAsync(counter.getCharacterCount()).toBeResolvedTo(3);
await expectAsync(counter.getCharacterCountLimit()).toBeResolvedTo(50);
await expectAsync(counter.isOverLimit()).toBeResolvedTo(false);
```

```typescript
// After
await expectAsync(inputBoxHarness.getCharacterCount()).toBeResolvedTo(3);
await expectAsync(inputBoxHarness.getCharacterLimit()).toBeResolvedTo(50);
await expectAsync(inputBoxHarness.isOverCharacterLimit()).toBeResolvedTo(false);
```

Assertions against a hand-written error element should be replaced with the
input box's built-in max length error assertion:

```typescript
await expectAsync(inputBoxHarness.hasMaxLengthError()).toBeResolvedTo(true);
```

## ✅ Validation checklist

Before considering the migration complete, confirm that:

- [ ] No `skyCharacterCounter`, `skyCharacterCounterLimit`,
      `skyCharacterCounterIndicator`, or `sky-character-counter-indicator`
      usages remain.
- [ ] No `SkyCharacterCounterModule` imports remain.
- [ ] Every migrated `sky-input-box` sets both `labelText` and `characterLimit`.
- [ ] Every migrated input is bound to a form control.
- [ ] Hand-written character-limit error markup and its supporting `skyId` /
      `aria-describedby` bindings are deleted.
- [ ] Code that read the `skyCharacterCounter` error key now reads `maxlength`.
- [ ] Unit tests use `getCharacterCount()`, `getCharacterLimit()`, and
      `isOverCharacterLimit()`.
- [ ] Tests pass and lint is clean.

## ❌ Common mistakes to avoid

- Leaving `sky-character-counter-indicator` in the template alongside
  `characterLimit`. The input box projects the deprecated indicator for
  backward compatibility, so you will see two counts.
- Setting `characterLimit` without `labelText`. The error message interpolates
  the label, so it reads poorly without one.
- Setting `characterLimit` on an input that has no form control. The max length
  validator is added to the control, so validation silently does nothing
  without one.
- Keeping the custom `sky-status-indicator` error, which duplicates the
  built-in message.
- Using `characterLimit` as a general max length constraint. It is intended for
  inputs where users are likely to approach the limit. For other inputs, use
  Angular's `maxlength` validator and a `maxLength` attribute on the input
  element instead.

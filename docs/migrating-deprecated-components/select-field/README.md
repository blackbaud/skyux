# Migration Instructions: sky-select-field to sky-lookup

## Project Context & Requirements

### Environment

- **Angular**: 19+
- **TypeScript**: >=5.5.0 <5.9.0
- **TypeScript Strict Mode**: May or may not be enabled (migration should support strict mode)
- **Testing**: Karma/Jasmine
- **SSR/Hydration**: Not required

### Migration Constraints

- **No Breaking Changes**: Preserve all inputs/outputs from converted components
- **Form Compatibility**: Support both Reactive Forms and Template-driven forms
- **Data Models**: Maintain same HTTP call data models
- **CSS/Attributes**: Preserve non-sky-\* CSS classes and data-\* attributes
- **Form State**: Preserve disabled states, touched/dirty status, async validator timing
- **APIs**: Use only documented Angular 19 APIs and existing sky-lookup APIs

## Quick Reference

### Most Common Patterns

**Basic Replacement:**

- `sky-select-field` → `sky-lookup` (wrapped in `sky-input-box` if static label exists)
- Always add: `descriptorProperty="label"` `idProperty="id"` `enableShowMore`
- Wrap observables: `[data]="(dataStream | async) ?? []"`
- **showMoreConfig**: Always define inline in template - NEVER create TypeScript property

**Critical Value Change (Single Select Only):**

- **Single select** = `selectMode="single"` (default is `selectMode="multiple"`)
- Single select: `value.property` → `value[0].property`
- Form controls: `FormControl<MyObject>` → `FormControl<MyObject[]>`
- **Multiple select** = `selectMode="multiple"` (default) - no value access changes needed

**Use sky-input-box Decision Tree:**

- Static label text → YES, use `<sky-input-box labelText="..." stacked>`
- `aria-labelledby` attribute → NO, use `sky-lookup` only
- Conditional label (`*ngIf`, ternary) → NO, use `sky-lookup` only
- No visible label → NO, use `sky-lookup` only

**Required Test Updates:**

- Add `provideNoopAnimations()` to test providers
- Import `SkyLookupModule` + `SkyInputBoxModule` in tests
- Update single select assertions: `expect(value[0])` instead of `expect(value)`

## Step-by-Step Migration

### 1. Install Packages and Update Imports

```bash
npm install @skyux/lookup @skyux/forms
```

**Standalone Component:**

```typescript
import { SkyLookupModule } from '@skyux/lookup';
import { SkyInputBoxModule } from '@skyux/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [
    SkySelectFieldModule,  // Keep during migration
    SkyLookupModule,       // Add new
    SkyInputBoxModule,     // Add new
    AsyncPipe,
    // ...existing imports
  ],
})
```

**NgModule:**

```typescript
@NgModule({
  imports: [
    SkySelectFieldModule,  // Keep during migration
    SkyLookupModule,       // Add new
    SkyInputBoxModule,     // Add new
    // ...existing imports
  ],
})
```

### 2. Update Form Controls (Single Select CRITICAL)

⚠️ **Only applies to `selectMode="single"`** - Multiple select (`selectMode="multiple"`) already uses arrays

```typescript
// Before - single object
myControl = new FormControl<MyObject | null>(null);

// After - array for all modes
myControl = new FormControl<MyObject[]>([]);

// Form initialization
this.form = this.fb.group({
  singleSelect: [{ id: '1', name: 'Item' }], // Array now
  multiSelect: [{ id: '1', name: 'Item' }], // Array (unchanged)
});
```

### 3. Update NgModel Bindings (Template Forms)

⚠️ **Only applies to `selectMode="single"`** - Multiple select already uses arrays

```typescript
// Before
@Component({
  template: `<sky-select-field [(ngModel)]="selectedItem">`
})
class MyComponent {
  selectedItem: MyObject | undefined;
}

// After
@Component({
  template: `<sky-lookup [(ngModel)]="selectedItems">`
})
class MyComponent {
  selectedItems: MyObject[] = []; // Array now

  // Getter for backward compatibility
  get selectedItem(): MyObject | undefined {
    return this.selectedItems[0];
  }
}
```

### 4. Update Value Access (CRITICAL)

<!-- prettier-ignore-start -->
```typescript
// Before - direct object access
onSelectionChange(value: MyObject | undefined) {
  if (value) {
    console.log(value.id);
  }
}

// After - array access with [0]
onSelectionChange(value: MyObject[] | undefined) {
  if (value && value.length > 0) {
    console.log(value[0].id); // Must use [0]
  }
}

// Form value access
const selectedItem = this.form.get('field')?.value?.[0]; // Use [0]
```
<!-- prettier-ignore-end -->

### 5. Update Tests

**Add required providers:**

```typescript
TestBed.configureTestingModule({
  imports: [
    SkyLookupModule,
    SkyInputBoxModule,
    // ...existing imports
  ],
  providers: [
    provideNoopAnimations(), // REQUIRED for sky-lookup
    // ...existing providers
  ],
});
```

**Update test assertions:**

```typescript
// Before
expect(component.selectedValue).toBe(expectedObject);

// After - use array for single select
expect(component.selectedValue).toEqual([expectedObject]);
```

**Update label tests to use SkyInputBoxHarness:**

```typescript
// After (use harness)
import { SkyInputBoxHarness } from '@skyux/forms/testing';

// Before (fails after migration)
const label = fixture.nativeElement.querySelector('.sky-control-label');
expect(label.innerHTML).toContain('Department');

const inputBoxHarness = await loader.getHarness(
  SkyInputBoxHarness.with({ selector: '[data-sky-id="department-field"]' }),
);
expect(await inputBoxHarness.getLabelText()).toBe('Department');
```

### 6. Template Migration Patterns

#### Pattern A: With sky-input-box (clear static label)

```html
<!-- Before -->
<div>
  <label class="sky-control-label">Department</label>
  <sky-select-field formControlName="field" [data]="dataStream">
  </sky-select-field>
</div>

<!-- After -->
<sky-input-box labelText="Department" stacked>
  <sky-lookup
    formControlName="field"
    [data]="(dataStream | async) ?? []"
    descriptorProperty="label"
    idProperty="id"
    enableShowMore
  >
  </sky-lookup>
</sky-input-box>
```

#### Pattern B: Without sky-input-box (aria-labelledby)

```html
<!-- Before -->
<span id="field-label">Department Selection</span>
<sky-select-field formControlName="field" [ariaLabelledBy]="'field-label'">
</sky-select-field>

<!-- After -->
<span id="field-label">Department Selection</span>
<sky-lookup
  formControlName="field"
  [data]="(dataStream | async) ?? []"
  [ariaLabelledBy]="'field-label'"
  descriptorProperty="label"
  idProperty="id"
  enableShowMore
>
</sky-lookup>
```

#### Pattern C: Without sky-input-box (conditional/no label)

```html
<!-- Before: Conditional label -->
<label class="sky-control-label" *ngIf="showLabel">{{dynamicLabel}}</label>
<sky-select-field formControlName="field" [data]="dataStream">
</sky-select-field>

<!-- Before: No label -->
<sky-select-field [ariaLabel]="'Select department'"> </sky-select-field>

<!-- After: Preserve existing label structure -->
<label class="sky-control-label" *ngIf="showLabel">{{dynamicLabel}}</label>
<sky-lookup
  formControlName="field"
  [data]="(dataStream | async) ?? []"
  [ariaLabel]="'Select department'"
  descriptorProperty="label"
  idProperty="id"
  enableShowMore
>
</sky-lookup>
```

### 7. Required Attribute Updates

**Always add these to sky-lookup:**

- `descriptorProperty="label"`
- `idProperty="id"`
- `enableShowMore`
- Wrap observables: `[data]="(dataStream | async) ?? []"`

**Attribute mappings:**

| sky-select-field               | sky-lookup           |
| ------------------------------ | -------------------- |
| `descriptorKey`                | `descriptorProperty` |
| `singleSelectPlaceholderText`  | `placeholderText`    |
| `multipleSelectOpenButtonText` | `placeholderText`    |
| `showAddNewRecordButton`       | `showAddButton`      |
| `(addNewRecordButtonClick)`    | `(addClick)`         |

**Convert customPicker to showMoreConfig:**

⚠️ **CRITICAL: Always define `showMoreConfig` as an inline object in the template - DO NOT create a TypeScript property**

**Before:**

```html
<sky-select-field pickerHeading="Select Items" [customPicker]="myCustomPicker">
</sky-select-field>
```

**After:**

```html
<sky-lookup
  [showMoreConfig]="{
    nativePickerConfig: { title: 'Select Items' },
    customPicker: myCustomPicker
  }"
>
</sky-lookup>
```

**Convert pickerHeading with resource pipe:**

```html
<!-- Before -->
<sky-select-field pickerHeading="{{ 'Select Items' | skyAppResources }}">
</sky-select-field>

<!-- After -->
<sky-lookup
  [showMoreConfig]="{
    nativePickerConfig: { title: ( 'Select Items' | skyAppResources ) }
  }"
>
</sky-lookup>
```

**Note:** If only `customPicker` exists, omit `nativePickerConfig`. If only `pickerHeading` exists, omit `customPicker`.

## Core Transformation Patterns

### 1. Component Replacement with Label

**When to use sky-input-box:** Only when there is clear, static label text that can be moved to `labelText` attribute.

**Before:**

```html
<div>
  <label class="sky-control-label">Department</label>
  <sky-select-field
    [data]="myData"
    [value]="myValue"
    [descriptorProperty]="'name'"
    [selectMode]="'single'"
    (selectionChange)="onSelectionChange($event)"
  >
  </sky-select-field>
</div>
```

**After:**

```html
<sky-input-box labelText="Department" stacked>
  <sky-lookup
    [data]="myData"
    [value]="myValue"
    [descriptorProperty]="'name'"
    [selectMode]="'single'"
    (selectionChange)="onSelectionChange($event)"
  >
  </sky-lookup>
</sky-input-box>
```

### 2. Component Replacement without sky-input-box

**When NOT to use sky-input-box:** When labels use `aria-labelledby`, conditional logic, or no clear label exists.

**Before (aria-labelledby):**

```html
<span id="dept-label">Select Department</span>
<sky-select-field
  [data]="myData"
  [ariaLabelledBy]="'dept-label'"
  [selectMode]="'single'"
>
</sky-select-field>
```

**After (preserve existing label structure):**

```html
<span id="dept-label">Select Department</span>
<sky-lookup
  [data]="myData"
  [ariaLabelledBy]="'dept-label'"
  [selectMode]="'single'"
>
</sky-lookup>
```

**Before (conditional label):**

```html
<label class="sky-control-label" *ngIf="showLabel">{{labelText}}</label>
<sky-select-field [data]="myData" [selectMode]="'single'"> </sky-select-field>
```

**After (preserve conditional logic):**

```html
<label class="sky-control-label" *ngIf="showLabel">{{labelText}}</label>
<sky-lookup [data]="myData" [selectMode]="'single'"> </sky-lookup>
```

**Before (no label):**

```html
<sky-select-field
  [data]="myData"
  [ariaLabel]="'Select option'"
  [selectMode]="'single'"
>
</sky-select-field>
```

**After (no wrapper needed):**

```html
<sky-lookup
  [data]="myData"
  [ariaLabel]="'Select option'"
  [selectMode]="'single'"
>
</sky-lookup>
```

### 3. Critical Value Access Change (Single Select)

**Before (sky-select-field):**

<!-- prettier-ignore-start -->
```typescript
// Value is the object directly
onSelectionChange(value: MyObject | undefined) {
  if (value) {
    console.log(value.id); // Direct access
  }
}
```
<!-- prettier-ignore-end -->

**After (sky-lookup):**

<!-- prettier-ignore-start -->
```typescript
// Value is always an array, even for single select
onSelectionChange(value: MyObject[] | undefined) {
  if (value && value.length > 0) {
    console.log(value[0].id); // Must access [0]
  }
}
```
<!-- prettier-ignore-end -->

### 4. Module Import Patterns

**Standalone Component:**

```typescript
import { SkyLookupModule } from '@skyux/lookup';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  imports: [SkyLookupModule, SkyInputBoxModule],
  // ... rest of component
})
```

**NgModule:**

```typescript
// Keep existing SkySelectFieldModule during partial migration
imports: [
  SkySelectFieldModule, // Keep during transition
  SkyLookupModule, // Add new
  SkyInputBoxModule, // Add new
];
```

### 5. Required Test Updates

**Test Setup (Add to beforeEach):**

```typescript
TestBed.configureTestingModule({
  providers: [provideNoopAnimations()], // Required for sky-lookup
  // ... existing providers
});
```

**Test Assertion Updates:**

```typescript
// Before: sky-select-field
expect(component.selectedValue).toBe(expectedObject);

// After: sky-lookup (single select)
expect(component.selectedValue).toEqual([expectedObject]);

// After: sky-lookup (multi select) - no change needed
expect(component.selectedValues).toEqual(expectedArray);
```

## Attribute Mapping Reference

| sky-select-field       | sky-lookup             | Notes                        |
| ---------------------- | ---------------------- | ---------------------------- |
| `[data]`               | `[data]`               | Direct mapping               |
| `[value]`              | `[value]`              | Single select: becomes array |
| `[descriptorProperty]` | `[descriptorProperty]` | Direct mapping               |
| `[selectMode]`         | `[selectMode]`         | Direct mapping               |
| `[disabled]`           | `[disabled]`           | Direct mapping               |
| `[required]`           | `[required]`           | Direct mapping               |
| `(selectionChange)`    | `(selectionChange)`    | Value format changes         |
| `[placeholderText]`    | `[placeholderText]`    | Direct mapping               |
| `[searchFilters]`      | `[searchFilters]`      | Direct mapping               |
| `[ariaLabel]`          | `[ariaLabel]`          | Direct mapping               |
| `[ariaLabelledBy]`     | `[ariaLabelledBy]`     | Direct mapping               |

## Error Handling Patterns

### Missing sky-input-box Wrapper

**Error:** Component styling broken or layout issues
**Fix:** Always wrap sky-lookup in `<sky-input-box stacked>` **only when clear static label text exists**

**Do NOT use sky-input-box when:**

- Labels use `ariaLabelledBy` or `aria-labelledby` attributes
- Labels have conditional logic (`*ngIf`, `@if`, ternary operators)
- No clear label text exists (only `ariaLabel` used)
- Complex label structures that can't be simplified to `labelText` attribute

### Incorrect Value Access

**Error:** `Cannot read property 'id' of undefined`
**Fix:** Change `value.property` to `value[0].property` for single select

### Missing Animation Provider

**Error:** test failure mentions `BrowserAnimationsModule`, `provideAnimations`, `NoopAnimationsModule`, or `provideNoopAnimations`
**Fix:** Add `provideNoopAnimations()` to test providers

### Form Control Type Mismatch

**Error:** TypeScript error on form control value
**Fix:** Update FormControl type from `MyObject` to `MyObject[]`

### Incorrect showMoreConfig Usage

**Error:** Creating TypeScript property for `showMoreConfig`
**Fix:** Always define `showMoreConfig` as inline object in template

**Wrong:**

```typescript
// DON'T DO THIS
export class MyComponent {
  showMoreConfig = {
    nativePickerConfig: { title: 'Select Items' },
  };
}
```

**Correct:**

```html
<!-- DO THIS -->
<sky-lookup
  [showMoreConfig]="{
    nativePickerConfig: { title: 'Select Items' }
  }"
>
</sky-lookup>
```

### Label Test Failures

**Error:** `Cannot read properties of null (reading 'innerHTML')` when tests look for `.sky-control-label`
**Fix:** Update tests to use `SkyInputBoxHarness` and `getLabelText()` method
**Pattern:** Tests accessing `querySelector('.sky-control-label')?.innerHTML` must use harness instead

**Before (failing after migration):**

<!-- prettier-ignore-start -->
```typescript
// Test looking for old sky-control-label
const labelElement = fixture.nativeElement.querySelector('.sky-control-label');
expect(labelElement.innerHTML).toContain('Department');

// Page object method accessing old label
getSelectFieldLabel(): string {
  return this.fixture.nativeElement.querySelector('.sky-control-label')?.innerHTML;
}
```
<!-- prettier-ignore-end -->

**After (use SkyInputBoxHarness):**

<!-- prettier-ignore-start -->
```typescript
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { expectAsync } from '@skyux-sdk/testing'; // If using skyAppResources pipe

// Test using harness for static label text
it('should display correct label', async () => {
  const inputBoxHarness = await loader.getHarness(
    SkyInputBoxHarness.with({ selector: '[data-sky-id="department-field"]' })
  );
  expect(await inputBoxHarness.getLabelText()).toBe('Department');
});

// Test using harness for resource pipe labels
it('should display localized label', async () => {
  const inputBoxHarness = await loader.getHarness(
    SkyInputBoxHarness.with({ selector: '[data-sky-id="department-field"]' })
  );
  await expectAsync(await inputBoxHarness.getLabelText()).toEqualResourceText('department_label');
});

// Updated page object method
async getInputBoxLabelText(): Promise<string> {
  const inputBoxHarness = await this.loader.getHarness(
    SkyInputBoxHarness.with({ selector: '[data-sky-id="field-id"]' })
  );
  return await inputBoxHarness.getLabelText();
}
```
<!-- prettier-ignore-end -->

**Setup harness loader in test:**

```typescript
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('Component', () => {
  let loader: HarnessLoader;

  beforeEach(() => {
    // ... existing setup
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
});
```

**Add data-sky-id for reliable harness selection:**

```html
<!-- Add data-sky-id to migrated sky-input-box for test targeting -->
<sky-input-box labelText="Department" stacked data-sky-id="department-field">
  <sky-lookup formControlName="department"> </sky-lookup>
</sky-input-box>
```

### Missing Module Imports in Tests

**Error:** `If 'sky-input-box' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.`
**Fix:** Add `SkyInputBoxModule` to test imports
**Also occurs for:** `sky-lookup` element when `SkyLookupModule` is missing from test imports

```typescript
// Add missing modules to TestBed configuration
TestBed.configureTestingModule({
  imports: [
    SkyInputBoxModule, // Required for sky-input-box
    SkyLookupModule, // Required for sky-lookup
    // ... other existing imports
  ],
  providers: [provideNoopAnimations()],
});
```

## Form Integration Patterns

### Reactive Forms (Single Select)

<!-- prettier-ignore-start -->
```typescript
// Before
myControl = new FormControl<MyObject | null>(null);

// After
myControl = new FormControl<MyObject[]>([]);

// Template binding stays the same
[formControl]="myControl";
```
<!-- prettier-ignore-end -->

### Template-Driven Forms

```typescript
// Before
@Component({
  template: `<sky-select-field [(ngModel)]="selectedItem">`
})
class MyComponent {
  selectedItem: MyObject | undefined;
}

// After
@Component({
  template: `<sky-lookup [(ngModel)]="selectedItems">`
})
class MyComponent {
  selectedItems: MyObject[] = [];

  // Getter for backward compatibility
  get selectedItem(): MyObject | undefined {
    return this.selectedItems[0];
  }
}
```

## Decision Tree for Edge Cases

### Custom Validators

- **If validator checks object properties:** Update to check `value[0]?.property`
- **If validator checks array length:** No changes needed
- **If async validator:** Preserve timing with `updateOn: 'blur'`

### Complex Data Models

- **If data contains nested objects:** Verify `descriptorProperty` path still works
- **If data is observable:** No changes needed
- **If data filtering is custom:** Test search behavior matches

### CSS and Accessibility

- **Preserve `class` attributes:** Move to sky-lookup element
- **Preserve `data-*` attributes:** Move to sky-lookup element
- **Preserve `aria-*` attributes:** Move to sky-lookup element
- **Custom CSS selectors:** Update to target sky-lookup instead of sky-select-field

## Validation Checklist

### Partial Migration Checklist

- [ ] Both `SkySelectFieldModule` and `SkyLookupModule` imported in component/module
- [ ] Wrap `sky-select-field` in `sky-input-box` **only when clear static label text exists**
- [ ] For `ariaLabelledBy`, conditional labels, or no labels: use `sky-lookup` without `sky-input-box`
- [ ] Required attributes added to migrated fields: `descriptorProperty="label"`, `idProperty="id"`, `enableShowMore`
- [ ] All migrated data bindings use `(observable | async) ?? []`
- [ ] Form value access updated for migrated single select fields (use `[0]`)
- [ ] Form initialization uses arrays for migrated single select fields
- [ ] Tests updated with `provideNoopAnimations()` for sky-lookup
- [ ] Add `SkyInputBoxModule` + `SkyLookupModule` to test imports (avoid CUSTOM_ELEMENTS_SCHEMA errors)
- [ ] Update label tests to use `SkyInputBoxHarness.getLabelText()` (only for `sky-input-box` cases)

### Complete Migration Checklist

- [ ] All `<sky-select-field>` tags removed from codebase (`grep -r "sky-select-field" src/`)
- [ ] All `SkySelectFieldModule` imports removed (`grep -r "SkySelectFieldModule" src/`)
- [ ] All single select form controls use array initialization
- [ ] All single select value access uses `[0]` notation
- [ ] `@skyux/select-field` package removed from dependencies
- [ ] All tests pass without `SkySelectFieldModule`

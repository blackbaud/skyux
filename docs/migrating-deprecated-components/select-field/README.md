# Migration Instructions: sky-select-field to sky-lookup

## Overview

The `sky-select-field` component is deprecated and should be replaced with `sky-lookup`. This guide provides comprehensive instructions for manual migration, covering template changes, module updates, form value handling, and accessibility improvements.

## Architecture Migration Path

### Determine Your Current Setup

```typescript
// Standalone Component (Angular 14+)
@Component({
  standalone: true, // or default true
  imports: [SkySelectFieldModule]
})

// NgModule Component
@Component({
  standalone: false
})
// with module that imports SkySelectFieldModule
```

### Migration Steps by Architecture

**For Standalone Components:**

1. Update component imports directly
2. Add `AsyncPipe` to imports
3. Update template

**For NgModule Components:**

1. Update module imports
2. Ensure `CommonModule` is imported for `AsyncPipe`
3. Update component template
4. Update component tests

## Step 1: Update Module Dependencies

### Add Required Imports

Replace `SkySelectFieldModule` with the required modules:

```typescript
// Before
import { SkySelectFieldModule } from '@skyux/select-field';

@Component({
  imports: [SkySelectFieldModule, ReactiveFormsModule]
})

// After
import { SkyLookupModule } from '@skyux/lookup';
import { SkyInputBoxModule } from '@skyux/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [SkyLookupModule, SkyInputBoxModule, ReactiveFormsModule, AsyncPipe]
})
```

### Update NgModule (if using modules instead of standalone)

```typescript
// Before
@NgModule({
  imports: [SkySelectFieldModule, CommonModule]
})

// After
@NgModule({
  imports: [SkyLookupModule, SkyInputBoxModule, CommonModule]
})
```

### Add Package Dependencies

Install the required packages:

```bash
npm install @skyux/lookup @skyux/forms
```

## Step 2: Template Migration

### Basic Template Structure

**Before:**

```html
<div class="form-group">
  <label class="sky-control-label">Environment Ids</label>
  <sky-select-field
    formControlName="environmentIds"
    [data]="environmentIdsStream"
    multipleSelectOpenButtonText="Select"
    pickerHeading="Environment Ids"
  >
  </sky-select-field>
</div>
```

**After:**

```html
<sky-input-box labelText="Environment Ids">
  <sky-lookup
    formControlName="environmentIds"
    [data]="(environmentIdsStream | async) ?? []"
    descriptorProperty="label"
    idProperty="id"
    enableShowMore
  >
  </sky-lookup>
</sky-input-box>
```

### Single Select Mode

**Before:**

```html
<div class="form-group">
  <label class="sky-control-label">Value Aggregate Function</label>
  <sky-select-field
    formControlName="valueAggregateFunction"
    selectMode="single"
    pickerHeading="Configure Chart Part Value Aggregate Function"
    singleSelectPlaceholderText="Configure Chart Part Value"
    [data]="aggregateFunctionsStream"
  >
  </sky-select-field>
</div>
```

**After:**

```html
<sky-input-box labelText="Value Aggregate Function">
  <sky-lookup
    formControlName="valueAggregateFunction"
    selectMode="single"
    placeholderText="Configure Chart Part Value"
    [data]="(aggregateFunctionsStream | async) ?? []"
    [showMoreConfig]="{ nativePickerConfig: { title: 'Configure Chart Part Value Aggregate Function' } }"
    descriptorProperty="label"
    idProperty="id"
    enableShowMore
  >
  </sky-lookup>
</sky-input-box>
```

## Step 3: Attribute Migration

### Direct Attribute Mappings

| sky-select-field               | sky-lookup           |
| ------------------------------ | -------------------- |
| `descriptorKey`                | `descriptorProperty` |
| `singleSelectPlaceholderText`  | `placeholderText`    |
| `multipleSelectOpenButtonText` | `placeholderText`    |
| `showAddNewRecordButton`       | `showAddButton`      |
| `(addNewRecordButtonClick)`    | `(addClick)`         |

### Required New Attributes

Always add these attributes to `sky-lookup`:

- `descriptorProperty="label"`
- `idProperty="id"`
- `enableShowMore`

### Show More Configuration

Convert `pickerHeading` and `customPicker` to `showMoreConfig`:

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

### Data Binding Changes

Always wrap observables with the async pipe:

**Before:**

```html
<sky-select-field [data]="dataObservable"></sky-select-field>
```

**After:**

```html
<sky-lookup [data]="(dataObservable | async) ?? []"></sky-lookup>
```

## Step 4: Event Handling Updates

### Supported Event Migration

```typescript
// Before
onAddNewRecord() {
  // Handle add new record
}

// After - update HTML event binding
// (addNewRecordButtonClick)="onAddNewRecord()" becomes (addClick)="onAddNewRecord()"
```

### Unsupported Events (Add TODO Comments)

```typescript
// todo: check whether this is still needed; previously used for the blur event on <sky-select-field>
onBlur() {
  // This event is no longer available in sky-lookup
}

// todo: check whether this is still needed; previously used for the searchApplied event on <sky-select-field>
onSearchApplied(event: any) {
  // This event is no longer available in sky-lookup
}
```

## Step 5: Form Value Handling (Critical)

### Single Select Mode Value Access

**Before (sky-select-field):**

```typescript
// Returns single object
const selectedItem = this.myForm.get('item')?.value;
// Result: { id: '1', label: 'Item 1' }
```

**After (sky-lookup):**

```typescript
// Returns array, access first element
const selectedItem = this.myForm.get('item')?.value?.[0];
// Result: { id: '1', label: 'Item 1' }

// For safety, use optional chaining
const selectedItemId = this.myForm.get('item')?.value?.[0]?.id;
```

### Form Initialization Updates

**Before:**

```typescript
this.myForm = this.formBuilder.group({
  // Single select - single object
  singleItem: [{ id: '1', label: 'Default Item' }],
  // Multiple select - array
  multipleItems: [[{ id: '1', label: 'Item 1' }]],
});
```

**After:**

```typescript
this.myForm = this.formBuilder.group({
  // Both single and multiple now use arrays
  singleItem: [[{ id: '1', label: 'Default Item' }]],
  multipleItems: [[{ id: '1', label: 'Item 1' }]],
});
```

### Form Validation Updates

```typescript
// Before - validator expected single object for single select
Validators.required;

// After - validator needs to handle array
Validators.compose([
  Validators.required,
  (control: AbstractControl) => {
    const value = control.value;
    return value && Array.isArray(value) && value.length > 0
      ? null
      : { required: true };
  },
]);
```

### Complex Validation Scenarios

**Single Select with Custom Validators:**

```typescript
// Before - expected single object
const itemValidator = (control: AbstractControl) => {
  const value = control.value;
  return value?.id === 'forbidden' ? { forbidden: true } : null;
};

// After - must handle array
const itemValidator = (control: AbstractControl) => {
  const value = control.value?.[0]; // Access first item
  return value?.id === 'forbidden' ? { forbidden: true } : null;
};
```

**Required Field Validation:**

```typescript
// Before
singleItem: ['', Validators.required];

// After - array-aware required validator
singleItem: [
  [],
  [
    Validators.required,
    (control: AbstractControl) => {
      const value = control.value;
      return value && Array.isArray(value) && value.length > 0
        ? null
        : { required: true };
    },
  ],
];
```

## Step 6: Custom Picker Migration

### Update Custom Picker Implementation

```typescript
// todo: update this to use SkyLookupShowMoreCustomPicker; more info at https://developer.blackbaud.com/skyux/components/lookup?docs-active-tab=development#interface_sky-lookup-show-more-custom-picker
interface MyCustomPicker {
  // Update implementation to match SkyLookupShowMoreCustomPicker
}
```

## Step 7: Testing Updates

### Update Test Module Configuration

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [
      SkyLookupModule,
      SkyInputBoxModule,
      ReactiveFormsModule,
      AsyncPipe,
    ],
    providers: [
      provideNoopAnimations(), // REQUIRED: sky-lookup uses animations
    ],
  });
});
```

### Why provideNoopAnimations() is Required

The `sky-lookup` component uses Angular animations internally. In test environments, you must provide `provideNoopAnimations()` to prevent animation-related test failures.

### Common Test Failures After Migration

```typescript
// ❌ This will fail - animations not provided
TestBed.configureTestingModule({
  imports: [SkyLookupModule],
});

// ✅ This works
TestBed.configureTestingModule({
  imports: [SkyLookupModule],
  providers: [provideNoopAnimations()],
});
```

### Update Test Value Assertions

```typescript
// Before
expect(component.myForm.get('item')?.value).toEqual({ id: '1', label: 'Item' });

// After - for single select
expect(component.myForm.get('item')?.value?.[0]).toEqual({
  id: '1',
  label: 'Item',
});

// After - for multiple select (unchanged)
expect(component.myForm.get('items')?.value).toEqual([
  { id: '1', label: 'Item' },
]);
```

## Step 8: Accessibility Considerations

### Label Migration

The `sky-input-box` now handles labeling, replacing manual label associations:

**Before:**

```html
<label class="sky-control-label" for="my-field" id="my-label">
  Select Item
</label>
<sky-select-field id="my-field" ariaLabelledBy="my-label"> </sky-select-field>
```

**After:**

```html
<sky-input-box labelText="Select Item">
  <sky-lookup></sky-lookup>
</sky-input-box>
```

The migration follows this logic for label handling:

#### Case 1: Label + Select Field in Container

```html
<!-- If label and sky-select-field are the ONLY children of a div/p -->
<div>
  <label>{{ 'resource' | skyAppResources }}</label>
  <sky-select-field></sky-select-field>
</div>
```

**Result:** Replace the entire container with `sky-input-box`

#### Case 2: Label + Select Field (No Container)

```html
<!-- Adjacent label and select field -->
<label>{{ "resource" | skyAppResources }}</label>
<sky-select-field></sky-select-field>
```

**Result:** Replace label with `sky-input-box` opening tag, add closing tag after select field

#### Case 3: Complex Label Content

```html
<!-- Labels with additional markup -->
<label><a href="#">With additional markup</a></label>
```

**Result:** No automatic wrapping - requires manual review

#### Case 4: No Clear Label

```html
<!-- No preceding label element -->
<sky-select-field></sky-select-field>
```

**Result:** No `sky-input-box` wrapper - add manually with appropriate `labelText`

## Step 9: Removed Features

These `sky-select-field` features have no equivalent in `sky-lookup`:

### Template Attributes (Remove These)

- `inMemorySearchEnabled`
- `multipleSelectOpenButtonText`
- `singleSelectClearButtonTitle`
- `singleSelectOpenButtonTitle`

### Events (Add TODO Comments)

- `(blur)` - No equivalent
- `(searchApplied)` - No equivalent

## Complete Example

### Before (sky-select-field)

```html
<form [formGroup]="myForm">
  <div class="form-group">
    <label class="sky-control-label sky-control-label-required">
      Environment Ids
    </label>
    <sky-select-field
      formControlName="environmentIds"
      [data]="environmentIdsStream"
      multipleSelectOpenButtonText="Select"
      pickerHeading="Environment Ids"
      (addNewRecordButtonClick)="onAddEnvironment()"
      (searchApplied)="onSearchApplied($event)"
      required
    >
    </sky-select-field>
  </div>
</form>
```

```typescript
export class MyComponent {
  environmentIdsStream = new BehaviorSubject([
    { id: 'dev', label: 'Development' },
    { id: 'prod', label: 'Production' },
  ]);

  myForm = this.fb.group({
    environmentIds: [[]],
  });

  onAddEnvironment() {
    // Add logic
  }

  onSearchApplied(event: any) {
    // Search logic
  }
}
```

### After (sky-lookup)

```html
<form [formGroup]="myForm">
  <sky-input-box labelText="Environment Ids" required>
    <sky-lookup
      formControlName="environmentIds"
      [data]="(environmentIdsStream | async) ?? []"
      descriptorProperty="label"
      idProperty="id"
      enableShowMore
      [showMoreConfig]="{ nativePickerConfig: { title: 'Environment Ids' } }"
      (addClick)="onAddEnvironment()"
      required
    >
    </sky-lookup>
  </sky-input-box>
</form>
```

```typescript
import { AsyncPipe } from '@angular/common';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

@Component({
  imports: [SkyLookupModule, SkyInputBoxModule, ReactiveFormsModule, AsyncPipe],
})
export class MyComponent {
  environmentIdsStream = new BehaviorSubject([
    { id: 'dev', label: 'Development' },
    { id: 'prod', label: 'Production' },
  ]);

  myForm = this.fb.group({
    environmentIds: [[]],
  });

  onAddEnvironment() {
    // Add logic (unchanged)
  }

  // todo: check whether this is still needed; previously used for the searchApplied event on <sky-select-field>
  onSearchApplied(event: any) {
    // This event is no longer available in sky-lookup
  }

  // Access form values (for single select, use [0])
  getSelectedEnvironments() {
    return this.myForm.get('environmentIds')?.value; // Returns array
  }
}
```

## Additional Examples

- [Migration with NgModule and Exported Dependencies](./example-with-additional-ng-module.md)
- [Migration with Layout Columns](./example-with-fluid-grid-layout.md)
- [Migration with Template Forms (NgModel)](./example-with-template-form.md)

## Validation Checklist

After migration, verify:

- [ ] All `SkySelectFieldModule` imports replaced with `SkyLookupModule`
- [ ] All data bindings use `(observable | async) ?? []`
- [ ] All `sky-select-field` tags wrapped in `sky-input-box`
- [ ] Required attributes added: `descriptorProperty="label"`, `idProperty="id"`, `enableShowMore`
- [ ] Form value access updated for single select mode (use `[0]`)
- [ ] Form initialization uses arrays for all select modes
- [ ] Unsupported events have TODO comments
- [ ] Custom pickers updated to use `SkyLookupShowMoreCustomPicker`
- [ ] Tests updated with proper module imports and `provideNoopAnimations()`

This migration ensures your application follows current SKY UX patterns while maintaining functionality and improving accessibility.

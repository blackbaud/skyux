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

### 2. Critical Value Access Change (Single Select)

**Before (sky-select-field):**

```typescript
// Value is the object directly
onSelectionChange(value: MyObject | undefined) {
  if (value) {
    console.log(value.id); // Direct access
  }
}
```

**After (sky-lookup):**

```typescript
// Value is always an array, even for single select
onSelectionChange(value: MyObject[] | undefined) {
  if (value && value.length > 0) {
    console.log(value[0].id); // Must access [0]
  }
}
```

### 3. Module Import Patterns

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

### 4. Required Test Updates

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
| `class`                | `class`                | Direct mapping               |
| `data-sky-id`          | `data-sky-id`          | Direct mapping               |

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

**Error:** `NullInjectorError: No provider for AnimationDriver`
**Fix:** Add `provideNoopAnimations()` to test providers

### Form Control Type Mismatch

**Error:** TypeScript error on form control value
**Fix:** Update FormControl type from `MyObject` to `MyObject[]`

### Label Test Failures

**Error:** `Cannot read properties of null (reading 'innerHTML')` when tests look for `.sky-control-label`
**Fix:** Update tests to use `SkyInputBoxHarness` and `getLabelText()` method
**Pattern:** Tests accessing `querySelector('.sky-control-label')?.innerHTML` must use harness instead

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

```typescript
// Before
myControl = new FormControl<MyObject | null>(null);

// After
myControl = new FormControl<MyObject[]>([]);

// Template binding stays the same
[formControl] = 'myControl';
```

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

## Migration Validation Checklist

- [ ] Add `SkyLookupModule` + `SkyInputBoxModule` (keep `SkySelectFieldModule` until all migrated)
- [ ] Add `AsyncPipe` to imports
- [ ] Wrap `sky-select-field` in `sky-input-box` **only when clear static label text exists**
- [ ] For `ariaLabelledBy`, conditional labels, or no labels: use `sky-lookup` without `sky-input-box`
- [ ] Update template attributes and data bindings
- [ ] Fix single select form value access (use `[0]`)
- [ ] Update tests with `provideNoopAnimations()`
- [ ] Add `SkyInputBoxModule` + `SkyLookupModule` to test imports (avoid CUSTOM_ELEMENTS_SCHEMA errors)
- [ ] Update label tests to use `SkyInputBoxHarness.getLabelText()` (only for `sky-input-box` cases)
- [ ] Remove `SkySelectFieldModule` only after all usages migrated

⚠️ **Critical**: Single select mode now returns arrays. Access values with `formControl.value[0]`
⚠️ **Partial Migration**: Keep both modules until all `sky-select-field` usages are migrated

## 1. Update Imports (Partial Migration Safe)

### Install packages

```bash
npm install @skyux/lookup @skyux/forms
```

### Add module imports (keep existing)

```typescript
// Keep existing
import { SkySelectFieldModule } from '@skyux/select-field';

// Add new modules
import { SkyLookupModule } from '@skyux/lookup';
import { SkyInputBoxModule } from '@skyux/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [
    SkySelectFieldModule,      // Keep until all usages migrated
    SkyLookupModule,           // Add for new sky-lookup components
    SkyInputBoxModule,         // Add for new sky-lookup components
    ReactiveFormsModule,
    AsyncPipe
  ]
})
```

### For NgModules: Add imports without removing

```typescript
// Keep both modules during migration
@NgModule({
  imports: [
    SkySelectFieldModule,      // Keep until all usages migrated
    SkyLookupModule,           // Add for new components
    SkyInputBoxModule,         // Add for new components
    CommonModule
  ]
})
```

### Remove old imports only when complete

After migrating all `sky-select-field` usages in your module/component:

```typescript
// Safe to remove after full migration
@Component({
  imports: [
    // SkySelectFieldModule,   // Remove only when no sky-select-field left
    SkyLookupModule,
    SkyInputBoxModule,
    ReactiveFormsModule,
    AsyncPipe
  ]
})
```

## 2. Template Migration

### Pattern A: With sky-input-box (clear static label)

```html
<!-- Before -->
<div>
  <label class="sky-control-label">Label Text</label>
  <sky-select-field formControlName="field" [data]="dataStream">
  </sky-select-field>
</div>

<!-- After -->
<sky-input-box labelText="Label Text" stacked>
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

### Pattern B: Without sky-input-box (aria-labelledby)

```html
<!-- Before -->
<span id="field-label">Department Selection</span>
<sky-select-field
  formControlName="field"
  [data]="dataStream"
  [ariaLabelledBy]="'field-label'"
>
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

### Pattern C: Without sky-input-box (conditional label)

```html
<!-- Before -->
<label class="sky-control-label" *ngIf="showLabel">{{dynamicLabel}}</label>
<sky-select-field formControlName="field" [data]="dataStream">
</sky-select-field>

<!-- After -->
<label class="sky-control-label" *ngIf="showLabel">{{dynamicLabel}}</label>
<sky-lookup
  formControlName="field"
  [data]="(dataStream | async) ?? []"
  descriptorProperty="label"
  idProperty="id"
  enableShowMore
>
</sky-lookup>
```

### Pattern D: Without sky-input-box (aria-label only)

```html
<!-- Before -->
<sky-select-field
  formControlName="field"
  [data]="dataStream"
  [ariaLabel]="'Select department'"
>
</sky-select-field>

<!-- After -->
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

### Template Forms (NgModel) - with sky-input-box

```html
<!-- Before -->
<label>Colors</label>
<sky-select-field
  name="colors"
  [(ngModel)]="selectedColors"
  [data]="colorsStream"
>
</sky-select-field>

<!-- After -->
<sky-input-box labelText="Colors" stacked>
  <sky-lookup
    name="colors"
    [(ngModel)]="selectedColors"
    [data]="(colorsStream | async) ?? []"
    descriptorProperty="label"
    idProperty="id"
    enableShowMore
  >
  </sky-lookup>
</sky-input-box>
```

### Layout Columns

```html
<!-- Before -->
<sky-column screenSmall="6">
  <label class="sky-control-label">Department</label>
  <sky-select-field formControlName="department" [data]="departmentsStream">
  </sky-select-field>
</sky-column>

<!-- After -->
<sky-column screenSmall="6">
  <sky-input-box labelText="Department" stacked>
    <sky-lookup
      formControlName="department"
      [data]="(departmentsStream | async) ?? []"
      descriptorProperty="label"
      idProperty="id"
      enableShowMore
    >
    </sky-lookup>
  </sky-input-box>
</sky-column>
```

### NgModule with shared modules (partial migration)

```typescript
// Before: app-extras.module.ts
@NgModule({
  exports: [SkySelectFieldModule, SkyIconModule, SkyButtonModule]
})

// During migration: app-extras.module.ts (keep both)
@NgModule({
  exports: [
    SkySelectFieldModule,      // Keep until all consuming components migrated
    SkyLookupModule,           // Add for migrated components
    SkyInputBoxModule,         // Add for migrated components
    SkyIconModule,
    SkyButtonModule
  ]
})

// After full migration: app-extras.module.ts
@NgModule({
  exports: [
    // SkySelectFieldModule,   // Remove when no components use sky-select-field
    SkyLookupModule,
    SkyInputBoxModule,
    SkyIconModule,
    SkyButtonModule
  ]
})
```

## 3. Attribute Updates

### Required attributes (always add)

- `descriptorProperty="label"`
- `idProperty="id"`
- `enableShowMore`

### Attribute mappings

| sky-select-field               | sky-lookup           |
| ------------------------------ | -------------------- |
| `descriptorKey`                | `descriptorProperty` |
| `singleSelectPlaceholderText`  | `placeholderText`    |
| `multipleSelectOpenButtonText` | `placeholderText`    |
| `showAddNewRecordButton`       | `showAddButton`      |
| `(addNewRecordButtonClick)`    | `(addClick)`         |

### ShowMore configuration

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

Convert `pickerHeading` with resource pipe to `showMoreConfig`:

**Before:**

```html
<sky-select-field pickerHeading="{{ 'Select Items' | skyAppResources }}">
</sky-select-field>
```

**After:**

```html
<sky-lookup
  [showMoreConfig]="{
    nativePickerConfig: { title: ( 'Select Items' | skyAppResources ) }
  }"
>
</sky-lookup>
```

### Data binding (always wrap observables)

```html
<!-- Before -->
<sky-select-field [data]="dataObservable">
  <!-- After -->
  <sky-lookup [data]="(dataObservable | async) ?? []"></sky-lookup
></sky-select-field>
```

## 4. Form Value Changes (CRITICAL)

⚠️ **Single select mode now returns arrays**

### Value access

```typescript
// Before - single object
const item = this.form.get('item')?.value;
// Result: { id: '1', label: 'Item' }

// After - array, use [0]
const item = this.form.get('item')?.value?.[0];
// Result: { id: '1', label: 'Item' }
```

### Form initialization

```typescript
// Before
this.form = this.fb.group({
  singleItem: [{ id: '1', label: 'Item' }], // Single object
  multipleItems: [[{ id: '1', label: 'Item' }]], // Array
});

// After - both use arrays
this.form = this.fb.group({
  singleItem: [[{ id: '1', label: 'Item' }]], // Array now
  multipleItems: [[{ id: '1', label: 'Item' }]], // Array (unchanged)
});
```

### NgModel (template forms)

```typescript
// Before
selectedLanguage: any = null;              // Single object
selectedColors: any[] = [];                // Array

// After - both use arrays
selectedLanguage: any[] = [];              // Array now
selectedColors: any[] = [];                // Array (unchanged)

// Access single value with [0]
getSelectedLanguage() {
  return this.selectedLanguage[0];
}
```

## 5. Update Tests (Partial Migration Safe)

### Add required providers (keep existing modules)

```typescript
TestBed.configureTestingModule({
  imports: [
    SkySelectFieldModule, // Keep if any sky-select-field remain in tests
    SkyLookupModule, // Add for migrated components
    SkyInputBoxModule, // Add for migrated components
  ],
  providers: [provideNoopAnimations()], // REQUIRED for sky-lookup
});
```

### Update test assertions gradually

```typescript
// Before - single object
expect(component.form.get('item')?.value).toEqual({ id: '1', label: 'Item' });

// After - array for single select (only for migrated fields)
expect(component.form.get('migratedItem')?.value[0]).toEqual({
  id: '1',
  label: 'Item',
});

// Unchanged - for fields still using sky-select-field
expect(component.form.get('legacyItem')?.value).toEqual({
  id: '1',
  label: 'Item',
});

// Multiple select unchanged regardless of migration
expect(component.form.get('items')?.value).toEqual([
  { id: '1', label: 'Item' },
]);
```

### Update label tests to use SkyInputBoxHarness

**Problem:** Tests fail with "Cannot read properties of null (reading 'innerHTML')" when looking for old label elements

**Before (failing after migration):**

```typescript
// Test looking for old sky-control-label
const labelElement = fixture.nativeElement.querySelector('.sky-control-label');
expect(labelElement.innerHTML).toContain('Department');

// Page object method accessing old label
getSelectFieldLabel(): string {
  return this.fixture.nativeElement.querySelector('.sky-control-label')?.innerHTML;
}
```

**After (use SkyInputBoxHarness):**

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

## 6. Handle Unsupported Features

### Add TODO comments for removed events

```typescript
// todo: check whether this is still needed; previously used for the blur event on <sky-select-field>
onBlur() { /* No equivalent in sky-lookup */ }

// todo: check whether this is still needed; previously used for the searchApplied event on <sky-select-field>
onSearchApplied(event: any) { /* No equivalent in sky-lookup */ }
```

### Remove unsupported attributes

Delete these from templates:

- `inMemorySearchEnabled`
- `singleSelectClearButtonTitle`
- `singleSelectOpenButtonTitle`
- `singleSelectClearButtonTitle`
- `singleSelectOpenButtonTitle`

## 7. Partial Migration Strategy

### Phase 1: Setup (safe for all scenarios)

1. Install new packages: `npm install @skyux/lookup @skyux/forms`
2. Add new module imports alongside existing ones
3. Keep `SkySelectFieldModule` in all imports/exports
4. Update tests to include both module sets

### Phase 2: Migrate templates one by one

1. Convert individual `sky-select-field` to `sky-lookup` + `sky-input-box`
2. Update form value access for migrated single-select fields only
3. Test each component individually
4. Both components can coexist safely

### Phase 3: Cleanup (after all templates migrated)

1. Remove `SkySelectFieldModule` from imports/exports
2. Search codebase to ensure no `<sky-select-field>` remain
3. Remove `@skyux/select-field` package dependency
4. Final testing

### Detecting remaining usages

```bash
# Search for remaining sky-select-field tags
grep -r "sky-select-field" src/

# Search for remaining SkySelectFieldModule imports
grep -r "SkySelectFieldModule" src/
```

## Example: Complete Migration (Mixed State)

### During Migration (both components coexist)

```html
<form [formGroup]="myForm">
  <!-- Migrated field -->
  <sky-input-box
    labelText="{{ 'Environment Ids' | skyAppResources }}"
    required
    stacked
  >
    <sky-lookup
      formControlName="environmentIds"
      [data]="(environmentIdsStream | async) ?? []"
      descriptorProperty="label"
      idProperty="id"
      enableShowMore
      [showMoreConfig]="{ nativePickerConfig: { title: ( 'Environment Ids' | skyAppResources ) } }"
      (addClick)="onAddEnvironment()"
      required
    >
    </sky-lookup>
  </sky-input-box>

  <!-- Legacy field (not yet migrated) -->
  <div class="form-group">
    <label class="sky-control-label">Legacy Field</label>
    <sky-select-field
      formControlName="legacyField"
      [data]="legacyDataStream"
      selectMode="single"
      singleSelectPlaceholderText="Select legacy option"
    >
    </sky-select-field>
  </div>
</form>
```

```typescript
@Component({
  imports: [
    SkySelectFieldModule, // Keep for legacy fields
    SkyLookupModule, // Add for migrated fields
    SkyInputBoxModule, // Add for migrated fields
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class MyComponent {
  environmentIdsStream = new BehaviorSubject([
    { id: 'dev', label: 'Development' },
    { id: 'prod', label: 'Production' },
  ]);

  legacyDataStream = new BehaviorSubject([
    { id: 'option1', label: 'Option 1' },
    { id: 'option2', label: 'Option 2' },
  ]);

  myForm = this.fb.group({
    environmentIds: [[]], // Migrated: array for all modes
    legacyField: [null], // Legacy: single object for single select
  });

  // Access values differently based on migration status
  getEnvironmentIds() {
    return this.myForm.get('environmentIds')?.value; // Returns array
  }

  getLegacyField() {
    return this.myForm.get('legacyField')?.value; // Returns single object
  }

  // todo: check whether this is still needed; previously used for the searchApplied event on <sky-select-field>
  onSearchApplied(event: any) {
    /* No equivalent in sky-lookup */
  }
}
```

### After Full Migration

```typescript
@Component({
  imports: [
    // SkySelectFieldModule,   // Remove after all fields migrated
    SkyLookupModule,
    SkyInputBoxModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class MyComponent {
  // All form controls now use arrays for single select
  myForm = this.fb.group({
    environmentIds: [[]],
    formerLegacyField: [[]], // Now array for single select
  });

  // All single select access uses [0]
  getFormerLegacyField() {
    return this.myForm.get('formerLegacyField')?.value?.[0];
  }
}
```

## Validation Checklist (Per Component)

After migrating each individual component, verify:

### During Partial Migration

- [ ] Both `SkySelectFieldModule` and `SkyLookupModule` imported in component/module
- [ ] All migrated `sky-select-field` tags wrapped in `sky-input-box`
- [ ] Required attributes added to migrated fields: `descriptorProperty="label"`, `idProperty="id"`, `enableShowMore`
- [ ] All migrated data bindings use `(observable | async) ?? []`
- [ ] Form value access updated for migrated single select fields (use `[0]`)
- [ ] Form initialization uses arrays for migrated single select fields
- [ ] Tests updated with `provideNoopAnimations()` for sky-lookup
- [ ] Migrated and legacy fields can coexist in same form

### After Full Migration (All Components)

- [ ] All `<sky-select-field>` tags removed from codebase (`grep -r "sky-select-field" src/`)
- [ ] All `SkySelectFieldModule` imports removed (`grep -r "SkySelectFieldModule" src/`)
- [ ] All single select form controls use array initialization
- [ ] All single select value access uses `[0]` notation
- [ ] `@skyux/select-field` package removed from dependencies
- [ ] All tests pass without `SkySelectFieldModule`

## Migration Benefits

This partial migration approach ensures:

1. **Zero downtime**: Applications remain functional throughout migration
2. **Incremental testing**: Each component can be tested independently
3. **Risk reduction**: Issues can be isolated to individual components
4. **Team collaboration**: Multiple developers can work on different components simultaneously
5. **Rollback capability**: Individual components can be reverted if issues arise

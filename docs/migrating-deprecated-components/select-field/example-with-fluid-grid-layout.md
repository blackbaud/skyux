# Example: Migration with Layout Columns

This example shows how to migrate `sky-select-field` components that are used within layout columns.

## Before (sky-select-field with layout)

```html
<sky-fluid-grid>
  <sky-row>
    <sky-column screenSmall="6" screenMedium="4">
      <label class="sky-control-label sky-control-label-required">
        Department
      </label>
      <sky-select-field
        formControlName="department"
        [data]="departmentsStream"
        pickerHeading="Select Department"
        required
      >
      </sky-select-field>
    </sky-column>

    <sky-column screenSmall="6" screenMedium="4">
      <label class="sky-control-label"> Manager </label>
      <sky-select-field
        formControlName="manager"
        selectMode="single"
        [data]="managersStream"
        singleSelectPlaceholderText="Choose a manager"
      >
      </sky-select-field>
    </sky-column>

    <sky-column screenSmall="12" screenMedium="4">
      <label class="sky-control-label"> Skills </label>
      <sky-select-field
        formControlName="skills"
        [data]="skillsStream"
        multipleSelectOpenButtonText="Add Skills"
        pickerHeading="Available Skills"
      >
      </sky-select-field>
    </sky-column>
  </sky-row>
</sky-fluid-grid>
```

```typescript
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkySelectFieldModule } from '@skyux/select-field';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  imports: [SkySelectFieldModule, SkyFluidGridModule, ReactiveFormsModule],
})
export class EmployeeFormComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly departmentsStream = new BehaviorSubject([
    { id: 'eng', label: 'Engineering' },
    { id: 'sales', label: 'Sales' },
    { id: 'hr', label: 'Human Resources' },
  ]);

  protected readonly managersStream = new BehaviorSubject([
    { id: 'john', label: 'John Smith' },
    { id: 'jane', label: 'Jane Doe' },
  ]);

  protected readonly skillsStream = new BehaviorSubject([
    { id: 'js', label: 'JavaScript' },
    { id: 'angular', label: 'Angular' },
    { id: 'css', label: 'CSS' },
  ]);

  protected readonly employeeForm = this.fb.group({
    department: [[]],
    manager: [{ id: 'john', label: 'John Smith' }],
    skills: [[]],
  });
}
```

## After (sky-lookup with layout)

```html
<sky-fluid-grid>
  <sky-row>
    <sky-column screenSmall="6" screenMedium="4">
      <sky-input-box labelText="Department" required>
        <sky-lookup
          formControlName="department"
          [data]="(departmentsStream | async) ?? []"
          descriptorProperty="label"
          idProperty="id"
          enableShowMore
          [showMoreConfig]="{ nativePickerConfig: { title: 'Select Department' } }"
          required
        >
        </sky-lookup>
      </sky-input-box>
    </sky-column>

    <sky-column screenSmall="6" screenMedium="4">
      <sky-input-box labelText="Manager">
        <sky-lookup
          formControlName="manager"
          selectMode="single"
          [data]="(managersStream | async) ?? []"
          descriptorProperty="label"
          idProperty="id"
          enableShowMore
          placeholderText="Choose a manager"
        >
        </sky-lookup>
      </sky-input-box>
    </sky-column>

    <sky-column screenSmall="12" screenMedium="4">
      <sky-input-box labelText="Skills">
        <sky-lookup
          formControlName="skills"
          [data]="(skillsStream | async) ?? []"
          descriptorProperty="label"
          idProperty="id"
          enableShowMore
          [showMoreConfig]="{ nativePickerConfig: { title: 'Available Skills' } }"
        >
        </sky-lookup>
      </sky-input-box>
    </sky-column>
  </sky-row>
</sky-fluid-grid>
```

```typescript
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyLookupModule } from '@skyux/lookup';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  imports: [
    SkyLookupModule,
    SkyInputBoxModule,
    SkyFluidGridModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class EmployeeFormComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly departmentsStream = new BehaviorSubject([
    { id: 'eng', label: 'Engineering' },
    { id: 'sales', label: 'Sales' },
    { id: 'hr', label: 'Human Resources' },
  ]);

  protected readonly managersStream = new BehaviorSubject([
    { id: 'john', label: 'John Smith' },
    { id: 'jane', label: 'Jane Doe' },
  ]);

  protected readonly skillsStream = new BehaviorSubject([
    { id: 'js', label: 'JavaScript' },
    { id: 'angular', label: 'Angular' },
    { id: 'css', label: 'CSS' },
  ]);

  protected readonly employeeForm = this.fb.group({
    department: [[]],
    manager: [[{ id: 'john', label: 'John Smith' }]], // Now wrapped in array
    skills: [[]],
  });

  // Access single select value - note the [0] access
  protected getSelectedManager() {
    return this.employeeForm.get('manager')?.value?.[0];
  }
}
```

## Key Changes

1. **Layout structure preserved**: The `sky-column` elements remain unchanged
2. **Label replacement**: Each `label` + `sky-select-field` pair is replaced with `sky-input-box` wrapping `sky-lookup`
3. **Module updates**: Added `SkyLookupModule`, `SkyInputBoxModule`, and `AsyncPipe` imports
4. **Form initialization**: Single select `manager` field now initialized with array
5. **Data binding**: All data streams now use `(stream | async) ?? []` pattern

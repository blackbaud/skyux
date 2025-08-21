# Example: Migration with NgModule and Exported Dependencies

This example shows how to migrate `sky-select-field` when it's used in a non-standalone component that imports from a module that exports `SkySelectFieldModule`.

## Before (NgModule with exported dependencies)

**app-extras.module.ts:**

```typescript
import { NgModule } from '@angular/core';
import { SkyButtonModule } from '@skyux/button';
import { SkyIconModule } from '@skyux/icon';
import { SkySelectFieldModule } from '@skyux/select-field';

@NgModule({
  exports: [SkySelectFieldModule, SkyIconModule, SkyButtonModule],
})
export class AppExtrasModule {}
```

**product-filter.module.ts:**

```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppExtrasModule } from '../shared/app-extras.module';

import { ProductFilterComponent } from './product-filter.component';

@NgModule({
  declarations: [ProductFilterComponent],
  imports: [CommonModule, ReactiveFormsModule, AppExtrasModule],
  exports: [ProductFilterComponent],
})
export class ProductFilterModule {}
```

**product-filter.component.html:**

```html
<div class="product-filter-container">
  <form [formGroup]="filterForm">
    <div class="filter-row">
      <label class="sky-control-label"> Product Categories </label>
      <sky-select-field
        formControlName="categories"
        [data]="categoriesStream"
        pickerHeading="Select Categories"
        multipleSelectOpenButtonText="Add Categories"
      >
      </sky-select-field>
    </div>

    <div class="filter-row">
      <label class="sky-control-label"> Price Range </label>
      <sky-select-field
        formControlName="priceRange"
        selectMode="single"
        [data]="priceRangesStream"
        singleSelectPlaceholderText="Any price"
        pickerHeading="Select Price Range"
      >
      </sky-select-field>
    </div>

    <div class="filter-row">
      <label class="sky-control-label"> Brand </label>
      <sky-select-field
        formControlName="brand"
        selectMode="single"
        [data]="brandsStream"
        singleSelectPlaceholderText="Any brand"
        (searchApplied)="onBrandSearchApplied($event)"
      >
      </sky-select-field>
    </div>

    <div class="filter-actions">
      <button
        type="button"
        class="sky-btn sky-btn-primary"
        (click)="applyFilters()"
      >
        <sky-icon iconName="filter" iconSize="sm"></sky-icon>
        Apply Filters
      </button>
    </div>
  </form>
</div>
```

**product-filter.component.ts:**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
  standalone: false,
})
export class ProductFilterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  protected readonly categoriesStream = new BehaviorSubject([
    { id: 'electronics', label: 'Electronics' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'books', label: 'Books' },
    { id: 'home', label: 'Home & Garden' },
  ]);

  protected readonly priceRangesStream = new BehaviorSubject([
    { id: 'under-25', label: 'Under $25' },
    { id: '25-50', label: '$25 - $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: 'over-100', label: 'Over $100' },
  ]);

  protected readonly brandsStream = new BehaviorSubject([
    { id: 'apple', label: 'Apple' },
    { id: 'samsung', label: 'Samsung' },
    { id: 'nike', label: 'Nike' },
    { id: 'adidas', label: 'Adidas' },
  ]);

  protected filterForm = this.fb.group({
    categories: [[]],
    priceRange: [null],
    brand: [null],
  });

  ngOnInit() {
    // Initialize form
  }

  protected applyFilters() {
    const filters = this.filterForm.value;
    console.log('Applied filters:', filters);
  }

  protected onBrandSearchApplied(event: any) {
    console.log('Brand search applied:', event);
  }
}
```

## After (NgModule with updated dependencies)

**app-extras.module.ts:**

```typescript
import { NgModule } from '@angular/core';
import { SkyButtonModule } from '@skyux/button';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyLookupModule } from '@skyux/lookup';

@NgModule({
  exports: [SkyLookupModule, SkyInputBoxModule, SkyIconModule, SkyButtonModule],
})
export class AppExtrasModule {}
```

**product-filter.module.ts:**

```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppExtrasModule } from '../shared/app-extras.module';

import { ProductFilterComponent } from './product-filter.component';

@NgModule({
  declarations: [ProductFilterComponent],
  imports: [CommonModule, ReactiveFormsModule, AppExtrasModule],
  exports: [ProductFilterComponent],
})
export class ProductFilterModule {}
```

**product-filter.component.html:**

```html
<div class="product-filter-container">
  <form [formGroup]="filterForm">
    <div class="filter-row">
      <sky-input-box labelText="Product Categories">
        <sky-lookup
          formControlName="categories"
          [data]="(categoriesStream | async) ?? []"
          descriptorProperty="label"
          idProperty="id"
          enableShowMore
          [showMoreConfig]="{ nativePickerConfig: { title: 'Select Categories' } }"
        >
        </sky-lookup>
      </sky-input-box>
    </div>

    <div class="filter-row">
      <sky-input-box labelText="Price Range">
        <sky-lookup
          formControlName="priceRange"
          selectMode="single"
          [data]="(priceRangesStream | async) ?? []"
          descriptorProperty="label"
          idProperty="id"
          enableShowMore
          placeholderText="Any price"
          [showMoreConfig]="{ nativePickerConfig: { title: 'Select Price Range' } }"
        >
        </sky-lookup>
      </sky-input-box>
    </div>

    <div class="filter-row">
      <sky-input-box labelText="Brand">
        <sky-lookup
          formControlName="brand"
          selectMode="single"
          [data]="(brandsStream | async) ?? []"
          descriptorProperty="label"
          idProperty="id"
          enableShowMore
          placeholderText="Any brand"
        >
        </sky-lookup>
      </sky-input-box>
    </div>

    <div class="filter-actions">
      <button
        type="button"
        class="sky-btn sky-btn-primary"
        (click)="applyFilters()"
      >
        <sky-icon iconName="filter" iconSize="sm"></sky-icon>
        Apply Filters
      </button>
    </div>
  </form>
</div>
```

**product-filter.component.ts:**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
  standalone: false,
})
export class ProductFilterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  protected readonly categoriesStream = new BehaviorSubject([
    { id: 'electronics', label: 'Electronics' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'books', label: 'Books' },
    { id: 'home', label: 'Home & Garden' },
  ]);

  protected readonly priceRangesStream = new BehaviorSubject([
    { id: 'under-25', label: 'Under $25' },
    { id: '25-50', label: '$25 - $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: 'over-100', label: 'Over $100' },
  ]);

  protected readonly brandsStream = new BehaviorSubject([
    { id: 'apple', label: 'Apple' },
    { id: 'samsung', label: 'Samsung' },
    { id: 'nike', label: 'Nike' },
    { id: 'adidas', label: 'Adidas' },
  ]);

  protected filterForm = this.fb.group({
    categories: [[]],
    priceRange: [[]], // Now array for single select
    brand: [[]], // Now array for single select
  });

  ngOnInit() {
    // Initialize form
  }

  protected applyFilters() {
    const filters = this.filterForm.value;

    // Extract single values from arrays for single select fields
    const processedFilters = {
      categories: filters.categories, // Array - use as-is
      priceRange: filters.priceRange?.[0] || null, // Single select - get first item
      brand: filters.brand?.[0] || null, // Single select - get first item
    };

    console.log('Applied filters:', processedFilters);
  }

  // todo: check whether this is still needed; previously used for the searchApplied event on <sky-select-field>
  protected onBrandSearchApplied(event: any) {
    // This event is no longer available in sky-lookup
    console.log('Brand search applied:', event);
  }
}
```

## Key Changes for NgModule Pattern

1. **Module exports updated**: `AppExtrasModule` now exports `SkyLookupModule` and `SkyInputBoxModule` instead of `SkySelectFieldModule`
2. **Component remains non-standalone**: The component declaration and module structure is preserved
3. **Form initialization**: Single select fields (`priceRange`, `brand`) now initialized as empty arrays
4. **Value extraction**: In `applyFilters()`, single select values are extracted using `[0]` access
5. **Template structure**: Each label + select-field pair replaced with `sky-input-box` wrapping `sky-lookup`
6. **Event handling**: Removed `searchApplied` event and added TODO comment

## Module Migration Strategy

1. **Update the shared module first**: Replace `SkySelectFieldModule` with `SkyLookupModule` and `SkyInputBoxModule` in `AppExtrasModule`
2. **Migrate each component**: Update templates and form handling in each component that uses the shared module
3. **Test incrementally**: Test each component after migration to ensure functionality is preserved
4. **Consider standalone migration**: After completing the select-field migration, consider converting components to standalone as a separate task

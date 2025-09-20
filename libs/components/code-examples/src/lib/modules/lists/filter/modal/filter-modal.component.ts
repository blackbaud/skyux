import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Filter } from './filter';
import { FilterModalContext } from './filter-modal-context';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  imports: [FormsModule, SkyCheckboxModule, SkyInputBoxModule, SkyModalModule],
})
export class FilterModalComponent {
  protected hideOrange = false;
  protected fruitType = 'any';

  protected readonly context = inject(FilterModalContext);
  protected readonly instance = inject(SkyModalInstance);

  constructor() {
    if (this.context.appliedFilters.length > 0) {
      this.#setFormFilters(this.context.appliedFilters);
    } else {
      this.clearAllFilters();
    }
  }

  protected applyFilters(): void {
    const result = this.#getAppliedFiltersArray();
    this.instance.save(result);
  }

  protected cancel(): void {
    this.instance.cancel();
  }

  protected clearAllFilters(): void {
    this.hideOrange = false;
    this.fruitType = 'any';
  }

  #getAppliedFiltersArray(): Filter[] {
    const appliedFilters: Filter[] = [];

    if (this.fruitType !== 'any') {
      appliedFilters.push({
        name: 'fruitType',
        value: this.fruitType,
        label: this.fruitType,
      });
    }

    if (this.hideOrange) {
      appliedFilters.push({
        name: 'hideOrange',
        value: true,
        label: 'hide orange fruits',
      });
    }

    return appliedFilters;
  }

  #setFormFilters(appliedFilters: Filter[]): void {
    for (const appliedFilter of appliedFilters) {
      if (appliedFilter.name === 'fruitType') {
        this.fruitType = `${appliedFilter.value}`;
      }

      if (appliedFilter.name === 'hideOrange') {
        this.hideOrange = !!appliedFilter.value;
      }
    }
  }
}

import { Component } from '@angular/core';

import { SkyModalInstance } from '@skyux/modals';

import { FilterDemoModalContext } from './filter-demo-modal-context';

@Component({
  selector: 'app-filter-demo-modal',
  templateUrl: './filter-demo-modal.component.html',
})
export class FilterDemoModalComponent {
  public hideOrange: boolean;

  public fruitType = 'any';

  constructor(
    public context: FilterDemoModalContext,
    public instance: SkyModalInstance
  ) {
    if (
      this.context &&
      this.context.appliedFilters &&
      this.context.appliedFilters.length > 0
    ) {
      this.setFormFilters(this.context.appliedFilters);
    } else {
      this.clearAllFilters();
    }
  }

  public applyFilters(): void {
    const result = this.getAppliedFiltersArray();
    this.instance.save(result);
  }

  public cancel(): void {
    this.instance.cancel();
  }

  public clearAllFilters(): void {
    this.hideOrange = false;
    this.fruitType = 'any';
  }

  private getAppliedFiltersArray(): any[] {
    const appliedFilters: any[] = [];
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

  private setFormFilters(appliedFilters: any[]): void {
    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i].name === 'fruitType') {
        this.fruitType = appliedFilters[i].value;
      }

      if (appliedFilters[i].name === 'hideOrange') {
        this.hideOrange = appliedFilters[i].value;
      }
    }
  }
}

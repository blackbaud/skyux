import {
  Component
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListFilterModel
} from '@skyux/list-builder';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  ListFiltersDocsModalContext
} from './list-filters-docs-modal-context';

@Component({
  selector: 'app-demo-filter-modal-form',
  templateUrl: './list-filters-demo-modal.component.html'
})
export class ListFiltersDocsModalComponent {

  public fruitType: string = 'any';

  public headerText: string = 'Filters';

  public hideOrange: boolean;

  constructor(
    public context: ListFiltersDocsModalContext,
    public instance: SkyModalInstance
  ) {
    if (this.context && this.context.appliedFilters && this.context.appliedFilters.length > 0) {
      this.setFormFilters(this.context.appliedFilters);
    } else {
      this.clearAllFilters();
    }
  }

  public applyFilters(): void {
    let result = this.getAppliedFiltersArray();
    this.instance.save(result);
  }

  public clearAllFilters(): void {
    this.hideOrange = false;
    this.fruitType = 'any';
  }

  public cancel(): void {
    this.instance.cancel();
  }

  private fruitTypeFilterFunction(item: ListItemModel, filterValue: any): boolean {
    return filterValue === item.data.type;
  }

  private hideOrangeFilterFunction(item: ListItemModel, filterValue: any): boolean {
    return !filterValue || (filterValue && item.data.color !== 'orange');
  }

  private getAppliedFiltersArray(): ListFilterModel[] {
    let appliedFilters: ListFilterModel[] = [];
    if (this.fruitType !== 'any') {

      appliedFilters.push(new ListFilterModel({
        name: 'fruitType',
        value: this.fruitType,
        label: this.fruitType,
        filterFunction: this.fruitTypeFilterFunction
      }));
    }

    if (this.hideOrange) {
      appliedFilters.push(new ListFilterModel({
        name: 'hideOrange',
        value: true,
        label: 'hide orange fruits',
        filterFunction: this.hideOrangeFilterFunction
      }));
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

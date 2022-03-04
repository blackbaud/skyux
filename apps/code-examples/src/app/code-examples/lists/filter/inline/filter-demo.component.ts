import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-demo',
  templateUrl: './filter-demo.component.html',
})
export class FilterDemoComponent {
  public appliedFilters: any[] = [];

  public filteredItems: any[];

  public filtersActive = false;

  public fruitType = 'any';

  public hideOrange = false;

  public items: any[] = [
    {
      name: 'Orange',
      type: 'citrus',
      color: 'orange',
    },
    {
      name: 'Mango',
      type: 'other',
      color: 'orange',
    },
    {
      name: 'Lime',
      type: 'citrus',
      color: 'green',
    },
    {
      name: 'Strawberry',
      type: 'berry',
      color: 'red',
    },
    {
      name: 'Blueberry',
      type: 'berry',
      color: 'blue',
    },
  ];

  public showInlineFilters = false;

  constructor() {
    this.filteredItems = this.items.slice();
  }

  public filterButtonClicked(): void {
    this.showInlineFilters = !this.showInlineFilters;
  }

  public fruitTypeChange(newValue: string): void {
    this.fruitType = newValue;
    this.setFilterActiveState();
  }

  public hideOrangeChange(newValue: boolean): void {
    this.hideOrange = newValue;
    this.setFilterActiveState();
  }

  private setFilterActiveState(): void {
    this.appliedFilters = [];
    if (this.fruitType !== 'any') {
      this.appliedFilters.push({
        name: 'fruitType',
        value: this.fruitType,
      });
    }
    if (this.hideOrange) {
      this.appliedFilters.push({
        name: 'hideOrange',
        value: true,
      });
    }
    this.filtersActive = this.appliedFilters.length > 0;

    this.filteredItems = this.filterItems(this.items, this.appliedFilters);
  }

  private orangeFilterFailed(filter: any, item: any): any {
    return (
      filter.name === 'hideOrange' && filter.value && item.color === 'orange'
    );
  }

  private fruitTypeFilterFailed(filter: any, item: any): any {
    return (
      filter.name === 'fruitType' &&
      filter.value !== 'any' &&
      filter.value !== item.type
    );
  }

  private itemIsShown(filters: any[], item: any[]): boolean {
    let passesFilter = true,
      j: number;

    for (j = 0; j < filters.length; j++) {
      if (this.orangeFilterFailed(filters[j], item)) {
        passesFilter = false;
      } else if (this.fruitTypeFilterFailed(filters[j], item)) {
        passesFilter = false;
      }
    }

    return passesFilter;
  }

  private filterItems(items: any[], filters: any[]): any[] {
    let i: number, passesFilter: boolean;
    const result: any[] = [];

    for (i = 0; i < items.length; i++) {
      passesFilter = this.itemIsShown(filters, items[i]);
      if (passesFilter) {
        result.push(items[i]);
      }
    }

    return result;
  }
}

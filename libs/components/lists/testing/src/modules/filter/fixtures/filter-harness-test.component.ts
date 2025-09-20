import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyFilterModule, SkyRepeaterModule } from '@skyux/lists';

interface Filter {
  name: string;
  value: string | boolean;
  label: string;
}

interface Fruit {
  name: string;
  type: string;
  color: string;
}

@Component({
  standalone: true,
  selector: 'test-filter-harness',
  templateUrl: './filter-harness-test.component.html',
  imports: [
    FormsModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyFilterModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
    SkyToolbarModule,
  ],
})
export class FilterHarnessTestComponent {
  public showText = true;
  protected appliedFilters: Filter[] = [];
  protected filteredItems: Fruit[];
  protected filtersActive = false;
  protected fruitType = 'any';
  protected hideOrange = false;

  protected items: Fruit[] = [
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

  protected showInlineFilters = false;

  constructor() {
    this.filteredItems = this.items.slice();
  }

  protected filterButtonClicked(): void {
    this.showInlineFilters = !this.showInlineFilters;
  }

  protected fruitTypeChange(newValue: string): void {
    this.fruitType = newValue;
    this.#setFilterActiveState();
  }

  protected hideOrangeChange(newValue: boolean): void {
    this.hideOrange = newValue;
    this.#setFilterActiveState();
  }

  protected onDismiss(index: number): void {
    const removedFilter = this.appliedFilters.splice(index, 1)[0];
    switch (removedFilter.name) {
      case 'fruitType':
        this.fruitType = 'any';
        break;
      case 'hideOrange':
        this.hideOrange = false;
        break;
      default:
        break;
    }
    this.#setFilterActiveState();
  }

  #setFilterActiveState(): void {
    this.appliedFilters = [];

    if (this.fruitType !== 'any') {
      this.appliedFilters.push({
        name: 'fruitType',
        value: this.fruitType,
        label: this.fruitType,
      });
    }

    if (this.hideOrange) {
      this.appliedFilters.push({
        name: 'hideOrange',
        value: true,
        label: 'hide orange fruits',
      });
    }

    this.filtersActive = this.appliedFilters.length > 0;
    this.filteredItems = this.#filterItems(this.items, this.appliedFilters);
  }

  #fruitTypeFilterFailed(filter: Filter, item: Fruit): boolean {
    return (
      filter.name === 'fruitType' &&
      filter.value !== 'any' &&
      filter.value !== item.type
    );
  }

  #itemIsShown(filters: Filter[], item: Fruit): boolean {
    let passesFilter = true,
      j: number;

    for (j = 0; j < filters.length; j++) {
      if (this.#orangeFilterFailed(filters[j], item)) {
        passesFilter = false;
      } else if (this.#fruitTypeFilterFailed(filters[j], item)) {
        passesFilter = false;
      }
    }

    return passesFilter;
  }

  #filterItems(items: Fruit[], filters: Filter[]): Fruit[] {
    let i: number, passesFilter: boolean;
    const result: Fruit[] = [];

    for (i = 0; i < items.length; i++) {
      passesFilter = this.#itemIsShown(filters, items[i]);
      if (passesFilter) {
        result.push(items[i]);
      }
    }

    return result;
  }

  #orangeFilterFailed(filter: Filter, item: Fruit): boolean {
    return (
      filter.name === 'hideOrange' && !!filter.value && item.color === 'orange'
    );
  }
}

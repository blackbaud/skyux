import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { Filter } from './filter';
import { FilterDemoModalContext } from './filter-demo-modal-context';
import { FilterDemoModalComponent } from './filter-demo-modal.component';
import { Fruit } from './fruit';

@Component({
  selector: 'app-filter-demo',
  templateUrl: './filter-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDemoComponent {
  public appliedFilters: Filter[] = [];

  public filteredItems: Fruit[];

  public items: Fruit[] = [
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

  constructor(
    private modal: SkyModalService,
    private changeRef: ChangeDetectorRef
  ) {
    this.filteredItems = this.items.slice();
  }

  public onDismiss(index: number): void {
    this.appliedFilters.splice(index, 1);
    this.filteredItems = this.filterItems(this.items, this.appliedFilters);
  }

  public onInlineFilterButtonClicked(): void {
    this.showInlineFilters = !this.showInlineFilters;
  }

  public onModalFilterButtonClick(): void {
    const modalInstance = this.modal.open(FilterDemoModalComponent, [
      {
        provide: FilterDemoModalContext,
        useValue: {
          appliedFilters: this.appliedFilters,
        },
      },
    ]);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        this.appliedFilters = result.data.slice();
        this.filteredItems = this.filterItems(this.items, this.appliedFilters);
        this.changeRef.markForCheck();
      }
    });
  }

  private fruitTypeFilterFailed(filter: Filter, item: Fruit): boolean {
    return (
      filter.name === 'fruitType' &&
      filter.value !== 'any' &&
      filter.value !== item.type
    );
  }

  private itemIsShown(filters: Filter[], item: Fruit): boolean {
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

  private filterItems(items: Fruit[], filters: Filter[]): Fruit[] {
    let i: number, passesFilter: boolean;
    const result: Fruit[] = [];

    for (i = 0; i < items.length; i++) {
      passesFilter = this.itemIsShown(filters, items[i]);
      if (passesFilter) {
        result.push(items[i]);
      }
    }

    return result;
  }

  private orangeFilterFailed(filter: Filter, item: Fruit): boolean {
    return (
      filter.name === 'hideOrange' && !!filter.value && item.color === 'orange'
    );
  }
}

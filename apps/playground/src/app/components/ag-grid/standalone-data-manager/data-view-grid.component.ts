import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { SkyAgGridColumnComponent, SkyAgGridComponent } from '@skyux/ag-grid';
import { SkyDataManagerModule, SkyDataManagerState } from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';

import { FruitItem } from './fruit-item';

@Component({
  selector: 'app-data-view-grid',
  imports: [SkyDataManagerModule, SkyAgGridComponent, SkyAgGridColumnComponent],
  templateUrl: './data-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewGridComponent {
  public readonly items = input<any[]>([]);

  public readonly displayedItems = computed(() => {
    const displayedItems = this.#filterItems(this.searchItems(this.items()));
    if (this.state()?.onlyShowSelected) {
      return displayedItems.filter((item) => item.selected);
    }
    return displayedItems;
  });

  protected readonly pageSize = 5;
  public readonly state = model<SkyDataManagerState>();
  public readonly searchText = model('');
  public readonly additionalData = model<any>();

  protected readonly currentPage = computed(
    () =>
      (this.additionalData() as { currentPage?: number } | undefined)
        ?.currentPage ?? 1,
  );

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    const searchText = this.searchText();

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (property === 'name' || property === 'description') {
            const propertyText = item[property].toLowerCase();
            if (propertyText.indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    return searchedItems;
  }

  #filterItems(items: FruitItem[]): FruitItem[] {
    let filteredItems = items;
    const filterState = this.state()?.filterData?.filters as
      | SkyFilterBarFilterState
      | undefined;

    if (filterState?.appliedFilters) {
      const filters = filterState.appliedFilters;
      const hideOrange = !!filters.find(
        (f) => f.filterId === 'hideOrange' && f.filterValue?.value,
      );
      const fruitTypeFilter = filters.find((f) => f.filterId === 'fruitType');
      const selectedTypes: string[] = Array.isArray(
        fruitTypeFilter?.filterValue?.value,
      )
        ? (fruitTypeFilter.filterValue.value as Array<{ id: string }>).map(
            (v) => v.id,
          )
        : [];

      filteredItems = items.filter((item) => {
        if (hideOrange && item.color === 'orange') {
          return false;
        }
        if (selectedTypes.length && !selectedTypes.includes(item.type)) {
          return false;
        }
        return true;
      });
    }

    return filteredItems;
  }
}

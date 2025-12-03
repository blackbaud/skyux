import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  model,
} from '@angular/core';
import { SkyDataManagerModule, SkyDataManagerState } from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';
import {
  SkyPagingContentChangeArgs,
  SkyPagingModule,
  SkyRepeaterModule,
} from '@skyux/lists';

import { DataManagerPagedItemsPipe } from './data-manager-paged-items.pipe';
import { FruitItem } from './fruit-item';

@Component({
  selector: 'app-data-view-repeater',
  imports: [
    DataManagerPagedItemsPipe,
    SkyDataManagerModule,
    SkyPagingModule,
    SkyRepeaterModule,
    DataManagerPagedItemsPipe,
  ],
  templateUrl: './data-view-repeater.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewRepeaterComponent {
  public items = input<FruitItem[]>([]); // typed items

  public dataState = model<SkyDataManagerState>();
  public additionalData = model<any>();
  protected displayedItems = computed<FruitItem[]>(() => {
    const selectedIds = this.selectedIds();
    let items: Required<FruitItem>[] = this.items().map((item) => ({
      selected: selectedIds.includes(item.id),
      ...item,
    }));
    items = this.filterItems(this.searchItems(items)) as Required<FruitItem>[];
    if (this.dataState()?.onlyShowSelected) {
      items = items.filter((item) => item.selected);
    }
    return items;
  });

  protected readonly pageSize = 5;
  protected currentPage = linkedSignal(
    () =>
      (this.additionalData() as { currentPage?: number } | undefined)
        ?.currentPage || 1,
  );

  // no explicit constructor logic needed
  public readonly selectedIds = model<string[]>([]);

  public searchItems(items: FruitItem[]): FruitItem[] {
    let searchedItems = items;
    const searchText = this.dataState()?.searchText;

    if (searchText) {
      searchedItems = items.filter(function (item: FruitItem) {
        let property: string;

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

  public filterItems(items: FruitItem[]): FruitItem[] {
    let filteredItems = items;
    const filterState = this.dataState()?.filterData?.filters as
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

  public selectAll(): void {
    this.selectedIds.set(this.items().map((item) => item.id));
  }

  public clearAll(): void {
    this.selectedIds.set([]);
  }

  public onItemSelect(isSelected: boolean, item: FruitItem): void {
    this.selectedIds.update((ids) => {
      if (isSelected === ids.includes(item.id)) {
        return ids;
      } else if (isSelected) {
        return [...ids, item.id];
      } else {
        return ids.filter((id) => id !== item.id);
      }
    });
  }

  protected onContentChange(args: SkyPagingContentChangeArgs): void {
    setTimeout(() => {
      this.additionalData.update((data) => ({
        ...((data as object | undefined) ?? {}),
        currentPage: args.currentPage,
      }));
      args.loadingComplete();
    }, 500);
  }
}

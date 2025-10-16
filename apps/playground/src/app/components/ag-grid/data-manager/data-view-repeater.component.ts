import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
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
  ],
  templateUrl: './data-view-repeater.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewRepeaterComponent implements OnInit {
  @Input()
  public items: FruitItem[]; // typed items
  public dataState = new SkyDataManagerState({});
  public displayedItems: FruitItem[];
  public isActive: boolean;
  public viewId = 'repeaterView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Repeater View',
    iconName: 'text-bullet-list',
    searchEnabled: true,
    searchHighlightEnabled: true,
    multiselectToolbarEnabled: true,
    onClearAllClick: this.clearAll.bind(this),
    onSelectAllClick: this.selectAll.bind(this),
  };

  protected readonly pageSize = 5;
  protected currentPage = 1;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dataManagerService = inject(SkyDataManagerService);

  // no explicit constructor logic needed

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.#dataManagerService.initDataView(this.viewConfig);

    this.#dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.currentPage = state.additionalData?.currentPage ?? 1;
        this.updateData();
      });

    this.#dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive = id === this.viewId;
    });
  }

  public updateData(): void {
    const selectedIds = this.dataState.selectedIds || [];
    this.items.forEach((item) => {
      item.selected = selectedIds.indexOf(item.id) !== -1;
    });
    this.displayedItems = this.filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    this.#dataManagerService.updateDataSummary(
      {
        totalItems: this.items.length,
        itemsMatching: this.displayedItems.length,
      },
      this.viewId,
    );

    this.#changeDetector.detectChanges();
  }

  public searchItems(items: FruitItem[]): FruitItem[] {
    let searchedItems = items;
    const searchText = this.dataState && this.dataState.searchText;

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
    const filterState = this.dataState.filterData?.filters as
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
    const selectedIds = this.dataState.selectedIds || [];

    this.displayedItems.forEach((item) => {
      if (!item.selected) {
        item.selected = true;
        selectedIds.push(item.id);
      }
    });

    this.dataState.selectedIds = selectedIds;
    this.#updateDataState();
    this.#changeDetector.markForCheck();
  }

  public clearAll(): void {
    const selectedIds = this.dataState.selectedIds || [];

    this.displayedItems.forEach((item) => {
      if (item.selected) {
        const itemIndex = selectedIds.indexOf(item.id);
        item.selected = false;
        selectedIds.splice(itemIndex, 1);
      }
    });
    this.dataState.selectedIds = selectedIds;
    this.#updateDataState();
    this.#changeDetector.markForCheck();
  }

  public onItemSelect(isSelected: boolean, item: FruitItem): void {
    const selectedItems = this.dataState.selectedIds || [];
    const itemIndex = selectedItems.indexOf(item.id);

    if (isSelected && itemIndex === -1) {
      selectedItems.push(item.id);
    } else if (!isSelected && itemIndex !== -1) {
      selectedItems.splice(itemIndex, 1);
    }

    this.dataState.selectedIds = selectedItems;
    this.#updateDataState();
  }

  protected onContentChange(args: SkyPagingContentChangeArgs): void {
    setTimeout(() => {
      this.currentPage = args.currentPage;
      this.dataState.additionalData ??= {};
      this.dataState.additionalData.currentPage = args.currentPage;
      this.#updateDataState();

      args.loadingComplete();
    }, 500);
  }

  #updateDataState(): void {
    this.#dataManagerService.updateDataState(this.dataState, this.viewId);
  }
}

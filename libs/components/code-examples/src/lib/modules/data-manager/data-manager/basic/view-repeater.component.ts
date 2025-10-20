import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';
import { SkyRepeaterModule } from '@skyux/lists';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataManagerDemoRow } from './data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const VIEW_ID = 'repeater_view_1';

@Component({
  selector: 'app-view-repeater',
  templateUrl: './view-repeater.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataManagerModule, SkyRepeaterModule],
})
export class ViewRepeaterComponent implements OnInit {

  readonly #destroyRef = inject(DestroyRef);
  readonly #dataManagerSvc = inject(SkyDataManagerService);

  public readonly items = input.required<DataManagerDemoRow[]>();

  protected displayedItems = signal<DataManagerDemoRow[]>([]);
  protected isActive = signal(false);

  protected readonly viewId = VIEW_ID;

  #dataState = new SkyDataManagerState<SkyFilterBarFilterState>({});

  readonly #viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Repeater View',
    iconName: 'text-bullet-list',
    searchEnabled: true,
    sortEnabled: true,
    multiselectToolbarEnabled: true,
    onClearAllClick: () => {
      this.#clearAll();
    },
    onSelectAllClick: () => {
      this.#selectAll();
    },
  };



  public ngOnInit(): void {
    this.displayedItems.set(this.items());

    this.#dataManagerSvc.initDataView(this.#viewConfig);

    this.#dataManagerSvc
      .getDataStateUpdates(this.viewId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((state) => {
        this.#dataState = state;
        this.#updateData();
      });

    this.#dataManagerSvc
      .getActiveViewIdUpdates()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((id) => {
        this.isActive.set(id === VIEW_ID);
      });
  }


  protected onItemSelect(isSelected: boolean, item: DataManagerDemoRow): void {
    const selectedItems = this.#dataState.selectedIds ?? [];
    const itemIndex = selectedItems.indexOf(item.id);

    if (isSelected && itemIndex === -1) {
      selectedItems.push(item.id);
    } else if (!isSelected && itemIndex !== -1) {
      selectedItems.splice(itemIndex, 1);
    }

    this.#dataState.selectedIds = selectedItems;
    this.#dataManagerSvc.updateDataState(this.#dataState, VIEW_ID);

    const displayedItems = this.displayedItems();

    if (this.#dataState.onlyShowSelected && displayedItems) {
      this.displayedItems.set(displayedItems.filter((itm) => itm.selected));
    }
  }

  #updateData(): void {
    const selectedIds = this.#dataState.selectedIds ?? [];

    this.items().forEach((item) => {
      item.selected = selectedIds.includes(item.id);
    });

    this.displayedItems = this.#filterItems(this.#searchItems(this.items));

    if (this.#dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    this.#dataManagerSvc.updateDataSummary(
      {
        totalItems: this.items.length,
        itemsMatching: this.displayedItems.length,
      },
      this.viewId,
    );
  }

  #searchItems(items: DataManagerDemoRow[]): DataManagerDemoRow[] {
    let searchedItems = items;
    const searchText =
      this.#dataState && this.#dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter((item: DataManagerDemoRow) => {
        let property: keyof typeof item;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            (property === 'name' || property === 'description')
          ) {
            const propertyText = item[property].toUpperCase();
            if (propertyText.includes(searchText)) {
              return true;
            }
          }
        }

        return false;
      });
    }

    return searchedItems;
  }

  #filterItems(items: DataManagerDemoRow[]): DataManagerDemoRow[] {
    let filteredItems = items;
    const filterState = this.#dataState.filterData?.filters as
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
        ? fruitTypeFilter.filterValue.value.map((v) => v.id)
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

  #selectAll(): void {
    const selectedIds = this.#dataState.selectedIds ?? [];

    this.displayedItems.forEach((item) => {
      if (!item.selected) {
        item.selected = true;
        selectedIds.push(item.id);
      }
    });

    this.#dataState.selectedIds = selectedIds;
    this.#dataManagerSvc.updateDataState(this.#dataState, this.viewId);
    this.#changeDetector.markForCheck();
  }

  #clearAll(): void {
    const selectedIds = this.#dataState.selectedIds ?? [];

    this.displayedItems.forEach((item) => {
      if (item.selected) {
        const itemIndex = selectedIds.indexOf(item.id);
        item.selected = false;
        selectedIds.splice(itemIndex, 1);
      }
    });

    if (this.#dataState.onlyShowSelected) {
      this.displayedItems = [];
    }

    this.#dataState.selectedIds = selectedIds;
    this.#dataManagerSvc.updateDataState(this.#dataState, this.viewId);
    this.#changeDetector.markForCheck();
  }
}

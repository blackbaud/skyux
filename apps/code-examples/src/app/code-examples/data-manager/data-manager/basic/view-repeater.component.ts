import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyRepeaterModule } from '@skyux/lists';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataManagerDemoRow } from './data';

@Component({
  standalone: true,
  selector: 'app-view-repeater',
  templateUrl: './view-repeater.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyDataManagerModule, SkyRepeaterModule],
})
export class ViewRepeaterComponent implements OnInit, OnDestroy {
  @Input()
  public items: DataManagerDemoRow[] = [];

  protected displayedItems: DataManagerDemoRow[] = [];
  protected isActive = false;

  protected readonly viewId = 'repeaterView';

  #dataState = new SkyDataManagerState({});
  #ngUnsubscribe = new Subject<void>();

  #viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Repeater View',
    icon: 'list',
    searchEnabled: true,
    filterButtonEnabled: true,
    multiselectToolbarEnabled: true,
    onClearAllClick: () => this.#clearAll(),
    onSelectAllClick: () => this.#selectAll(),
  };

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dataManagerSvc = inject(SkyDataManagerService);

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.#dataManagerSvc.initDataView(this.#viewConfig);

    this.#dataManagerSvc
      .getDataStateUpdates(this.viewId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((state) => {
        this.#dataState = state;
        this.#updateData();
      });

    this.#dataManagerSvc
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((id) => {
        this.isActive = id === this.viewId;
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  protected onItemSelect(isSelected: boolean, item: DataManagerDemoRow): void {
    const selectedItems = this.#dataState.selectedIds || [];
    const itemIndex = selectedItems.indexOf(item.id);

    if (isSelected && itemIndex === -1) {
      selectedItems.push(item.id);
    } else if (!isSelected && itemIndex !== -1) {
      selectedItems.splice(itemIndex, 1);
    }

    this.#dataState.selectedIds = selectedItems;
    this.#dataManagerSvc.updateDataState(this.#dataState, this.viewId);

    if (this.#dataState.onlyShowSelected && this.displayedItems) {
      this.displayedItems = this.displayedItems.filter((itm) => itm.selected);
      this.#changeDetector.markForCheck();
    }
  }

  #updateData(): void {
    const selectedIds = this.#dataState.selectedIds || [];

    this.items.forEach((item) => {
      item.selected = selectedIds.indexOf(item.id) !== -1;
    });

    this.displayedItems = this.#filterItems(this.#searchItems(this.items));

    if (this.#dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    this.#changeDetector.markForCheck();
  }

  #searchItems(items: DataManagerDemoRow[]): DataManagerDemoRow[] {
    let searchedItems = items;
    const searchText =
      this.#dataState && this.#dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter(function (item: DataManagerDemoRow) {
        let property: keyof typeof item;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            (property === 'name' || property === 'description')
          ) {
            const propertyText = item[property].toUpperCase();
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

  #filterItems(items: DataManagerDemoRow[]): DataManagerDemoRow[] {
    let filteredItems = items;
    const filterData = this.#dataState && this.#dataState.filterData;

    if (filterData && filterData.filters) {
      const filters = filterData.filters;
      filteredItems = items.filter((item: DataManagerDemoRow) => {
        if (
          ((filters.hideOrange && item.color !== 'orange') ||
            !filters.hideOrange) &&
          ((filters.type !== 'any' && item.type === filters.type) ||
            !filters.type ||
            filters.type === 'any')
        ) {
          return true;
        }

        return false;
      });
    }

    return filteredItems;
  }

  #selectAll(): void {
    const selectedIds = this.#dataState.selectedIds || [];

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
    const selectedIds = this.#dataState.selectedIds || [];

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

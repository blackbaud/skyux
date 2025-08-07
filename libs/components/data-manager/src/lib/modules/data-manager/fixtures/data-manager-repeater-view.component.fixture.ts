import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewConfig } from '../models/data-view-config';

import { DataManagerTestItem } from './data-manager-test-item';

@Component({
  selector: 'sky-data-view-repeater-fixture',
  templateUrl: './data-manager-repeater-view.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DataViewRepeaterFixtureComponent implements OnInit {
  @Input()
  public items: DataManagerTestItem[] = [];

  public dataState: SkyDataManagerState | undefined;
  public displayedItems: DataManagerTestItem[] = [];
  public isActive: boolean | undefined;
  public viewId = 'repeaterView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Repeater View',
    icon: 'list',
    searchEnabled: true,
    filterButtonEnabled: true,
    multiselectToolbarEnabled: true,
    onClearAllClick: this.clearAll.bind(this),
    onSelectAllClick: this.selectAll.bind(this),
  };

  #changeDetector: ChangeDetectorRef;
  #dataManagerService: SkyDataManagerService;

  constructor(
    changeDetector: ChangeDetectorRef,
    dataManagerService: SkyDataManagerService,
  ) {
    this.#changeDetector = changeDetector;
    this.#dataManagerService = dataManagerService;
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.#dataManagerService.initDataView(this.viewConfig);

    this.#dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.updateData();
      });

    this.#dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive = id === this.viewId;
    });
  }

  public updateData(): void {
    const selectedIds = this.dataState?.selectedIds || [];
    this.items.forEach((item) => {
      item.selected = selectedIds.indexOf(item.id) !== -1;
    });
    this.displayedItems = this.filterItems(this.searchItems(this.items));

    if (this.dataState?.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    this.#changeDetector.detectChanges();
  }

  public searchItems(items: DataManagerTestItem[]): DataManagerTestItem[] {
    let searchedItems = items;
    const searchText =
      this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter(function (item) {
        let property: string;

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

  public filterItems(items: DataManagerTestItem[]): DataManagerTestItem[] {
    let filteredItems = items;
    const filterData = this.dataState && this.dataState.filterData;

    if (filterData && filterData.filters) {
      const filters = filterData.filters;
      filteredItems = items.filter((item) => {
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

  public selectAll(): void {
    if (this.dataState) {
      const selectedIds = this.dataState.selectedIds || [];

      this.displayedItems.forEach((item) => {
        if (!item.selected) {
          item.selected = true;
          selectedIds.push(item.id);
        }
      });

      this.dataState.selectedIds = selectedIds;
      this.#dataManagerService.updateDataState(this.dataState, this.viewId);
      this.#changeDetector.markForCheck();
    }
  }

  public clearAll(): void {
    if (this.dataState) {
      const selectedIds = this.dataState.selectedIds || [];

      this.displayedItems.forEach((item) => {
        if (item.selected) {
          const itemIndex = selectedIds.indexOf(item.id);
          item.selected = false;
          selectedIds.splice(itemIndex, 1);
        }
      });
      this.dataState.selectedIds = selectedIds;
      this.#dataManagerService.updateDataState(this.dataState, this.viewId);
      this.#changeDetector.markForCheck();
    }
  }

  public onItemSelect(isSelected: boolean, item: DataManagerTestItem): void {
    if (this.dataState) {
      const selectedItems = this.dataState.selectedIds || [];
      const itemIndex = selectedItems.indexOf(item.id);

      if (isSelected && itemIndex === -1) {
        selectedItems.push(item.id);
      } else if (!isSelected && itemIndex !== -1) {
        selectedItems.splice(itemIndex, 1);
      }

      this.dataState.selectedIds = selectedItems;
      this.#dataManagerService.updateDataState(this.dataState, this.viewId);
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { SkyDataManagerDemoRow } from './data-manager-demo-data';

@Component({
  selector: 'app-data-view-repeater-demo',
  templateUrl: './data-view-repeater.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewRepeaterDemoComponent implements OnInit {
  @Input()
  public items: SkyDataManagerDemoRow[] = [];

  public dataState = new SkyDataManagerState({});

  public displayedItems: SkyDataManagerDemoRow[] = [];

  public isActive = false;

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

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {}

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.initDataView(this.viewConfig);

    this.dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.updateData();
      });

    this.dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive = id === this.viewId;
      this.changeDetector.detectChanges();
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

    this.changeDetector.detectChanges();
  }

  public searchItems(items: SkyDataManagerDemoRow[]): SkyDataManagerDemoRow[] {
    let searchedItems = items;
    const searchText =
      this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter(function (item: SkyDataManagerDemoRow) {
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

  public filterItems(items: SkyDataManagerDemoRow[]): SkyDataManagerDemoRow[] {
    let filteredItems = items;
    const filterData = this.dataState && this.dataState.filterData;

    if (filterData && filterData.filters) {
      const filters = filterData.filters;
      filteredItems = items.filter((item: SkyDataManagerDemoRow) => {
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
    const selectedIds = this.dataState.selectedIds || [];

    this.displayedItems.forEach((item) => {
      if (!item.selected) {
        item.selected = true;
        selectedIds.push(item.id);
      }
    });

    this.dataState.selectedIds = selectedIds;
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
    this.changeDetector.markForCheck();
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

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = [];
    }

    this.dataState.selectedIds = selectedIds;
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
    this.changeDetector.markForCheck();
  }

  public onItemSelect(isSelected: boolean, item: SkyDataManagerDemoRow): void {
    const selectedItems = this.dataState.selectedIds || [];
    const itemIndex = selectedItems.indexOf(item.id);

    if (isSelected && itemIndex === -1) {
      selectedItems.push(item.id);
    } else if (!isSelected && itemIndex !== -1) {
      selectedItems.splice(itemIndex, 1);
    }

    this.dataState.selectedIds = selectedItems;
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
    if (this.dataState.onlyShowSelected && this.displayedItems) {
      this.displayedItems = this.displayedItems.filter((itm) => itm.selected);
      this.changeDetector.markForCheck();
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import {
  SkyPagingContentChangeArgs,
  SkyPagingModule,
  SkyRepeaterModule,
} from '@skyux/lists';

import { DataManagerPagedItemsPipe } from './data-manager-paged-items.pipe';

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
  public items: any[];

  public dataState = new SkyDataManagerState({});
  public displayedItems: any[];
  public isActive: boolean;
  public viewId = 'repeaterView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Repeater View',
    iconName: 'text-bullet-list',
    searchEnabled: true,
    searchHighlightEnabled: true,
    filterButtonEnabled: true,
    multiselectToolbarEnabled: true,
    onClearAllClick: this.clearAll.bind(this),
    onSelectAllClick: this.selectAll.bind(this),
  };

  protected readonly pageSize = 5;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
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

    this.dataManagerService.updateDataSummary(
      {
        totalItems: this.items.length,
        itemsMatching: this.displayedItems.length,
      },
      this.viewId,
    );

    this.changeDetector.detectChanges();
  }

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    const searchText = this.dataState && this.dataState.searchText;

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

  public filterItems(items: any[]): any[] {
    let filteredItems = items;
    const filterData = this.dataState && this.dataState.filterData;

    if (filterData && filterData.filters) {
      const filters = filterData.filters;
      filteredItems = items.filter((item: any) => {
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
    this.#updateDataState();
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
    this.dataState.selectedIds = selectedIds;
    this.#updateDataState();
    this.changeDetector.markForCheck();
  }

  public onItemSelect(isSelected: boolean, item: any): void {
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
      this.dataState.additionalData.currentPage = args.currentPage;
      this.#updateDataState();

      args.loadingComplete();
    }, 500);
  }

  #updateDataState(): void {
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
  }
}

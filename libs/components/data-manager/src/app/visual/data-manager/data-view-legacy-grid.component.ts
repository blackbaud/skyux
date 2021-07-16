import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService
} from '../../public/public_api';

/**
 * We are using the legacy grid here to avoid potential circular dependencies with pulling our
 * AG Grid library into this library. We needed this example to be able to see the column picker
 * in a real-world scenario.
 */
@Component({
  selector: 'data-view-legacy-grid',
  templateUrl: './data-view-legacy-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewLegacyGridComponent implements OnInit {
  @Input()
  public items: any[];

  public columns: any[] = [
    {
      id: 'name',
      label: 'Fruit name',
      description: 'The name of the fruit.'
    },
    {
      id: 'description',
      label: 'Description',
      description: 'Some information about the fruit.'
    },
    {
      id: 'type',
      label: 'Type',
      description: 'The type of fruit.'
    },
    {
      id: 'color',
      label: 'Color',
      description: 'The color of the fruit.'
    }
  ];

  public dataState: SkyDataManagerState;
  public displayedColumns: any[] = [
    this.columns[0],
    this.columns[1]
  ];
  public displayedItems: any[];
  public isActive: boolean;
  public viewId = 'gridView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Grid View',
    icon: 'table',
    searchEnabled: true,
    filterButtonEnabled: true,
    columnPickerEnabled: true,
    columnOptions: this.columns
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) { }

  public ngOnInit(): void {
    this.dataManagerService.initDataView(this.viewConfig);

    this.dataManagerService.getDataStateUpdates(this.viewId).subscribe(state => {
      this.dataState = state;
      this.updateData();
    });

    this.dataManagerService.getActiveViewIdUpdates().subscribe(id => {
      this.isActive = id === this.viewId;
    });
  }

  public updateData(): void {
    if (this.dataState) {
      this.displayedColumns = this.columns
        .filter(column => this.dataState.getViewStateById(this.viewId).displayedColumnIds.indexOf(column.id) >= 0);
      let selectedIds = this.dataState.selectedIds || [];
      this.items.forEach(item => {
        item.selected = selectedIds.indexOf(item.id) !== -1;
      });
      this.displayedItems = this.filterItems(this.searchItems(this.items));

      if (this.dataState.onlyShowSelected) {
        this.displayedItems = this.displayedItems.filter(item => item.selected);
      }

      this.changeDetector.detectChanges();
    }
  }

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    let searchText = this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (item.hasOwnProperty(property) && (property === 'name' || property === 'description')) {
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

  public filterItems(items: any[]): any[] {
    let filteredItems = items;
    let filterData = this.dataState && this.dataState.filterData;

    if (filterData && filterData.filters) {
      let filters = filterData.filters;
      filteredItems = items.filter((item: any) => {
        if (((filters.hideOrange && item.color !== 'orange') || !filters.hideOrange) &&
          ((filters.type !== 'any' && item.type === filters.type) || (!filters.type || filters.type === 'any'))) {
          return true;
        }
        return false;
      });
    }

    return filteredItems;
  }
}

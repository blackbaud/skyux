import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import {
  ColDef,
  ColumnApi,
  ColumnState,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowSelectedEvent,
} from 'ag-grid-community';

@Component({
  selector: 'app-data-view-grid-demo',
  templateUrl: './data-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewGridDemoComponent implements OnInit {
  @Input()
  public items: any[] = [];

  public viewId = 'gridView';

  public columnDefs: ColDef[] = [
    {
      colId: 'selected',
      field: 'selected',
      headerName: '',
      maxWidth: 50,
      type: SkyCellType.RowSelector,
      suppressMovable: true,
      lockPosition: true,
      lockVisible: true,
    },
    {
      colId: 'name',
      field: 'name',
      headerName: 'Fruit name',
      width: 150,
    },
    {
      colId: 'description',
      field: 'description',
      headerName: 'Description',
    },
  ];

  public dataState = new SkyDataManagerState({});

  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Grid View',
    icon: 'table',
    searchEnabled: true,
    sortEnabled: true,
    multiselectToolbarEnabled: true,
    columnPickerEnabled: true,
    filterButtonEnabled: true,
    columnOptions: [
      {
        id: 'selected',
        alwaysDisplayed: true,
        label: 'selected',
      },
      {
        id: 'name',
        label: 'Fruit name',
        description: 'The name of the fruit.',
      },
      {
        id: 'description',
        label: 'Description',
        description: 'Some information about the fruit.',
      },
    ],
  };

  public columnApi?: ColumnApi;
  public displayedItems: any[] = [];
  public gridApi?: GridApi;
  public gridInitialized = false;
  public gridOptions!: GridOptions;
  public noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;
  public isActive = false;

  constructor(
    private agGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {}

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.initDataView(this.viewConfig);

    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs,
        onGridReady: this.onGridReady.bind(this),
      },
    });

    this.dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.setInitialColumnOrder();
        this.updateData();
        this.changeDetector.detectChanges();
      });

    this.dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive = id === this.viewId;
      this.changeDetector.detectChanges();
    });
  }

  public updateData(): void {
    this.sortItems();
    this.displayedItems = this.filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    if (this.displayedItems.length > 0) {
      this.gridApi?.hideOverlay();
    } else {
      this.gridApi?.showNoRowsOverlay();
    }
  }

  public setInitialColumnOrder(): void {
    const viewState = this.dataState.getViewStateById(this.viewId);
    const visibleColumns = viewState.displayedColumnIds;

    this.columnDefs.sort((col1, col2) => {
      const col1Index = visibleColumns.findIndex(
        (colId: string) => colId === col1.colId
      );
      const col2Index = visibleColumns.findIndex(
        (colId: string) => colId === col2.colId
      );

      if (col1Index === -1) {
        col1.hide = true;
        return 0;
      } else if (col2Index === -1) {
        col2.hide = true;
        return 0;
      } else {
        return col1Index - col2Index;
      }
    });

    this.gridInitialized = true;
  }

  public onGridReady(event: GridReadyEvent): void {
    this.columnApi = event.columnApi;
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
    this.updateData();
  }

  public onRowSelected(rowSelectedEvent: RowSelectedEvent): void {
    if (!rowSelectedEvent.data.selected) {
      this.updateData();
    }
  }

  public sortItems(): void {
    const sortOption = this.dataState.activeSortOption;
    if (this.columnApi && sortOption) {
      const sort: ColumnState[] = [
        {
          colId: sortOption.propertyName,
          sort: sortOption.descending ? 'desc' : 'asc',
        },
      ];

      this.columnApi.applyColumnState({
        state: sort,
      });
    }
  }

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    const searchText = this.dataState && this.dataState.searchText;

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            (property === 'name' || property === 'description')
          ) {
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
        return (
          ((filters.hideOrange && item.color !== 'orange') ||
            !filters.hideOrange) &&
          ((filters.type !== 'any' && item.type === filters.type) ||
            !filters.type ||
            filters.type === 'any')
        );
      });
    }

    return filteredItems;
  }
}

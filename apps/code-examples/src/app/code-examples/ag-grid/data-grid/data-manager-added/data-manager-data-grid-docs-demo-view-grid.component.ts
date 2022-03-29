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
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowSelectedEvent,
  ValueFormatterParams,
} from '@ag-grid-community/core';

@Component({
  selector: 'app-data-manager-data-grid-docs-demo-view-grid',
  templateUrl: './data-manager-data-grid-docs-demo-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagerDataGridsDocsDemoViewGridComponent implements OnInit {
  @Input()
  public items: any[] = [];

  public viewId = 'dataGridWithDataManagerView';

  public columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
    },
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      maxWidth: 60,
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      type: SkyCellType.Date,
      sort: 'asc',
    },
    {
      field: 'endDate',
      headerName: 'End date',
      type: SkyCellType.Date,
      valueFormatter: this.endDateFormatter,
    },
    {
      field: 'department',
      headerName: 'Department',
      type: SkyCellType.Autocomplete,
    },
    {
      field: 'jobTitle',
      headerName: 'Title',
      type: SkyCellType.Autocomplete,
    },
  ];

  public dataState = new SkyDataManagerState({});

  public columnApi?: ColumnApi;
  public displayedItems: any[] = [];
  public gridApi?: GridApi;
  public gridInitialized = false;
  public gridOptions!: GridOptions;
  public noRowsTemplate: string;
  public isActive = false;

  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Data Grid View',
    icon: 'table',
    searchEnabled: true,
    sortEnabled: true,
    multiselectToolbarEnabled: true,
    columnPickerEnabled: true,
    filterButtonEnabled: true,
    columnOptions: [
      {
        id: 'selected',
        label: 'selected',
        alwaysDisplayed: true,
      },
      {
        id: 'name',
        label: 'Name',
        description: 'The name of the employee.',
      },
      {
        id: 'age',
        label: 'Age',
        description: 'The age of the employee.',
      },
      {
        id: 'startDate',
        label: 'Start date',
        description: 'The start date of the employee.',
      },
      {
        id: 'endDate',
        label: 'End date',
        description: 'The end date of the employee.',
      },
      {
        id: 'department',
        label: 'Department',
        description: 'The department of the employee',
      },
      {
        id: 'jobTitle',
        label: 'Title',
        description: 'The job title of the employee.',
      },
    ],
  };

  constructor(
    private agGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    this.noRowsTemplate = `<div class="sky-deemphasized">No results found.</div>`;
  }

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

    this.changeDetector.markForCheck();
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
    this.changeDetector.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.columnApi = gridReadyEvent.columnApi;
    this.updateData();
    this.changeDetector.markForCheck();
  }

  public onRowSelected(rowSelectedEvent: RowSelectedEvent): void {
    if (!rowSelectedEvent.data.selected) {
      this.updateData();
    }
  }

  public sortItems(): void {
    const sortOption = this.dataState.activeSortOption;
    if (this.columnApi && sortOption) {
      this.columnApi.applyColumnState({
        state: [
          {
            colId: sortOption.propertyName,
            sort: sortOption.descending ? 'desc' : 'asc',
          },
        ],
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
          ((filters.hideSales && item.department.name !== 'Sales') ||
            !filters.hideSales) &&
          ((filters.jobTitle !== 'any' &&
            item.jobTitle?.name === filters.jobTitle) ||
            !filters.jobTitle ||
            filters.jobTitle === 'any')
        );
      });
    }

    return filteredItems;
  }

  private endDateFormatter(params: ValueFormatterParams): string {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return params.value
      ? params.value.toLocaleDateString('en-us', dateConfig)
      : 'N/A';
  }
}

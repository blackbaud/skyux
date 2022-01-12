import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SkyCellType, SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import {
  GridApi,
  GridReadyEvent,
  GridOptions,
  ValueFormatterParams,
  ColumnApi,
  ColDef,
} from 'ag-grid-community';

import { SKY_AG_GRID_DEMO_DATA } from './data-manager-data-grid-docs-demo-data';
import { DataManagerDataGridDocsDemoFiltersModalComponent } from './data-manager-data-grid-docs-demo-filter-modal.component';

@Component({
  selector: 'app-data-manager-data-grid-docs-demo',
  templateUrl: './data-manager-data-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class SkyDataManagerDataGridDemoComponent implements OnInit {
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
    {
      colId: 'validationCurrency',
      field: 'validationCurrency',
      type: [SkyCellType.CurrencyValidator],
    },
    {
      colId: 'validationDate',
      field: 'validationDate',
      type: [SkyCellType.Date, SkyCellType.Validator],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: Date) => !!value && value > new Date(1985, 9, 26),
          validatorMessage: 'Please enter a future date',
        },
      },
    },
  ];

  public columnApi?: ColumnApi;
  public displayedItems: any[] = [];
  public gridApi?: GridApi;
  public gridInitialized = false;
  public items = SKY_AG_GRID_DEMO_DATA;
  public gridOptions!: GridOptions;

  public searchText: string = '';
  public activeViewId = 'dataManagerGridView';
  public viewId = 'dataManagerGridView';
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
        label: 'Selected',
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
      {
        id: 'validationCurrency',
        label: 'Validation currency',
        description: 'An example column for currency validation.',
      },
      {
        id: 'validationDate',
        label: 'Validation date',
        description: 'An example column for date validation.',
      },
    ],
  };
  public dataState = new SkyDataManagerState({});

  public dataManagerConfig = {
    filterModalComponent: DataManagerDataGridDocsDemoFiltersModalComponent,
    sortOptions: [
      {
        id: 'az',
        label: 'Name (A-Z)',
        descending: false,
        propertyName: 'name',
      },
      {
        id: 'za',
        label: 'Name (Z-A)',
        descending: true,
        propertyName: 'name',
      },
    ],
  };
  public defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {
        hideSales: false,
      },
    },
    views: [
      {
        viewId: this.viewId,
        displayedColumnIds: [
          'selected',
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
          'validationCurrency',
          'validationDate',
        ],
      },
    ],
  });

  constructor(
    private agGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    this.dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.setInitialColumnOrder();
        this.updateData();
        this.changeDetector.markForCheck();
      });
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.initDataManager({
      activeViewId: this.activeViewId,
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
    });

    this.dataManagerService.initDataView(this.viewConfig);

    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs,
        onGridReady: this.onGridReady.bind(this),
      },
    });
    this.changeDetector.markForCheck();
  }

  public updateData(): void {
    this.sortItems();
    this.displayedItems = this.filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }
    this.changeDetector.markForCheck();
  }

  public setInitialColumnOrder(): void {
    let viewState = this.dataState.getViewStateById(this.viewId);
    let visibleColumns = viewState.displayedColumnIds;

    this.columnDefs.sort((col1, col2) => {
      let col1Index = visibleColumns.findIndex(
        (colId: string) => colId === col1.colId
      );
      let col2Index = visibleColumns.findIndex(
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

  public sortItems(): void {
    let sortOption = this.dataState.activeSortOption;
    if (this.columnApi && sortOption) {
      const allColumns = this.columnApi.getAllColumns() || [];
      allColumns.forEach((column) => {
        if (column.getColId() === sortOption.propertyName) {
          column.setSort(sortOption.descending ? 'desc' : 'asc');
        } else {
          column.setSort('none');
        }
      });
    }
  }

  public clearAll(): void {
    if (this.dataState) {
      let selectedIds = this.dataState.selectedIds || [];

      this.displayedItems.forEach((item) => {
        if (item.selected) {
          let itemIndex = selectedIds.indexOf(item.id);
          item.selected = false;
          selectedIds.splice(itemIndex, 1);
        }
      });
      this.dataState.selectedIds = selectedIds;
      this.dataManagerService.updateDataState(this.dataState, this.viewId);
    }
  }

  public selectAll(): void {
    if (this.dataState) {
      let selectedIds = this.dataState.selectedIds || [];

      this.displayedItems.forEach((item) => {
        if (!item.selected) {
          item.selected = true;
          selectedIds.push(item.id);
        }
      });

      this.dataState.selectedIds = selectedIds;
      this.dataManagerService.updateDataState(this.dataState, this.viewId);
    }
  }

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    let searchText = this.dataState && this.dataState.searchText;

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (
            item.hasOwnProperty(property) &&
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
    let filterData = this.dataState && this.dataState.filterData;

    if (filterData && filterData.filters) {
      let filters = filterData.filters;
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

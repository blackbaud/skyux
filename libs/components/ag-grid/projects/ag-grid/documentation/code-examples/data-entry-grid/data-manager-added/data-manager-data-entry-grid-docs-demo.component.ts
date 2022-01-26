import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService,
} from '@skyux/data-manager';

import { SkyDataManagerDataEntryGridContextMenuComponent } from './data-manager-data-entry-grid-docs-demo-context-menu.component';
import { SKY_AG_GRID_DEMO_DATA } from './data-manager-data-entry-grid-docs-demo-data';
import { SkyDataEntryGridEditModalContext } from './data-manager-data-entry-grid-docs-demo-edit-modal-context';
import { SkyDataManagerDataEntryGridEditModalComponent } from './data-manager-data-entry-grid-docs-demo-edit-modal.component';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';
import { DataManagerDataEntryGridDocsDemoFiltersModalComponent } from './data-manager-data-entry-grid-docs-demo-filter-modal.component';

@Component({
  selector: 'app-data-manager-data-entry-grid-docs-demo',
  templateUrl: './data-manager-data-entry-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class SkyDataManagerDataEntryGridDemoComponent implements OnInit {
  public columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
    },
    {
      field: 'context',
      headerName: '',
      maxWidth: 50,
      sortable: false,
      cellRendererFramework: SkyDataManagerDataEntryGridContextMenuComponent,
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
      field: 'validationCurrency',
      headerName: 'Validation currency',
      type: [SkyCellType.CurrencyValidator],
    },
    {
      field: 'validationDate',
      headerName: 'Validation date',
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
  public gridData = SKY_AG_GRID_DEMO_DATA;

  public viewId = 'gridView';
  public activeViewId = 'gridView';

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
        label: 'selected',
        alwaysDisplayed: true,
      },

      {
        id: 'context',
        label: 'context',
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

  public dataManagerConfig = {
    filterModalComponent: DataManagerDataEntryGridDocsDemoFiltersModalComponent,
    sortOptions: [
      {
        id: 'az',
        label: 'Name (A - Z)',
        descending: false,
        propertyName: 'name',
      },
      {
        id: 'za',
        label: 'Name (Z - A)',
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

  public gridApi?: GridApi;
  public gridInitialized = false;
  public gridOptions!: GridOptions;
  public noRowsTemplate: string;

  constructor(
    private agGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
    private modalService: SkyModalService
  ) {
    this.noRowsTemplate = `<div class="sky-deemphasized">No results found.</div>`;
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
    this.displayedItems = this.gridData;

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
    this.displayedItems = this.filterItems(this.searchItems(this.gridData));

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

  public onGridReady(event: GridReadyEvent): void {
    this.columnApi = event.columnApi;
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
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

  public openModal(): void {
    const context = new SkyDataEntryGridEditModalContext();
    context.gridData = this.gridData;
    this.changeDetector.markForCheck();

    const options = {
      providers: [
        { provide: SkyDataEntryGridEditModalContext, useValue: context },
      ],
      ariaDescribedBy: 'docs-edit-grid-modal-content',
      size: 'large',
    };

    const modalInstance = this.modalService.open(
      SkyDataManagerDataEntryGridEditModalComponent,
      options
    );

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'cancel' || result.reason === 'close') {
        alert('Edits canceled!');
      } else {
        this.gridData = result.data;
        if (this.gridApi) {
          this.gridApi.refreshCells();
        }
        alert('Saving data!');
      }
      this.changeDetector.markForCheck();
    });
  }

  private endDateFormatter(params: ValueFormatterParams): string {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return params.value
      ? params.value.toLocaleDateString('en-us', dateConfig)
      : 'N/A';
  }
}

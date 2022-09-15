import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService,
  SkyDataManagerColumnPickerOption,
  SkyDataViewState,
} from '@skyux/data-manager';

import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
  RowSelectedEvent,
} from 'ag-grid-community';

@Component({
  selector: 'app-data-manager-data-grid-docs-demo-view-grid',
  templateUrl: './data-manager-data-grid-docs-demo-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagerDataGridDocsDemoViewGridComponent implements OnInit {
  @Input()
  public items: any[] = [];

  @Input()
  public set enableMultiselect(value: boolean) {
    if (value !== this.enableMultiselectOrDefault) {
      this.enableMultiselectOrDefault = value || false;

      if (this.gridApi) {
        this.updateViewState();
        this.updateColumnOrder();
        this.updateGridOptionsSelectionType();
        this.updateColumnDefinitions();
        this.checkForDeselect();
        this.updateViewConfig();
      }

      this.changeDetector.markForCheck();
    }
  }

  public viewId = 'dataGridWithDataManagerView';

  public singleSelectColumnDefinitions: ColDef[] = [
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

  public multiSelectColumnDefinitions: ColDef[] = [
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

  private columnPickerOptions: SkyDataManagerColumnPickerOption[] = [
    {
      id: 'selected',
      label: '',
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
  ];

  public dataState = new SkyDataManagerState({});

  public columnApi?: ColumnApi;
  public displayedItems: any[] = [];
  public gridApi?: GridApi;
  public isGridReadyForInitialization: boolean = false;
  public gridOptions!: GridOptions;
  public noRowsTemplate: string;
  public isThisViewActive: boolean = false;

  public enableMultiselectOrDefault: boolean = false;

  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Data Grid View',
    icon: 'table',
    searchEnabled: true,
    sortEnabled: true,
    multiselectToolbarEnabled: false,
    columnPickerEnabled: true,
    filterButtonEnabled: true,
    columnOptions: this.columnPickerOptions,
  };

  constructor(
    private skyAgGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    this.noRowsTemplate = `<div class="sky-deemphasized">No results found.</div>`;
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.initDataView(this.viewConfig);

    this.gridOptions = this.skyAgGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.enableMultiselectOrDefault
          ? this.multiSelectColumnDefinitions
          : this.singleSelectColumnDefinitions,
        rowSelection: this.enableMultiselectOrDefault ? 'multiple' : 'single',
        onGridReady: this.onGridReady.bind(this),
      },
    });

    this.dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.updateViewState();
        this.updateColumnOrder();
        this.updateGridOptionsSelectionType();
        this.updateViewConfig();
        this.isGridReadyForInitialization = true;
        this.updateDisplayedItems();
        this.changeDetector.detectChanges();
      });

    this.dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isThisViewActive = id === this.viewId;
      this.changeDetector.detectChanges();
    });
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.columnApi = gridReadyEvent.columnApi;
    this.updateGridOptionsSelectionType();
    this.updateColumnDefinitions();
    this.checkForDeselect();
    this.updateViewConfig();
    this.updateViewState();
    this.updateDisplayedItems();
    this.changeDetector.markForCheck();
  }

  public onRowSelected(rowSelectedEvent: RowSelectedEvent): void {
    if (!rowSelectedEvent.data.selected) {
      this.updateDisplayedItems();
    }
  }

  private searchItems(items: any[]): any[] {
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

  private filterItems(items: any[]): any[] {
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

  // TODO: put this logic in the skyAgGridDataManagerAdapter
  private updateColumnOrder(): void {
    let viewState: SkyDataViewState = this.dataState.getViewStateById(
      this.viewId
    );

    const columnDefinitionsToModify = this.enableMultiselectOrDefault
      ? this.multiSelectColumnDefinitions
      : this.singleSelectColumnDefinitions;
    columnDefinitionsToModify.sort((columnDefinition1, columnDefinition2) => {
      let displayedColumnIdIndex1: number =
        viewState.displayedColumnIds.findIndex(
          (aDisplayedColumnId: string) =>
            aDisplayedColumnId === columnDefinition1.field
        );
      let displayedColumnIdIndex2: number =
        viewState.displayedColumnIds.findIndex(
          (aDisplayedColumnId: string) =>
            aDisplayedColumnId === columnDefinition2.field
        );

      if (displayedColumnIdIndex1 === -1) {
        return 0;
      } else if (displayedColumnIdIndex2 === -1) {
        return 0;
      } else {
        return displayedColumnIdIndex1 - displayedColumnIdIndex2;
      }
    });
    this.changeDetector.markForCheck();
  }

  private updateGridOptionsSelectionType() {
    this.gridOptions.rowSelection = this.enableMultiselectOrDefault
      ? 'multiple'
      : 'single';
  }

  private updateColumnDefinitions() {
    this.gridApi.setColumnDefs(
      this.enableMultiselectOrDefault
        ? this.multiSelectColumnDefinitions
        : this.singleSelectColumnDefinitions
    );

    this.gridApi.sizeColumnsToFit();
  }

  private checkForDeselect() {
    if (!this.enableMultiselectOrDefault) {
      this.gridApi.deselectAll();
    }
  }

  private updateViewConfig() {
    this.dataManagerService.updateViewConfig({
      ...this.viewConfig,
      multiselectToolbarEnabled: this.enableMultiselectOrDefault,
    });
  }

  private updateViewState() {
    let viewState = this.dataState.getViewStateById(this.viewId);
    if (this.enableMultiselectOrDefault) {
      if (!viewState.columnIds.includes('selected')) {
        viewState.columnIds.unshift('selected');
        viewState.displayedColumnIds.unshift('selected');
      }
    } else {
      if (viewState.columnIds.includes('selected')) {
        viewState.columnIds.shift();
        viewState.displayedColumnIds.shift();
      }
    }
    this.dataState.addOrUpdateView(this.viewId, viewState);
  }

  private updateDisplayedItems(): void {
    let sortOption = this.dataState.activeSortOption;
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
}

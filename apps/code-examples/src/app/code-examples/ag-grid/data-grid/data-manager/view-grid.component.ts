import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerColumnPickerOption,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataViewState,
} from '@skyux/data-manager';

import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowSelectedEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';

import { ContextMenuComponent } from './context-menu.component';
import { AgGridDemoRow } from './data';
import { Filters } from './filters';

@Component({
  standalone: true,
  selector: 'app-view-grid',
  templateUrl: './view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule],
})
export class ViewGridComponent implements OnInit, OnDestroy {
  @Input()
  public items: AgGridDemoRow[] = [];

  protected displayedItems: AgGridDemoRow[] = [];
  protected gridOptions!: GridOptions;
  protected isGridReadyForInitialization = false;
  protected isViewActive = false;
  protected noRowsTemplate = `<div class="sky-deemphasized">No results found.</div>`;
  protected viewConfig: SkyDataViewConfig;

  #columnDefs: ColDef[] = [
    {
      colId: 'context',
      maxWidth: 50,
      sortable: false,
      cellRenderer: ContextMenuComponent,
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
      valueFormatter: (params: ValueFormatterParams<AgGridDemoRow, Date>) =>
        this.#endDateFormatter(params),
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

  #columnPickerOptions: SkyDataManagerColumnPickerOption[] = [
    {
      id: 'context',
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

  #dataState = new SkyDataManagerState({});
  #gridApi: GridApi | undefined;
  #ngUnsubscribe = new Subject<void>();
  #viewId = 'dataGridWithDataManagerView';

  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #dataManagerSvc = inject(SkyDataManagerService);

  constructor() {
    this.viewConfig = {
      id: this.#viewId,
      name: 'Data Grid View',
      icon: 'table',
      searchEnabled: true,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      columnOptions: this.#columnPickerOptions,
    };
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.#dataManagerSvc.initDataView(this.viewConfig);

    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs,
        onGridReady: this.onGridReady.bind(this),
        rowSelection: { mode: 'singleRow' },
      },
    });

    this.#dataManagerSvc
      .getDataStateUpdates(this.#viewId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((state) => {
        this.#dataState = state;
        this.#updateColumnOrder();
        this.isGridReadyForInitialization = true;
        this.#updateDisplayedItems();
        this.#changeDetectorRef.detectChanges();
      });

    this.#dataManagerSvc
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((id) => {
        this.isViewActive = id === this.#viewId;
        this.#changeDetectorRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#updateDisplayedItems();
  }

  protected onRowSelected(
    rowSelectedEvent: RowSelectedEvent<AgGridDemoRow>,
  ): void {
    if (!rowSelectedEvent.data?.selected) {
      this.#updateDisplayedItems();
    }
  }

  #searchItems(items: AgGridDemoRow[]): AgGridDemoRow[] {
    let searchedItems = items;
    const searchText = this.#dataState && this.#dataState.searchText;

    if (searchText) {
      searchedItems = items.filter((item: AgGridDemoRow) => {
        let property: keyof typeof item;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            property === 'name'
          ) {
            const propertyText = item[property].toLowerCase();

            if (propertyText.includes(searchText)) {
              return true;
            }
          }
        }

        return false;
      });
    }

    return searchedItems;
  }

  #filterItems(items: AgGridDemoRow[]): AgGridDemoRow[] {
    let filteredItems = items;
    const filterData = this.#dataState && this.#dataState.filterData;

    if (filterData?.filters) {
      const filters = filterData.filters as Filters;

      filteredItems = items.filter((item: AgGridDemoRow) => {
        return (
          (!!(filters.hideSales && item.department.name !== 'Sales') ||
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

  #endDateFormatter(params: ValueFormatterParams<AgGridDemoRow, Date>): string {
    return params.value
      ? params.value.toLocaleDateString('en-us', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : 'N/A';
  }

  #updateColumnOrder(): void {
    const viewState: SkyDataViewState | undefined =
      this.#dataState.getViewStateById(this.#viewId);

    if (viewState) {
      this.#columnDefs.sort((columnDefinition1, columnDefinition2) => {
        const displayedColumnIdIndex1: number =
          viewState.displayedColumnIds.findIndex(
            (aDisplayedColumnId: string) =>
              aDisplayedColumnId === columnDefinition1.field,
          );

        const displayedColumnIdIndex2: number =
          viewState.displayedColumnIds.findIndex(
            (aDisplayedColumnId: string) =>
              aDisplayedColumnId === columnDefinition2.field,
          );

        if (displayedColumnIdIndex1 === -1) {
          return 0;
        } else if (displayedColumnIdIndex2 === -1) {
          return 0;
        } else {
          return displayedColumnIdIndex1 - displayedColumnIdIndex2;
        }
      });

      this.#changeDetectorRef.markForCheck();
    }
  }

  #updateDisplayedItems(): void {
    this.displayedItems = this.#filterItems(this.#searchItems(this.items));

    if (this.#dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    if (this.displayedItems.length > 0) {
      this.#gridApi?.hideOverlay();
    } else {
      this.#gridApi?.showNoRowsOverlay();
    }

    this.#dataManagerSvc.updateDataSummary(
      {
        totalItems: this.items.length,
        itemsMatching: this.displayedItems.length,
      },
      this.#viewId,
    );
  }
}

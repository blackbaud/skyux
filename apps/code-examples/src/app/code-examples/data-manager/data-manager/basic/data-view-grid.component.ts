import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerDemoRow } from './data-manager-demo-data';

@Component({
  selector: 'app-data-view-grid-demo',
  templateUrl: './data-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewGridDemoComponent implements OnInit, OnDestroy {
  @Input()
  public items: SkyDataManagerDemoRow[] = [];

  public readonly viewId = 'gridView';

  public displayedItems: SkyDataManagerDemoRow[] = [];
  public gridInitialized = false;
  public gridOptions: GridOptions;
  public isActive = false;
  public noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;

  #columnDefs: ColDef[] = [
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

  #columnApi?: ColumnApi;
  #dataState = new SkyDataManagerState({});
  #gridApi?: GridApi;
  #ngUnsubscribe = new Subject<void>();

  #viewConfig: SkyDataViewConfig = {
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

  #agGridSvc = inject(SkyAgGridService);
  #changeDetector = inject(ChangeDetectorRef);
  #dataManagerSvc = inject(SkyDataManagerService);

  constructor() {
    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs,
        onGridReady: (args) => {
          this.#onGridReady(args);
        },
      },
    });
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.#dataManagerSvc.initDataView(this.#viewConfig);

    this.#dataManagerSvc
      .getDataStateUpdates(this.viewId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((state) => {
        this.#dataState = state;
        this.#setInitialColumnOrder();
        this.#updateData();
        this.#changeDetector.markForCheck();
      });

    this.#dataManagerSvc
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((id) => {
        this.isActive = id === this.viewId;
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onRowSelected(rowSelectedEvent: RowSelectedEvent): void {
    if (!rowSelectedEvent.data.selected) {
      this.#updateData();
    }
  }

  #filterItems(items: SkyDataManagerDemoRow[]): SkyDataManagerDemoRow[] {
    let filteredItems = items;

    const filterData = this.#dataState && this.#dataState.filterData;

    if (filterData && filterData.filters) {
      const filters = filterData.filters;

      filteredItems = items.filter((item) => {
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

  #onGridReady(event: GridReadyEvent): void {
    this.#columnApi = event.columnApi;
    this.#gridApi = event.api;
    this.#gridApi.sizeColumnsToFit();
    this.#updateData();
  }

  #searchItems(items: SkyDataManagerDemoRow[]): SkyDataManagerDemoRow[] {
    let searchedItems = items;
    const searchText = this.#dataState && this.#dataState.searchText;

    if (searchText) {
      searchedItems = items.filter(function (item: SkyDataManagerDemoRow) {
        let property: keyof typeof item;

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

  #setInitialColumnOrder(): void {
    const viewState = this.#dataState.getViewStateById(this.viewId);
    const visibleColumns = viewState?.displayedColumnIds || [];

    this.#columnDefs.sort((col1, col2) => {
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

  #sortItems(): void {
    const sortOption = this.#dataState.activeSortOption;
    if (this.#columnApi && sortOption) {
      const sort: ColumnState[] = [
        {
          colId: sortOption.propertyName,
          sort: sortOption.descending ? 'desc' : 'asc',
        },
      ];

      this.#columnApi.applyColumnState({
        state: sort,
      });
    }
  }

  #updateData(): void {
    this.#sortItems();
    this.displayedItems = this.#filterItems(this.#searchItems(this.items));

    if (this.#dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    if (this.displayedItems.length > 0) {
      this.#gridApi?.hideOverlay();
    } else {
      this.#gridApi?.showNoRowsOverlay();
    }
  }
}

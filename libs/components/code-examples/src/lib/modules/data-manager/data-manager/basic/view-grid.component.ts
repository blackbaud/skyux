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
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectedEvent,
  SortChangedEvent,
} from 'ag-grid-community';
import { Subject, Subscription, fromEvent, of, takeUntil } from 'rxjs';

import { DataManagerDemoRow } from './data';
import { FruitTypeLookupItem } from './example.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-view-grid',
  templateUrl: './view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule],
})
export class ViewGridComponent implements OnInit, OnDestroy {
  @Input()
  public items: DataManagerDemoRow[] = [];

  protected displayedItems: DataManagerDemoRow[] = [];
  protected gridOptions: GridOptions;
  protected isActive = false;
  protected isGridInitialized = false;
  protected noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;

  protected readonly viewId = 'gridView';

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
      cellRendererParams: {
        // Could be a SkyAppResourcesService.getString call that returns an observable.
        label: (data: DataManagerDemoRow) => of(`Select ${data.name}`),
      },
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

  #dataState = new SkyDataManagerState({});
  #gridApi: GridApi | undefined;
  #ngUnsubscribe = new Subject<void>();

  #viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Grid View',
    iconName: 'table',
    searchEnabled: true,
    columnPickerEnabled: true,
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

  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dataManagerSvc = inject(SkyDataManagerService);

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

  protected onRowSelected(
    rowSelectedEvent: RowSelectedEvent<DataManagerDemoRow>,
  ): void {
    if (!rowSelectedEvent.data?.selected) {
      this.#updateData();
    }
  }

  #filterItems(items: DataManagerDemoRow[]): DataManagerDemoRow[] {
    let filteredItems = items;
    const filterState = this.#dataState.filterData?.filters as
      | SkyFilterBarFilterState
      | undefined;

    if (filterState?.appliedFilters) {
      const filters = filterState.appliedFilters;
      const hideOrange = !!filters.find(
        (f) => f.filterId === 'hideOrange' && f.filterValue?.value,
      );
      const fruitTypeFilter = filters.find((f) => f.filterId === 'fruitType');
      const selectedTypes: string[] = Array.isArray(
        fruitTypeFilter?.filterValue?.value,
      )
        ? (fruitTypeFilter.filterValue.value as FruitTypeLookupItem[]).map(
            (v) => v.id,
          )
        : [];

      filteredItems = items.filter((item) => {
        if (hideOrange && item.color === 'orange') {
          return false;
        }
        if (selectedTypes.length && !selectedTypes.includes(item.type)) {
          return false;
        }
        return true;
      });
    }

    return filteredItems;
  }

  #onGridReady(event: GridReadyEvent): void {
    this.#gridApi = event.api;
    this.#updateData();

    // When the grid is destroyed, unsubscribe from all grid events.
    const gridSubscription = new Subscription();
    gridSubscription.add(
      fromEvent(this.#gridApi, 'gridPreDestroyed').subscribe(() => {
        gridSubscription.unsubscribe();
      }),
    );

    // Keep the data manager sort option in sync with grid sort changes.
    gridSubscription.add(
      fromEvent<SortChangedEvent>(this.#gridApi, 'sortChanged').subscribe(
        (sortChanged) => {
          const sortOption = (
            this.#dataManagerSvc.getCurrentDataManagerConfig().sortOptions ?? []
          ).find((option) =>
            (sortChanged.columns ?? []).some(
              (col) => col.getColId() === option.propertyName,
            ),
          );
          const state = new SkyDataManagerState(this.#dataState);
          state.activeSortOption = sortOption;
          this.#dataManagerSvc.updateDataState(state, this.viewId);
        },
      ),
    );
  }

  #searchItems(items: DataManagerDemoRow[]): DataManagerDemoRow[] {
    let searchedItems = items;
    const searchText = this.#dataState && this.#dataState.searchText;

    if (searchText) {
      searchedItems = items.filter((item: DataManagerDemoRow) => {
        let property: keyof typeof item;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            (property === 'name' || property === 'description')
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

  #setInitialColumnOrder(): void {
    const viewState = this.#dataState.getViewStateById(this.viewId);
    const visibleColumns = viewState?.displayedColumnIds ?? [];

    this.#columnDefs.sort((col1, col2) => {
      const col1Index = visibleColumns.findIndex(
        (colId: string) => colId === col1.colId,
      );
      const col2Index = visibleColumns.findIndex(
        (colId: string) => colId === col2.colId,
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

    // Update the grid's initial sort based on the data state's active sort option.
    const field = this.#dataState.activeSortOption?.propertyName;
    const descending = this.#dataState.activeSortOption?.descending ?? false;
    this.#columnDefs.forEach((column) => {
      column.initialSort =
        field && field === column.field
          ? descending
            ? 'desc'
            : 'asc'
          : undefined;
    });

    this.isGridInitialized = true;
  }

  #updateData(): void {
    this.displayedItems = this.#filterItems(this.#searchItems(this.items));

    if (this.#dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    if (!this.isActive) {
      // Do nothing if the grid is not the active view.
    } else if (this.displayedItems.length > 0) {
      this.#gridApi?.hideOverlay();
    } else {
      this.#gridApi?.showNoRowsOverlay();
    }

    this.#dataManagerSvc.updateDataSummary(
      {
        totalItems: this.items.length,
        itemsMatching: this.displayedItems.length,
      },
      this.viewId,
    );
  }
}

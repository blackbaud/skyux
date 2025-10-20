import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import {
  SkyFilterBarFilterState,
  isSkyFilterBarFilterState,
} from '@skyux/filter-bar';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectedEvent,
} from 'ag-grid-community';
import { of } from 'rxjs';

import { DataManagerDemoRow } from './data';

const VIEW_ID = 'grid_view_1';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-view-grid',
  templateUrl: './view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule],
})
export class ViewGridComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #dataManagerSvc = inject(SkyDataManagerService);

  public readonly items = input.required<DataManagerDemoRow[]>();

  readonly #columnDefs: ColDef[] = [
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

  #dataState = new SkyDataManagerState<SkyFilterBarFilterState>({});
  #gridApi: GridApi | undefined;

  #viewConfig: SkyDataViewConfig = {
    id: VIEW_ID,
    name: 'Grid View',
    iconName: 'table',
    searchEnabled: true,
    multiselectToolbarEnabled: true,
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

  protected readonly gridOptions = this.#agGridSvc.getGridOptions({
    gridOptions: {
      columnDefs: this.#columnDefs,
      onGridReady: (args) => {
        this.#onGridReady(args);
      },
    },
  });

  protected displayedItems = signal<DataManagerDemoRow[]>([]);
  protected readonly isActive = signal(false);
  protected readonly isGridInitialized = signal(false);
  protected readonly noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;
  protected readonly viewId = VIEW_ID;

  public ngOnInit(): void {
    this.displayedItems.set(this.items());

    this.#dataManagerSvc.initDataView(this.#viewConfig);

    this.#dataManagerSvc
      .getDataStateUpdates(VIEW_ID)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((state) => {
        if (hasFilterBarState(state)) {
          this.#dataState = state;
          this.#setInitialColumnOrder();
          this.#updateData();
        }
      });

    this.#dataManagerSvc
      .getActiveViewIdUpdates()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((id) => {
        this.isActive.set(id === VIEW_ID);
      });
  }

  protected onRowSelected(
    rowSelectedEvent: RowSelectedEvent<DataManagerDemoRow>,
  ): void {
    if (!rowSelectedEvent.data?.selected) {
      this.#updateData();
    }
  }

  #onGridReady(event: GridReadyEvent): void {
    this.#gridApi = event.api;
    this.#updateData();
  }

  #setInitialColumnOrder(): void {
    const viewState = this.#dataState.getViewStateById(VIEW_ID);
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

    this.isGridInitialized.set(true);
  }

  #updateData(): void {
    const items = this.items();

    let filteredItems = filterItems(
      searchItems(items, this.#dataState?.searchText),
      this.#dataState?.filterData?.filters,
    );

    if (this.#dataState.onlyShowSelected) {
      filteredItems = filteredItems.filter((item) => item.selected);
    }

    if (filteredItems.length > 0) {
      this.#gridApi?.hideOverlay();
    } else {
      this.#gridApi?.showNoRowsOverlay();
    }

    this.#dataManagerSvc.updateDataSummary(
      {
        totalItems: this.items.length,
        itemsMatching: filteredItems.length,
      },
      VIEW_ID,
    );

    this.displayedItems.set(filteredItems);
  }
}

/**
 * Whether the data state includes filter bar state.
 */
function hasFilterBarState(
  value: SkyDataManagerState,
): value is SkyDataManagerState<SkyFilterBarFilterState> {
  return isSkyFilterBarFilterState(value.filterData?.filters);
}

function filterItems(
  items: DataManagerDemoRow[],
  filters?: SkyFilterBarFilterState,
): DataManagerDemoRow[] {
  let filteredItems = items;

  const appliedFilters = filters?.appliedFilters;

  if (appliedFilters) {
    const hideOrange = !!appliedFilters.some(
      (filter) => filter.filterId === 'hideOrange' && filter.filterValue?.value,
    );

    const fruitTypeFilter = appliedFilters.find(
      (filter) => filter.filterId === 'fruitType',
    );

    const selectedTypes = Array.isArray(fruitTypeFilter?.filterValue?.value)
      ? fruitTypeFilter.filterValue.value.map((value) => value.id)
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

function searchItems(
  items: DataManagerDemoRow[],
  searchText?: string,
): DataManagerDemoRow[] {
  let searchedItems = items;

  if (searchText) {
    searchedItems = items.filter((item) => {
      let property: keyof typeof item;

      for (property in item) {
        if (
          Object.prototype.hasOwnProperty.call(item, property) &&
          (property === 'name' || property === 'description')
        ) {
          const propertyText = item[property].toLocaleLowerCase();

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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  ModuleRegistry,
  ValueFormatterParams,
} from 'ag-grid-community';
import { of } from 'rxjs';

import { ContextMenuComponent } from './context-menu.component';
import { AgGridDemoRow, AutocompleteOption } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-view-grid',
  templateUrl: './view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule, SkyDataManagerModule],
})
export class ViewGridComponent {
  public readonly items = input<AgGridDemoRow[]>([]);

  protected readonly viewId = 'dataGridMultiselectWithDataManagerView';

  protected noRowsTemplate = `<div class="sky-deemphasized">No results found.</div>`;

  readonly #columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
      suppressMovable: true,
      lockPosition: true,
      lockVisible: true,
      cellRendererParams: {
        // Could be a SkyAppResourcesService.getString call that returns an observable.
        label: (data: AgGridDemoRow) => of(`Select ${data.name}`),
      },
    },
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
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataState = toSignal(
    this.#dataManagerSvc.getDataStateUpdates(this.viewId),
    { initialValue: new SkyDataManagerState({}) },
  );
  readonly #gridApi = signal<GridApi | undefined>(undefined);

  protected readonly displayedItems = computed(() =>
    this.#filterItems(this.#searchItems(this.items())),
  );
  protected readonly gridOptions = inject(SkyAgGridService).getGridOptions({
    gridOptions: {
      columnDefs: this.#columnDefs,
      onGridReady: (params) => {
        this.#gridApi.set(params.api);
      },
      onGridPreDestroyed: () => {
        this.#gridApi.set(undefined);
      },
    },
  });

  constructor() {
    effect(() => {
      this.#dataManagerSvc.updateDataSummary(
        {
          totalItems: this.items().length,
          itemsMatching: this.displayedItems().length,
        },
        this.viewId,
      );
    });
    effect(() => {
      const gridApi = this.#gridApi();
      const rowData = this.displayedItems();
      gridApi?.setGridOption('rowData', rowData);
    });
    this.#dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Data Grid View',
      iconName: 'table',
      searchEnabled: true,
      columnPickerEnabled: true,
      columnOptions: [
        {
          id: 'selected',
          label: '',
          alwaysDisplayed: true,
        },
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
      ],
    });
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

  #filterItems(items: AgGridDemoRow[]): AgGridDemoRow[] {
    let filteredItems = items;
    const filterState = this.#dataState().filterData?.filters as
      | SkyFilterBarFilterState
      | undefined;

    if (filterState?.appliedFilters) {
      const filters = filterState.appliedFilters;
      const hideSales = filters.some(
        (filter) =>
          filter.filterId === 'hideSales' && !!filter.filterValue?.value,
      );
      const jobTitleFilter = filters.find((f) => f.filterId === 'jobTitle');
      const selectedTypes: string[] = Array.isArray(
        jobTitleFilter?.filterValue?.value,
      )
        ? (jobTitleFilter.filterValue.value as AutocompleteOption[]).map(
            (v) => v.id,
          )
        : [];

      filteredItems = items.filter((item: AgGridDemoRow) => {
        if (hideSales && item.department.name === 'Sales') {
          return false;
        }
        return !(
          selectedTypes.length &&
          (!item.jobTitle || !selectedTypes.includes(item.jobTitle.id))
        );
      });
    }

    return filteredItems;
  }

  #searchItems(items: AgGridDemoRow[]): AgGridDemoRow[] {
    let searchedItems = items;
    const searchText = this.#dataState().searchText;

    if (searchText) {
      searchedItems = items.filter((item: AgGridDemoRow) => {
        let property: keyof typeof item;
        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            property === 'name'
          ) {
            const propertyText = item[property]?.toLowerCase();
            if (propertyText.includes(searchText.toLowerCase())) {
              return true;
            }
          }
        }

        return false;
      });
    }

    return searchedItems;
  }
}

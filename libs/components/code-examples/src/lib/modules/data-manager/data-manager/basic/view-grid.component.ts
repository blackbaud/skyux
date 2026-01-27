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
  SkyDataManagerColumnPickerOption,
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  ModuleRegistry,
} from 'ag-grid-community';
import { of } from 'rxjs';

import { DataManagerDemoRow } from './data';
import { filterItems } from './filters';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-view-grid',
  templateUrl: './view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridAngular, SkyAgGridModule, SkyDataManagerModule],
})
export class ViewGridComponent {
  public readonly items = input<DataManagerDemoRow[]>([]);

  protected readonly viewId = 'gridView';

  readonly #columnDefs: ColDef[] = [
    {
      colId: 'selected',
      field: 'selected',
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
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataState = toSignal(
    this.#dataManagerSvc.getDataStateUpdates(`${this.viewId}-data-state`),
    { initialValue: new SkyDataManagerState({}) },
  );
  readonly #gridApi = signal<GridApi | undefined>(undefined);
  protected readonly displayedItems = computed(() => {
    const dataState = this.#dataState();
    return filterItems(
      this.items(),
      dataState.filterData?.filters as SkyFilterBarFilterState | undefined,
      dataState.searchText,
    );
  });
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
      name: 'Grid View',
      iconName: 'table',
      searchEnabled: true,
      columnPickerEnabled: true,
      columnOptions: this.#columnDefs.map(
        (colDef): SkyDataManagerColumnPickerOption => ({
          id: colDef.colId!,
          label: colDef.headerName ?? colDef.colId!,
          alwaysDisplayed: !!colDef.lockVisible,
        }),
      ),
    });
  }
}

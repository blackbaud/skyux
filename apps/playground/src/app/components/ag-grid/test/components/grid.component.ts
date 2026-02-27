import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerColumnPickerOption,
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyPagingModule } from '@skyux/lists';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';

import { DATA, DataRow } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);

const GRID_VIEW = 'gridView';

@Component({
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyPagingModule,
    SkyWaitModule,
  ],
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit {
  #agGridSvc = inject(SkyAgGridService);
  #dataMgrSvc = inject(SkyDataManagerService);
  #destroy = inject(DestroyRef);

  #gridApi: GridApi | undefined;

  protected readonly viewId = GRID_VIEW;

  protected gridOptions = signal<GridOptions<DataRow> | undefined>(undefined);
  protected displayItems = signal<DataRow[]>([]);

  public ngOnInit(): void {
    const columns: ColDef<DataRow>[] = [
      {
        field: 'name',
        colId: 'name',
      },
      {
        field: 'occupation',
        colId: 'occupation',
      },
    ];

    const gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        columnDefs: columns,
        onGridReady: this.onGridReady.bind(this),
        suppressPaginationPanel: true,
      },
    }) satisfies GridOptions<DataRow>;

    this.gridOptions.set(gridOptions);

    // If we subscribe to data state here, things work as expected
    // this.#registerStateListener();

    this.#dataMgrSvc.initDataView({
      id: GRID_VIEW,
      name: 'Grid View',
      searchEnabled: true,
      columnPickerEnabled: true,
      columnOptions: columns.map(
        (colDef): SkyDataManagerColumnPickerOption => ({
          id: colDef.field!,
          label: colDef.headerName ?? colDef.colId!,
        }),
      ),
    });

    // If we subscribe here, the comparator does not work
    this.#registerStateListener();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#gridApi.sizeColumnsToFit();

    this.displayItems.set(DATA);
  }

  #registerStateListener(): void {
    this.#dataMgrSvc
      .getDataStateUpdates('grid-view-data-state', {
        // properties: ['activeSortOption'],
        comparator: (s1, s2) => {
          const sort1 = s1.activeSortOption;
          const sort2 = s2.activeSortOption;
          const result = JSON.stringify(sort1) === JSON.stringify(sort2);
          console.log('comparing', sort1, sort2, result);
          return result;
        },
      })
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe({
        next: (state) => {
          console.log('new data state', state);
        },
      });
  }
}

import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyIconModule } from '@skyux/icon';
import { SkyListSummaryModule } from '@skyux/lists';

import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, GridApi, ModuleRegistry } from 'ag-grid-community';
import { map } from 'rxjs/operators';

import { DashboardLinkCellRendererComponent } from './dashboard-link-cell-renderer.component';
import { DashboardGridContextMenuComponent } from './dashboards-grid-context-menu.component';
import { Item } from './item';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-list-page-content',
  templateUrl: './list-page-content.component.html',
  providers: [SkyDataManagerService],
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyIconModule,
    SkyListSummaryModule,
  ],
})
export class ListPageContentComponent {
  protected items: Item[] = [
    {
      dashboard: 'Cash Flow Tracker',
      name: 'Kanesha Hutto',
      lastUpdated: '06/21/2023',
    },
    {
      dashboard: 'Accounts Receivable Dashboard',
      name: 'Kristeen Lunsford',
      lastUpdated: '06/30/2023',
    },
    {
      dashboard: 'Accounts Payable Dashboard',
      name: 'Darcel Lenz',
      lastUpdated: '04/20/2023',
    },
    {
      dashboard: 'Budget vs. Actual',
      name: 'Barbara Durr',
      lastUpdated: '12/04/2023',
    },
    {
      dashboard: 'Balance Sheet - New',
      name: 'Ilene Woo',
      lastUpdated: '12/20/2023',
    },
    {
      dashboard: 'Debt Management',
      name: 'Tonja Sanderson',
      lastUpdated: '09/10/2023',
    },
  ];

  protected readonly gridOptions = inject(SkyAgGridService).getGridOptions({
    gridOptions: {
      columnDefs: [
        {
          colId: 'contextMenu',
          headerName: '',
          sortable: false,
          cellRenderer: DashboardGridContextMenuComponent,
          maxWidth: 55,
        },
        {
          colId: 'dashboard',
          field: 'dashboard',
          headerName: 'Name',
          width: 150,
          cellRenderer: DashboardLinkCellRendererComponent,
        },
        {
          colId: 'name',
          field: 'name',
          headerName: 'Created By',
        },
        {
          colId: 'lastUpdated',
          field: 'lastUpdated',
          headerName: 'Last Updated',
        },
      ],
      onGridReady: (params) => {
        this.#gridApi.set(params.api);
      },
      onGridPreDestroyed: () => {
        this.#gridApi.set(undefined);
      },
      rowData: this.items,
    },
  });

  readonly #gridApi = signal<GridApi | undefined>(undefined);
  readonly #viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    searchEnabled: true,
  };

  constructor() {
    const dataManagerService = inject(SkyDataManagerService);
    dataManagerService.initDataManager({
      activeViewId: this.#viewConfig.id,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: this.#viewConfig.id,
            displayedColumnIds: [
              'contextMenu',
              'dashboard',
              'name',
              'lastUpdated',
            ],
          },
        ],
      }),
    });
    dataManagerService.initDataView(this.#viewConfig);
    const searchText = toSignal(
      dataManagerService
        .getDataStateUpdates(`${this.#viewConfig.id}-searchText`)
        .pipe(map((state) => state.searchText ?? '')),
      { initialValue: '' },
    );
    effect(() => {
      const text = searchText();
      this.#gridApi()?.setGridOption('quickFilterText', text);
    });
  }
}

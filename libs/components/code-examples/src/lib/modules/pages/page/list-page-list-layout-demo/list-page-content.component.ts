import { Component, inject } from '@angular/core';
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
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

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
      rowData: this.items,
    },
  });

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
  }
}

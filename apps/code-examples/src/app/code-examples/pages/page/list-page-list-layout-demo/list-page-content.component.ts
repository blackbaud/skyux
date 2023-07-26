import { Component, OnInit, inject } from '@angular/core';
import { SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';

import { DashboardGridContextMenuComponent } from './dashboards-grid-context-menu.component';

@Component({
  selector: 'app-list-page-content',
  templateUrl: './list-page-content.component.html',
  providers: [SkyDataManagerService],
})
export class ListPageContentComponent implements OnInit {
  public items = [
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
  public gridOptions: GridOptions;

  #dataManagerService = inject(SkyDataManagerService);
  #agGridSvc = inject(SkyAgGridService);

  #columnDefs: ColDef[] = [
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
      cellRenderer: (params: ICellRendererParams): string => {
        return `<a href="/">${params.value}</a>`;
      },
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
  ];

  #viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    searchEnabled: true,
  };

  constructor() {
    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs,
        onGridReady: (args) => {
          args.api.sizeColumnsToFit();
        },
      },
    });
  }

  public ngOnInit(): void {
    this.#dataManagerService.initDataManager({
      activeViewId: 'gridView',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: 'gridView',
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

    this.#dataManagerService.initDataView(this.#viewConfig);
  }
}

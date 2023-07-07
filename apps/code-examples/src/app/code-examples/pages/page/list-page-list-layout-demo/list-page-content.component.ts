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
      name: 'Cash Flow Tracker',
      // eslint-disable-next-line @cspell/spellchecker
      createdBy: 'Kanesha Hutto',
      lastUpdated: '06/21/2023',
    },
    {
      name: 'Accounts Receivable Dashboard',
      // eslint-disable-next-line @cspell/spellchecker
      createdBy: 'Kristeen Lunsford',
      lastUpdated: '06/30/2023',
    },
    {
      name: 'Accounts Payable Dashboard',
      // eslint-disable-next-line @cspell/spellchecker
      createdBy: 'Darcel Lenz',
      lastUpdated: '04/20/2023',
    },
    {
      name: 'Budget vs. Actuals',
      // eslint-disable-next-line @cspell/spellchecker
      createdBy: 'Barbara Durr',
      lastUpdated: '12/04/2023',
    },
    {
      name: 'Balance Sheet - New',
      createdBy: 'Ilene Woo',
      lastUpdated: '12/20/2023',
    },
    {
      name: 'Debt Management',
      // eslint-disable-next-line @cspell/spellchecker
      createdBy: 'Tonja Sanderson',
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
      colId: 'name',
      field: 'name',
      headerName: 'Name',
      width: 150,
      cellRenderer: (params: ICellRendererParams): string => {
        return `<a href="/">${params.value}</a>`;
      },
    },
    {
      colId: 'createdBy',
      field: 'createdBy',
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
              'name',
              'createdBy',
              'lastUpdated',
            ],
          },
        ],
      }),
    });

    this.#dataManagerService.initDataView(this.#viewConfig);
  }
}

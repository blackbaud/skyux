import { Component, Input, OnInit, inject } from '@angular/core';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyIconModule } from '@skyux/icon';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridOptions,
  ICellRendererParams,
  ModuleRegistry,
} from 'ag-grid-community';

import { ContactContextMenuComponent } from './contact-context-menu.component';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Contact {
  name: string;
  organization: string;
  emailAddress: string;
}

@Component({
  selector: 'app-list-page-contacts-grid',
  templateUrl: './list-page-contacts-grid.component.html',
  providers: [SkyDataManagerService],
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyIconModule,
    SkyKeyInfoModule,
  ],
})
export class ListPageContactsGridComponent implements OnInit {
  @Input()
  public contacts: Contact[] = [];

  protected gridOptions: GridOptions;

  #dataManagerService = inject(SkyDataManagerService);
  #agGridSvc = inject(SkyAgGridService);

  #columnDefs: ColDef[] = [
    {
      colId: 'contextMenu',
      headerName: '',
      sortable: false,
      cellRenderer: ContactContextMenuComponent,
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
      colId: 'organization',
      field: 'organization',
      headerName: 'Organization',
    },
    {
      colId: 'emailAddress',
      field: 'emailAddress',
      headerName: 'Email Address',
    },
  ];

  #viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    searchEnabled: true,
    columnPickerEnabled: true,
    columnOptions: [
      { id: 'contextMenu', label: 'Context menu', alwaysDisplayed: true },
      { id: 'name', label: 'Name' },
      { id: 'organization', label: 'Organization' },
      { id: 'emailAddress', label: 'Email Address' },
    ],
  };

  constructor() {
    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs,
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
              'organization',
              'emailAddress',
            ],
          },
        ],
      }),
    });

    this.#dataManagerService.initDataView(this.#viewConfig);
  }
}

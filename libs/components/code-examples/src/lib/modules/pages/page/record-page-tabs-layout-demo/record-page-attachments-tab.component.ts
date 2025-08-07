import { Component, OnInit, inject } from '@angular/core';
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

import { Attachment } from './attachment';
import { AttachmentsGridContextMenuComponent } from './attachments-grid-context-menu.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-record-page-attachments-tab',
  templateUrl: './record-page-attachments-tab.component.html',
  providers: [SkyDataManagerService],
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyKeyInfoModule,
    SkyIconModule,
  ],
})
export class RecordPageAttachmentsTabComponent implements OnInit {
  protected items: Attachment[] = [
    {
      name: 'Agreement.pdf',
      description: 'Cardholder agreement',
      size: '10 KB',
      dateAdded: '01/28/2023',
    },
    {
      name: 'Appendix.pdf',
      description: 'Updated terms 2023',
      size: '25 KB',
      dateAdded: '05/05/2023',
    },
  ];
  protected gridOptions: GridOptions;

  #dataManagerService = inject(SkyDataManagerService);
  #agGridSvc = inject(SkyAgGridService);

  #columnDefs: ColDef[] = [
    {
      colId: 'contextMenu',
      headerName: '',
      sortable: false,
      cellRenderer: AttachmentsGridContextMenuComponent,
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
      colId: 'description',
      field: 'description',
      headerName: 'Description',
    },
    {
      colId: 'size',
      field: 'size',
      headerName: 'Size',
    },
    {
      colId: 'dateAdded',
      field: 'dateAdded',
      headerName: 'Date Added',
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
              'description',
              'size',
              'dateAdded',
            ],
          },
        ],
      }),
    });

    this.#dataManagerService.initDataView(this.#viewConfig);
  }
}

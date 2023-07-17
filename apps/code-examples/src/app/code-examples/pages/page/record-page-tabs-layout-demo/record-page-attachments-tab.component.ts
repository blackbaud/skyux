import { Component, OnInit, inject } from '@angular/core';
import { SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';

import { AttachmentsGridContextMenuComponent } from './attachments-grid-context-menu.component';

@Component({
  selector: 'app-record-page-attachments-tab',
  templateUrl: './record-page-attachments-tab.component.html',
  providers: [SkyDataManagerService],
})
export class RecordPageAttachmentsTabComponent implements OnInit {
  public items = [
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
  public gridOptions: GridOptions;

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

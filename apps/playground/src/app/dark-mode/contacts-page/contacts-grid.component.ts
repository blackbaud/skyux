import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyIconModule, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyTabsModule } from '@skyux/tabs';

import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  Events,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  RowSelectedEvent,
} from 'ag-grid-community';

import { Contact } from './contact';
import { ContactContextMenuComponent } from './contact-context-menu.component';
import { SummaryActionBarComponent } from './summary-action-bar.component';

@Component({
  selector: 'app-contacts-grid',
  templateUrl: './contacts-grid.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SkyTabsModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    AgGridModule,
    SkyKeyInfoModule,
    SkyIconModule,
    SummaryActionBarComponent,
  ],
  providers: [SkyDataManagerService],
})
export class ContactsGridComponent implements OnInit {
  @Input()
  public contacts: Contact[] = [];

  public gridOptions: GridOptions;
  public selectedContactIds: string[] = [];
  public gridApi?: GridApi;

  #dataManagerService = inject(SkyDataManagerService);
  #agGridSvc = inject(SkyAgGridService);

  #columnDefs: ColDef[] = [
    {
      field: 'selected',
      colId: 'selected',
      type: SkyCellType.RowSelector,
    },
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
      {
        id: 'selected',
        label: 'selected',
        alwaysDisplayed: true,
      },
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
        onGridReady: (args) => this.#onGridReady(args),
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
              'selected',
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

  #onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.addEventListener(
      Events.EVENT_ROW_SELECTED,
      (event: RowSelectedEvent) => {
        const row = event.node;
        if (row.isSelected()) {
          this.selectedContactIds = [...this.selectedContactIds, row.data.id];
        } else {
          this.selectedContactIds = this.selectedContactIds.filter(
            (id) => id !== row.id
          );
        }
      }
    );
  }
}

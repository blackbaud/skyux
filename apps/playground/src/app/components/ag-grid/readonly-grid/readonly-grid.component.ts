import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  booleanAttribute,
  input,
} from '@angular/core';
import {
  SkyAgGridModule,
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyInfiniteScrollModule } from '@skyux/lists';
import { SkyThemeService } from '@skyux/theme';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  RowSelectedEvent,
} from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';

import { ReadonlyGridContextMenuComponent } from './readonly-grid-context-menu.component';
import { READONLY_GRID_DATA } from './readonly-grid-data';

ModuleRegistry.registerModules([AllCommunityModule]);

let nextId = 0;

@Component({
  selector: 'app-readonly-grid-visual',
  templateUrl: './readonly-grid.component.html',
  styleUrls: ['./readonly-grid.component.scss'],
  imports: [
    AgGridModule,
    CommonModule,
    SkyAgGridModule,
    SkyBackToTopModule,
    SkyInfiniteScrollModule,
  ],
})
export class ReadonlyGridComponent implements OnInit {
  public gridApi: GridApi;
  public gridData = READONLY_GRID_DATA;
  public gridOptions: GridOptions;
  public hasMore = true;

  public readonly normal = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  public columnDefs: ColDef[] = [];

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  constructor(
    private agGridService: SkyAgGridService,
    public themeSvc: SkyThemeService,
  ) {}

  public ngOnInit(): void {
    this.columnDefs = [
      {
        field: 'selected',
        colId: 'selected',
        type: SkyCellType.RowSelector,
      },
      {
        colId: 'contextMenu',
        headerName: 'Context menu',
        sortable: false,
        cellRenderer: ReadonlyGridContextMenuComponent,
        maxWidth: 55,
        headerComponentParams: {
          headerHidden: true,
        },
      },
      {
        field: 'name',
        headerName: 'Goal Name',
        autoHeight: !this.normal(),
      },
      {
        field: 'value',
        headerName: 'Current Value',
        type: SkyCellType.Number,
        maxWidth: 200,
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        type: [SkyCellType.RightAligned, SkyCellType.Date],
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        type: SkyCellType.Date,
      },
      {
        field: 'comment',
        headerName: 'Comment',
        maxWidth: 500,
        autoHeight: !this.normal(),
        wrapText: !this.normal(),
      },
      {
        field: 'status',
        headerName: 'Status',
        sortable: false,
        cellRenderer: this.statusRenderer,
        minWidth: 300,
      },
    ];
    this.getGridOptions();
  }

  public deleteConfirm(confirmArgs: SkyAgGridRowDeleteConfirmArgs): void {
    setTimeout(() => {
      this.gridApi.applyTransaction({
        remove: this.gridData.filter((data) => data.id === confirmArgs.id),
      });
    }, 3000);
  }

  public mockRemote(): Observable<any> {
    const lorem =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam. Tempor orci eu lobortis elementum nibh tellus molestie. Tempus imperdiet nulla malesuada pellentesque elit.';
    const data: any[] = [];

    for (let i = 0; i < 8; i++) {
      data.push({
        id: `9${++nextId}`,
        name: `Item #` + nextId,
        comment: i % 3 === 0 ? lorem : '',
      });
    }

    const results = new Subject<any>();

    setTimeout(() => {
      results.next({
        data,
        hasMore: nextId < 50,
      });
    }, 1000);

    return results;
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.addEventListener('rowSelected', (event: RowSelectedEvent) => {
      const row = event.node;
      if (row.isSelected()) {
        this.gridOptions.context.rowDeleteIds = [
          ...this.gridOptions.context.rowDeleteIds,
          row.id,
        ];
      } else {
        this.gridOptions.context.rowDeleteIds =
          this.gridOptions.context.rowDeleteIds.filter((id) => id !== row.id);
      }
    });
  }

  public onScrollEnd(): void {
    if (this.hasMore) {
      // MAKE API REQUEST HERE
      // I am faking an API request because I don't have one to work with
      this.mockRemote().subscribe((result: any) => {
        this.gridApi.applyTransaction({ add: result.data });
        this.hasMore = result.hasMore;
      });
    }
  }

  public statusRenderer(cellRendererParams: ICellRendererParams): string {
    if (cellRendererParams.value) {
      return `<div class="status ${cellRendererParams.value.toLowerCase()}">${
        cellRendererParams.value
      }</div>`;
    } else {
      return '';
    }
  }

  private getGridOptions(): void {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      domLayout: this.normal() ? 'normal' : 'autoHeight',
      onGridReady: (gridReadyEvent): void => this.onGridReady(gridReadyEvent),
      context: {
        rowDeleteIds: this.gridData
          .filter((row) => row.selected)
          .map((row) => row.id),
      },
    };
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: this.gridOptions,
    });
  }
}

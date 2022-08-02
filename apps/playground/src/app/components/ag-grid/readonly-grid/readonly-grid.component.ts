import { Component, HostListener, OnInit } from '@angular/core';
import {
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyThemeService } from '@skyux/theme';

import {
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';

import { ReadonlyGridContextMenuComponent } from './readonly-grid-context-menu.component';
import { READONLY_GRID_DATA, RowStatusNames } from './readonly-grid-data';

let nextId = 0;

@Component({
  selector: 'app-readonly-grid-visual',
  templateUrl: './readonly-grid.component.html',
  styleUrls: ['./readonly-grid.component.scss'],
})
export class ReadonlyGridComponent implements OnInit {
  public gridApi: GridApi;
  public gridData = READONLY_GRID_DATA;
  public gridOptions: GridOptions;
  public hasMore = true;
  public rowDeleteIds: string[];

  public columnDefs = [
    {
      field: 'selected',
      colId: 'selected',
      type: SkyCellType.RowSelector,
    },
    {
      colId: 'contextMenu',
      headerName: '',
      sortable: false,
      cellRenderer: ReadonlyGridContextMenuComponent,
      maxWidth: 55,
    },
    {
      field: 'name',
      headerName: 'Goal Name',
      autoHeight: true,
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
      type: SkyCellType.Date,
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
      autoHeight: true,
      wrapText: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      cellRenderer: this.statusRenderer,
      minWidth: 300,
    },
  ];

  @HostListener('window:resize')
  public onWindowResize() {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  constructor(
    private agGridService: SkyAgGridService,
    public themeSvc: SkyThemeService
  ) {}

  public ngOnInit(): void {
    this.getGridOptions();
  }

  public deleteConfirm(confirmArgs: SkyAgGridRowDeleteConfirmArgs): void {
    setTimeout(() => {
      this.gridData = this.gridData.filter(
        (data) => data.id !== confirmArgs.id
      );
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
    this.gridApi.resetRowHeights();
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
    const iconClassMap = {
      [RowStatusNames.BEHIND]: 'fa-warning',
      [RowStatusNames.CURRENT]: 'fa-clock-o',
      [RowStatusNames.COMPLETE]: 'fa-check',
    };
    if (cellRendererParams.value) {
      return `<div class="status ${cellRendererParams.value.toLowerCase()}">
              <i class="fa ${iconClassMap[cellRendererParams.value]}"></i> ${
        cellRendererParams.value
      }
            </div>`;
    } else {
      return '';
    }
  }

  private getGridOptions(): void {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      onGridReady: (gridReadyEvent) => this.onGridReady(gridReadyEvent),
      context: {
        rowDeleteIds: [],
      },
    };
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: this.gridOptions,
    });
  }
}

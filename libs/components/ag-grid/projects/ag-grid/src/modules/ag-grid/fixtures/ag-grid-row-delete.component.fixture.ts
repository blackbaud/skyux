import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  SkyAgGridService
} from '../ag-grid.service';

import {
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent
} from 'ag-grid-community';

import {
  SKY_AG_GRID_DATA,
  SKY_AG_GRID_LONG_DATA
} from './ag-grid-data.fixture';

import {
  SkyAgGridRowDeleteCancelArgs
} from '../types/ag-grid-row-delete-cancel-args';

import {
  SkyAgGridRowDeleteConfirmArgs
} from '../types/ag-grid-row-delete-confirm-args';

import {
  SkyCellType
} from '../types/cell-type';

@Component({
  selector: 'sky-ag-grid-row-delete-component-fixture',
  templateUrl: './ag-grid-row-delete.component.fixture.html',
  styleUrls: ['../../../styles/ag-grid-styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkyAgGridRowDeleteFixtureComponent implements OnInit {

  public allColumnWidth: number = undefined;

  public columnDefs = [
    {
      field: 'selected',
      headerName: '',
      maxWidth: 50,
      sortable: false,
      type: SkyCellType.RowSelector,
      width: this.allColumnWidth
    },
    {
      field: 'name',
      headerName: 'First Name',
      width: this.allColumnWidth
    },
    {
      field: 'nickname',
      headerName: 'Nickname',
      editable: true,
      type: SkyCellType.Text,
      width: this.allColumnWidth
    },
    {
      field: 'value',
      headerName: 'Current Value',
      editable: true,
      type: SkyCellType.Number,
      width: this.allColumnWidth
    },
    {
      field: 'target',
      headerName: 'Goal',
      type: SkyCellType.Number,
      width: this.allColumnWidth
    },
    {
      field: 'date',
      headerName: 'Completed Date',
      editable: true,
      type: SkyCellType.Date,
      width: this.allColumnWidth
    }
  ];

  public columnApi: ColumnApi;
  public gridApi: GridApi;
  public gridData = SKY_AG_GRID_DATA;

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    onGridReady: gridReadyEvent => this.onGridReady(gridReadyEvent)
  };

  public rowDeleteIds: string[] = [];

  constructor(private gridService: SkyAgGridService) { }

  public ngOnInit(): void {
    this.gridOptions = this.gridService.getEditableGridOptions({ gridOptions: this.gridOptions });
  }

  public addDataPoint(): void {
    this.gridApi.applyTransaction({
      add: [{
        id: '4',
        name: 'John',
        target: 11,
        selected: false
      }]
    });
  }

  public cancelRowDelete(cancelArgs: SkyAgGridRowDeleteCancelArgs): void {
    return;
  }

  public changeToLongData(): void {
    this.gridData = SKY_AG_GRID_LONG_DATA;
  }

  public filterName(): void {
    this.gridApi.setFilterModel({
      name: {
        filterType: 'text',
        type: 'startsWith',
        filter: 'Mar'
      }
    });
  }

  public finishRowDelete(confirmArgs: SkyAgGridRowDeleteConfirmArgs): void {
    return;
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.columnApi = gridReadyEvent.columnApi;
  }

  public removeFirstItem(): void {
    this.gridData = this.gridData.slice(1);
  }

  public sortName(): void {
    this.columnApi.applyColumnState({
      state: [
        {
          colId: 'name',
          sort: 'desc'
        }
      ]
    });
  }
}

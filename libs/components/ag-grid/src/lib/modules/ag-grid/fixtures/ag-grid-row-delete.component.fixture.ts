import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';
import { firstValueFrom, fromEvent, fromEventPattern } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { SkyAgGridRowDeleteDirective } from '../ag-grid-row-delete.directive';
import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import { SkyAgGridService } from '../ag-grid.service';
import { SkyAgGridRowDeleteCancelArgs } from '../types/ag-grid-row-delete-cancel-args';
import { SkyAgGridRowDeleteConfirmArgs } from '../types/ag-grid-row-delete-confirm-args';
import { SkyCellType } from '../types/cell-type';

import {
  SKY_AG_GRID_DATA,
  SKY_AG_GRID_LONG_DATA,
} from './ag-grid-data.fixture';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'sky-ag-grid-row-delete-component-fixture',
  templateUrl: './ag-grid-row-delete.component.fixture.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SkyAgGridWrapperComponent,
    SkyAgGridRowDeleteDirective,
    AgGridAngular,
  ],
})
export class SkyAgGridRowDeleteFixtureComponent implements OnInit {
  public allColumnWidth = 0;
  public hideFirstColumn = false;

  public columnDefs = () => [
    {
      field: 'selected',
      headerName: '',
      maxWidth: 50,
      sortable: false,
      type: SkyCellType.RowSelector,
      width: this.allColumnWidth,
      hide: this.hideFirstColumn,
    },
    {
      field: 'name',
      headerName: 'First Name',
      width: this.allColumnWidth,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'nickname',
      headerName: 'Nickname',
      editable: true,
      type: SkyCellType.Text,
      width: this.allColumnWidth,
    },
    {
      field: 'value',
      headerName: 'Current Value',
      editable: true,
      type: SkyCellType.Number,
      width: this.allColumnWidth,
    },
    {
      field: 'target',
      headerName: 'Goal',
      type: SkyCellType.Number,
      width: this.allColumnWidth,
    },
    {
      field: 'date',
      headerName: 'Completed Date',
      editable: true,
      type: SkyCellType.Date,
      width: this.allColumnWidth,
    },
  ];

  public gridApi: GridApi | undefined;
  public gridData = SKY_AG_GRID_DATA;

  public gridOptions: GridOptions | undefined;

  public rowDeleteIds: string[] | undefined;

  #gridService: SkyAgGridService;

  constructor(gridService: SkyAgGridService) {
    this.#gridService = gridService;
  }

  public ngOnInit(): void {
    this.gridOptions = this.#gridService.getEditableGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs(),
        onGridReady: (gridReadyEvent) => this.onGridReady(gridReadyEvent),
      },
    });
  }

  public addDataPoint(): void {
    this.gridApi?.applyTransaction({
      add: [
        {
          id: '4',
          name: 'John',
          target: 11,
          selected: false,
        },
      ],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public cancelRowDelete(args: SkyAgGridRowDeleteCancelArgs): void {
    return;
  }

  public changeToLongData(): void {
    this.gridData = SKY_AG_GRID_LONG_DATA;
    this.gridApi?.setGridOption('rowData', this.gridData);
  }

  public filterName(filter: string): void {
    const filterChangedPromise = firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fromEvent(this.gridApi!, 'filterChanged').pipe(
        first(),
        map(() => undefined),
      ),
    );
    this.gridApi?.setFilterModel({
      name: {
        filterType: 'text',
        type: 'startsWith',
        filter,
      },
    });
    queueMicrotask(async () => await filterChangedPromise);
  }

  public clearFilter(): void {
    const filterChangedPromise = firstValueFrom(
      fromEventPattern(
        (handler) => this.gridApi?.addEventListener('filterChanged', handler),
        (handler) =>
          this.gridApi?.removeEventListener('filterChanged', handler),
      ).pipe(
        first(),
        map(() => undefined),
      ),
    );
    this.gridApi?.destroyFilter('name');
    queueMicrotask(async () => await filterChangedPromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public finishRowDelete(args: SkyAgGridRowDeleteConfirmArgs): void {
    return;
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
  }

  public removeFirstItem(): void {
    this.gridData = this.gridData.slice(1);
    this.gridApi?.setGridOption('rowData', this.gridData);
  }

  public sortName(): void {
    const sortChangedPromise = firstValueFrom(
      fromEventPattern(
        (handler) => this.gridApi?.addEventListener('sortChanged', handler),
        (handler) => this.gridApi?.removeEventListener('sortChanged', handler),
      ).pipe(
        first(),
        map(() => undefined),
      ),
    );
    this.gridApi?.applyColumnState({
      state: [
        {
          colId: 'name',
          sort: 'desc',
        },
      ],
    });
    queueMicrotask(async () => await sortChangedPromise);
  }
}

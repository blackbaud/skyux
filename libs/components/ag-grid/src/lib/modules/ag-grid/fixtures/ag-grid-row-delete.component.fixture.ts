import type { OnInit } from '@angular/core';
import { Component, ViewEncapsulation } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { firstValueFrom, fromEvent } from 'rxjs';

import { SkyAgGridRowDeleteDirective } from '../ag-grid-row-delete.directive';
import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import type { SkyAgGridService } from '../ag-grid.service';
import type { SkyAgGridRowDeleteCancelArgs } from '../types/ag-grid-row-delete-cancel-args';
import type { SkyAgGridRowDeleteConfirmArgs } from '../types/ag-grid-row-delete-confirm-args';
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

  public columnDefs: () => ColDef[] = () => [
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

  public async filterName(filter: string): Promise<void> {
    const filterChangedPromise = firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fromEvent(this.gridApi!, 'filterChanged'),
    );
    this.gridApi?.setFilterModel({
      name: {
        filterType: 'text',
        type: 'startsWith',
        filter,
      },
    });
    await filterChangedPromise.then(() => undefined);
  }

  public async clearFilter(): Promise<void> {
    const filterChangedPromise = firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fromEvent(this.gridApi!, 'filterChanged'),
    );
    this.gridApi?.destroyFilter('name');
    await filterChangedPromise.then(() => undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public finishRowDelete(args: SkyAgGridRowDeleteConfirmArgs): void {
    return;
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
  }

  public async removeFirstItem(): Promise<void> {
    const dataChangedPromise = firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fromEvent(this.gridApi!, 'rowDataUpdated'),
    );
    this.gridData = this.gridData.slice(1);
    this.gridApi?.setGridOption('rowData', this.gridData);
    await dataChangedPromise.then(() => undefined);
  }

  public async sortName(): Promise<void> {
    const sortChangedPromise = firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fromEvent(this.gridApi!, 'sortChanged'),
    );
    this.gridApi?.applyColumnState({
      state: [
        {
          colId: 'name',
          sort: 'desc',
        },
      ],
    });
    await sortChangedPromise.then(() => undefined);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';

import { SKY_AG_GRID_DEMO_DATA } from './top-scroll-data-grid-demo-data';

@Component({
  selector: 'app-basic-data-grid-docs-demo',
  templateUrl: './top-scroll-data-grid-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyTopScrollDataGridDemoComponent {
  public columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
    },
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      maxWidth: 60,
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      type: SkyCellType.Date,
      sort: 'asc',
    },
    {
      field: 'endDate',
      headerName: 'End date',
      type: SkyCellType.Date,
      valueFormatter: this.endDateFormatter,
    },
    {
      field: 'department',
      headerName: 'Department',
      type: SkyCellType.Autocomplete,
    },
    {
      field: 'jobTitle',
      headerName: 'Title',
      type: SkyCellType.Autocomplete,
    },
  ];

  public gridApi: GridApi | undefined;
  public gridData = SKY_AG_GRID_DEMO_DATA;
  public gridOptions: GridOptions;
  public searchText = '';
  public noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;

  constructor(private agGridService: SkyAgGridService) {
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs,
        onGridReady: this.onGridReady.bind(this),
        context: {
          enableTopScroll: true,
        },
      },
    });
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
  }

  public searchApplied(searchText: string | void): void {
    if (searchText) {
      this.searchText = searchText;
    } else {
      this.searchText = '';
    }
    if (this.gridApi) {
      this.gridApi.setQuickFilter(this.searchText);
      const displayedRowCount = this.gridApi.getDisplayedRowCount();
      if (displayedRowCount > 0) {
        this.gridApi.hideOverlay();
      } else {
        this.gridApi.showNoRowsOverlay();
      }
    }
  }

  private endDateFormatter(params: ValueFormatterParams): string {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return params.value
      ? params.value.toLocaleDateString('en-us', dateConfig)
      : 'N/A';
  }
}

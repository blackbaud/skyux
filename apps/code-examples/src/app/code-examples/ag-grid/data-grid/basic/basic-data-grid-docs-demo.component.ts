import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SkyCellType, SkyAgGridService } from '@skyux/ag-grid';

import {
  GridApi,
  GridReadyEvent,
  GridOptions,
  ValueFormatterParams,
} from 'ag-grid-community';

import { SKY_AG_GRID_DEMO_DATA } from './basic-data-grid-docs-demo-data';

@Component({
  selector: 'app-basic-data-grid-docs-demo',
  templateUrl: './basic-data-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBasicDataGridDemoComponent {
  public columnDefs = [
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
  public noRowsTemplate: string;

  constructor(
    private agGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.noRowsTemplate = `<div class="sky-deemphasized">No results found.</div>`;
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs,
        onGridReady: this.onGridReady.bind(this),
      },
    });
    this.changeDetector.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.changeDetector.markForCheck();
  }

  public searchApplied(searchText: string | void): void {
    if (searchText) {
      this.searchText = searchText;
    } else {
      this.searchText = '';
    }
    if (this.gridApi) {
      this.gridApi.setQuickFilter(searchText);
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

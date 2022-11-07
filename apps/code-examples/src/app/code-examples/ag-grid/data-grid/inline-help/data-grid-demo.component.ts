import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';

import { SKY_AG_GRID_DEMO_DATA } from './data-grid-demo-data';
import { InlineHelpComponent } from './inline-help.component';

@Component({
  selector: 'app-data-grid-demo',
  templateUrl: './data-grid-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridDemoComponent {
  public columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
    },
    {
      field: 'name',
      headerName: 'Name',
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      maxWidth: 60,
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      type: SkyCellType.Date,
      sort: 'asc',
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
    {
      field: 'endDate',
      headerName: 'End date',
      type: SkyCellType.Date,
      valueFormatter: this.#endDateFormatter,
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
    {
      field: 'department',
      headerName: 'Department',
      type: SkyCellType.Autocomplete,
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
    {
      field: 'jobTitle',
      headerName: 'Title',
      type: SkyCellType.Autocomplete,
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
  ];

  public gridApi: GridApi | undefined;
  public gridData = SKY_AG_GRID_DEMO_DATA;
  public gridOptions: GridOptions;
  public searchText = '';
  public noRowsTemplate: string;

  #agGridService: SkyAgGridService;
  #changeDetector: ChangeDetectorRef;

  constructor(
    agGridService: SkyAgGridService,
    changeDetector: ChangeDetectorRef
  ) {
    this.#agGridService = agGridService;
    this.#changeDetector = changeDetector;
    this.noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;
    this.gridOptions = this.#agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs,
        onGridReady: this.onGridReady.bind(this),
      },
    });
    this.#changeDetector.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.#changeDetector.markForCheck();
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

  #endDateFormatter(params: ValueFormatterParams): string {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return params.value
      ? params.value.toLocaleDateString('en-us', dateConfig)
      : 'N/A';
  }
}

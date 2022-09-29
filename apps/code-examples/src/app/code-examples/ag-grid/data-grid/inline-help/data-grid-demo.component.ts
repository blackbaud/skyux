import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  SkyAgGridHeaderComponent,
  SkyAgGridHeaderParams,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';

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
      headerComponent: SkyAgGridHeaderComponent,
      headerComponentParams: {
        headerAppendComponent: InlineHelpComponent,
      } as SkyAgGridHeaderParams,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      maxWidth: 60,
      headerComponent: SkyAgGridHeaderComponent,
      headerComponentParams: {
        headerAppendComponent: InlineHelpComponent,
      } as SkyAgGridHeaderParams,
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      type: SkyCellType.Date,
      sort: 'asc',
      headerComponent: SkyAgGridHeaderComponent,
      headerComponentParams: {
        headerAppendComponent: InlineHelpComponent,
      } as SkyAgGridHeaderParams,
    },
    {
      field: 'endDate',
      headerName: 'End date',
      type: SkyCellType.Date,
      valueFormatter: this.endDateFormatter,
      headerComponent: SkyAgGridHeaderComponent,
      headerComponentParams: {
        headerAppendComponent: InlineHelpComponent,
      } as SkyAgGridHeaderParams,
    },
    {
      field: 'department',
      headerName: 'Department',
      type: SkyCellType.Autocomplete,
      headerComponent: SkyAgGridHeaderComponent,
      headerComponentParams: {
        headerAppendComponent: InlineHelpComponent,
      } as SkyAgGridHeaderParams,
    },
    {
      field: 'jobTitle',
      headerName: 'Title',
      type: SkyCellType.Autocomplete,
      headerComponent: SkyAgGridHeaderComponent,
      headerComponentParams: {
        headerAppendComponent: InlineHelpComponent,
      } as SkyAgGridHeaderParams,
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
    this.noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;
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

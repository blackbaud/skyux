import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValueFormatterParams,
} from 'ag-grid-community';
import { of } from 'rxjs';

import { ContextMenuComponent } from './context-menu.component';
import { AG_GRID_DEMO_DATA, AgGridDemoRow } from './data';
import { InlineHelpComponent } from './inline-help.component';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * @title Basic setup with inline help (without data manager)
 */
@Component({
  selector: 'app-ag-grid-data-grid-inline-help-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule, SkySearchModule, SkyToolbarModule],
})
export class AgGridDataGridInlineHelpExampleComponent {
  protected gridData = AG_GRID_DEMO_DATA;
  protected gridOptions: GridOptions;
  protected searchText = '';
  protected noRowsTemplate: string;

  #columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
      cellRendererParams: {
        // Could be a SkyAppResourcesService.getString call that returns an observable.
        label: (data: AgGridDemoRow) => of(`Select ${data.name}`),
      },
    },
    {
      colId: 'context',
      maxWidth: 50,
      sortable: false,
      cellRenderer: ContextMenuComponent,
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
      valueFormatter: (params: ValueFormatterParams<AgGridDemoRow, Date>) =>
        this.#endDateFormatter(params),
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

  #gridApi: GridApi | undefined;

  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    this.noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;

    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs,
        onGridReady: this.onGridReady.bind(this),
      },
    });

    this.#changeDetectorRef.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#changeDetectorRef.markForCheck();
  }

  protected searchApplied(searchText: string | void): void {
    if (searchText) {
      this.searchText = searchText;
    } else {
      this.searchText = '';
    }
    if (this.#gridApi) {
      this.#gridApi.updateGridOptions({ quickFilterText: this.searchText });
      const displayedRowCount = this.#gridApi.getDisplayedRowCount();

      if (displayedRowCount > 0) {
        this.#gridApi.hideOverlay();
      } else {
        this.#gridApi.showNoRowsOverlay();
      }
    }
  }

  #endDateFormatter(params: ValueFormatterParams<AgGridDemoRow, Date>): string {
    return params.value
      ? params.value.toLocaleDateString('en-us', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : 'N/A';
  }
}

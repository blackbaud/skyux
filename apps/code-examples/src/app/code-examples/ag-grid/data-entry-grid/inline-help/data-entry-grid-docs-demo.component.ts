import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyModalCloseArgs,
  SkyModalConfigurationInterface,
  SkyModalService,
} from '@skyux/modals';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';

import { DataEntryGridContextMenuComponent } from './data-entry-grid-docs-demo-context-menu.component';
import { AG_GRID_DEMO_DATA } from './data-entry-grid-docs-demo-data';
import { DataEntryGridEditModalContext } from './data-entry-grid-docs-demo-edit-modal-context';
import { DataEntryGridEditModalComponent } from './data-entry-grid-docs-demo-edit-modal.component';
import { InlineHelpComponent } from './inline-help.component';

@Component({
  selector: 'app-data-entry-grid-docs-demo',
  templateUrl: './data-entry-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataEntryGridDemoComponent {
  protected gridData = AG_GRID_DEMO_DATA;
  protected gridOptions: GridOptions;
  protected noRowsTemplate = `<div class="sky-font-deemphasized">No results found.</div>`;
  protected searchText = '';

  #columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
    },
    {
      colId: 'context',
      headerName: '',
      maxWidth: 50,
      sortable: false,
      cellRenderer: DataEntryGridContextMenuComponent,
    },
    {
      field: 'name',
      headerName: 'Name',
      type: SkyCellType.Text,
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: string): boolean => String(value).length <= 10,
          validatorMessage: `Value exceeds maximum length`,
        },
      },
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: number): boolean => value >= 18,
          validatorMessage: `Age must be 18+`,
        },
      },
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
    {
      colId: 'validationCurrency',
      field: 'validationCurrency',
      headerName: 'Validation currency',
      type: [SkyCellType.CurrencyValidator],
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
    {
      colId: 'validationDate',
      field: 'validationDate',
      headerName: 'Validation date',
      type: [SkyCellType.Date, SkyCellType.Validator],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: Date): boolean =>
            !!value && value > new Date(1985, 9, 26),
          validatorMessage: 'Enter a future date',
        },
      },
      headerComponentParams: {
        inlineHelpComponent: InlineHelpComponent,
      },
    },
  ];
  #gridApi: GridApi | undefined;

  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #modalSvc = inject(SkyModalService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    const gridOptions: GridOptions = {
      columnDefs: this.#columnDefs,
      onGridReady: (gridReadyEvent): void => this.onGridReady(gridReadyEvent),
    };

    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions,
    });

    this.#changeDetectorRef.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#gridApi.sizeColumnsToFit();
    this.#changeDetectorRef.markForCheck();
  }

  protected openModal(): void {
    const context = new DataEntryGridEditModalContext();
    context.gridData = this.gridData;

    const options: SkyModalConfigurationInterface = {
      providers: [
        {
          provide: DataEntryGridEditModalContext,
          useValue: context,
        },
      ],
      ariaDescribedBy: 'docs-edit-grid-modal-content',
      size: 'large',
    };

    const modalInstance = this.#modalSvc.open(
      DataEntryGridEditModalComponent,
      options
    );

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'cancel' || result.reason === 'close') {
        alert('Edits canceled!');
      } else {
        this.gridData = result.data;
        this.#gridApi?.refreshCells();

        alert('Saving data!');
      }
    });
  }

  protected searchApplied(searchText: string | void): void {
    this.searchText = searchText ?? '';

    if (this.#gridApi) {
      this.#gridApi.setQuickFilter(this.searchText);
      const displayedRowCount = this.#gridApi.getDisplayedRowCount();

      if (displayedRowCount > 0) {
        this.#gridApi.hideOverlay();
      } else {
        this.#gridApi.showNoRowsOverlay();
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

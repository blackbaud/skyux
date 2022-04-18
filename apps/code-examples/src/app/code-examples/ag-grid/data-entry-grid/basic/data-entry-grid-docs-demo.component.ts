import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';

import { SkyDataEntryGridContextMenuComponent } from './data-entry-grid-docs-demo-context-menu.component';
import { SKY_AG_GRID_DEMO_DATA } from './data-entry-grid-docs-demo-data';
import { SkyDataEntryGridEditModalContext } from './data-entry-grid-docs-demo-edit-modal-context';
import { SkyDataEntryGridEditModalComponent } from './data-entry-grid-docs-demo-edit-modal.component';

@Component({
  selector: 'app-data-entry-grid-docs-demo',
  templateUrl: './data-entry-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataEntryGridDemoComponent {
  public gridData = SKY_AG_GRID_DEMO_DATA;
  public columnDefs: ColDef[] = [
    {
      field: 'selected',
      type: SkyCellType.RowSelector,
    },
    {
      colId: 'context',
      headerName: '',
      maxWidth: 50,
      sortable: false,
      cellRenderer: SkyDataEntryGridContextMenuComponent,
    },
    {
      field: 'name',
      headerName: 'Name',
      type: SkyCellType.Text,
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value): boolean => String(value).length <= 10,
          validatorMessage: `Value exceeds maximum length`,
        },
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value) => value >= 18,
          validatorMessage: `Age must be 18+`,
        },
      },
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
    {
      colId: 'validationCurrency',
      field: 'validationCurrency',
      headerName: 'Validation currency',
      type: [SkyCellType.CurrencyValidator],
    },
    {
      colId: 'validationDate',
      field: 'validationDate',
      headerName: 'Validation date',
      type: [SkyCellType.Date, SkyCellType.Validator],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: Date) => !!value && value > new Date(1985, 9, 26),
          validatorMessage: 'Please enter a future date',
        },
      },
    },
  ];

  public gridApi: GridApi | undefined;
  public gridOptions: GridOptions;
  public searchText = '';
  public noRowsTemplate: string;

  constructor(
    private agGridService: SkyAgGridService,
    private modalService: SkyModalService,
    private changeDetection: ChangeDetectorRef
  ) {
    this.noRowsTemplate = `<div class="sky-deemphasized">No results found.</div>`;
    this.gridOptions = {
      columnDefs: this.columnDefs,
      onGridReady: (gridReadyEvent) => this.onGridReady(gridReadyEvent),
    };
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: this.gridOptions,
    });
    this.changeDetection.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.changeDetection.markForCheck();
  }

  public openModal(): void {
    const context = new SkyDataEntryGridEditModalContext();
    context.gridData = this.gridData;

    const options = {
      providers: [
        { provide: SkyDataEntryGridEditModalContext, useValue: context },
      ],
      ariaDescribedBy: 'docs-edit-grid-modal-content',
      size: 'large',
    };

    const modalInstance = this.modalService.open(
      SkyDataEntryGridEditModalComponent,
      options
    );

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'cancel' || result.reason === 'close') {
        alert('Edits canceled!');
      } else {
        this.gridData = result.data;
        if (this.gridApi) {
          this.gridApi.refreshCells();
        }
        alert('Saving data!');
      }
    });
  }

  public searchApplied(searchText: string | undefined): void {
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

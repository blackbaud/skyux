import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValueFormatterParams,
} from 'ag-grid-community';
import { of } from 'rxjs';

import { ContextMenuComponent } from './context-menu.component';
import { AG_GRID_DEMO_DATA, AgGridDemoRow } from './data';
import { EditModalContext } from './edit-modal-context';
import { EditModalComponent } from './edit-modal.component';
import { InlineHelpComponent } from './inline-help.component';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * @title Basic setup with inline help (without data manager)
 */
@Component({
  selector: 'app-ag-grid-data-entry-grid-inline-help-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridAngular, SkyAgGridModule, SkySearchModule, SkyToolbarModule],
})
export class AgGridDataEntryGridInlineHelpExampleComponent {
  protected readonly gridData = signal<AgGridDemoRow[]>(AG_GRID_DEMO_DATA);
  protected gridOptions: GridOptions<AgGridDemoRow> = inject(
    SkyAgGridService,
  ).getGridOptions({
    gridOptions: {
      columnDefs: [
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
          headerName: 'Context menu',
          headerComponentParams: {
            headerHidden: true,
          },
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
      ],
      onGridReady: (gridReadyEvent): void => {
        this.#gridApi.set(gridReadyEvent.api);
      },
      onGridPreDestroyed: (): void => {
        this.#gridApi.set(undefined);
      },
    },
  });

  readonly #gridApi = signal<GridApi | undefined>(undefined);
  readonly #modalSvc = inject(SkyModalService);

  constructor() {
    effect(() => {
      const rowData = this.gridData();
      this.#gridApi()?.setGridOption('rowData', rowData);
    });
  }

  protected openModal(): void {
    const context = new EditModalContext();
    context.gridData = structuredClone(this.gridData());

    const options: SkyModalConfigurationInterface = {
      providers: [
        {
          provide: EditModalContext,
          useValue: context,
        },
      ],
      size: 'large',
    };

    const modalInstance = this.#modalSvc.open(EditModalComponent, options);

    modalInstance.closed.subscribe((result) => {
      if (result.reason === 'cancel' || result.reason === 'close') {
        alert('Edits canceled!');
      } else {
        this.gridData.set(result.data as AgGridDemoRow[]);
      }
    });
  }

  protected searchApplied(searchText: string | void): void {
    this.#gridApi()?.setGridOption('quickFilterText', searchText ?? '');
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

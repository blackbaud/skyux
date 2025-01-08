import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  SkyAgGridAutocompleteProperties,
  SkyAgGridDatepickerProperties,
  SkyAgGridModule,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorParams,
  IRowNode,
} from 'ag-grid-community';

import { AgGridDemoRow, DEPARTMENTS, JOB_TITLES } from './data';
import { EditModalContext } from './edit-modal-context';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule, SkyModalModule],
})
export class EditModalComponent {
  protected gridData: AgGridDemoRow[];
  protected gridOptions: GridOptions;

  #columnDefs: ColDef[];
  #gridApi: GridApi | undefined;

  protected readonly instance = inject(SkyModalInstance);
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #context = inject(EditModalContext);

  constructor() {
    this.#columnDefs = [
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
        cellEditorParams: {
          skyComponentProperties: {
            maxlength: 10,
          },
        },
        editable: true,
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
        cellEditorParams: {
          skyComponentProperties: {
            min: 18,
          },
        },
        editable: true,
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
        editable: true,
        cellEditorParams: (
          params: ICellEditorParams<AgGridDemoRow>,
        ): { skyComponentProperties: SkyAgGridDatepickerProperties } => {
          return { skyComponentProperties: { minDate: params.data.startDate } };
        },
      },
      {
        field: 'department',
        headerName: 'Department',
        type: SkyCellType.Autocomplete,
        editable: true,
        cellEditorParams: (
          params: ICellEditorParams<AgGridDemoRow>,
        ): { skyComponentProperties: SkyAgGridAutocompleteProperties } => {
          return {
            skyComponentProperties: {
              data: DEPARTMENTS,
              selectionChange: (change): void => {
                this.#departmentSelectionChange(change, params.node);
              },
            },
          };
        },
        onCellValueChanged: (event): void => {
          if (event.newValue !== event.oldValue) {
            this.#clearJobTitle(event.node);
          }
        },
      },
      {
        field: 'jobTitle',
        headerName: 'Title',
        type: SkyCellType.Autocomplete,
        editable: true,
        cellEditorParams: (
          params: ICellEditorParams<AgGridDemoRow>,
        ): { skyComponentProperties: SkyAgGridAutocompleteProperties } => {
          const selectedDepartment = params.data?.department?.name;
          const editParams: {
            skyComponentProperties: SkyAgGridAutocompleteProperties;
          } = { skyComponentProperties: { data: [] } };

          if (selectedDepartment) {
            editParams.skyComponentProperties.data =
              JOB_TITLES[selectedDepartment];
          }

          return editParams;
        },
      },
      {
        colId: 'validationCurrency',
        field: 'validationCurrency',
        headerName: 'Validation currency',
        type: [SkyCellType.CurrencyValidator],
        editable: true,
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
            validatorMessage: 'Please enter a future date',
          },
        },
        editable: true,
      },
    ];

    this.gridData = this.#context.gridData;

    const gridOptions: GridOptions = {
      columnDefs: this.#columnDefs,
      onGridReady: (gridReadyEvent): void => {
        this.onGridReady(gridReadyEvent);
      },
    };

    this.gridOptions = this.#agGridSvc.getEditableGridOptions({
      gridOptions,
    });

    this.#changeDetectorRef.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#changeDetectorRef.markForCheck();
  }

  #departmentSelectionChange(
    change: SkyAutocompleteSelectionChange,
    node: IRowNode<AgGridDemoRow>,
  ): void {
    if (change.selectedItem && change.selectedItem !== node.data?.department) {
      this.#clearJobTitle(node);
    }
  }

  #clearJobTitle(node: IRowNode<AgGridDemoRow> | null): void {
    if (node?.data) {
      node.data.jobTitle = undefined;

      this.#changeDetectorRef.markForCheck();
      this.#gridApi?.refreshCells({ rowNodes: [node] });
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
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
  CellEditingStartedEvent,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorParams,
  IRowNode,
  NewValueParams,
} from 'ag-grid-community';

import { AgGridDemoRow, DEPARTMENTS, JOB_TITLES } from './data';
import { EditModalContext } from './edit-modal-context';
import { MarkInactiveComponent } from './mark-inactive.component';

@Component({
  standalone: true,
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyModalModule,
    MarkInactiveComponent,
  ],
})
export class EditModalComponent implements OnInit {
  @ViewChild('markInactiveAction', { static: true })
  protected markInactiveAction: TemplateRef<unknown> | undefined;

  protected gridData: AgGridDemoRow[];
  protected gridOptions: GridOptions | undefined;

  #gridApi: GridApi | undefined;

  protected readonly instance = inject(SkyModalInstance);
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #context = inject(EditModalContext);

  constructor() {
    this.gridData = this.#context.gridData;
  }

  public ngOnInit(): void {
    const columnDefs: ColDef[] = [
      {
        colId: 'markInactiveAction',
        headerName: 'Mark inactive',
        type: SkyCellType.Template,
        editable: true,
        cellRendererParams: {
          template: this.markInactiveAction,
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
              selectionChange: (
                change: SkyAutocompleteSelectionChange,
              ): void => {
                this.#departmentSelectionChange(change, params.node);
              },
            },
          };
        },
        onCellValueChanged: (event: NewValueParams): void => {
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

    this.gridOptions = {
      columnDefs: columnDefs,
      onGridReady: (gridReadyEvent): void => {
        this.onGridReady(gridReadyEvent);
      },
    };

    this.gridOptions = this.#agGridSvc.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });

    this.#changeDetectorRef.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#gridApi.addEventListener(
      'cellEditingStarted',
      (params: CellEditingStartedEvent) => {
        if (params.colDef?.type === SkyCellType.Template) {
          if (params.rowIndex !== null) {
            this.#gridApi?.setFocusedCell(params.rowIndex, params.column);
          }
        }
      },
    );

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

      if (this.#gridApi) {
        this.#gridApi.refreshCells({ rowNodes: [node] });
      }
    }
  }
}

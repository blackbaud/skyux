import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  SkyAgGridAutocompleteProperties,
  SkyAgGridDatepickerProperties,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';
import { SkyModalInstance } from '@skyux/modals';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorParams,
  NewValueParams,
  RowNode,
} from 'ag-grid-community';

import {
  SKY_DEPARTMENTS,
  SKY_JOB_TITLES,
  SkyAgGridDemoRow,
} from './data-entry-grid-docs-demo-data';
import { SkyDataEntryGridEditModalContext } from './data-entry-grid-docs-demo-edit-modal-context';

@Component({
  selector: 'app-data-entry-grid-docs-demo-edit-modal',
  templateUrl: './data-entry-grid-docs-demo-edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataEntryGridEditModalComponent {
  public columnDefs: ColDef[];
  private gridApi: GridApi | undefined;
  public gridData: SkyAgGridDemoRow[];
  public gridOptions: GridOptions;

  constructor(
    private agGridService: SkyAgGridService,
    public context: SkyDataEntryGridEditModalContext,
    public instance: SkyModalInstance,
    private changeDetector: ChangeDetectorRef
  ) {
    this.columnDefs = [
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
            validator: (value) => value >= 18,
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
          params: ICellEditorParams
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
          params: ICellEditorParams
        ): { skyComponentProperties: SkyAgGridAutocompleteProperties } => {
          return {
            skyComponentProperties: {
              data: SKY_DEPARTMENTS,
              selectionChange: (
                change: SkyAutocompleteSelectionChange
              ): void => {
                this.departmentSelectionChange(change, params.node);
              },
            },
          };
        },
        onCellValueChanged: (event: NewValueParams): void => {
          if (event.newValue !== event.oldValue) {
            this.clearJobTitle(event.node);
          }
        },
      },
      {
        field: 'jobTitle',
        headerName: 'Title',
        type: SkyCellType.Autocomplete,
        editable: true,
        cellEditorParams: (
          params: ICellEditorParams
        ): { skyComponentProperties: SkyAgGridAutocompleteProperties } => {
          const selectedDepartment: string =
            params.data &&
            params.data.department &&
            params.data.department.name;
          const editParams: {
            skyComponentProperties: SkyAgGridAutocompleteProperties;
          } = { skyComponentProperties: { data: [] } };

          if (selectedDepartment) {
            editParams.skyComponentProperties.data =
              SKY_JOB_TITLES[selectedDepartment];
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
            validator: (value: Date) =>
              !!value && value > new Date(1985, 9, 26),
            validatorMessage: 'Please enter a future date',
          },
        },
        editable: true,
      },
    ];
    this.gridData = this.context.gridData;
    this.gridOptions = {
      columnDefs: this.columnDefs,
      onGridReady: (gridReadyEvent) => this.onGridReady(gridReadyEvent),
    };
    this.gridOptions = this.agGridService.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });
    this.changeDetector.markForCheck();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.changeDetector.markForCheck();
  }

  private departmentSelectionChange(
    change: SkyAutocompleteSelectionChange,
    node: RowNode
  ): void {
    if (change.selectedItem && change.selectedItem !== node.data.department) {
      this.clearJobTitle(node);
    }
  }

  private clearJobTitle(node: RowNode | null): void {
    if (node) {
      node.data.jobTitle = undefined;
      this.changeDetector.markForCheck();
      if (this.gridApi) {
        this.gridApi.refreshCells({ rowNodes: [node] });
      }
    }
  }
}

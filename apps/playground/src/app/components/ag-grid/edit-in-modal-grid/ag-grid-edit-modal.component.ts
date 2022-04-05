import { Component, OnInit } from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';
import { SkyModalInstance } from '@skyux/modals';

import {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorParams,
  RowNode,
} from 'ag-grid-community';

import {
  SKY_DEPARTMENTS,
  SKY_JOB_TITLES,
  SkyAgGridDemoRow,
} from './ag-grid-demo-data';
import { SkyAgGridEditModalContext } from './ag-grid-edit-modal-context';

@Component({
  selector: 'app-demo-edit-modal-form',
  templateUrl: './ag-grid-edit-modal.component.html',
})
export class SkyAgGridEditModalComponent implements OnInit {
  public gridData: SkyAgGridDemoRow[];
  public columnDefs: ColDef[];
  public gridOptions: GridOptions;
  public gridApi: GridApi;

  constructor(
    private agGridService: SkyAgGridService,
    public context: SkyAgGridEditModalContext,
    public instance: SkyModalInstance
  ) {}

  public ngOnInit(): void {
    this.gridData = this.context.gridData;
    this.columnDefs = [
      {
        field: 'name',
        headerName: 'Name',
      },
      {
        field: 'age',
        headerName: 'Age',
        type: SkyCellType.Number,
        maxWidth: 100,
        editable: true,
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        type: SkyCellType.Date,
        sort: 'asc',
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        type: SkyCellType.Date,
        editable: true,
        cellEditorParams: (params: ICellEditorParams): any => {
          return { skyComponentProperties: { minDate: params.data.startDate } };
        },
      },
      {
        field: 'department',
        headerName: 'Department',
        type: SkyCellType.Autocomplete,
        editable: true,
        cellEditorParams: (params: ICellEditorParams) => {
          return {
            skyComponentProperties: {
              data: SKY_DEPARTMENTS,
              selectionChange: (change: SkyAutocompleteSelectionChange) => {
                this.departmentSelectionChange(change, params.node);
              },
            },
          };
        },
        onCellValueChanged: (changeEvent: CellValueChangedEvent) => {
          if (changeEvent.newValue !== changeEvent.oldValue) {
            this.clearJobTitle(changeEvent.node);
          }
        },
      },
      {
        field: 'jobTitle',
        headerName: 'Title',
        type: SkyCellType.Autocomplete,
        editable: true,
        cellEditorParams: (params: ICellEditorParams): any => {
          const selectedDepartment: string =
            params.data &&
            params.data.department &&
            params.data.department.name;
          const editParams: any = { skyComponentProperties: { data: [] } };

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

    this.gridOptions = {
      columnDefs: this.columnDefs,
      onGridReady: (gridReadyEvent) => this.onGridReady(gridReadyEvent),
    };
    this.gridOptions = this.agGridService.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });
  }

  public onGridReady(gridReadyEvent: GridReadyEvent) {
    this.gridApi = gridReadyEvent.api;

    this.gridApi.sizeColumnsToFit();
  }

  private departmentSelectionChange(
    change: SkyAutocompleteSelectionChange,
    node: RowNode
  ) {
    if (change.selectedItem && change.selectedItem !== node.data.department) {
      this.clearJobTitle(node);
    }
  }

  private clearJobTitle(node: RowNode) {
    node.data.jobTitle = undefined;
    this.gridApi.refreshCells({ rowNodes: [node] });
  }
}

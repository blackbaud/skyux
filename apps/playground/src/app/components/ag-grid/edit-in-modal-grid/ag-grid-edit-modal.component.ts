import { Component, OnInit } from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorParams,
  IRowNode,
  ModuleRegistry,
} from 'ag-grid-community';

import { AgGridDemoRow, DEPARTMENTS, JOB_TITLES } from './ag-grid-demo-data';
import { SkyAgGridEditModalContext } from './ag-grid-edit-modal-context';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-demo-edit-modal-form',
  templateUrl: './ag-grid-edit-modal.component.html',
  imports: [AgGridModule, SkyAgGridModule, SkyModalModule],
})
export class SkyAgGridEditModalComponent implements OnInit {
  public gridData: AgGridDemoRow[];
  public columnDefs: ColDef[];
  public gridOptions: GridOptions;
  public gridApi: GridApi;

  constructor(
    private agGridService: SkyAgGridService,
    public context: SkyAgGridEditModalContext,
    public instance: SkyModalInstance,
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
        cellEditorParams: (params: ICellEditorParams): any => {
          return {
            skyComponentProperties: {
              data: DEPARTMENTS,
              selectionChange: (
                change: SkyAutocompleteSelectionChange,
              ): void => {
                this.departmentSelectionChange(change, params.node);
              },
            },
          };
        },
        onCellValueChanged: (changeEvent: CellValueChangedEvent): void => {
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
      columnDefs: this.columnDefs,
      onGridReady: (gridReadyEvent): void => this.onGridReady(gridReadyEvent),
    };
    this.gridOptions = this.agGridService.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;

    this.gridApi.sizeColumnsToFit();
  }

  private departmentSelectionChange(
    change: SkyAutocompleteSelectionChange,
    node: IRowNode,
  ): void {
    if (change.selectedItem && change.selectedItem !== node.data.department) {
      this.clearJobTitle(node);
    }
  }

  private clearJobTitle(node: IRowNode): void {
    node.data.jobTitle = undefined;
    this.gridApi.refreshCells({ rowNodes: [node] });
  }
}

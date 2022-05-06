import { Component, HostListener, OnInit } from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyThemeService } from '@skyux/theme';

import {
  CellClassParams,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';

import {
  EDITABLE_GRID_AUTOCOMPLETE_OPTIONS,
  EDITABLE_GRID_DATA,
  EditableGridRow,
} from './edit-stop-when-loses-focus-data';

@Component({
  selector: 'app-edit-stop-when-loses-focus-visual',
  templateUrl: './edit-stop-when-loses-focus.component.html',
  styleUrls: ['./edit-stop-when-loses-focus.component.scss'],
})
export class EditStopWhenLosesFocusComponent implements OnInit {
  public gridData = EDITABLE_GRID_DATA;
  public editMode = false;
  public uneditedGridData: EditableGridRow[];
  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public columnDefs: ColDef[];

  @HostListener('window:resize')
  public onWindowResize() {
    this.sizeGrid();
  }

  constructor(
    private agGridService: SkyAgGridService,
    public themeSvc: SkyThemeService
  ) {}

  public ngOnInit(): void {
    this.setColumnDefs();

    this.getGridOptions();

    this.themeSvc.settingsChange.subscribe(() => {
      this.getGridOptions();
    });

    this.gridData.forEach((row) => {
      row.total = this.calculateRowTotal(row);
    });

    this.uneditedGridData = this.cloneGridData(this.gridData);
  }

  public setColumnDefs(): void {
    this.columnDefs = [
      {
        colId: 'name',
        field: 'name',
        headerName: 'Goal Name',
        minWidth: 220,
        editable: this.editMode,
        type: SkyCellType.Text,
      },
      {
        colId: 'completedDate',
        field: 'completedDate',
        headerName: 'Completed Date',
        editable: this.editMode,
        type: SkyCellType.Date,
        cellEditorParams: {
          skyComponentProperties: {
            startingDay: 1,
          },
        },
      },
      {
        colId: 'value1',
        field: 'value1',
        headerName: 'Update 1',
        editable: this.editMode,
        onCellValueChanged: (changeEvent: CellValueChangedEvent) =>
          this.onUpdateCellValueChanged(changeEvent),
        type: SkyCellType.Number,
      },
      {
        colId: 'value2',
        field: 'value2',
        headerName: 'Update 2',
        editable: this.editMode,
        onCellValueChanged: (changeEvent: CellValueChangedEvent) =>
          this.onUpdateCellValueChanged(changeEvent),
        type: SkyCellType.Number,
      },
      {
        colId: 'value3',
        field: 'value3',
        headerName: 'Update 3',
        editable: this.editMode,
        onCellValueChanged: (changeEvent: CellValueChangedEvent) =>
          this.onUpdateCellValueChanged(changeEvent),
        type: SkyCellType.Number,
      },
      {
        colId: 'total',
        field: 'total',
        headerName: 'Current Total',
        type: SkyCellType.Number,
        cellClass: this.totalCellClass,
      },
      {
        colId: 'target',
        field: 'target',
        headerName: 'Target Value',
        type: SkyCellType.Number,
      },
      {
        colId: 'primaryContact',
        field: 'primaryContact',
        headerName: 'Primary Contact',
        editable: this.editMode,
        type: SkyCellType.Autocomplete,
        cellEditorParams: {
          skyComponentProperties: {
            data: EDITABLE_GRID_AUTOCOMPLETE_OPTIONS,
          },
        },
      },
      {
        colId: 'dueDate',
        field: 'dueDate',
        headerName: 'Due Date',
        type: SkyCellType.Date,
        sort: 'asc',
        minWidth: 160,
      },
      {
        colId: 'currencyAmount',
        field: 'currencyAmount',
        headerName: 'Currency',
        type: SkyCellType.Currency,
        editable: this.editMode,
        cellRendererParams: {},
        cellEditorParams: {},
      },
    ];
  }

  public cloneGridData(data: EditableGridRow[]): EditableGridRow[] {
    const clonedData: EditableGridRow[] = [];
    data.forEach((row) => {
      clonedData.push({ ...row });
    });

    return clonedData;
  }

  public cancelEdits(): void {
    this.setEditMode(false);
    this.gridData = this.cloneGridData(this.uneditedGridData);
  }

  public setEditMode(editable: boolean): void {
    this.editMode = editable;
    this.setColumnDefs();
    this.gridApi.setColumnDefs(this.columnDefs);
    this.gridApi.redrawRows();
  }

  public saveData(): void {
    this.uneditedGridData = this.cloneGridData(this.gridData);
    this.setEditMode(false);
    alert('save your data here!');
  }

  public totalCellClass(params: CellClassParams): string {
    const difference = params.data.target - params.data.total;
    const thresholdOne = params.data.target / 3;
    const thresholdTwo = thresholdOne * 2;
    if (difference >= thresholdTwo) {
      return 'red';
    } else if (difference >= thresholdOne) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  public onUpdateCellValueChanged(
    cellValueChangedData: CellValueChangedEvent
  ): void {
    if (cellValueChangedData.newValue !== cellValueChangedData.oldValue) {
      cellValueChangedData.data.total = this.calculateRowTotal(
        cellValueChangedData.data
      );
      this.gridApi.refreshCells({ rowNodes: [cellValueChangedData.node] });
    }
  }

  public calculateRowTotal(row: EditableGridRow): number {
    let rowValue = 0;
    if (row.value1 !== undefined) {
      rowValue = rowValue + row.value1;
    }
    if (row.value2 !== undefined) {
      rowValue = rowValue + row.value2;
    }
    if (row.value3 !== undefined) {
      rowValue = rowValue + row.value3;
    }

    return rowValue;
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;

    this.sizeGrid();
  }

  public sizeGrid(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  private getGridOptions(): void {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      onGridReady: (gridReadyEvent) => this.onGridReady(gridReadyEvent),
      onGridSizeChanged: () => {
        this.sizeGrid();
      },
    };
    this.gridOptions = this.agGridService.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });
    this.gridOptions.stopEditingWhenGridLosesFocus = true;
  }
}

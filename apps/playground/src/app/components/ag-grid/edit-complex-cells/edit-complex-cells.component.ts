import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  SkyAgGridRowDeleteCancelArgs,
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyAutocompleteSearchAsyncArgs } from '@skyux/lookup';
import { SkyThemeService } from '@skyux/theme';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IGetRowsParams,
  RowNode,
  RowSelectedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, of } from 'rxjs';
import { delay, skip } from 'rxjs/operators';

import { CustomMultilineComponent } from './custom-multiline/custom-multiline.component';
import {
  EDITABLE_GRID_DATA,
  EDITABLE_GRID_DATA_FACTORY,
  EDITABLE_GRID_LOOKUP,
  EDITABLE_GRID_LOOKUP_ASYNC,
  EDITABLE_GRID_OPTIONS,
  EditableGridOption,
  EditableGridRow,
} from './edit-complex-cells-data';

@Component({
  selector: 'app-edit-complex-cells-visual',
  templateUrl: './edit-complex-cells.component.html',
  styleUrls: ['./edit-complex-cells.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditComplexCellsComponent implements OnInit {
  public gridData = EDITABLE_GRID_DATA;
  public editMode = false;
  public uneditedGridData: EditableGridRow[];
  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public columnDefs: ColDef[];
  public refresh = new BehaviorSubject<boolean>(true);
  public rowDeleteIds: string[] = [];
  public rowModelType: 'clientSide' | 'infinite' = 'clientSide';

  private deletedRowIds: string[] = [];

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

    this.themeSvc.settingsChange.pipe(skip(1)).subscribe(() => {
      this.getGridOptions();
      this.refresh.next(!this.refresh.getValue());
    });

    this.uneditedGridData = this.cloneGridData(this.gridData);
  }

  public setColumnDefs(): void {
    this.columnDefs = [
      {
        field: 'selected',
        colId: 'selected',
        type: SkyCellType.RowSelector,
      },
      {
        colId: 'name',
        field: 'name',
        headerName: 'Name',
        minWidth: 220,
        editable: this.editMode,
        type: SkyCellType.Text,
      },
      {
        colId: 'language',
        field: 'language',
        minWidth: 185,
        maxWidth: 235,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['English', 'Spanish', 'French', 'Portuguese', '(other)'],
        },
        editable: this.editMode,
      },
      {
        colId: 'validationAutocomplete',
        field: 'validationAutocomplete',
        minWidth: 185,
        maxWidth: 235,
        editable: this.editMode,
        type: [SkyCellType.Autocomplete, SkyCellType.Validator],
        cellEditorParams: {
          skyComponentProperties: {
            data: EDITABLE_GRID_OPTIONS,
          },
        },
        cellRendererParams: {
          skyComponentProperties: {
            validator: (value: EditableGridOption) => !!value?.validOption,
            validatorMessage: 'Please choose an odd number option',
          },
        },
      },
      {
        colId: 'validationCurrency',
        field: 'validationCurrency',
        minWidth: 185,
        maxWidth: 235,
        editable: this.editMode,
        type: [SkyCellType.CurrencyValidator],
      },
      {
        colId: 'validationDate',
        field: 'validationDate',
        minWidth: 185,
        maxWidth: 235,
        editable: this.editMode,
        type: [SkyCellType.Date, SkyCellType.Validator],
        cellRendererParams: {
          skyComponentProperties: {
            validator: (value: Date) =>
              !!value && value > new Date(1985, 9, 26),
            validatorMessage: 'Please enter a future date',
          },
        },
      },
      {
        colId: 'lookupSingle',
        field: 'lookupSingle',
        minWidth: 185,
        maxWidth: 235,
        editable: this.editMode,
        type: SkyCellType.Lookup,
        cellEditorParams: {
          skyComponentProperties: {
            data: EDITABLE_GRID_LOOKUP,
            idProperty: 'id',
            descriptorProperty: 'name',
            selectMode: 'single',
          },
        },
        cellRendererParams: {
          skyComponentProperties: {
            descriptorProperty: 'name',
          },
        },
      },
      {
        colId: 'lookupMultiple',
        field: 'lookupMultiple',
        minWidth: 235,
        maxWidth: 285,
        editable: this.editMode,
        type: SkyCellType.Lookup,
        cellEditorParams: {
          skyComponentProperties: {
            data: EDITABLE_GRID_LOOKUP,
            idProperty: 'id',
            descriptorProperty: 'name',
            selectMode: 'multiple',
            enableShowMore: true,
          },
        },
        cellRendererParams: {
          skyComponentProperties: {
            descriptorProperty: 'name',
          },
        },
      },
      {
        colId: 'lookupAsync',
        field: 'lookupAsync',
        minWidth: 235,
        maxWidth: 285,
        editable: this.editMode,
        type: SkyCellType.Lookup,
        cellEditorParams: {
          skyComponentProperties: {
            data: EDITABLE_GRID_LOOKUP,
            idProperty: 'id',
            descriptorProperty: 'name',
            selectMode: 'single',
            searchAsync: (search: SkyAutocompleteSearchAsyncArgs) => {
              const items = EDITABLE_GRID_LOOKUP_ASYNC.filter((value) =>
                value.name.startsWith(search.searchText.toUpperCase())
              );
              search.result = of({
                hasMore: false,
                items,
                totalCount: items.length,
              }).pipe(delay(600));
            },
          },
        },
        cellRendererParams: {
          skyComponentProperties: {
            descriptorProperty: 'name',
          },
        },
      },
      {
        colId: 'custom-multiline',
        field: 'custom-multiline',
        minWidth: 235,
        maxWidth: 285,
        editable: false,
        cellRendererFramework: CustomMultilineComponent,
        autoHeight: true,
        wrapText: true,
        cellClass: 'custom-multiline',
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

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;

    this.gridApi.addEventListener(
      RowNode.EVENT_ROW_SELECTED,
      ($event: RowSelectedEvent) => {
        if (this.editMode && $event.node.isSelected()) {
          this.rowDeleteIds = this.rowDeleteIds.concat([$event.node.id]);
        } else {
          this.rowDeleteIds = this.rowDeleteIds.filter(
            (id) => id !== $event.node.id
          );
        }
      }
    );

    this.sizeGrid();
  }

  public rowDeleteCancel($event: SkyAgGridRowDeleteCancelArgs): void {
    this.rowDeleteIds = this.rowDeleteIds.filter((id) => id !== $event.id);
  }

  public rowDeleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    if (this.rowModelType === 'clientSide') {
      this.gridData = this.gridData.filter((row) => row.id !== $event.id);
    } else if (this.rowModelType === 'infinite') {
      this.deletedRowIds = (this.deletedRowIds || []).concat([$event.id]);
      this.gridApi.purgeInfiniteCache();
    }
  }

  public sizeGrid(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  public switchRowModelTypeTo(rowModelType: 'clientSide' | 'infinite'): void {
    this.rowModelType = rowModelType;
    this.refresh.next(!this.refresh.getValue());
  }

  private getGridOptions(): void {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      datasource: {
        getRows(params: IGetRowsParams) {
          setTimeout(() => {
            const rowsThisBlock = EDITABLE_GRID_DATA_FACTORY(
              params.startRow,
              params.endRow - params.startRow,
              this.deletedRowIds
            );
            params.successCallback(rowsThisBlock, 300);
          });
        },
        rowCount: 300,
      },
      domLayout: 'normal',
      onGridReady: (gridReadyEvent) => this.onGridReady(gridReadyEvent),
      onGridSizeChanged: () => {
        this.sizeGrid();
      },
      suppressColumnVirtualisation: true,
    };
    this.gridOptions = this.agGridService.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });
    this.gridOptions.stopEditingWhenCellsLoseFocus = true;
  }
}

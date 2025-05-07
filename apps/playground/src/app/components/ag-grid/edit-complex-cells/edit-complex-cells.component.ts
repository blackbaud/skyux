import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  SkyAgGridLookupProperties,
  SkyAgGridModule,
  SkyAgGridRowDeleteCancelArgs,
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyAutocompleteSearchAsyncArgs } from '@skyux/lookup';
import { SkyThemeService } from '@skyux/theme';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IGetRowsParams,
  ModuleRegistry,
  RowSelectedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, skip } from 'rxjs/operators';

import { ActionComponent } from './action/action.component';
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
import { InlineHelpComponent } from './inline-help/inline-help.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-edit-complex-cells-visual',
  templateUrl: './edit-complex-cells.component.html',
  styleUrls: ['./edit-complex-cells.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    AgGridModule,
    CommonModule,
    SkyAgGridModule,
    SkyToolbarModule,
    ActionComponent,
  ],
})
export class EditComplexCellsComponent implements OnInit {
  @ViewChild('actionColumn', { static: true })
  protected actionColumn: TemplateRef<unknown> | undefined;

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
  public onWindowResize(): void {
    this.sizeGrid();
  }

  constructor(
    private agGridService: SkyAgGridService,
    public themeSvc: SkyThemeService,
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
        cellRendererParams: {
          label: (data: any): Observable<string> => of(`Select ${data.name}`),
        },
      },
      {
        colId: 'name',
        field: 'name',
        headerName: 'Name',
        minWidth: 220,
        editable: this.editMode,
        type: SkyCellType.Text,
        headerComponentParams: {
          inlineHelpComponent: InlineHelpComponent,
        },
        sortable: false,
        filter: true,
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
        headerComponentParams: {
          inlineHelpComponent: InlineHelpComponent,
        },
        sortable: false,
        filter: true,
      },
      {
        colId: 'action',
        headerName: 'Action',
        type: SkyCellType.Template,
        cellRendererParams: {
          template: this.actionColumn,
        },
        cellEditorParams: {
          template: this.actionColumn,
        },
        editable: this.editMode,
        minWidth: 130,
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
            validator: (value: EditableGridOption): boolean =>
              !!value?.validOption,
            validatorMessage: 'Please choose an odd number option',
          },
        },
        headerComponentParams: {
          inlineHelpComponent: InlineHelpComponent,
        },
        sortable: true,
        filter: true,
      },
      {
        colId: 'validationCurrency',
        field: 'validationCurrency',
        minWidth: 185,
        maxWidth: 235,
        editable: this.editMode,
        type: [SkyCellType.CurrencyValidator],
        headerComponentParams: {
          inlineHelpComponent: InlineHelpComponent,
        },
        sortable: true,
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
            validator: (value: Date): boolean =>
              !!value && value > new Date(1985, 9, 26),
            validatorMessage: 'Please enter a future date',
          },
        },
        headerComponentParams: {
          inlineHelpComponent: InlineHelpComponent,
        },
        sortable: false,
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
        minWidth: 335,
        maxWidth: 385,
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
            descriptorProperty: 'interestingFact',
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
            enableShowMore: true,
            idProperty: 'id',
            descriptorProperty: 'name',
            selectMode: 'single',
            searchAsync: (search: SkyAutocompleteSearchAsyncArgs) => {
              const items = EDITABLE_GRID_LOOKUP_ASYNC.filter((value) =>
                value.name.startsWith(search.searchText.toUpperCase()),
              );
              search.result = of({
                hasMore: false,
                items,
                totalCount: items.length,
              }).pipe(delay(600));
            },
            showAddButton: true,
            addClick: () => {
              alert('Add button clicked!');
            },
          } as SkyAgGridLookupProperties,
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
        cellRenderer: CustomMultilineComponent,
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
    this.gridApi.updateGridOptions({
      columnDefs: this.columnDefs,
    });
  }

  public saveData(): void {
    this.uneditedGridData = this.cloneGridData(this.gridData);
    console.table(this.uneditedGridData);
    this.setEditMode(false);
    alert('save your data here!');
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;

    this.gridApi.addEventListener('rowSelected', ($event: RowSelectedEvent) => {
      if (this.editMode && $event.node.isSelected()) {
        this.rowDeleteIds = this.rowDeleteIds.concat([$event.node.id]);
      } else {
        this.rowDeleteIds = this.rowDeleteIds.filter(
          (id) => id !== $event.node.id,
        );
      }
    });

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
    const overrides: GridOptions = {
      columnDefs: this.columnDefs,
      datasource: {
        getRows(params: IGetRowsParams) {
          setTimeout(() => {
            const rowsThisBlock = EDITABLE_GRID_DATA_FACTORY(
              params.startRow,
              params.endRow - params.startRow,
              this.deletedRowIds,
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
      stopEditingWhenCellsLoseFocus: false,
    };

    this.gridOptions = this.agGridService.getEditableGridOptions({
      gridOptions: overrides,
    });
  }
}

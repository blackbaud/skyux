import {
  Injectable
} from '@angular/core';

import {
  CellClassParams,
  GridOptions,
  ValueFormatterParams
} from 'ag-grid-community';

import {
  CellKeyPressEvent
} from 'ag-grid-community/dist/lib/events';

import {
  SkyAgGridCellEditorAutocompleteComponent,
  SkyAgGridCellEditorDatepickerComponent,
  SkyAgGridCellEditorNumberComponent,
  SkyAgGridCellEditorTextComponent
} from './cell-editors';

import {
  SkyAgGridCellRendererRowSelectorComponent
} from './cell-renderers';

import {
  SkyCellClass,
  SkyCellType,
  SkyGetGridOptionsArgs
} from './types';

function autocompleteComparator(value1: {name: string}, value2: {name: string}): number {
  if (value1 && value2 && value1.name > value2.name) {
    return 1;
  } else if (value1 && value2 && value1.name < value2.name) {
    return -1;
  } else if (value1 && value2 && value1 === value2) {
    return 0;
  } else if (value1) {
    return 1;
  } else {
    return -1;
  }
}

function autocompleteFormatter(params: ValueFormatterParams): string | undefined {
  return params.value && params.value.name;
}

/**
 * A service that provides default styling and behavior for agGrids in SKY UX SPAs.
 */
@Injectable()
export class SkyAgGridService {

  /**
   * Get SKY UX gridOptions to create your agGrid with default SKY styling and behavior.
   * @param args options to be applied to the default SKY UX agGrid gridOptions.
   */
  public getGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    const defaultGridOptions = this.getDefaultGridOptions(args);
    const mergedGridOptions = this.mergeGridOptions(defaultGridOptions, args.gridOptions);

    return mergedGridOptions;
  }

  public getEditableGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    const defaultGridOptions = this.getDefaultEditableGridOptions(args);
    const mergedGridOptions = this.mergeGridOptions(defaultGridOptions, args.gridOptions);

    return mergedGridOptions;
  }

  private mergeGridOptions(defaultGridOptions: GridOptions, providedGridOptions: GridOptions): GridOptions {
    let mergedGridOptions = {
      ...defaultGridOptions,
      ...providedGridOptions,
      columnTypes: {
        ...providedGridOptions.columnTypes,
        // apply default second to prevent consumers from overwriting our default column types
        ...defaultGridOptions.columnTypes
      },
      defaultColDef: {
        ...defaultGridOptions.defaultColDef,
        ...providedGridOptions.defaultColDef,
        // allow consumers to override all defaultColDef properties except cellClassRules, which we reserve for styling
        cellClassRules: defaultGridOptions.defaultColDef.cellClassRules
      },
      icons: {
        ...defaultGridOptions.icons,
        ...providedGridOptions.icons
      }
    };

    return mergedGridOptions;
  }

  private getDefaultGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    // cellClassRules can be functions or string expressions
    const cellClassRuleTrueExpression = 'true';

    function getEditableFn(isUneditable?: boolean): ((params: CellClassParams) => boolean) {
      return function (params: CellClassParams): boolean {
        let isEditable = params.colDef.editable;

        if (typeof isEditable === 'function') {
          const column = params.columnApi.getColumn(params.colDef.field);
          isEditable = isEditable({ ...params, column });
        }

        return isUneditable ? !isEditable : isEditable;
      };
    }

    const editableCellClassRules = {
      [SkyCellClass.Editable]: getEditableFn(),
      [SkyCellClass.Uneditable]: getEditableFn(true)
    };

    const defaultSkyGridOptions: GridOptions = {
      columnTypes: {
        [SkyCellType.Autocomplete]: {
          cellClassRules: {
            [SkyCellClass.Autocomplete]: cellClassRuleTrueExpression,
            ...editableCellClassRules
          },
          cellEditorFramework: SkyAgGridCellEditorAutocompleteComponent,
          valueFormatter: autocompleteFormatter,
          comparator: autocompleteComparator,
          minWidth: 185
        },
        [SkyCellType.Date]: {
          cellClassRules: {
            [SkyCellClass.Date]: cellClassRuleTrueExpression,
            ...editableCellClassRules
          },
          cellEditorFramework: SkyAgGridCellEditorDatepickerComponent,
          valueFormatter: (params: ValueFormatterParams) => this.dateFormatter(params, args.locale)
        },
        [SkyCellType.Number]: {
          cellClassRules: {
            [SkyCellClass.Number]: cellClassRuleTrueExpression,
            ...editableCellClassRules
          },
          cellEditorFramework: SkyAgGridCellEditorNumberComponent
        },
        [SkyCellType.RowSelector]: {
          cellClassRules: {
            [SkyCellClass.RowSelector]: cellClassRuleTrueExpression,
            [SkyCellClass.Uneditable]: cellClassRuleTrueExpression
          },
          cellRendererFramework: SkyAgGridCellRendererRowSelectorComponent,
          minWidth: 50,
          width: 50
        },
        [SkyCellType.Text]: {
          cellClassRules: {
            [SkyCellClass.Text]: cellClassRuleTrueExpression,
            ...editableCellClassRules
          },
          cellEditorFramework: SkyAgGridCellEditorTextComponent
        }
      },
      defaultColDef: {
        cellClassRules: editableCellClassRules,
        sortable: true,
        resizable: true,
        minWidth: 100
      },
      domLayout: 'autoHeight',
      enterMovesDownAfterEdit: true,
      headerHeight: 37,
      icons: {
        sortDescending: this.getIconTemplate('caret-down'),
        sortAscending: this.getIconTemplate('caret-up'),
        columnMoveMove: this.getIconTemplate('arrows'),
        columnMoveHide: this.getIconTemplate('arrows'),
        columnMoveLeft: this.getIconTemplate('arrows'),
        columnMoveRight: this.getIconTemplate('arrows'),
        columnMovePin: this.getIconTemplate('arrows')
      },
      onCellKeyPress: (keypress: CellKeyPressEvent) => this.onKeyPress(keypress),
      rowHeight: 38,
      rowMultiSelectWithClick: true,
      rowSelection: 'multiple',
      singleClickEdit: true,
      sortingOrder: ['desc', 'asc', 'null'],
      stopEditingWhenGridLosesFocus: true,
      suppressCellSelection: true,
      suppressDragLeaveHidesColumns: true
    };

    return defaultSkyGridOptions;
  }

  private getDefaultEditableGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    let defaultGridOptions = this.getDefaultGridOptions(args);

    defaultGridOptions.rowSelection = 'none';
    defaultGridOptions.suppressCellSelection = false;

    return defaultGridOptions;
  }

  private dateFormatter(params: ValueFormatterParams, locale: string = 'en-us'): string | undefined {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return params.value && params.value.toLocaleDateString(locale, dateConfig);
  }

  private getIconTemplate(iconName: string): string {
    return `<i class="fa fa-${iconName}"></i>`;
  }

  private onKeyPress(keypress: CellKeyPressEvent): void {
    const event = keypress.event as KeyboardEvent;

    if (event.key === 'Enter') {
      keypress.api.startEditingCell({
        rowIndex: keypress.rowIndex,
        colKey: keypress.colDef.colId
      });
    }
  }
}

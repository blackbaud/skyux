import {
  Injectable
} from '@angular/core';

import {
  CellClassParams,
  GridOptions,
  ValueFormatterParams
} from 'ag-grid-community';

import {
  SkyAgGridCellEditorAutocompleteComponent,
  SkyAgGridCellEditorDatepickerComponent,
  SkyAgGridCellEditorNumberComponent
} from './cell-editors';

import {
  SkyAgGridCellRendererRowSelectorComponent
} from './cell-renderers';

import {
  SkyCellClass,
  SkyCellType,
  SkyGetGridOptionsArgs
} from './types';

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

    let mergedGridOptions = {
      ...defaultGridOptions,
      ...args.gridOptions,
      columnTypes: {
        ...args.gridOptions.columnTypes,
        // apply default second to prevent consumers from overwriting our default column types
        ...defaultGridOptions.columnTypes
      },
      defaultColDef: {
        ...defaultGridOptions.defaultColDef,
        ...args.gridOptions.defaultColDef,
        // allow consumers to override all defaultColDef properties except cellClassRules, which we reserve for styling
        cellClassRules: defaultGridOptions.defaultColDef.cellClassRules
      },
      icons: {
        ...defaultGridOptions.icons,
        ...args.gridOptions.icons
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

    const defaultSkyGridOptions = {
      columnTypes: {
        [SkyCellType.Autocomplete]: {
          cellClassRules: {
            [SkyCellClass.Autocomplete]: cellClassRuleTrueExpression,
            ...editableCellClassRules
          },
          cellEditorFramework: SkyAgGridCellEditorAutocompleteComponent,
          valueFormatter: (params: ValueFormatterParams) => this.autocompleteFormatter(params),
          minWidth: 185
        },
        [SkyCellType.Number]: {
          cellClassRules: {
            [SkyCellClass.Number]: cellClassRuleTrueExpression,
            ...editableCellClassRules
          },
          cellEditorFramework: SkyAgGridCellEditorNumberComponent
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
      rowHeight: 37,
      rowMultiSelectWithClick: true,
      rowSelection: 'multiple',
      singleClickEdit: true,
      sortingOrder: ['desc', 'asc', 'null'],
      suppressCellSelection: true,
      suppressDragLeaveHidesColumns: true
    };

    return defaultSkyGridOptions;
  }

  private dateFormatter(params: ValueFormatterParams, locale: string = 'en-us'): string | undefined {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return params.value && params.value.toLocaleDateString(locale, dateConfig);
  }

  private autocompleteFormatter(params: ValueFormatterParams): string | undefined {
    return params.value && params.value.name;
  }

  private getIconTemplate(iconName: string): string {
    return `<i class="fa fa-${iconName}"></i>`;
  }
}

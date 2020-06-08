import {
  Injectable
} from '@angular/core';

import {
  CellClassParams,
  GridOptions,
  SuppressKeyboardEventParams,
  ValueFormatterParams
} from 'ag-grid-community';

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

import {
  SkyAgGridAdapterService
} from './ag-grid-adapter.service';

function autocompleteComparator(value1: {name: string}, value2: {name: string}): number {
  if (value1 && value2) {
    if (value1.name > value2.name) {
      return 1;
    }

    if (value1.name < value2.name) {
      return -1;
    }

    return 0;
  }

  return value1 ? 1 : -1;
}

function autocompleteFormatter(params: ValueFormatterParams): string | undefined {
  return params.value && params.value.name;
}

function dateComparator(date1: any, date2: any): number {
  let date1value = date1;
  let date2value = date2;

  if (typeof date1value === 'string') {
    date1value = new Date(date1);
  }

  if (typeof date2value === 'string') {
    date2value = new Date(date2);
  }

  if (date1value && date2value) {
    if (date1value > date2value) {
      return 1;
    }

    if (date1value < date2value) {
      return -1;
    }

    return 0;
  }

  return date1value ? 1 : -1;
}

/**
 * A service that provides default styling and behavior for agGrids in SKY UX SPAs.
 */
@Injectable()
export class SkyAgGridService {

  constructor(
    private agGridAdapterService: SkyAgGridAdapterService
  ) {}

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
          valueFormatter: (params: ValueFormatterParams) => this.dateFormatter(params, args.locale),
          comparator: dateComparator
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
          headerName: '',
          minWidth: 50,
          maxWidth: 50,
          sortable: false,
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
      onCellFocused: () => this.onCellFocused(),
      suppressKeyboardEvent: (keypress: SuppressKeyboardEventParams) => this.suppressTab(keypress),
      rowHeight: 38,
      rowMultiSelectWithClick: true,
      rowSelection: 'multiple',
      singleClickEdit: true,
      // tslint:disable-next-line: no-null-keyword
      sortingOrder: ['desc', 'asc', null],
      stopEditingWhenGridLosesFocus: false,
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: true
    };

    return defaultSkyGridOptions;
  }

  private onCellFocused(): void {
    const currentElement = this.agGridAdapterService.getFocusedElement();

    this.agGridAdapterService.focusOnFocusableChildren(currentElement);
  }

  private getDefaultEditableGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    let defaultGridOptions = this.getDefaultGridOptions(args);

    defaultGridOptions.rowSelection = 'none';
    defaultGridOptions.suppressCellSelection = false;

    return defaultGridOptions;
  }

  private dateFormatter(params: ValueFormatterParams, locale: string = 'en-us'): string | undefined {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    let date: Date = params.value;

    if (date && typeof date === 'string') {
      date = new Date(params.value);
    }

    let formattedDate = date && date.toLocaleDateString && date.toLocaleDateString(locale, dateConfig);

    if (date && date.getTime && !isNaN(date.getTime())) {
      return formattedDate;
    }
  }

  private getIconTemplate(iconName: string): string {
    return `<i class="fa fa-${iconName}"></i>`;
  }

  private suppressTab(params: SuppressKeyboardEventParams): boolean {
    if (params.event.code === 'Tab') {
      if (params.editing) {
        const currentlyFocusedEl = this.agGridAdapterService.getFocusedElement();
        // inline cell editors have the 'ag-cell' class, while popup editors have the 'ag-popup-editor' class
        const cellEl = this.agGridAdapterService.getElementOrParentWithClass(currentlyFocusedEl, 'ag-cell');
        const popupEl = this.agGridAdapterService.getElementOrParentWithClass(currentlyFocusedEl, 'ag-popup-editor');
        const parentEl = cellEl || popupEl;

        const nextFocusableElementInCell =
          this.agGridAdapterService.getNextFocusableElement(currentlyFocusedEl, parentEl, params.event.shiftKey);
          return !!nextFocusableElementInCell;
      }
      return true;
    }
    return false;
  }
}

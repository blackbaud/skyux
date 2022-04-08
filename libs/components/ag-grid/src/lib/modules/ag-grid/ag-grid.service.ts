import { Injectable, OnDestroy, Optional } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

import {
  CellClassParams,
  GridOptions,
  ICellRendererParams,
  RowClassParams,
  SuppressKeyboardEventParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { EditableCallbackParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { applySkyLookupPropertiesDefaults } from './apply-lookup-properties-defaults';
import { SkyAgGridCellEditorAutocompleteComponent } from './cell-editors/cell-editor-autocomplete/cell-editor-autocomplete.component';
import { SkyAgGridCellEditorCurrencyComponent } from './cell-editors/cell-editor-currency/cell-editor-currency.component';
import { SkyAgGridCellEditorDatepickerComponent } from './cell-editors/cell-editor-datepicker/cell-editor-datepicker.component';
import { SkyAgGridCellEditorLookupComponent } from './cell-editors/cell-editor-lookup/cell-editor-lookup.component';
import { SkyAgGridCellEditorNumberComponent } from './cell-editors/cell-editor-number/cell-editor-number.component';
import { SkyAgGridCellEditorTextComponent } from './cell-editors/cell-editor-text/cell-editor-text.component';
import { SkyAgGridCellRendererCurrencyValidatorComponent } from './cell-renderers/cell-renderer-currency/cell-renderer-currency-validator.component';
import { SkyAgGridCellRendererCurrencyComponent } from './cell-renderers/cell-renderer-currency/cell-renderer-currency.component';
import { SkyAgGridCellRendererLookupComponent } from './cell-renderers/cell-renderer-lookup/cell-renderer-lookup.component';
import { SkyAgGridCellRendererRowSelectorComponent } from './cell-renderers/cell-renderer-row-selector/cell-renderer-row-selector.component';
import { SkyAgGridCellRendererValidatorTooltipComponent } from './cell-renderers/cell-renderer-validator-tooltip/cell-renderer-validator-tooltip.component';
import { SkyCellClass } from './types/cell-class';
import { SkyCellType } from './types/cell-type';
import { SkyHeaderClass } from './types/header-class';
import {
  SkyAgGridGetGridOptionsArgs,
  SkyGetGridOptionsArgs,
} from './types/sky-grid-options';

type GetGridOptions = SkyAgGridGetGridOptionsArgs | SkyGetGridOptionsArgs;

function autocompleteComparator(
  value1: { name: string },
  value2: { name: string }
): number {
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

function autocompleteFormatter(
  params: ValueFormatterParams
): string | undefined {
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

function getValidatorCellRendererSelector(component: string, fallback?: any) {
  return (params: ICellRendererParams) => {
    if (
      params.colDef &&
      typeof params.colDef.cellRendererParams?.skyComponentProperties
        ?.validator === 'function'
    ) {
      if (
        !params.colDef.cellRendererParams.skyComponentProperties.validator(
          params.value,
          params.data,
          params.rowIndex
        )
      ) {
        return {
          component,
          params: {
            ...params.colDef.cellRendererParams,
          },
        };
      }
    }
    return fallback;
  };
}

let rowNodeId = -1;

/**
 * `SkyAgGridService` provides methods to get AG Grid `gridOptions` to ensure grids match SKY UX functionality. The `gridOptions` can be overridden, and include registered SKY UX column types.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyAgGridService implements OnDestroy {
  /**
   * @internal
   */
  public currentTheme: SkyThemeSettings;
  private ngUnsubscribe = new Subject();

  constructor(
    private agGridAdapterService: SkyAgGridAdapterService,
    @Optional() private themeSvc?: SkyThemeService,
    @Optional() private resources?: SkyLibResourcesService
  ) {
    /*istanbul ignore else*/
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (settingsChange) =>
            (this.currentTheme = settingsChange.currentSettings)
        );
    }
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Returns [AG Grid `gridOptions`](https://www.ag-grid.com/javascript-grid-properties/) with default SKY UX options, styling, and cell renderers registered for read-only grids.
   * @param args
   * @returns
   */
  public getGridOptions(args: GetGridOptions): GridOptions {
    const defaultGridOptions = this.getDefaultGridOptions(args);
    const mergedGridOptions = this.mergeGridOptions(
      defaultGridOptions,
      args.gridOptions
    );

    return mergedGridOptions;
  }

  /**
   * Returns [AG Grid `gridOptions`](https://www.ag-grid.com/javascript-grid-properties/) with default SKY UX options, styling, and cell editors registered for editable grids.
   * @param args
   * @returns
   */
  public getEditableGridOptions(args: GetGridOptions): GridOptions {
    const defaultGridOptions = this.getDefaultEditableGridOptions(args);
    const mergedGridOptions = this.mergeGridOptions(
      defaultGridOptions,
      args.gridOptions
    );

    return mergedGridOptions;
  }

  private mergeGridOptions(
    defaultGridOptions: GridOptions,
    providedGridOptions: GridOptions
  ): GridOptions {
    const mergedGridOptions = {
      ...defaultGridOptions,
      ...providedGridOptions,
      columnTypes: {
        ...providedGridOptions.columnTypes,
        // apply default second to prevent consumers from overwriting our default column types
        ...defaultGridOptions.columnTypes,
      },
      defaultColDef: {
        ...defaultGridOptions.defaultColDef,
        ...providedGridOptions.defaultColDef,
        // allow consumers to override all defaultColDef properties except cellClassRules, which we reserve for styling
        cellClassRules: defaultGridOptions.defaultColDef.cellClassRules,
      },
      icons: {
        ...defaultGridOptions.icons,
        ...providedGridOptions.icons,
      },
    };

    return mergedGridOptions;
  }

  private getDefaultGridOptions(args: GetGridOptions): GridOptions {
    // cellClassRules can be functions or string expressions
    const cellClassRuleTrueExpression = 'true';

    function getEditableFn(
      isUneditable?: boolean
    ): (params: CellClassParams) => boolean {
      return function (params: CellClassParams): boolean {
        let isEditable = params.colDef.editable;

        if (typeof isEditable === 'function') {
          const column = params.columnApi.getColumn(params.colDef.field);
          isEditable = isEditable({
            ...params,
            column,
          } as EditableCallbackParams);
        }

        return isUneditable ? !isEditable : isEditable;
      };
    }

    const editableCellClassRules = {
      [SkyCellClass.Editable]: getEditableFn(),
      [SkyCellClass.Uneditable]: getEditableFn(true),
    };

    function getValidatorFn(): (params: CellClassParams) => boolean {
      return function (param: CellClassParams) {
        if (
          param.colDef &&
          typeof param.colDef.cellRendererParams?.skyComponentProperties
            ?.validator === 'function'
        ) {
          return !param.colDef.cellRendererParams.skyComponentProperties.validator(
            param.value,
            param.data,
            param.rowIndex
          );
        }
        return false;
      };
    }

    const validatorCellClassRules = {
      [SkyCellClass.Invalid]: getValidatorFn(),
    };

    const defaultSkyGridOptions: GridOptions = {
      columnTypes: {
        [SkyCellType.Autocomplete]: {
          cellClassRules: {
            [SkyCellClass.Autocomplete]: cellClassRuleTrueExpression,
            ...editableCellClassRules,
          },
          cellEditorFramework: SkyAgGridCellEditorAutocompleteComponent,
          valueFormatter: autocompleteFormatter,
          comparator: autocompleteComparator,
          minWidth: 185,
        },
        [SkyCellType.Currency]: {
          cellClassRules: {
            [SkyCellClass.Currency]: cellClassRuleTrueExpression,
            ...validatorCellClassRules,
            ...editableCellClassRules,
          },
          cellRendererSelector: getValidatorCellRendererSelector(
            'sky-ag-grid-cell-renderer-currency-validator',
            { component: 'sky-ag-grid-cell-renderer-currency' }
          ),
          cellEditorFramework: SkyAgGridCellEditorCurrencyComponent,
          headerClass: SkyHeaderClass.RightAligned,
          minWidth: 185,
        },
        [SkyCellType.Date]: {
          cellClassRules: {
            [SkyCellClass.Date]: cellClassRuleTrueExpression,
            ...editableCellClassRules,
          },
          cellEditorFramework: SkyAgGridCellEditorDatepickerComponent,
          comparator: dateComparator,
          minWidth: this.currentTheme?.theme?.name === 'modern' ? 180 : 160,
          valueFormatter: (params: ValueFormatterParams) =>
            this.dateFormatter(params, args.locale),
        },
        [SkyCellType.Lookup]: {
          cellClassRules: {
            [SkyCellClass.Lookup]: cellClassRuleTrueExpression,
            ...editableCellClassRules,
          },
          cellEditorFramework: SkyAgGridCellEditorLookupComponent,
          cellRendererFramework: SkyAgGridCellRendererLookupComponent,
          valueFormatter: (params) => {
            const lookupProperties = applySkyLookupPropertiesDefaults(params);
            return (params.value || [])
              .map((value) => {
                return value[lookupProperties.descriptorProperty];
              })
              .filter((value) => value !== '' && value !== undefined)
              .join('; ');
          },
          minWidth: 185,
        },
        [SkyCellType.Number]: {
          cellClassRules: {
            [SkyCellClass.Number]: cellClassRuleTrueExpression,
            ...validatorCellClassRules,
            ...editableCellClassRules,
          },
          cellRendererSelector: getValidatorCellRendererSelector(
            'sky-ag-grid-cell-renderer-validator-tooltip'
          ),
          cellEditorFramework: SkyAgGridCellEditorNumberComponent,
          headerClass: SkyHeaderClass.RightAligned,
        },
        [SkyCellType.RowSelector]: {
          cellClassRules: {
            [SkyCellClass.RowSelector]: cellClassRuleTrueExpression,
            [SkyCellClass.Uneditable]: cellClassRuleTrueExpression,
          },
          cellRendererFramework: SkyAgGridCellRendererRowSelectorComponent,
          headerName: '',
          minWidth: 55,
          maxWidth: 55,
          sortable: false,
          width: 55,
        },
        [SkyCellType.Text]: {
          cellClassRules: {
            [SkyCellClass.Text]: cellClassRuleTrueExpression,
            ...validatorCellClassRules,
            ...editableCellClassRules,
          },
          cellEditorFramework: SkyAgGridCellEditorTextComponent,
          cellRendererSelector: getValidatorCellRendererSelector(
            'sky-ag-grid-cell-renderer-validator-tooltip'
          ),
        },
        [SkyCellType.Validator]: {
          cellClassRules: {
            ...validatorCellClassRules,
            ...editableCellClassRules,
          },
          cellRendererSelector: getValidatorCellRendererSelector(
            'sky-ag-grid-cell-renderer-validator-tooltip'
          ),
        },
      },
      defaultColDef: {
        cellClassRules: editableCellClassRules,
        minWidth: 100,
        resizable: true,
        sortable: true,
        suppressKeyboardEvent: (keypress: SuppressKeyboardEventParams) =>
          this.suppressTab(keypress),
      },
      domLayout: 'autoHeight',
      enterMovesDownAfterEdit: true,
      frameworkComponents: {
        'sky-ag-grid-cell-renderer-currency':
          SkyAgGridCellRendererCurrencyComponent,
        'sky-ag-grid-cell-renderer-currency-validator':
          SkyAgGridCellRendererCurrencyValidatorComponent,
        'sky-ag-grid-cell-renderer-validator-tooltip':
          SkyAgGridCellRendererValidatorTooltipComponent,
      },
      getRowNodeId(data: any): string {
        if ('id' in data && data.id !== undefined) {
          return `${data.id}`;
        }
        return `${rowNodeId--}`;
      },
      getRowClass: (params: RowClassParams) => {
        if (params.node.id) {
          return `sky-ag-grid-row-${params.node.id}`;
        } else {
          return undefined;
        }
      },
      headerHeight: this.currentTheme?.theme?.name === 'modern' ? 60 : 37,
      icons: {
        sortDescending: this.getIconTemplate('caret-down'),
        sortAscending: this.getIconTemplate('caret-up'),
        columnMoveMove: this.getIconTemplate('arrows'),
        columnMoveHide: this.getIconTemplate('arrows'),
        columnMoveLeft: this.getIconTemplate('arrows'),
        columnMoveRight: this.getIconTemplate('arrows'),
        columnMovePin: this.getIconTemplate('arrows'),
      },
      onCellFocused: () => this.onCellFocused(),
      rowHeight: this.currentTheme?.theme?.name === 'modern' ? 60 : 38,
      rowMultiSelectWithClick: true,
      rowSelection: 'multiple',
      singleClickEdit: true,
      // tslint:disable-next-line: no-null-keyword
      sortingOrder: ['desc', 'asc', null],
      stopEditingWhenGridLosesFocus: false,
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: true,
    };

    defaultSkyGridOptions.columnTypes[SkyCellType.CurrencyValidator] = {
      ...defaultSkyGridOptions.columnTypes[SkyCellType.Currency],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: any, data: any, rowIndex: number) => {
            return !!`${value || ''}`.match(/^[^0-9]*(\d+[,.]?)+\d*[^0-9]*$/);
          },
          validatorMessage: 'Please enter a valid currency',
        },
      },
    };
    /*istanbul ignore else*/
    if (this.resources) {
      this.resources
        .getString('sky_ag_grid_cell_renderer_currency_validator_message')
        .subscribe((value) => {
          defaultSkyGridOptions.columnTypes[
            SkyCellType.CurrencyValidator
          ].cellRendererParams.skyComponentProperties.validatorMessage = value;
        });
    }

    defaultSkyGridOptions.columnTypes[SkyCellType.NumberValidator] = {
      ...defaultSkyGridOptions.columnTypes[SkyCellType.Validator],
      ...defaultSkyGridOptions.columnTypes[SkyCellType.Number],
      cellClassRules: {
        ...defaultSkyGridOptions.columnTypes[SkyCellType.Validator]
          .cellClassRules,
        ...defaultSkyGridOptions.columnTypes[SkyCellType.Number].cellClassRules,
      },
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: any, data: any, rowIndex: number) => {
            return !!value && !isNaN(parseFloat(value));
          },
          validatorMessage: 'Please enter a valid number',
        },
      },
    };
    /*istanbul ignore else*/
    if (this.resources) {
      this.resources
        .getString('sky_ag_grid_cell_renderer_number_validator_message')
        .subscribe((value) => {
          defaultSkyGridOptions.columnTypes[
            SkyCellType.NumberValidator
          ].cellRendererParams.skyComponentProperties.validatorMessage = value;
        });
    }

    return defaultSkyGridOptions;
  }

  private onCellFocused(): void {
    const currentElement = this.agGridAdapterService.getFocusedElement();

    this.agGridAdapterService.focusOnFocusableChildren(currentElement);
  }

  private getDefaultEditableGridOptions(args: GetGridOptions): GridOptions {
    const defaultGridOptions = this.getDefaultGridOptions(args);

    defaultGridOptions.rowSelection = 'none';

    return defaultGridOptions;
  }

  private dateFormatter(
    params: ValueFormatterParams,
    locale: string = 'en-us'
  ): string | undefined {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    let date: Date = params.value;

    if (date && typeof date === 'string') {
      date = new Date(params.value);
    }

    const formattedDate =
      date &&
      date.toLocaleDateString &&
      date.toLocaleDateString(locale, dateConfig as Intl.DateTimeFormatOptions);

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
        const currentlyFocusedEl =
          this.agGridAdapterService.getFocusedElement();
        // inline cell editors have the 'ag-cell' class, while popup editors have the 'ag-popup-editor' class
        const cellEl = this.agGridAdapterService.getElementOrParentWithClass(
          currentlyFocusedEl,
          'ag-cell'
        );
        const popupEl = this.agGridAdapterService.getElementOrParentWithClass(
          currentlyFocusedEl,
          'ag-popup-editor'
        );
        const parentEl = cellEl || popupEl;

        const nextFocusableElementInCell =
          this.agGridAdapterService.getNextFocusableElement(
            currentlyFocusedEl,
            parentEl,
            params.event.shiftKey
          );
        return !!nextFocusableElementInCell;
      }
      return true;
    }
    return false;
  }
}

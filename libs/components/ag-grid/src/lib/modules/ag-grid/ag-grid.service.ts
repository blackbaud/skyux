import { Injectable, OnDestroy, Optional, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyDateService } from '@skyux/datetime';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

import {
  CellClassParams,
  ColDef,
  EditableCallbackParams,
  GridOptions,
  HeaderClassParams,
  ICellRendererParams,
  RowClassParams,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
  ValueFormatterParams,
} from 'ag-grid-community';
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
import { SkyAgGridCellRendererTemplateComponent } from './cell-renderers/cell-renderer-template/cell-renderer-template.component';
import { SkyAgGridCellRendererValidatorTooltipComponent } from './cell-renderers/cell-renderer-validator-tooltip/cell-renderer-validator-tooltip.component';
import { SkyAgGridHeaderGroupComponent } from './header/header-group.component';
import { SkyAgGridHeaderComponent } from './header/header.component';
import { IconMapType, iconMap } from './icons/icon-map';
import { SkyAgGridLoadingComponent } from './loading/loading.component';
import { SkyCellClass } from './types/cell-class';
import { SkyCellType } from './types/cell-type';
import { SkyHeaderClass } from './types/header-class';
import { SkyGetGridOptionsArgs } from './types/sky-grid-options';

function autocompleteComparator(
  value1: { name: string },
  value2: { name: string },
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

function autocompleteFormatter(params: ValueFormatterParams): string {
  return params.value && params.value.name;
}

function dateComparator(date1: Date | string, date2: Date | string): number {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValidatorCellRendererSelector(component: string, fallback?: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (params: ICellRendererParams): any => {
    if (
      params.colDef &&
      typeof params.colDef.cellRendererParams?.skyComponentProperties
        ?.validator === 'function'
    ) {
      if (
        !params.colDef.cellRendererParams.skyComponentProperties.validator(
          params.value,
          params.data,
          params?.node?.rowIndex,
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
  providedIn: 'root',
})
export class SkyAgGridService implements OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #keyMap = new WeakMap<any, string>();
  #ngUnsubscribe = new Subject<void>();
  #currentTheme: SkyThemeSettings | undefined = undefined;
  #agGridAdapterService: SkyAgGridAdapterService;
  #resources: SkyLibResourcesService | undefined;
  #dateService = inject(SkyDateService);
  #logService = inject(SkyLogService);

  constructor(
    agGridAdapterService: SkyAgGridAdapterService,
    @Optional() themeSvc?: SkyThemeService,
    @Optional() resources?: SkyLibResourcesService,
  ) {
    this.#agGridAdapterService = agGridAdapterService;
    this.#resources = resources;

    /*istanbul ignore else*/
    if (themeSvc) {
      themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((settingsChange) => {
          this.#currentTheme = settingsChange.currentSettings;
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Returns [AG Grid `gridOptions`](https://www.ag-grid.com/javascript-grid-properties/) with default SKY UX options, styling, and cell renderers registered for read-only grids.
   * @param args
   * @returns
   */
  public getGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    const defaultGridOptions = this.#getDefaultGridOptions(args);
    const mergedGridOptions = this.#mergeGridOptions(
      defaultGridOptions,
      args.gridOptions,
    );

    return mergedGridOptions;
  }

  /**
   * Returns [AG Grid `gridOptions`](https://www.ag-grid.com/javascript-grid-properties/) with default SKY UX options, styling, and cell editors registered for editable grids.
   * @param args
   * @returns
   */
  public getEditableGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    const defaultGridOptions = this.#getDefaultEditableGridOptions(args);
    const mergedGridOptions = this.#mergeGridOptions(
      defaultGridOptions,
      args.gridOptions,
    );

    return mergedGridOptions;
  }

  /**
   * @deprecated The `getHeaderHeight` method is no longer needed. Header height is managed in CSS.
   */
  public getHeaderHeight(): number {
    return this.#currentTheme?.theme?.name === 'modern' ? 60 : 37;
  }

  #mergeGridOptions(
    defaultGridOptions: GridOptions,
    providedGridOptions: GridOptions,
  ): GridOptions {
    const mergedGridOptions: GridOptions = {
      ...defaultGridOptions,
      ...providedGridOptions,
      components: {
        ...providedGridOptions.components,
        // Apply default components last to prevent consumers from overwriting our component types.
        ...defaultGridOptions.components,
      },
      columnTypes: {
        ...providedGridOptions.columnTypes,
        // apply default second to prevent consumers from overwriting our default column types
        ...defaultGridOptions.columnTypes,
      },
      defaultColDef: {
        ...defaultGridOptions.defaultColDef,
        ...providedGridOptions.defaultColDef,
        // allow consumers to override all defaultColDef properties except cellClassRules, which we reserve for styling
        cellClassRules: defaultGridOptions.defaultColDef?.cellClassRules,
        headerClass: defaultGridOptions.defaultColDef?.headerClass,
      },
      defaultColGroupDef: {
        ...defaultGridOptions.defaultColGroupDef,
        ...providedGridOptions.defaultColGroupDef,
        headerClass: defaultGridOptions.defaultColGroupDef?.headerClass,
      },
      icons: {
        ...defaultGridOptions.icons,
        ...providedGridOptions.icons,
      },
    };

    // Enable text selection unless explicitly disabled or conflicting with another setting.
    if (
      mergedGridOptions.enableCellTextSelection ||
      (!('enableCellTextSelection' in mergedGridOptions) &&
        !mergedGridOptions.enableRangeSelection &&
        !mergedGridOptions.columnDefs?.some((col: ColDef) => col.editable))
    ) {
      mergedGridOptions.context ||= {};
      mergedGridOptions.enableCellTextSelection ??= true;
      mergedGridOptions.context.enableCellTextSelection =
        mergedGridOptions.enableCellTextSelection;
    }

    return mergedGridOptions;
  }

  #getDefaultGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    // cellClassRules can be functions or string expressions
    const cellClassRuleTrueExpression = (): boolean => true;

    function getEditableFn(
      isUneditable?: boolean,
    ): (params: CellClassParams) => boolean {
      return function (params: CellClassParams): boolean {
        let isEditable = params.colDef.editable;

        if (typeof isEditable === 'function') {
          const column = params.api.getColumn(params.colDef);
          isEditable = isEditable({
            ...params,
            column,
          } as EditableCallbackParams);
        }

        return isUneditable ? !isEditable : !!isEditable;
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
            param.node?.rowIndex,
          );
        }
        return false;
      };
    }

    const validatorCellClassRules = {
      [SkyCellClass.Invalid]: getValidatorFn(),
    };

    function getHeaderClass(
      ...classNames: string[]
    ): (params: HeaderClassParams) => string | string[] | undefined {
      return (params: HeaderClassParams): string | string[] | undefined => {
        // istanbul ignore next
        const minWidth = params.column?.getMinWidth() ?? 0;
        // istanbul ignore next
        const maxWidth = params.column?.getMaxWidth() ?? Infinity;
        if (params.column?.isResizable() && minWidth < maxWidth) {
          return [...classNames, SkyHeaderClass.Resizable];
        }
        return classNames;
      };
    }

    const defaultSkyGridOptions: GridOptions = {
      columnTypes: {
        [SkyCellType.Autocomplete]: {
          cellClassRules: {
            [SkyCellClass.Autocomplete]: cellClassRuleTrueExpression,
            ...editableCellClassRules,
          },
          cellEditor: SkyAgGridCellEditorAutocompleteComponent,
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
            { component: 'sky-ag-grid-cell-renderer-currency' },
          ),
          cellEditor: SkyAgGridCellEditorCurrencyComponent,
          headerClass: getHeaderClass(SkyHeaderClass.RightAligned),
          minWidth: 185,
          suppressKeyboardEvent: (params) =>
            this.#suppressEnter(params) || this.#suppressTab(params),
        },
        [SkyCellType.Date]: {
          cellClassRules: {
            [SkyCellClass.Date]: cellClassRuleTrueExpression,
            ...editableCellClassRules,
          },
          cellEditor: SkyAgGridCellEditorDatepickerComponent,
          comparator: dateComparator,
          minWidth: this.#currentTheme?.theme?.name === 'modern' ? 180 : 160,
          valueFormatter: (params: ValueFormatterParams) => {
            try {
              return (
                this.#dateService.format(
                  params.value,
                  args.locale,
                  args.dateFormat || 'shortDate',
                ) || ''
              );
            } catch (err) {
              /* istanbul ignore else */
              if ((err as Error).stack) {
                this.#logService.error(`${(err as Error).stack}`);
              } else {
                this.#logService.error(`${err}`);
              }
              return '';
            }
          },
        },
        [SkyCellType.Lookup]: {
          cellClassRules: {
            [SkyCellClass.Lookup]: cellClassRuleTrueExpression,
            ...editableCellClassRules,
          },
          cellEditor: SkyAgGridCellEditorLookupComponent,
          cellRenderer: SkyAgGridCellRendererLookupComponent,
          valueFormatter: (params) => {
            const lookupProperties = applySkyLookupPropertiesDefaults(
              params.colDef?.cellRendererParams?.skyComponentProperties ??
                params.colDef?.cellEditorParams?.skyComponentProperties ??
                {},
            );
            return (params.value || [])
              .map((value: Record<string, unknown>) => {
                return value[lookupProperties.descriptorProperty as string];
              })
              .filter((value: unknown) => value !== '' && value !== undefined)
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
            'sky-ag-grid-cell-renderer-validator-tooltip',
          ),
          cellEditor: SkyAgGridCellEditorNumberComponent,
          headerClass: getHeaderClass(SkyHeaderClass.RightAligned),
        },
        [SkyCellType.RowSelector]: {
          cellClassRules: {
            [SkyCellClass.RowSelector]: cellClassRuleTrueExpression,
            [SkyCellClass.Uneditable]: cellClassRuleTrueExpression,
          },
          cellRenderer: SkyAgGridCellRendererRowSelectorComponent,
          headerComponentParams: {
            headerHidden: true,
          },
          headerName: 'Row selection',
          minWidth: 55,
          maxWidth: 55,
          resizable: false,
          sortable: false,
          width: 55,
        },
        [SkyCellType.Template]: {
          cellRenderer: SkyAgGridCellRendererTemplateComponent,
        },
        [SkyCellType.Text]: {
          cellClassRules: {
            [SkyCellClass.Text]: cellClassRuleTrueExpression,
            ...validatorCellClassRules,
            ...editableCellClassRules,
          },
          cellEditor: SkyAgGridCellEditorTextComponent,
          cellRendererSelector: getValidatorCellRendererSelector(
            'sky-ag-grid-cell-renderer-validator-tooltip',
          ),
        },
        [SkyCellType.Validator]: {
          cellClassRules: {
            ...validatorCellClassRules,
            ...editableCellClassRules,
          },
          cellRendererSelector: getValidatorCellRendererSelector(
            'sky-ag-grid-cell-renderer-validator-tooltip',
          ),
        },
      },
      defaultColDef: {
        cellClassRules: editableCellClassRules,
        headerClass: getHeaderClass(),
        headerComponent: SkyAgGridHeaderComponent,
        minWidth: 100,
        suppressHeaderKeyboardEvent: (
          keypress: SuppressHeaderKeyboardEventParams,
        ) => keypress.event.code === 'Tab',
        suppressKeyboardEvent: (keypress: SuppressKeyboardEventParams) =>
          this.#suppressTab(keypress),
      },
      defaultColGroupDef: {
        headerGroupComponent: SkyAgGridHeaderGroupComponent,
      },
      domLayout: 'autoHeight',
      ensureDomOrder: true,
      enterNavigatesVerticallyAfterEdit: true,
      components: {
        'sky-ag-grid-cell-renderer-currency':
          SkyAgGridCellRendererCurrencyComponent,
        'sky-ag-grid-cell-renderer-currency-validator':
          SkyAgGridCellRendererCurrencyValidatorComponent,
        'sky-ag-grid-cell-renderer-validator-tooltip':
          SkyAgGridCellRendererValidatorTooltipComponent,
      },
      getRowId: (params) => {
        const dataId = params.data.id;
        if (dataId !== undefined) {
          return `${params.data.id}`;
        }
        if (!this.#keyMap.has(params.data)) {
          this.#keyMap.set(params.data, `${rowNodeId--}`);
        }
        return this.#keyMap.get(params.data) as string;
      },
      getRowClass: (params: RowClassParams) => {
        if (params.node.id) {
          return `sky-ag-grid-row-${params.node.id}`;
        } else {
          return undefined;
        }
      },
      icons: {
        sortDescending: this.#getIconTemplate('sortDescending'),
        sortAscending: this.#getIconTemplate('sortAscending'),
        columnMoveMove: this.#getIconTemplate('columnMoveMove'),
        columnMoveHide: this.#getIconTemplate('columnMoveHide'),
        columnMoveLeft: this.#getIconTemplate('columnMoveLeft'),
        columnMoveRight: this.#getIconTemplate('columnMoveRight'),
        columnMovePin: this.#getIconTemplate('columnMovePin'),
      },
      loadingOverlayComponent: SkyAgGridLoadingComponent,
      onCellFocused: () => this.#onCellFocused(),
      rowMultiSelectWithClick: true,
      rowSelection: 'multiple',
      singleClickEdit: true,
      sortingOrder: ['desc', 'asc', null],
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: true,
    };

    const columnTypes = defaultSkyGridOptions.columnTypes as Record<
      string,
      ColDef
    >;

    columnTypes[SkyCellType.CurrencyValidator] = {
      ...columnTypes[SkyCellType.Currency],
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: string): boolean => {
            return !!`${value || ''}`.match(/^[^0-9]*(\d+[,.]?)+\d*[^0-9]*$/);
          },
          validatorMessage: 'Please enter a valid currency',
        },
      },
    };
    /*istanbul ignore else*/
    if (this.#resources) {
      this.#resources
        .getString('sky_ag_grid_cell_renderer_currency_validator_message')
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value) => {
          columnTypes[
            SkyCellType.CurrencyValidator
          ].cellRendererParams.skyComponentProperties.validatorMessage = value;
        });
    }

    columnTypes[SkyCellType.NumberValidator] = {
      ...columnTypes[SkyCellType.Validator],
      ...columnTypes[SkyCellType.Number],
      cellClassRules: {
        ...columnTypes[SkyCellType.Validator].cellClassRules,
        ...columnTypes[SkyCellType.Number].cellClassRules,
      },
      cellRendererParams: {
        skyComponentProperties: {
          validator: (value: string): boolean => {
            return !!value && !isNaN(parseFloat(value));
          },
          validatorMessage: 'Please enter a valid number',
        },
      },
    };
    /*istanbul ignore else*/
    if (this.#resources) {
      this.#resources
        .getString('sky_ag_grid_cell_renderer_number_validator_message')
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value) => {
          columnTypes[
            SkyCellType.NumberValidator
          ].cellRendererParams.skyComponentProperties.validatorMessage = value;
        });
      this.#resources
        .getString('sky_ag_grid_row_selector_column_heading')
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value) => {
          columnTypes[SkyCellType.RowSelector].headerName = value;
        });
    }

    return defaultSkyGridOptions;
  }

  #onCellFocused(): void {
    const currentElement = this.#agGridAdapterService.getFocusedElement();

    this.#agGridAdapterService.focusOnFocusableChildren(currentElement);
  }

  #getDefaultEditableGridOptions(args: SkyGetGridOptionsArgs): GridOptions {
    const defaultGridOptions = this.#getDefaultGridOptions(args);

    defaultGridOptions.rowSelection = undefined;

    return defaultGridOptions;
  }

  #getIconTemplate(iconName: keyof IconMapType): () => string {
    return () => {
      const icon = iconMap[iconName];
      if (this.#currentTheme?.theme.name === 'modern' && icon.skyIcon) {
        return `<i aria-hidden="true" class="sky-i-${icon.skyIcon}"></i>`;
      } else {
        return `<i aria-hidden="true" class="fa fa-${icon.faIcon}"></i>`;
      }
    };
  }

  #suppressTab(params: SuppressKeyboardEventParams): boolean {
    if (params.event.code === 'Tab') {
      if (params.editing) {
        const currentlyFocusedEl =
          this.#agGridAdapterService.getFocusedElement();
        // inline cell editors have the 'ag-cell' class, while popup editors have the 'ag-popup-editor' class
        const cellEl = this.#agGridAdapterService.getElementOrParentWithClass(
          currentlyFocusedEl,
          'ag-cell',
        );
        const popupEl = this.#agGridAdapterService.getElementOrParentWithClass(
          currentlyFocusedEl,
          'ag-popup-editor',
        );
        const parentEl = cellEl || popupEl;

        const nextFocusableElementInCell =
          this.#agGridAdapterService.getNextFocusableElement(
            currentlyFocusedEl,
            parentEl,
            params.event.shiftKey,
          );
        return !!nextFocusableElementInCell;
      }
      return true;
    }
    return false;
  }

  #suppressEnter(params: SuppressKeyboardEventParams): boolean {
    if (params.event.code === 'Enter') {
      return params.editing;
    }
    return false;
  }
}

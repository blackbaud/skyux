import { CSP_NONCE, DOCUMENT, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyDateService } from '@skyux/datetime';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyThemeService } from '@skyux/theme';

import {
  AgColumn,
  CellClassParams,
  CellFocusedEvent,
  CellRendererSelectorFunc,
  CellRendererSelectorResult,
  ColDef,
  EditableCallbackParams,
  GridOptions,
  HeaderClassParams,
  ICellRendererParams,
  RowClassParams,
  RowNode,
  RowSelectionOptions,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { EMPTY, map, of } from 'rxjs';

import { getSkyAgGridTheme } from '../../styles/ag-grid-theme';

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
import { SkyAgGridColumnFilterDatepickerComponent } from './column-filters/column-filter-datepicker/column-filter-datepicker.component';
import { SkyAgGridHeaderGroupComponent } from './header/header-group.component';
import { SkyAgGridHeaderRowSelectorComponent } from './header/header-row-selector/header-row-selector.component';
import { SkyAgGridHeaderComponent } from './header/header.component';
import { IconMapType, iconMap } from './icons/icon-map';
import { SkyAgGridLoadingComponent } from './loading/loading.component';
import { SkyCellClass } from './types/cell-class';
import { SkyCellType } from './types/cell-type';
import { SkyHeaderClass } from './types/header-class';
import { LastFocusedCell } from './types/last-focused.cell';
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

function getValidatorCellRendererSelector(
  component: string,
  fallback?: CellRendererSelectorResult,
): CellRendererSelectorFunc {
  return (params: ICellRendererParams) => {
    if (
      params.colDef &&
      typeof params.colDef.cellRendererParams?.skyComponentProperties
        ?.validator === 'function'
    ) {
      if (
        params.column?.isCellEditable(params.node) ||
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
export class SkyAgGridService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #keyMap = new WeakMap<any, string>();
  readonly #agGridAdapterService = inject(SkyAgGridAdapterService);
  readonly #resources = inject(SkyLibResourcesService, { optional: true });
  readonly #dateService = inject(SkyDateService);
  readonly #logService = inject(SkyLogService);
  readonly #cspNonce = inject(CSP_NONCE, { optional: true });
  readonly #doc = inject(DOCUMENT);
  readonly #currentTheme = toSignal(
    inject(SkyThemeService, { optional: true })?.settingsChange.pipe(
      map((settingsChange) => settingsChange.currentSettings),
    ) ?? EMPTY,
    { initialValue: undefined },
  );
  readonly #currencyValidatorMsg = toSignal(
    this.#resources?.getString(
      'sky_ag_grid_cell_renderer_currency_validator_message',
    ) ?? of('Please enter a valid currency'),
    { initialValue: 'Please enter a valid currency' },
  );
  readonly #numberValidatorMsg = toSignal(
    this.#resources?.getString(
      'sky_ag_grid_cell_renderer_number_validator_message',
    ) ?? of('Please enter a valid number'),
    { initialValue: 'Please enter a valid number' },
  );
  readonly #rowSelectorHeading = toSignal(
    this.#resources?.getString('sky_ag_grid_row_selector_column_heading') ??
      of('Row selection'),
    { initialValue: 'Row selection' },
  );

  /**
   * Returns [AG Grid `gridOptions`](https://www.ag-grid.com/angular-data-grid/grid-options/) with default SKY UX options, styling, and cell renderers registered for read-only grids.
   * @param args
   * @returns
   */
  public getGridOptions<T = any>(
    args: SkyGetGridOptionsArgs<T>,
  ): GridOptions<T> {
    const defaultGridOptions = this.#getDefaultGridOptions(args);
    const mergedGridOptions = this.#mergeGridOptions(
      defaultGridOptions,
      args.gridOptions,
    );

    return mergedGridOptions;
  }

  /**
   * Returns [AG Grid `gridOptions`](https://www.ag-grid.com/angular-data-grid/grid-options/) with default SKY UX options, styling, and cell editors registered for editable grids.
   * @param args
   * @returns
   */
  public getEditableGridOptions<T = any>(
    args: SkyGetGridOptionsArgs<T>,
  ): GridOptions<T> {
    const defaultGridOptions = this.#getDefaultEditableGridOptions(args);
    const mergedGridOptions = this.#mergeGridOptions<T>(
      defaultGridOptions,
      args.gridOptions,
    );

    return mergedGridOptions;
  }

  #mergeGridOptions<T>(
    defaultGridOptions: GridOptions<T> & {
      getRowClass: (params: RowClassParams) => string[];
    },
    providedGridOptions: GridOptions<T>,
  ): GridOptions<T> {
    if ('enableRangeSelection' in providedGridOptions) {
      if (providedGridOptions.enableRangeSelection) {
        providedGridOptions.cellSelection = true;
      }
      delete providedGridOptions.enableRangeSelection;
    }
    if (
      providedGridOptions.rowSelection === 'single' ||
      providedGridOptions.rowSelection === 'multiple'
    ) {
      const rowSelectionOptions: Record<string, RowSelectionOptions> = {
        single: { mode: 'singleRow', checkboxes: false },
        multiple: { mode: 'multiRow', checkboxes: false },
      };
      providedGridOptions.rowSelection =
        rowSelectionOptions[providedGridOptions.rowSelection];
    }
    if (providedGridOptions.rowSelection?.mode) {
      providedGridOptions.rowSelection = {
        ...((defaultGridOptions.rowSelection as RowSelectionOptions) ?? {
          checkboxes: false,
        }),
        ...providedGridOptions.rowSelection,
      } as RowSelectionOptions;
    }
    if ('enableCellChangeFlash' in providedGridOptions) {
      providedGridOptions.defaultColDef ??= {};
      providedGridOptions.defaultColDef.enableCellChangeFlash ??=
        !!providedGridOptions.enableCellChangeFlash;
      delete providedGridOptions.enableCellChangeFlash;
    }

    const mergedGridOptions: GridOptions = {
      ...defaultGridOptions,
      ...providedGridOptions,
      components: {
        ...providedGridOptions.components,
        // Apply default components last to prevent consumers from overwriting our component types.
        ...defaultGridOptions.components,
      },
      context: {
        ...defaultGridOptions.context,
        ...providedGridOptions.context,
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
      getRowClass: (params): string[] => {
        const defaultClasses = defaultGridOptions.getRowClass(
          params,
        ) as string[];
        const providedClasses = providedGridOptions.getRowClass?.(params) ?? [];
        const providedClassesArray = Array.isArray(providedClasses)
          ? providedClasses
          : [providedClasses];
        return [...defaultClasses, ...providedClassesArray];
      },
      onCellFocused: (event): void => {
        defaultGridOptions.onCellFocused?.(event);
        providedGridOptions.onCellFocused?.(event);
      },
    };

    // Enable text selection unless explicitly disabled or conflicting with another setting.
    if (
      mergedGridOptions.enableCellTextSelection ||
      (!('enableCellTextSelection' in mergedGridOptions) &&
        !mergedGridOptions.cellSelection &&
        !mergedGridOptions.columnDefs?.some((col: ColDef) => col.editable))
    ) {
      mergedGridOptions.context ||= {};
      mergedGridOptions.enableCellTextSelection ??= true;
      mergedGridOptions.context.enableCellTextSelection =
        mergedGridOptions.enableCellTextSelection;
    }

    return mergedGridOptions;
  }

  #getDefaultGridOptions<T>(args: SkyGetGridOptionsArgs<T>): GridOptions<T> & {
    getRowClass: (params: RowClassParams) => string[];
  } {
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
      [SkyCellClass.Validator]: cellClassRuleTrueExpression,
    };

    function getHeaderClass(
      ...classNames: string[]
    ): (params: HeaderClassParams) => string | string[] | undefined {
      return (params: HeaderClassParams): string | string[] | undefined => {
        // istanbul ignore next
        const minWidth = params.column?.getMinWidth() ?? 0;
        // istanbul ignore next
        const maxWidth = params.column?.getMaxWidth() ?? Infinity;
        if (
          (params.columnGroup?.isResizable() || params.column?.isResizable()) &&
          minWidth < maxWidth
        ) {
          return [...classNames, SkyHeaderClass.Resizable];
        }
        return classNames;
      };
    }

    const defaultSkyGridOptions: GridOptions & {
      getRowClass: (params: RowClassParams) => string[];
    } = {
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
          sortingOrder: [null, 'desc', 'asc'],
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
          minWidth: this.#currentTheme()?.theme?.name === 'modern' ? 180 : 160,
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
          sortingOrder: [null, 'desc', 'asc'],
        },
        [SkyCellType.RightAligned]: {
          cellClassRules: {
            [SkyCellClass.RightAligned]: cellClassRuleTrueExpression,
          },
          headerClass: getHeaderClass(SkyHeaderClass.RightAligned),
        },
        [SkyCellType.RowSelector]: {
          cellClassRules: {
            [SkyCellClass.RowSelector]: cellClassRuleTrueExpression,
            [SkyCellClass.Uneditable]: cellClassRuleTrueExpression,
          },
          cellRenderer: SkyAgGridCellRendererRowSelectorComponent,
          headerComponent: SkyAgGridHeaderRowSelectorComponent,
          headerValueGetter: () => this.#rowSelectorHeading(),
          minWidth: 55,
          maxWidth: 55,
          resizable: false,
          sortable: false,
          width: 55,
        },
        [SkyCellType.Template]: {
          cellClassRules: {
            [SkyCellClass.Template]: cellClassRuleTrueExpression,
          },
          cellRenderer: SkyAgGridCellRendererTemplateComponent,
          cellEditor: SkyAgGridCellRendererTemplateComponent,
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
        dateComponent: SkyAgGridColumnFilterDatepickerComponent,
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
      components: {
        'sky-ag-grid-cell-renderer-currency':
          SkyAgGridCellRendererCurrencyComponent,
        'sky-ag-grid-cell-renderer-currency-validator':
          SkyAgGridCellRendererCurrencyValidatorComponent,
        'sky-ag-grid-cell-renderer-validator-tooltip':
          SkyAgGridCellRendererValidatorTooltipComponent,
      },
      focusGridInnerElement: (params) => {
        const lastFocusedCell = params.context?.['lastFocusedCell'] as
          | LastFocusedCell
          | undefined;
        if (lastFocusedCell) {
          if (lastFocusedCell.rowIndex !== null) {
            params.api.setFocusedCell(
              lastFocusedCell.rowIndex,
              lastFocusedCell.column,
            );
          } else {
            params.api.setFocusedHeader(lastFocusedCell.column);
          }
          return true;
        }
        return false;
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
      getRowClass: (params: RowClassParams): string[] => {
        if (params.node.id) {
          return [`sky-ag-grid-row-${params.node.id}`];
        } else {
          return [];
        }
      },
      icons: Object.fromEntries(
        Object.keys(iconMap).map((iconKey) => [
          iconKey,
          this.#getIconTemplate(iconKey as keyof IconMapType),
        ]),
      ),
      loadingOverlayComponent: SkyAgGridLoadingComponent,
      onCellFocused: (event: CellFocusedEvent) => this.#onCellFocused(event),
      rowModelType: 'clientSide',
      rowSelection: {
        mode: 'multiRow',
        enableClickSelection: false,
        enableSelectionWithoutKeys: true,
        checkboxes: false,
        headerCheckbox: false,
      },
      singleClickEdit: true,
      styleNonce: this.#cspNonce ?? undefined,
      suppressDragLeaveHidesColumns: true,
      theme: getSkyAgGridTheme('data-grid'),
      themeStyleContainer: this.#doc.head,
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
          validatorMessage: this.#currencyValidatorMsg,
        },
      },
    };

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
          validatorMessage: this.#numberValidatorMsg,
        },
      },
    };

    return defaultSkyGridOptions;
  }

  #onCellFocused(event: CellFocusedEvent): void {
    const shouldFocus = this.#shouldFocusChildren(event);
    if (shouldFocus) {
      const currentElement = this.#agGridAdapterService.getFocusedElement();
      this.#agGridAdapterService.focusOnFocusableChildren(currentElement);
    }
  }

  #shouldFocusChildren(event: CellFocusedEvent): boolean {
    let shouldFocus = true;
    // The API says the column can be string or null, but should be an object.
    shouldFocus &&= typeof event.column === 'object';
    // Row index can be number or null.
    const rowNode =
      Number.isInteger(event.rowIndex) &&
      event.api.getDisplayedRowAtIndex(event.rowIndex as number);
    shouldFocus &&= !!rowNode;
    // Do not change focus if the cell is a row drag or dnd source.
    shouldFocus &&= !(event.column as AgColumn).isRowDrag(rowNode as RowNode);
    shouldFocus &&= !(event.column as AgColumn).isDndSource(rowNode as RowNode);
    return shouldFocus;
  }

  #getDefaultEditableGridOptions<T>(
    args: SkyGetGridOptionsArgs<T>,
  ): GridOptions<T> & {
    getRowClass: (params: RowClassParams) => string[];
  } {
    const defaultGridOptions = this.#getDefaultGridOptions(args);
    defaultGridOptions.rowSelection = undefined;
    defaultGridOptions.theme = getSkyAgGridTheme('data-entry-grid');
    return defaultGridOptions;
  }

  #getIconTemplate(iconKey: keyof IconMapType): () => string {
    return () => {
      const iconInfo = iconMap[iconKey];
      return `<svg height="16" width="16"><use xlink:href="#sky-i-${iconInfo.name}-${iconInfo.size}-solid"></use></svg>`;
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

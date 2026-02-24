import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import { SkyDateService } from '@skyux/datetime';
import { SkyLibResourcesService } from '@skyux/i18n';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import {
  AgColumn,
  BeanCollection,
  CellClassParams,
  CellFocusedEvent,
  GetRowIdParams,
  GridApi,
  GridOptions,
  ICellRendererParams,
  RowClassParams,
  RowNode,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
  ValueFormatterFunc,
  ValueFormatterParams,
} from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridService } from './ag-grid.service';
import { SkyAgGridHeaderComponent } from './header/header.component';
import { SkyCellClass } from './types/cell-class';
import { SkyCellType } from './types/cell-type';

type comparator = (...args: unknown[]) => number;

describe('SkyAgGridService', () => {
  let agGridService: SkyAgGridService;
  let agGridAdapterService: SkyAgGridAdapterService;
  let defaultGridOptions: GridOptions;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  let dateService: jasmine.SpyObj<SkyDateService>;

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };
    dateService = jasmine.createSpyObj<SkyDateService>('SkyDateService', [
      'format',
    ]);
    (dateService.format as jasmine.Spy).and.returnValue('FORMATTED_DATE');

    TestBed.configureTestingModule({
      providers: [
        SkyAgGridService,
        SkyAgGridAdapterService,
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        {
          provide: SkyDateService,
          useValue: dateService,
        },
      ],
    });

    agGridService = TestBed.inject(SkyAgGridService);
    agGridAdapterService = TestBed.inject(SkyAgGridAdapterService);
    defaultGridOptions = agGridService.getGridOptions({ gridOptions: {} });
  });

  describe('getGridOptions', () => {
    it('should return a default grid options configuration when no override options are passed', () => {
      expect(defaultGridOptions).toBeDefined();
      expect(defaultGridOptions.defaultColDef).toBeDefined();
    });

    it('should override non-nested properties from the given options', () => {
      const newHeight = 1000;
      const overrideGridOptions = {
        headerHeight: newHeight,
        rowHeight: newHeight,
      };
      const mergedGridOptions = agGridService.getGridOptions({
        gridOptions: overrideGridOptions,
      });

      expect(defaultGridOptions.rowHeight).not.toEqual(newHeight);
      expect(mergedGridOptions.rowHeight).toEqual(newHeight);
    });

    it('should include new provided columnTypes', () => {
      const newColumnType = {
        width: 1000,
        sortable: false,
        editable: true,
      };
      const overrideGridOptions = {
        columnTypes: {
          newType: newColumnType,
        },
      };
      const mergedGridOptions = agGridService.getGridOptions({
        gridOptions: overrideGridOptions,
      });
      const mergedColumnTypes = mergedGridOptions.columnTypes;

      expect(mergedColumnTypes?.['newType']).toEqual(newColumnType);
      expect(mergedColumnTypes?.[SkyCellType.Number]).toBeDefined();
      expect(mergedColumnTypes?.[SkyCellType.Date]).toBeDefined();
      expect(mergedColumnTypes?.[SkyCellType.RowSelector]).toBeDefined();
    });

    it('should not overwrite the default grid options columnTypes', () => {
      const overrideDateColumnType = {
        width: 1000,
        sortable: false,
        editable: true,
        cellClass: 'random',
      };
      const defaultDateColumnType =
        defaultGridOptions.columnTypes?.[SkyCellType.Date];
      const overrideGridOptions = {
        columnTypes: {
          [SkyCellType.Date]: overrideDateColumnType,
        },
      };

      const mergedGridOptions = agGridService.getGridOptions({
        gridOptions: overrideGridOptions,
      });
      const mergedColumnTypes = mergedGridOptions.columnTypes;

      expect(mergedColumnTypes?.[SkyCellType.Date].width).toEqual(
        defaultDateColumnType?.width,
      );
      expect(mergedColumnTypes?.[SkyCellType.Date].width).not.toEqual(
        overrideDateColumnType.width,
      );
      expect(mergedColumnTypes?.[SkyCellType.Date].sortable).toEqual(
        defaultDateColumnType?.sortable,
      );
      expect(mergedColumnTypes?.[SkyCellType.Date].sortable).not.toEqual(
        overrideDateColumnType.sortable,
      );
      expect(mergedColumnTypes?.[SkyCellType.Number]).toBeDefined();
      expect(mergedColumnTypes?.[SkyCellType.RowSelector]).toBeDefined();
    });

    it('should override defaultColDef options that are not cellClassRules', () => {
      const overrideDefaultColDef = {
        sortable: false,
        resizable: false,
      };
      const defaultColDef = defaultGridOptions.defaultColDef;
      const overrideGridOptions = {
        defaultColDef: overrideDefaultColDef,
      };

      const mergedGridOptions = agGridService.getGridOptions({
        gridOptions: overrideGridOptions,
      });
      const mergedDefaultColDef = mergedGridOptions.defaultColDef;

      expect(mergedDefaultColDef?.sortable).not.toEqual(
        defaultColDef?.sortable,
      );
      expect(mergedDefaultColDef?.sortable).toEqual(
        overrideDefaultColDef.sortable,
      );
      expect(mergedDefaultColDef?.resizable).not.toEqual(
        defaultColDef?.resizable,
      );
      expect(mergedDefaultColDef?.resizable).toEqual(
        overrideDefaultColDef.resizable,
      );
    });

    it('should not override defaultColDef cellClassRules', () => {
      const overrideDefaultColDef = {
        cellClassRules: {
          'new-rule': 'true',
        },
      };
      const overrideGridOptions = {
        defaultColDef: overrideDefaultColDef,
      };

      const mergedGridOptions = agGridService.getGridOptions({
        gridOptions: overrideGridOptions,
      });
      const mergedCellClassRules =
        mergedGridOptions.defaultColDef?.cellClassRules;

      expect(mergedCellClassRules?.['new-rule']).toBeUndefined();
      expect(mergedCellClassRules?.[SkyCellClass.Editable]).toBeDefined();
      expect(mergedCellClassRules?.[SkyCellClass.Uneditable]).toBeDefined();
    });

    it('should set icons for modern theme', () => {
      const options = agGridService.getGridOptions({
        gridOptions: {},
      });

      expect(typeof options.icons?.['sortDescending']).toBe('function');

      // Trigger change to modern theme
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });

      expect((options.icons?.['sortDescending'] as () => string)()).toBe(
        `<svg height="16" width="16"><use xlink:href="#sky-i-chevron-down-16-solid"></use></svg>`,
      );
    });

    it('should set options for modern theme', () => {
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });

      const options = agGridService.getEditableGridOptions({
        gridOptions: {},
      });

      expect(options.columnTypes?.[SkyCellType.Date].minWidth).toBe(180);
    });

    it('should disable checkboxes if row selection is enabled', () => {
      const editableGridOptions = agGridService.getEditableGridOptions({
        gridOptions: {
          rowSelection: {
            mode: 'singleRow',
          },
        },
      });

      expect(editableGridOptions.rowSelection).toEqual({
        checkboxes: false,
        mode: 'singleRow',
      });
    });

    it('should not overwrite default component definitions', () => {
      const options = agGridService.getGridOptions({
        gridOptions: {
          components: {
            foo: 'bar',
          },
        },
      });

      expect(Object.keys(options.components as string[])).toEqual([
        'foo',
        'sky-ag-grid-cell-renderer-currency',
        'sky-ag-grid-cell-renderer-currency-validator',
        'sky-ag-grid-cell-renderer-validator-tooltip',
      ]);
    });

    it('should capture enableCellTextSelection in context', () => {
      const optionsWithoutSettingEnableCellTextSelection =
        agGridService.getGridOptions({
          gridOptions: {},
        });
      expect(
        optionsWithoutSettingEnableCellTextSelection.context
          ?.enableCellTextSelection,
      ).toBeTrue();

      const optionsWhenSettingEnableCellTextSelectionTrue =
        agGridService.getGridOptions({
          gridOptions: {
            enableCellTextSelection: true,
          },
        });
      expect(
        optionsWhenSettingEnableCellTextSelectionTrue.context
          ?.enableCellTextSelection,
      ).toBeTrue();

      const optionsWhenSettingEnableCellTextSelectionFalse =
        agGridService.getGridOptions({
          gridOptions: {
            enableCellTextSelection: false,
          },
        });
      expect(
        optionsWhenSettingEnableCellTextSelectionFalse.context
          ?.enableCellTextSelection,
      ).toBeFalsy();
    });

    it('should update selection options', () => {
      expect(
        agGridService.getGridOptions({
          gridOptions: { enableRangeSelection: true, rowSelection: 'multiple' },
        }),
      ).toEqual(
        jasmine.objectContaining({
          cellSelection: true,
          rowSelection: {
            mode: 'multiRow',
            enableClickSelection: false,
            enableSelectionWithoutKeys: true,
            checkboxes: false,
            headerCheckbox: false,
          },
        }),
      );
    });

    it('should update enableCellChangeFlash options', () => {
      expect(
        agGridService.getGridOptions({
          gridOptions: { enableCellChangeFlash: true } as any,
        }),
      ).toEqual(
        jasmine.objectContaining({
          defaultColDef: {
            cellClassRules: jasmine.any(Object),
            headerClass: jasmine.any(Function),
            headerComponent: SkyAgGridHeaderComponent,
            minWidth: 100,
            suppressHeaderKeyboardEvent: jasmine.any(Function),
            suppressKeyboardEvent: jasmine.any(Function),
            enableCellChangeFlash: true,
          },
        }),
      );
    });
  });

  describe('getEditableGridOptions', () => {
    it('should return the default gridOptions with the edit-specific property settings', () => {
      const editableGridOptions = agGridService.getEditableGridOptions({
        gridOptions: {},
      });

      expect(editableGridOptions.rowSelection).toBeUndefined();
    });
  });

  describe('dateFormatter', () => {
    let dateValueFormatter: ValueFormatterFunc;
    let dateValueFormatterParams: ValueFormatterParams;

    beforeEach(() => {
      dateValueFormatter = defaultGridOptions.columnTypes?.[SkyCellType.Date]
        .valueFormatter as ValueFormatterFunc;
      const api = jasmine.createSpyObj('GridApi', ['refreshCells']);
      dateValueFormatterParams = {
        api,
      } as unknown as ValueFormatterParams;
    });

    it('should return the formatted date string created by the date service', () => {
      const formattedDate = dateValueFormatter(dateValueFormatterParams);

      expect(formattedDate).toBe('FORMATTED_DATE');
    });

    it('should return an empty string if the date service returns undefined', () => {
      (dateService.format as jasmine.Spy).and.returnValue(undefined);

      const formattedDate = dateValueFormatter(dateValueFormatterParams);
      expect(formattedDate).toBe('');
    });

    it('should return an empty string if the date service returns an error', () => {
      (dateService.format as jasmine.Spy).and.throwError(
        'SkyDateService error message.',
      );
      const logService = TestBed.inject(SkyLogService);
      const errorLogSpy = spyOn(logService, 'error').and.stub();

      const formattedDate = dateValueFormatter(dateValueFormatterParams);
      expect(formattedDate).toBe('');
      expect(errorLogSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('Error: SkyDateService error message.'),
      );
    });
  });

  describe('dateComparator', () => {
    let dateComparator: comparator;
    const earlyDateString = '1/1/19';
    const lateDateString = '12/1/19';
    const earlyDate = new Date(earlyDateString);
    const lateDate = new Date(lateDateString);

    beforeEach(() => {
      dateComparator = defaultGridOptions.columnTypes?.[SkyCellType.Date]
        .comparator as comparator;
    });

    it('should return 1 when date1 (object) comes after date2 (string)', () => {
      expect(dateComparator(lateDate, earlyDateString)).toEqual(1);
    });

    it('should return -1 when date1 (string) comes before date1 (object)', () => {
      expect(dateComparator(earlyDateString, lateDate)).toEqual(-1);
    });

    it('should return 0 when date1 is equal to date2', () => {
      expect(dateComparator(earlyDate, earlyDate)).toEqual(0);
    });

    it('should return 1 when value1 is defined and value2 is undefined', () => {
      expect(dateComparator(earlyDate, undefined)).toEqual(1);
    });

    it('should return -1 when value2 is defined and value1 is undefined', () => {
      expect(dateComparator(undefined, lateDate)).toEqual(-1);
    });
  });

  describe('autocompleteFormatter', () => {
    let autocompleteValueFormatter: ValueFormatterFunc;
    let autocompleteValueFormatterParams: ValueFormatterParams;

    beforeEach(() => {
      autocompleteValueFormatter = defaultGridOptions.columnTypes?.[
        SkyCellType.Autocomplete
      ].valueFormatter as ValueFormatterFunc;
      const api = jasmine.createSpyObj('GridApi', ['refreshCells']);
      autocompleteValueFormatterParams = {
        api,
        colDef: {
          cellEditorParams: {},
        },
      } as unknown as ValueFormatterParams;
    });

    it('should return the name property of the value', () => {
      autocompleteValueFormatterParams.value = { id: '1', name: 'Bob' };

      const formattedAutocomplete = autocompleteValueFormatter(
        autocompleteValueFormatterParams,
      );

      expect(formattedAutocomplete).toEqual('Bob');
    });

    it('should return undefined when the cell does not have a value', () => {
      const formattedAutocomplete = autocompleteValueFormatter(
        autocompleteValueFormatterParams,
      );

      expect(formattedAutocomplete).toBeUndefined();
    });
  });

  describe('autocompleteComparator', () => {
    let autocompleteComparator: (...args: unknown[]) => number;
    const cat = { id: '1', name: 'cat' };
    const dog = { id: '2', name: 'dog' };

    beforeEach(() => {
      autocompleteComparator = defaultGridOptions.columnTypes?.[
        SkyCellType.Autocomplete
      ].comparator as (...args: unknown[]) => number;
    });

    it('should return 1 when value1.name comes after value2.name', () => {
      expect(autocompleteComparator(dog, cat)).toEqual(1);
    });

    it('should return -1 when value1.name comes before value2.name', () => {
      expect(autocompleteComparator(cat, dog)).toEqual(-1);
    });

    it('should return 0 when value1.name is equal to value2.name', () => {
      expect(autocompleteComparator(cat, cat)).toEqual(0);
    });

    it('should return 1 when value1 is defined and value2 is undefined', () => {
      expect(autocompleteComparator(cat, undefined)).toEqual(1);
    });

    it('should return -1 when value2 is defined and value1 is undefined', () => {
      expect(autocompleteComparator(undefined, dog)).toEqual(-1);
    });
  });

  describe('lookup value formatter', () => {
    let lookupValueFormatter: ValueFormatterFunc;
    const baseParameters = {} as ValueFormatterParams;

    beforeEach(() => {
      lookupValueFormatter = defaultGridOptions.columnTypes?.[
        SkyCellType.Lookup
      ].valueFormatter as ValueFormatterFunc;
    });

    it('should format an empty value', () => {
      expect(lookupValueFormatter({ ...baseParameters })).toBe('');
    });

    it('should format a single value', () => {
      expect(
        lookupValueFormatter({
          ...baseParameters,
          value: [{ name: 'expected' }],
        }),
      ).toBe('expected');
    });

    it('should use descriptorProperty', () => {
      expect(
        lookupValueFormatter({
          colDef: {
            cellEditorParams: {
              skyComponentProperties: {
                descriptorProperty: 'other',
              },
            },
          },
          value: [{ name: 'not-expected', other: 'expected' }],
        } as ValueFormatterParams),
      ).toBe('expected');
    });
  });

  describe('suppressKeyboardEvent', () => {
    const mockEl = document.createElement('div');
    let suppressHeaderKeypressFunction: (
      params: SuppressHeaderKeyboardEventParams<any>,
    ) => boolean;
    let suppressKeypressFunction: (
      params: SuppressKeyboardEventParams<any>,
    ) => boolean;
    let suppressKeypressFunctionCurrency:
      | ((params: SuppressKeyboardEventParams<any>) => boolean)
      | undefined;

    beforeEach(() => {
      suppressHeaderKeypressFunction = defaultGridOptions.defaultColDef
        ?.suppressHeaderKeyboardEvent as (
        params: SuppressHeaderKeyboardEventParams<any>,
      ) => boolean;
      suppressKeypressFunction = defaultGridOptions.defaultColDef
        ?.suppressKeyboardEvent as (
        params: SuppressKeyboardEventParams<any>,
      ) => boolean;
      suppressKeypressFunctionCurrency =
        defaultGridOptions.columnTypes &&
        defaultGridOptions.columnTypes[SkyCellType.Currency] &&
        (defaultGridOptions.columnTypes[SkyCellType.Currency]
          ?.suppressKeyboardEvent as (
          params: SuppressKeyboardEventParams<any>,
        ) => boolean);
    });

    it('should return true to suppress the event when the tab key is pressed on a header cell', () => {
      const params = {
        event: { code: 'Tab' },
      } as SuppressHeaderKeyboardEventParams;
      expect(suppressHeaderKeypressFunction(params)).toBe(true);
    });

    it('should return true to suppress the event when the tab key is pressed and cells are not being edited', () => {
      const params = { event: { code: 'Tab' } } as SuppressKeyboardEventParams;
      expect(suppressKeypressFunction(params)).toBe(true);
    });

    it('should return true to suppress the event when the enter key is pressed and currency cell is being edited', () => {
      const params = {
        event: { code: 'Enter' },
        editing: true,
      } as SuppressKeyboardEventParams;
      expect(
        suppressKeypressFunctionCurrency &&
          suppressKeypressFunctionCurrency(params),
      ).toBe(true);
    });

    it('should return false to suppress the event when a key is pressed and currency cell is being edited', () => {
      // Not Enter or Tab.
      const params = {
        event: { code: ' ' },
        editing: true,
      } as SuppressKeyboardEventParams;
      expect(
        suppressKeypressFunctionCurrency &&
          suppressKeypressFunctionCurrency(params),
      ).toBe(false);
    });

    it('should return true to suppress the event when the tab key is pressed, an inline cell is being edited, and there is other cell content to tab to', () => {
      const params = {
        editing: true,
        event: {
          code: 'Tab',
        },
      } as SuppressKeyboardEventParams;

      spyOn(
        agGridAdapterService,
        'getElementOrParentWithClass',
      ).and.returnValue(mockEl);
      spyOn(agGridAdapterService, 'getNextFocusableElement').and.returnValue(
        mockEl,
      );

      expect(suppressKeypressFunction(params)).toBe(true);
    });

    it('should return false to suppress the event when the tab key is pressed, a popup cell is being edited, and there is no other cell content to tab to', () => {
      const params = {
        editing: true,
        event: {
          code: 'Tab',
        },
      } as SuppressKeyboardEventParams;

      spyOn(
        agGridAdapterService,
        'getElementOrParentWithClass',
      ).and.returnValues(undefined, mockEl);
      spyOn(agGridAdapterService, 'getNextFocusableElement').and.returnValue(
        undefined,
      );

      expect(suppressKeypressFunction(params)).toBe(false);
    });

    it('should return false for non-tab keys to allow the keypress event', () => {
      const params = {
        event: { code: 'Enter' },
      } as SuppressKeyboardEventParams;
      expect(suppressKeypressFunction(params)).toBe(false);
    });
  });

  describe('onCellFocused', () => {
    let onCellFocusedFunction: (event: CellFocusedEvent) => void;

    beforeEach(() => {
      onCellFocusedFunction = defaultGridOptions.onCellFocused as (
        event: CellFocusedEvent,
      ) => void;
    });

    it('should get the currently focused cell and place focus on its children elements', () => {
      spyOn(agGridAdapterService, 'getFocusedElement');
      spyOn(agGridAdapterService, 'focusOnFocusableChildren');

      onCellFocusedFunction({
        api: {
          getDisplayedRowAtIndex: () => ({ rowIndex: 0 }) as RowNode,
        } as unknown as GridApi,
        column: {
          isRowDrag: () => false,
          isDndSource: () => false,
        } as unknown as AgColumn,
        rowIndex: 0,
      } as unknown as CellFocusedEvent);

      expect(agGridAdapterService.getFocusedElement).toHaveBeenCalled();
      expect(agGridAdapterService.focusOnFocusableChildren).toHaveBeenCalled();
    });

    it('should not focus if there is no matching row', () => {
      spyOn(agGridAdapterService, 'getFocusedElement');
      spyOn(agGridAdapterService, 'focusOnFocusableChildren');

      onCellFocusedFunction({} as CellFocusedEvent);

      expect(agGridAdapterService.getFocusedElement).not.toHaveBeenCalled();
      expect(
        agGridAdapterService.focusOnFocusableChildren,
      ).not.toHaveBeenCalled();

      onCellFocusedFunction({
        api: {
          getDisplayedRowAtIndex: () => undefined,
        } as unknown as GridApi,
        column: {
          isRowDrag: () => false,
          isDndSource: () => true,
        } as unknown as AgColumn,
        rowIndex: 0,
      } as unknown as CellFocusedEvent);

      expect(agGridAdapterService.getFocusedElement).not.toHaveBeenCalled();
      expect(
        agGridAdapterService.focusOnFocusableChildren,
      ).not.toHaveBeenCalled();
    });

    it('should not focus if the column is a drag handle', () => {
      spyOn(agGridAdapterService, 'getFocusedElement');
      spyOn(agGridAdapterService, 'focusOnFocusableChildren');

      onCellFocusedFunction({
        api: {
          getDisplayedRowAtIndex: () => ({ rowIndex: 0 }) as RowNode,
        } as unknown as GridApi,
        column: {
          isRowDrag: () => false,
          isDndSource: () => true,
        } as unknown as AgColumn,
        rowIndex: 0,
      } as unknown as CellFocusedEvent);

      expect(agGridAdapterService.getFocusedElement).not.toHaveBeenCalled();
      expect(
        agGridAdapterService.focusOnFocusableChildren,
      ).not.toHaveBeenCalled();
    });
  });

  describe('getDefaultGridOptions getEditableFn', () => {
    let cellClassRuleEditableFunction: (params?: any) => boolean;
    let cellClassParams: CellClassParams;

    beforeEach(() => {
      const cellClassRuleEditable =
        defaultGridOptions.defaultColDef?.cellClassRules?.[
          SkyCellClass.Editable
        ];
      if (typeof cellClassRuleEditable === 'function') {
        cellClassRuleEditableFunction = cellClassRuleEditable;
      }

      const api = jasmine.createSpyObj('GridApi', [
        'getColumn',
        'refreshCells',
      ]);
      cellClassParams = {
        api,

        colDef: {},
      } as unknown as CellClassParams;
    });

    it("should return true when the columnDefinition's editable property is true and checking for editable", () => {
      cellClassParams.colDef.editable = true;
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeTruthy();
    });

    it("should return false when the columnDefinition's editable property is false and checking for editable", () => {
      cellClassParams.colDef.editable = false;
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeFalsy();
    });

    it("should return false when the columnDefinition's editable property is undefined and checking for editable", () => {
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeFalsy();
    });

    it("should return the result of the function when the columnDefinition's editable property is a function and checking for editable", () => {
      cellClassParams.colDef.editable = (): boolean => {
        return true;
      };
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeTruthy();
    });

    it("should return false when the columnDefinition's editable property is true and checking for uneditable", () => {
      let cellClassRuleUneditableFunction:
        | ((params: CellClassParams) => boolean)
        | undefined;

      const cellClassRuleUneditable =
        defaultGridOptions.defaultColDef?.cellClassRules?.[
          SkyCellClass.Uneditable
        ];
      if (typeof cellClassRuleUneditable === 'function') {
        cellClassRuleUneditableFunction = cellClassRuleUneditable;
      }

      cellClassParams.colDef.editable = true;
      const editable = cellClassRuleUneditableFunction?.(cellClassParams);

      expect(editable).toBeFalsy();
    });
  });

  describe('getDefaultGridOptions validator', () => {
    let cellClassRuleValidatorFunction: (params: CellClassParams) => boolean;
    let cellClassParams: CellClassParams;
    let cellRendererParams: ICellRendererParams;

    beforeEach(() => {
      const cellClassRuleValidator =
        defaultGridOptions.columnTypes?.[SkyCellType.Validator]
          .cellClassRules?.[SkyCellClass.Invalid];
      if (typeof cellClassRuleValidator === 'function') {
        cellClassRuleValidatorFunction = cellClassRuleValidator;
      }

      const api = jasmine.createSpyObj('GridApi', ['refreshCells']);
      cellClassParams = {
        api,

        colDef: {},
      } as unknown as CellClassParams;

      cellRendererParams = {
        addRenderedRowListener(): void {},
        api,
        colDef: {},
        column: undefined,

        context: undefined,
        data: undefined,
        eGridCell: undefined,
        eParentOfValue: undefined,
        formatValue(): any {},
        getValue(): any {},
        node: { rowIndex: 0 },
        refreshCell(): void {},
        registerRowDragger(): void {},
        setValue(): void {},
        value: 1.23,
        valueFormatted: undefined,
      } as unknown as ICellRendererParams;
    });

    it('should return false when there is no validator function', () => {
      const invalidClass = cellClassRuleValidatorFunction(cellClassParams);

      expect(invalidClass).toBeFalsy();
    });

    it('should return false when the validator function passes', () => {
      cellClassParams.colDef.cellRendererParams = {
        skyComponentProperties: {
          validator: () => true,
        },
      };
      const invalidClass = cellClassRuleValidatorFunction(cellClassParams);

      expect(invalidClass).toBeFalsy();
    });

    it('should return true when the validator function fails', () => {
      cellClassParams.colDef.cellRendererParams = {
        skyComponentProperties: {
          validator: () => false,
        },
      };
      const invalidClass = cellClassRuleValidatorFunction(cellClassParams);

      expect(invalidClass).toBeTruthy();
    });

    it('should select currency cell renderer when the validator function passes', () => {
      const cellRendererSelector =
        defaultGridOptions.columnTypes?.[SkyCellType.CurrencyValidator]
          .cellRendererSelector;
      const validator =
        defaultGridOptions.columnTypes?.[SkyCellType.CurrencyValidator]
          .cellRendererParams.skyComponentProperties.validator;
      const params = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            skyComponentProperties: {
              validator,
            },
          },
        },
        value: 1.23,
      } as ICellRendererParams;
      expect(cellRendererSelector?.(params)?.component).toBe(
        'sky-ag-grid-cell-renderer-currency',
      );
    });

    it('should select validator cell renderer when the validator function fails', () => {
      const cellRendererSelector =
        defaultGridOptions.columnTypes?.[SkyCellType.NumberValidator]
          .cellRendererSelector;
      const validator =
        defaultGridOptions.columnTypes?.[SkyCellType.NumberValidator]
          .cellRendererParams.skyComponentProperties.validator;
      const params = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            skyComponentProperties: {
              validator,
            },
          },
        },
        value: 'invalid',
      } as ICellRendererParams;
      expect(cellRendererSelector?.(params)?.component).toBe(
        'sky-ag-grid-cell-renderer-validator-tooltip',
      );
    });

    it('should select currency cell renderer when the validator function omitted', () => {
      const cellRendererSelector =
        defaultGridOptions.columnTypes?.[SkyCellType.Currency]
          .cellRendererSelector;
      const params = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            skyComponentProperties: {
              validator: undefined,
            },
          },
        },
        value: 1.23,
      } as ICellRendererParams;
      expect(cellRendererSelector?.(params)?.component).toBe(
        'sky-ag-grid-cell-renderer-currency',
      );

      const paramsWithEmptyComponentProperties = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            skyComponentProperties: undefined,
          },
        },
        value: 1.23,
      } as ICellRendererParams;
      expect(
        cellRendererSelector?.(paramsWithEmptyComponentProperties)?.component,
      ).toBe('sky-ag-grid-cell-renderer-currency');

      const paramsWithoutComponentProperties = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            skyComponentProperties: undefined,
          },
        },
        value: 1.23,
      } as ICellRendererParams;
      expect(
        cellRendererSelector?.(paramsWithoutComponentProperties)?.component,
      ).toBe('sky-ag-grid-cell-renderer-currency');

      const paramsWithoutRendererParams = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: undefined,
        },
        value: 1.23,
      } as ICellRendererParams;
      expect(
        cellRendererSelector?.(paramsWithoutRendererParams)?.component,
      ).toBe('sky-ag-grid-cell-renderer-currency');
    });

    it('should select validator cell renderer when the value is empty', () => {
      const cellRendererSelector =
        defaultGridOptions.columnTypes?.[SkyCellType.CurrencyValidator]
          .cellRendererSelector;
      const validator =
        defaultGridOptions.columnTypes?.[SkyCellType.CurrencyValidator]
          .cellRendererParams.skyComponentProperties.validator;
      const params = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            skyComponentProperties: {
              validator,
            },
          },
        },
        value: '',
      } as ICellRendererParams;
      expect(cellRendererSelector?.(params)?.component).toBe(
        'sky-ag-grid-cell-renderer-currency-validator',
      );
    });

    it('should pass data and rowId to validator', () => {
      const cellRendererSelector =
        defaultGridOptions.columnTypes?.[SkyCellType.CurrencyValidator]
          .cellRendererSelector;
      const validator = (value: any, data: any, rowId: number) => {
        return value && data && rowId;
      };
      const validatorMessage = (value: any, data: any, rowId: number) => {
        return value && data && rowId ? 'Good' : 'Bad';
      };

      const paramsInvalid = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            skyComponentProperties: {
              validator,
              validatorMessage,
            },
          },
        },
        value: '',
      } as ICellRendererParams;
      expect(cellRendererSelector?.(paramsInvalid)?.component).toBe(
        'sky-ag-grid-cell-renderer-currency-validator',
      );

      const paramsValid = {
        ...paramsInvalid,
        data: true,
        node: {
          rowIndex: 1,
        },
        value: 'valuable',
      } as ICellRendererParams;
      expect(cellRendererSelector?.(paramsValid)?.component).toBe(
        'sky-ag-grid-cell-renderer-currency',
      );
    });
  });

  describe('getRowId', () => {
    it('should use the id field when available', () => {
      expect(
        defaultGridOptions.getRowId?.({ data: { id: 123 } } as GetRowIdParams),
      ).toEqual('123');
    });

    it('should generate an id regardless', () => {
      expect(
        defaultGridOptions.getRowId?.({ data: {} } as GetRowIdParams),
      ).toBeTruthy();
    });
  });

  describe('getRowClass', () => {
    const params = {
      node: new RowNode({} as BeanCollection),
      rowIndex: 0,
      source: 'api',
      context: {},
      type: 'rowSelected',
      api: {} as GridApi,
      data: {} as any,

      rowPinned: null,
    } as RowClassParams;

    it('should use the row id for the row class', () => {
      expect(
        defaultGridOptions.getRowClass?.({
          ...params,
          node: {
            id: '123',
          },
        } as RowClassParams),
      ).toEqual(['sky-ag-grid-row-123']);
    });

    it('should not generate a class without an id', () => {
      expect(defaultGridOptions.getRowClass?.(params)).toEqual([]);
    });

    it('should merge row classes', () => {
      expect(
        agGridService
          .getGridOptions({
            gridOptions: {
              getRowClass: () => 'custom-class',
            },
          })
          .getRowClass?.({
            ...params,
            node: {
              id: '123',
            },
          } as RowClassParams),
      ).toEqual(['sky-ag-grid-row-123', 'custom-class']);
    });
  });

  describe('when SkyLibResourcesService is not provided', () => {
    let serviceWithoutResources: SkyAgGridService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SkyAgGridService,
          SkyAgGridAdapterService,
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc,
          },
          {
            provide: SkyDateService,
            useValue: dateService,
          },
          {
            provide: SkyLibResourcesService,
            useValue: undefined,
          },
        ],
      });

      serviceWithoutResources = TestBed.inject(SkyAgGridService);
    });

    it('should use fallback row selector heading', () => {
      const options = serviceWithoutResources.getGridOptions({
        gridOptions: {},
      });

      expect(options.columnTypes?.[SkyCellType.RowSelector].headerName).toEqual(
        'Row selection',
      );
    });

    it('should use fallback currency validator message', () => {
      const options = serviceWithoutResources.getGridOptions({
        gridOptions: {},
      });
      const validatorMessage =
        options.columnTypes?.[SkyCellType.CurrencyValidator].cellRendererParams
          .skyComponentProperties.validatorMessage;

      expect(validatorMessage()).toEqual('Please enter a valid currency');
    });

    it('should use fallback number validator message', () => {
      const options = serviceWithoutResources.getGridOptions({
        gridOptions: {},
      });
      const validatorMessage =
        options.columnTypes?.[SkyCellType.NumberValidator].cellRendererParams
          .skyComponentProperties.validatorMessage;

      expect(validatorMessage()).toEqual('Please enter a valid number');
    });
  });
});

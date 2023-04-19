import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import {
  CellClassParams,
  CellFocusedEvent,
  ColumnApi,
  GetRowIdParams,
  GridApi,
  GridOptions,
  RowClassParams,
  RowNode,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
  ValueFormatterFunc,
  ValueFormatterParams,
} from 'ag-grid-community';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { BehaviorSubject } from 'rxjs';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridService } from './ag-grid.service';
import { SkyAgGridFixtureComponent } from './fixtures/ag-grid.component.fixture';
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

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        SkyAgGridService,
        SkyAgGridAdapterService,
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
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

      expect(defaultGridOptions.headerHeight).not.toEqual(newHeight);
      expect(defaultGridOptions.rowHeight).not.toEqual(newHeight);
      expect(mergedGridOptions.headerHeight).toEqual(newHeight);
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

      expect(mergedColumnTypes?.newType).toEqual(newColumnType);
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
        defaultDateColumnType?.width
      );
      expect(mergedColumnTypes?.[SkyCellType.Date].width).not.toEqual(
        overrideDateColumnType.width
      );
      expect(mergedColumnTypes?.[SkyCellType.Date].sortable).toEqual(
        defaultDateColumnType?.sortable
      );
      expect(mergedColumnTypes?.[SkyCellType.Date].sortable).not.toEqual(
        overrideDateColumnType.sortable
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
        defaultColDef?.sortable
      );
      expect(mergedDefaultColDef?.sortable).toEqual(
        overrideDefaultColDef.sortable
      );
      expect(mergedDefaultColDef?.resizable).not.toEqual(
        defaultColDef?.resizable
      );
      expect(mergedDefaultColDef?.resizable).toEqual(
        overrideDefaultColDef.resizable
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

    it('should set rowHeight and headerHeight for modern theme', () => {
      // Trigger change to modern theme
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });

      const modernThemeGridOptions = agGridService.getGridOptions({
        gridOptions: {},
      });

      expect(modernThemeGridOptions.rowHeight).toBe(60);
      expect(modernThemeGridOptions.headerHeight).toBe(60);
    });

    it('should unsubscribe from the theme service when destroyed', () => {
      const overrideOptions = { gridOptions: {} };
      let gridOptions = agGridService.getGridOptions(overrideOptions);

      expect(gridOptions.rowHeight).toBe(38);

      // Trigger change to modern theme
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });

      // Get new grid options after theme change
      gridOptions = agGridService.getGridOptions(overrideOptions);
      expect(gridOptions.rowHeight).toBe(60);

      // Destroy subscription
      agGridService.ngOnDestroy();

      // Trigger change to default theme
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });

      // Get new grid options after theme change, but expect heights have not changed
      gridOptions = agGridService.getGridOptions(overrideOptions);
      expect(gridOptions.rowHeight).toBe(60);
    });

    it('should respect the value of the deprecated `frameworkComponents` property', () => {
      const options = agGridService.getGridOptions({
        gridOptions: {
          frameworkComponents: {
            frameworkFoo: 'framework-bar',
          },
        },
      });

      expect(Object.keys(options.frameworkComponents)).toEqual([
        'frameworkFoo',
      ]);

      expect(Object.keys(options.components as string[])).toEqual([
        'sky-ag-grid-cell-renderer-currency',
        'sky-ag-grid-cell-renderer-currency-validator',
        'sky-ag-grid-cell-renderer-validator-tooltip',
      ]);
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

    // remove the invisible characters IE11 includes in the output of toLocaleDateString
    // by creating a new string that only includes ASCII characters 47 - 57 (/0123456789)
    // https://stackoverflow.com/a/24874223/6178885
    function fixLocaleDateString(localeDate: string): string {
      let newStr = '';
      for (let i = 0; i < localeDate.length; i++) {
        const code = localeDate.charCodeAt(i);
        if (code >= 47 && code <= 57) {
          newStr += localeDate.charAt(i);
        }
      }
      return newStr;
    }

    beforeEach(() => {
      dateValueFormatter = defaultGridOptions.columnTypes?.[SkyCellType.Date]
        .valueFormatter as ValueFormatterFunc;
      dateValueFormatterParams = {
        columnApi: new ColumnApi(),
      } as ValueFormatterParams;
    });

    it('should return empty string when no date value is provided', () => {
      const formattedDate = dateValueFormatter(dateValueFormatterParams);

      expect(formattedDate).toBe('');
    });

    it('should return empty string when a string that is not a valid date is provided', () => {
      dateValueFormatterParams.value = 'cat';
      const formattedDate = dateValueFormatter(dateValueFormatterParams);

      expect(formattedDate).toBe('');
    });

    it('should return empty string when a non-Date object is provided', () => {
      dateValueFormatterParams.value = {};
      const formattedDate = dateValueFormatter(dateValueFormatterParams);

      expect(formattedDate).toBe('');
    });

    it('should return a date string in the DD/MM/YYYY string format when a Date object and british english en-gb locale  are provided', () => {
      const britishGridOptions = agGridService.getGridOptions({
        gridOptions: {},
        locale: 'en-gb',
      });
      const britishDateValueFormatter = britishGridOptions.columnTypes?.[
        SkyCellType.Date
      ].valueFormatter as ValueFormatterFunc;
      dateValueFormatterParams.value = new Date('12/1/2019');

      const formattedDate = britishDateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('01/12/2019');
    });

    it('should return a date string in the DD/MM/YYYY string format when a date string and british english en-gb locale  are provided', () => {
      const britishGridOptions = agGridService.getGridOptions({
        gridOptions: {},
        locale: 'en-gb',
      });
      const britishDateValueFormatter = britishGridOptions.columnTypes?.[
        SkyCellType.Date
      ].valueFormatter as ValueFormatterFunc;
      dateValueFormatterParams.value = '3/1/2019';

      const formattedDate = britishDateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('01/03/2019');
    });

    it('should return a date string in the MM/DD/YYYY format when only a Date object is provided', () => {
      dateValueFormatterParams.value = new Date('12/1/2019');
      const formattedDate = dateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('12/01/2019');
    });

    it('should return a date string in the MM/DD/YYYY format when only a date string is provided', () => {
      dateValueFormatterParams.value = '3/1/2019';
      const formattedDate = dateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('03/01/2019');
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
      autocompleteValueFormatterParams = {
        colDef: {
          cellEditorParams: {},
        },
        columnApi: new ColumnApi(),
      } as ValueFormatterParams;
    });

    it('should return the name property of the value', () => {
      autocompleteValueFormatterParams.value = { id: '1', name: 'Bob' };

      const formattedAutocomplete = autocompleteValueFormatter(
        autocompleteValueFormatterParams
      );

      expect(formattedAutocomplete).toEqual('Bob');
    });

    it('should return undefined when the cell does not have a value', () => {
      const formattedAutocomplete = autocompleteValueFormatter(
        autocompleteValueFormatterParams
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
        })
      ).toBe('expected');
    });
  });

  describe('suppressKeyboardEvent', () => {
    const mockEl = document.createElement('div');
    let suppressHeaderKeypressFunction: (
      params: SuppressHeaderKeyboardEventParams<any>
    ) => boolean;
    let suppressKeypressFunction: (
      params: SuppressKeyboardEventParams<any>
    ) => boolean;

    beforeEach(() => {
      suppressHeaderKeypressFunction = defaultGridOptions.defaultColDef
        ?.suppressHeaderKeyboardEvent as (
        params: SuppressHeaderKeyboardEventParams<any>
      ) => boolean;
      suppressKeypressFunction = defaultGridOptions.defaultColDef
        ?.suppressKeyboardEvent as (
        params: SuppressKeyboardEventParams<any>
      ) => boolean;
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

    it('should return true to suppress the event when the tab key is pressed, an inline cell is being edited, and there is other cell content to tab to', () => {
      const params = {
        editing: true,
        event: {
          code: 'Tab',
        },
      } as SuppressKeyboardEventParams;

      spyOn(
        agGridAdapterService,
        'getElementOrParentWithClass'
      ).and.returnValue(mockEl);
      spyOn(agGridAdapterService, 'getNextFocusableElement').and.returnValue(
        mockEl
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
        'getElementOrParentWithClass'
      ).and.returnValues(undefined, mockEl);
      spyOn(agGridAdapterService, 'getNextFocusableElement').and.returnValue(
        undefined
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
        event: CellFocusedEvent
      ) => void;
    });

    it('should get the currently focused cell and place focus on its children elements', () => {
      spyOn(agGridAdapterService, 'getFocusedElement');
      spyOn(agGridAdapterService, 'focusOnFocusableChildren');

      onCellFocusedFunction({} as CellFocusedEvent);

      expect(agGridAdapterService.getFocusedElement).toHaveBeenCalled();
      expect(agGridAdapterService.focusOnFocusableChildren).toHaveBeenCalled();
    });
  });

  describe('getDefaultGridOptions getEditableFn', () => {
    let cellClassRuleEditableFunction: Function;
    let cellClassParams: CellClassParams;

    beforeEach(() => {
      const cellClassRuleEditable =
        defaultGridOptions.defaultColDef?.cellClassRules?.[
          SkyCellClass.Editable
        ];
      if (typeof cellClassRuleEditable === 'function') {
        cellClassRuleEditableFunction = cellClassRuleEditable;
      }

      cellClassParams = {
        columnApi: new ColumnApi(),
        colDef: {},
      } as CellClassParams;
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
      spyOn(cellClassParams.columnApi, 'getColumn').and.returnValue(null);
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

      cellClassParams = {
        columnApi: new ColumnApi(),
        colDef: {},
      } as CellClassParams;

      cellRendererParams = {
        addRenderedRowListener(): void {},
        api: undefined,
        colDef: {},
        column: undefined,
        columnApi: undefined,
        context: undefined,
        data: undefined,
        eGridCell: undefined,
        eParentOfValue: undefined,
        formatValue(): any {},
        getValue(): any {},
        node: undefined,
        refreshCell(): void {},
        registerRowDragger(): void {},
        rowIndex: 0,
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
        'sky-ag-grid-cell-renderer-currency'
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
        'sky-ag-grid-cell-renderer-validator-tooltip'
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
        'sky-ag-grid-cell-renderer-currency'
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
        cellRendererSelector?.(paramsWithEmptyComponentProperties)?.component
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
        cellRendererSelector?.(paramsWithoutComponentProperties)?.component
      ).toBe('sky-ag-grid-cell-renderer-currency');

      const paramsWithoutRendererParams = {
        ...cellRendererParams,
        colDef: {
          cellRendererParams: undefined,
        },
        value: 1.23,
      } as ICellRendererParams;
      expect(
        cellRendererSelector?.(paramsWithoutRendererParams)?.component
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
        'sky-ag-grid-cell-renderer-currency-validator'
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
        'sky-ag-grid-cell-renderer-currency-validator'
      );

      const paramsValid = {
        ...paramsInvalid,
        data: true,
        rowIndex: 1,
        value: 'valuable',
      } as ICellRendererParams;
      expect(cellRendererSelector?.(paramsValid)?.component).toBe(
        'sky-ag-grid-cell-renderer-currency'
      );
    });
  });

  describe('getRowId', () => {
    it('should use the id field when available', () => {
      expect(
        defaultGridOptions.getRowId?.({ data: { id: 123 } } as GetRowIdParams)
      ).toEqual('123');
    });

    it('should generate an id regardless', () => {
      expect(
        defaultGridOptions.getRowId?.({ data: {} } as GetRowIdParams)
      ).toBeTruthy();
    });

    it('should prefer the deprecated getRowNodeId if set by consumer', () => {
      expect(defaultGridOptions.getRowId).toBeDefined();
      expect(defaultGridOptions.getRowNodeId).toBeUndefined();

      const options = agGridService.getGridOptions({
        gridOptions: {
          getRowNodeId: (data) => {
            if ('id' in data && data.id !== undefined) {
              return `${data.id}`;
            }
            return '-1';
          },
        },
      });

      expect(options.getRowId).toBeUndefined();
      expect(options.getRowNodeId).toBeDefined();
    });
  });

  describe('getRowClass', () => {
    const params = {
      node: {} as RowNode,
      rowIndex: 0,
    } as RowClassParams;

    it('should use the row id for the row class', () => {
      expect(
        defaultGridOptions.getRowClass?.({
          ...params,
          node: {
            id: '123',
          },
        } as RowClassParams)
      ).toEqual('sky-ag-grid-row-123');
    });

    it('should not generate a class without an id', () => {
      expect(defaultGridOptions.getRowClass?.(params)).toBeFalsy();
    });
  });
});

describe('SkyAgGridService via fixture', () => {
  let gridWrapperFixture: ComponentFixture<SkyAgGridFixtureComponent>;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };
  });

  it('should update header and row height via api', async () => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
    gridWrapperFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();

    const api = gridWrapperFixture?.componentInstance?.agGrid?.api as GridApi;
    const headerHeightSpy = spyOn(api, 'setHeaderHeight');
    const rowHeightSpy = spyOn(api, 'resetRowHeights');
    expect(api).toBeDefined();
    expect(api.getSizesForCurrentTheme().headerHeight).toEqual(37);
    expect(api.getSizesForCurrentTheme().rowHeight).toEqual(38);

    mockThemeSvc.settingsChange.next({
      currentSettings: {
        theme: SkyTheme.presets.modern,
        mode: SkyThemeMode.presets.light,
      },
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    expect(headerHeightSpy).toHaveBeenCalledWith(60);
    expect(rowHeightSpy).toHaveBeenCalled();

    mockThemeSvc.settingsChange.next({
      currentSettings: {
        theme: SkyTheme.presets.default,
        mode: SkyThemeMode.presets.light,
      },
      previousSettings: undefined,
    });
    gridWrapperFixture.detectChanges();
    await gridWrapperFixture.whenStable();
    expect(headerHeightSpy).toHaveBeenCalledWith(37);
  });
});

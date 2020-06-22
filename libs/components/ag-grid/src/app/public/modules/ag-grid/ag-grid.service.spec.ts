import {
  TestBed
} from '@angular/core/testing';

import {
  CellClassParams,
  ColumnApi,
  GridOptions,
  ValueFormatterParams
} from 'ag-grid-community';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyCoreAdapterService
} from '@skyux/core';

import {
  SkyAgGridAdapterService
} from './ag-grid-adapter.service';

import {
  SkyAgGridService,
  SkyCellClass,
  SkyCellType
} from '../../public_api';

describe('SkyAgGridService', () => {
  let agGridService: SkyAgGridService;
  let agGridAdapterService: SkyAgGridAdapterService;
  let defaultGridOptions: GridOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SkyAgGridService,
        SkyAgGridAdapterService,
        SkyCoreAdapterService
      ]
    });

    agGridService = TestBed.inject(SkyAgGridService);
    agGridAdapterService = TestBed.inject(SkyAgGridAdapterService);
    defaultGridOptions = agGridService.getGridOptions({ gridOptions: {}});
  });

  describe('getGridOptions', () => {
    it('should return a default grid options configuration when no override options are passed', () => {

      expect(defaultGridOptions).toBeDefined();
      expect(defaultGridOptions.defaultColDef).toBeDefined();
    });

    it('overrides non-nested properties from the given options', () => {
      const newHeight = 1000;
      const overrideGridOptions = {
        headerHeight: newHeight,
        rowHeight: newHeight
      };
      const mergedGridOptions = agGridService.getGridOptions({ gridOptions: overrideGridOptions });

      expect(defaultGridOptions.headerHeight).not.toEqual(newHeight);
      expect(defaultGridOptions.rowHeight).not.toEqual(newHeight);
      expect(mergedGridOptions.headerHeight).toEqual(newHeight);
      expect(mergedGridOptions.rowHeight).toEqual(newHeight);
    });

    it('includes new provided columnTypes', () => {
      const newColumnType = {
        width: 1000,
        sortable: false,
        editable: true
      };
      const overrideGridOptions = {
        columnTypes: {
          newType: newColumnType
        }
      };
      const mergedGridOptions = agGridService.getGridOptions({ gridOptions: overrideGridOptions });
      const mergedColumnTypes = mergedGridOptions.columnTypes;

      expect(mergedColumnTypes.newType).toEqual(newColumnType);
      expect(mergedColumnTypes[SkyCellType.Number]).toBeDefined();
      expect(mergedColumnTypes[SkyCellType.Date]).toBeDefined();
      expect(mergedColumnTypes[SkyCellType.RowSelector]).toBeDefined();
    });

    it('does not overwrite the default grid options columnTypes', () => {
      const overrideDateColumnType = {
        width: 1000,
        sortable: false,
        editable: true,
        cellClass: 'random'
      };
      const defaultDateColumnType = defaultGridOptions.columnTypes[SkyCellType.Date];
      const overrideGridOptions = {
        columnTypes: {
          [SkyCellType.Date]: overrideDateColumnType
        }
      };

      const mergedGridOptions = agGridService.getGridOptions({ gridOptions: overrideGridOptions });
      const mergedColumnTypes = mergedGridOptions.columnTypes;

      expect(mergedColumnTypes[SkyCellType.Date].width).toEqual(defaultDateColumnType.width);
      expect(mergedColumnTypes[SkyCellType.Date].width).not.toEqual(overrideDateColumnType.width);
      expect(mergedColumnTypes[SkyCellType.Date].sortable).toEqual(defaultDateColumnType.sortable);
      expect(mergedColumnTypes[SkyCellType.Date].sortable).not.toEqual(overrideDateColumnType.sortable);
      expect(mergedColumnTypes[SkyCellType.Number]).toBeDefined();
      expect(mergedColumnTypes[SkyCellType.RowSelector]).toBeDefined();
    });

    it('overrides defaultColDef options that are not cellClassRules', () => {
      const overrideDefaultColDef = {
        sortable: false,
        resizable: false
      };
      const defaultColDef = defaultGridOptions.defaultColDef;
      const overrideGridOptions = {
        defaultColDef: overrideDefaultColDef
      };

      const mergedGridOptions = agGridService.getGridOptions({ gridOptions: overrideGridOptions });
      const mergedDefaultColDef = mergedGridOptions.defaultColDef;

      expect(mergedDefaultColDef.sortable).not.toEqual(defaultColDef.sortable);
      expect(mergedDefaultColDef.sortable).toEqual(overrideDefaultColDef.sortable);
      expect(mergedDefaultColDef.resizable).not.toEqual(defaultColDef.resizable);
      expect(mergedDefaultColDef.resizable).toEqual(overrideDefaultColDef.resizable);
    });

    it('does not override defaultColDef cellClassRules', () => {
      const overrideDefaultColDef = {
        cellClassRules: {
          'new-rule': 'true'
        }
      };
      const overrideGridOptions = {
        defaultColDef: overrideDefaultColDef
      };

      const mergedGridOptions = agGridService.getGridOptions({ gridOptions: overrideGridOptions });
      const mergedCellClassRules = mergedGridOptions.defaultColDef.cellClassRules;

      expect(mergedCellClassRules['new-rule']).toBeUndefined();
      expect(mergedCellClassRules[SkyCellClass.Editable]).toBeDefined();
      expect(mergedCellClassRules[SkyCellClass.Uneditable]).toBeDefined();
    });
  });

  describe('getEditableGridOptions', () => {
    it('should return the default gridOptions with the edit-specific property settings', () => {
      const editableGridOptions = agGridService.getEditableGridOptions({gridOptions: {}});

      expect(editableGridOptions.rowSelection).toEqual('none');
      expect(editableGridOptions.suppressCellSelection).toBe(false);
    });
  });

  describe('dateFormatter', () => {
    let dateValueFormatter: Function;
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
      dateValueFormatter = defaultGridOptions.columnTypes[SkyCellType.Date].valueFormatter as Function;
      dateValueFormatterParams = {
        value: undefined,
        node: undefined,
        data: undefined,
        colDef: undefined,
        column: undefined,
        columnApi: new ColumnApi(),
        api: undefined,
        context: undefined
      };
    });

    it('returns undefined when no date value is provided', () => {
      const formattedDate = dateValueFormatter(dateValueFormatterParams);

      expect(formattedDate).toBeUndefined();
    });

    it('returns undefined when a string that is not a valid date is provided', () => {
      dateValueFormatterParams.value = 'cat';
      const formattedDate = dateValueFormatter(dateValueFormatterParams);

      expect(formattedDate).toBeUndefined();
    });

    it('returns undefined when a non-Date object is provided', () => {
      dateValueFormatterParams.value = {};
      const formattedDate = dateValueFormatter(dateValueFormatterParams);

      expect(formattedDate).toBeUndefined();
    });

    it('returns a date string in the DD/MM/YYYY string format when a Date object and british english en-gb locale  are provided', () => {
      const britishGridOptions = agGridService.getGridOptions({ gridOptions: {}, locale: 'en-gb' });
      const britishDateValueFormatter = britishGridOptions.columnTypes[SkyCellType.Date].valueFormatter as Function;
      dateValueFormatterParams.value = new Date('12/1/2019');

      const formattedDate = britishDateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('01/12/2019');
    });

    it('returns a date string in the DD/MM/YYYY string format when a date string and british english en-gb locale  are provided', () => {
      const britishGridOptions = agGridService.getGridOptions({ gridOptions: {}, locale: 'en-gb' });
      const britishDateValueFormatter = britishGridOptions.columnTypes[SkyCellType.Date].valueFormatter as Function;
      dateValueFormatterParams.value = '3/1/2019';

      const formattedDate = britishDateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('01/03/2019');
    });

    it('returns a date string in the MM/DD/YYYY format when only a Date object is provided', () => {
      dateValueFormatterParams.value = new Date('12/1/2019');
      const formattedDate = dateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('12/01/2019');
    });

    it('returns a date string in the MM/DD/YYYY format when only a date string is provided', () => {
      dateValueFormatterParams.value = '3/1/2019';
      const formattedDate = dateValueFormatter(dateValueFormatterParams);
      const fixedFormattedDate = fixLocaleDateString(formattedDate);

      expect(fixedFormattedDate).toEqual('03/01/2019');
    });
  });

  describe('dateComparator', () => {
    let dateComparator: Function;
    const earlyDateString = '1/1/19';
    const lateDateString = '12/1/19';
    const earlyDate = new Date(earlyDateString);
    const lateDate = new Date(lateDateString);

    beforeEach(() => {
      dateComparator = defaultGridOptions.columnTypes[SkyCellType.Date].comparator;
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
    let autocompleteValueFormatter: Function;
    let autocompleteValueFormatterParams: ValueFormatterParams;

    beforeEach(() => {
      autocompleteValueFormatter = defaultGridOptions.columnTypes[SkyCellType.Autocomplete].valueFormatter as Function;
      autocompleteValueFormatterParams = {
        value: undefined,
        node: undefined,
        data: undefined,
        colDef: {
          cellEditorParams: {}
        },
        column: undefined,
        columnApi: new ColumnApi(),
        api: undefined,
        context: undefined
      };
    });

    it('should return the name property of the value', () => {
      autocompleteValueFormatterParams.value = { id: '1', name: 'Bob' };

      const formattedAutocomplete = autocompleteValueFormatter(autocompleteValueFormatterParams);

      expect(formattedAutocomplete).toEqual('Bob');
    });

    it('returns undefined when the cell does not have a value', () => {
      const formattedAutocomplete = autocompleteValueFormatter(autocompleteValueFormatterParams);

      expect(formattedAutocomplete).toBeUndefined();
    });
  });

  describe('autocompleteComparator', () => {
    let autocompleteComparator: Function;
    const cat = { id: '1', name: 'cat' };
    const dog = { id: '2', name: 'dog' };

    beforeEach(() => {
      autocompleteComparator = defaultGridOptions.columnTypes[SkyCellType.Autocomplete].comparator;
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

  describe('suppressKeyboardEvent', () => {
    const mockEl = document.createElement('div');
    let suppressKeypressFunction: Function;

    beforeEach(() => {
      suppressKeypressFunction = defaultGridOptions.suppressKeyboardEvent;
    });

    it('should return true to suppress the event when the tab key is pressed and cells are not being edited', () => {
      const params = { event: { code: 'Tab' }};
      expect(suppressKeypressFunction(params)).toBe(true);
    });

    it('should return true to suppress the event when the tab key is pressed, an inline cell is being edited, and there is other cell content to tab to', () => {
      const params = {
        editing: true,
        event: {
          code: 'Tab'
        }};

      spyOn(agGridAdapterService, 'getElementOrParentWithClass').and.returnValue(mockEl);
      spyOn(agGridAdapterService, 'getNextFocusableElement').and.returnValue(mockEl);

      expect(suppressKeypressFunction(params)).toBe(true);
    });

    it('should return false to suppress the event when the tab key is pressed, a popup cell is being edited, and there is no other cell content to tab to', () => {
      const params = {
        editing: true,
        event: {
          code: 'Tab'
        }};

      spyOn(agGridAdapterService, 'getElementOrParentWithClass').and.returnValues(undefined, mockEl);
      spyOn(agGridAdapterService, 'getNextFocusableElement').and.returnValue(undefined);

      expect(suppressKeypressFunction(params)).toBe(false);
    });

    it('should return false for non-tab keys to allow the keypress event', () => {
      const params = { event: { code: 'Enter' }};
      expect(suppressKeypressFunction(params)).toBe(false);
    });
  });

  describe('onCellFocused', () => {
    let onCellFocusedFunction: Function;

    beforeEach(() => {
      onCellFocusedFunction = defaultGridOptions.onCellFocused;
    });

    it('should get the currently focused cell and place focus on its children elements', () => {
      spyOn(agGridAdapterService, 'getFocusedElement');
      spyOn(agGridAdapterService, 'focusOnFocusableChildren');

      onCellFocusedFunction();

      expect(agGridAdapterService.getFocusedElement).toHaveBeenCalled();
      expect(agGridAdapterService.focusOnFocusableChildren).toHaveBeenCalled();
    });
  });

  describe('getDefaultGridOptions getEditableFn', () => {
    let cellClassRuleEditableFunction: Function;
    let cellClassParams: CellClassParams;

    beforeEach(() => {
      const cellClassRuleEditable = defaultGridOptions.defaultColDef.cellClassRules[SkyCellClass.Editable];
      if (typeof cellClassRuleEditable === 'function') {
        cellClassRuleEditableFunction = cellClassRuleEditable;
      }

      cellClassParams = {
        value: undefined,
        data: undefined,
        node: undefined,
        rowIndex: undefined,
        $scope: undefined,
        api: undefined,
        columnApi: new ColumnApi(),
        context: undefined,
        colDef: {}
      };
    });

    it('returns true when the columnDefinion\'s editable property is true and checkinng for editable', () => {
      cellClassParams.colDef.editable = true;
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeTruthy();
    });

    it('returns false when the columnDefinion\'s editable property is false and checking for editable', () => {
      cellClassParams.colDef.editable = false;
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeFalsy();
    });

    it('returns false when the columnDefinion\'s editable property is undefined and checking for editable', () => {
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeFalsy();
    });

    it('returns the result of the function when the columnDefinion\'s editable property is a function and checking for editable', () => {
      cellClassParams.colDef.editable = () => { return true; };
      spyOn(cellClassParams.columnApi, 'getColumn').and.returnValue(undefined);
      const editable = cellClassRuleEditableFunction(cellClassParams);

      expect(editable).toBeTruthy();
    });

    it('returns false when the columnDefinion\'s editable property is true and checking for uneditable', () => {
      let cellClassRuleUneditableFunction: Function;

      const cellClassRuleUneditable = defaultGridOptions.defaultColDef.cellClassRules[SkyCellClass.Uneditable];
      if (typeof cellClassRuleUneditable === 'function') {
        cellClassRuleUneditableFunction = cellClassRuleUneditable;
      }

      cellClassParams.colDef.editable = true;
      const editable = cellClassRuleUneditableFunction(cellClassParams);

      expect(editable).toBeFalsy();
    });
  });
});

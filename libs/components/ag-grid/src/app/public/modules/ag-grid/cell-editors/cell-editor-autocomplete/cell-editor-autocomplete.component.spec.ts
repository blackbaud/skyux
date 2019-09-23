import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyAppTestModule
} from '@skyux-sdk/builder/runtime/testing/browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  Column,
  ICellEditorParams,
  RowNode
} from 'ag-grid-community';

import {
  SkyAgGridCellEditorAutocompleteComponent
} from '../cell-editor-autocomplete';

describe('SkyCellEditorAutocompleteComponent', () => {
  let fixture: ComponentFixture<SkyAgGridCellEditorAutocompleteComponent>;
  let component: SkyAgGridCellEditorAutocompleteComponent;
  let nativeElement: HTMLElement;

  const data = [
    { id: '1', name: 'John Doe', town: 'Daniel Island' },
    { id: '2', name: 'Jane Doe', town: 'Daniel Island' },
    { id: '3', name: 'John Smith', town: 'West Ashley' },
    { id: '4', name: 'Jane Smith', town: 'Mt Pleasant' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAppTestModule
      ]
    });

    fixture = TestBed.createComponent(SkyAgGridCellEditorAutocompleteComponent);
    nativeElement = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should render an autocomplete input', () => {
    fixture.detectChanges();

    let element = nativeElement.querySelector('sky-autocomplete');
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    let cellEditorParams: ICellEditorParams;
    let column: Column;
    const columnWidth = 200;
    const selection = data[0];
    const rowNode = new RowNode();
    rowNode.rowHeight = 37;

    beforeEach(() => {
      column = new Column(
        {
          colId: 'col'
        },
        undefined,
        'col',
        true);

      column.setActualWidth(columnWidth);

      cellEditorParams = {
        value: selection,
        column,
        node: rowNode,
        keyPress: undefined,
        charPress: undefined,
        colDef: {},
        columnApi: undefined,
        data: undefined,
        rowIndex: undefined,
        api: undefined,
        cellStartedEdit: undefined,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined
      };
    });

    it('should initialize the SkyuxNumericCellEditorComponent properties', () => {
      expect(component.currentSelection).toBeUndefined();
      expect(component.columnWidth).toBeUndefined();
      expect(component.rowHeight).toBeUndefined();

      component.agInit(cellEditorParams);

      expect(component.currentSelection).toEqual(selection);
      expect(component.columnWidth).toBe(columnWidth);
      expect(component.rowHeight).toBe(38);
    });

    it('should set the cellEditorParams', () => {
      const debounceTime = 2;
      const descriptorProperty = 'name';
      const propertiesToSearch = ['name', 'town'];
      const search = () => {};
      const searchFilters: any[] = [];
      const searchResultsLimit = 10;
      const searchResultTemplate = 'template';
      const searchTextMinimumCharacters = 2;
      const selectionChange = () => {};

      cellEditorParams.colDef.cellEditorParams = {
        debounceTime,
        descriptorProperty,
        propertiesToSearch,
        search,
        searchFilters,
        searchResultsLimit,
        searchResultTemplate,
        searchTextMinimumCharacters,
        selectionChange
      };

      expect(component.debounceTime).toBeUndefined();
      expect(component.descriptorProperty).toBeUndefined();
      expect(component.propertiesToSearch).toBeUndefined();
      expect(component.search).toBeUndefined();
      expect(component.searchFilters).toBeUndefined();
      expect(component.searchResultsLimit).toBeUndefined();
      expect(component.searchResultTemplate).toBeUndefined();
      expect(component.searchTextMinimumCharacters).toBeUndefined();
      expect(component.selectionChange).toBeUndefined();

      component.agInit(cellEditorParams);

      expect(component.debounceTime).toBe(debounceTime);
      expect(component.descriptorProperty).toBe(descriptorProperty);
      expect(component.propertiesToSearch).toBe(propertiesToSearch);
      expect(component.search).toBe(search);
      expect(component.searchFilters).toBe(searchFilters);
      expect(component.searchResultsLimit).toBe(searchResultsLimit);
      expect(component.searchResultTemplate).toBe(searchResultTemplate);
      expect(component.searchTextMinimumCharacters).toBe(searchTextMinimumCharacters);
      expect(component.selectionChange).toBe(selectionChange);
    });
  });

  describe('getValue', () => {
    it('should return the selected object if one is selected', () => {
      let selection = data[0];
      component.currentSelection = selection;

      fixture.detectChanges();

      expect(component.getValue()).toEqual(selection);
    });

    it('should return undefined if no value is selected', () => {
      expect(component.getValue()).toBeUndefined();
    });
  });

  describe('afterGuiAttached', () => {
    it('should focus on the input after it attaches to the DOM', () => {
      fixture.detectChanges();

      const input = nativeElement.querySelector('input');
      spyOn(input, 'focus');

      component.afterGuiAttached();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    });
  });

  describe('isPopup', () => {
    it('should return true', () => {
      expect(component.isPopup()).toBeTruthy();
    });
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});

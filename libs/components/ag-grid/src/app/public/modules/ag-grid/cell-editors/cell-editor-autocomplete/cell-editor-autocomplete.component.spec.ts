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
  RowNode
} from 'ag-grid-community';

import {
  SkyAgGridCellEditorAutocompleteComponent
} from '../cell-editor-autocomplete';

import {
  SkyCellEditorAutocompleteParams
} from '../../types/cell-editor-autocomplete-params';

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
    let cellEditorParams: SkyCellEditorAutocompleteParams;
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

    it('should initialize the SkyAgGridCellEditorAutocompleteComponent properties', () => {
      expect(component.currentSelection).toBeUndefined();
      expect(component.columnWidth).toBeUndefined();
      expect(component.rowHeight).toBeUndefined();

      component.agInit(cellEditorParams);

      expect(component.currentSelection).toEqual(selection);
      expect(component.columnWidth).toBe(columnWidth);
      expect(component.rowHeight).toBe(36);
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

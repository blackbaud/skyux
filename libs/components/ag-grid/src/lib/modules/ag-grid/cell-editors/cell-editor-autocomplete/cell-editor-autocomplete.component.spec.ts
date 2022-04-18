import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { Beans, Column, RowNode } from 'ag-grid-community';

import { SkyAgGridModule } from '../../ag-grid.module';
import { SkyCellEditorAutocompleteParams } from '../../types/cell-editor-autocomplete-params';
import { SkyAgGridCellEditorAutocompleteComponent } from '../cell-editor-autocomplete/cell-editor-autocomplete.component';

describe('SkyCellEditorAutocompleteComponent', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  let fixture: ComponentFixture<SkyAgGridCellEditorAutocompleteComponent>;
  let component: SkyAgGridCellEditorAutocompleteComponent;
  let nativeElement: HTMLElement;

  const data = [
    { id: '1', name: 'John Doe', town: 'Daniel Island' },
    { id: '2', name: 'Jane Doe', town: 'Daniel Island' },
    { id: '3', name: 'John Smith', town: 'West Ashley' },
    { id: '4', name: 'Jane Smith', town: 'Mt Pleasant' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridModule],
    });
    fixture = TestBed.createComponent(SkyAgGridCellEditorAutocompleteComponent);
    nativeElement = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should render an autocomplete input', () => {
    fixture.detectChanges();

    const element = nativeElement.querySelector('sky-autocomplete');
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    let cellEditorParams: SkyCellEditorAutocompleteParams;
    let column: Column;
    const columnWidth = 200;
    const selection = data[0];
    const rowNode = new RowNode({} as Beans);
    rowNode.rowHeight = 37;

    beforeEach(() => {
      column = new Column(
        {
          colId: 'col',
        },
        undefined,
        'col',
        true
      );

      column.setActualWidth(columnWidth);

      cellEditorParams = {
        value: selection,
        column,
        node: rowNode,
        key: undefined,
        eventKey: undefined,
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
        formatValue: undefined,
      };
    });

    it('should initialize the SkyAgGridCellEditorAutocompleteComponent properties', () => {
      expect(component.currentSelection).toBeUndefined();
      component.agInit(cellEditorParams);

      expect(component.currentSelection).toEqual(selection);
    });
  });

  describe('getValue', () => {
    it('should return the selected object if one is selected', () => {
      const selection = data[0];
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

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

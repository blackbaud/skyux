import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { Beans, Column, KeyCode, RowNode } from 'ag-grid-community';

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
        cellStartedEdit: true,
        onKeyDown: undefined,
        context: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
    });

    it('should initialize the SkyAgGridCellEditorAutocompleteComponent properties', () => {
      expect(component.editorForm.get('selection').value).toBeNull();
      component.agInit(cellEditorParams);

      expect(component.editorForm.get('selection').value).toEqual(selection);
    });

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.BACKSPACE });

        expect(component.editorForm.get('selection').value).toBeUndefined();
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.DELETE });

        expect(component.editorForm.get('selection').value).toBeUndefined();
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.F2 });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.ENTER });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, charPress: 'a' });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with the current value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.BACKSPACE });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      it('initializes with the current value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.DELETE });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.F2 });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, eventKey: KeyCode.ENTER });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toBeNull();

        component.agInit({ ...cellEditorParams, charPress: 'a' });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });
    });
  });

  describe('getValue', () => {
    it('should return the selected object if one is selected', () => {
      const selection = data[0];
      component.editorForm.get('selection').setValue(selection);

      fixture.detectChanges();

      expect(component.getValue()).toEqual(selection);
    });

    it('should return undefined if no value is selected', () => {
      expect(component.getValue()).toBeUndefined();
    });
  });

  describe('afterGuiAttached', () => {
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
        cellStartedEdit: true,
        onKeyDown: undefined,
        context: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
    });

    it('should focus on the input after it attaches to the DOM', () => {
      fixture.detectChanges();

      const input = nativeElement.querySelector('input');
      spyOn(input, 'focus');

      component.afterGuiAttached();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    });

    describe('cellStartedEdit is true', () => {
      it('does not select the input value if Backspace triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.BACKSPACE });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.DELETE });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.F2 });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('selects the input value if Enter triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.ENTER });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).toHaveBeenCalledTimes(1);
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({ ...cellEditorParams, charPress: 'a' });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        fixture.detectChanges();

        expect(input.value).toBe('a');
        expect(selectSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('does not select the input value if Backspace triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.BACKSPACE });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.DELETE });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.F2 });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Enter triggers the edit', () => {
        component.agInit({ ...cellEditorParams, eventKey: KeyCode.ENTER });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({ ...cellEditorParams, charPress: 'a' });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        fixture.detectChanges();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });
    });
  });

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

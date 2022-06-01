import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { Column, ICellEditorParams, KeyCode } from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellEditorNumberParams } from '../../types/cell-editor-number-params';
import { SkyAgGridCellEditorNumberComponent } from '../cell-editor-number/cell-editor-number.component';

describe('SkyCellEditorNumberComponent', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  let numberEditorFixture: ComponentFixture<SkyAgGridCellEditorNumberComponent>;
  let numberEditorComponent: SkyAgGridCellEditorNumberComponent;
  let numberEditorNativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    numberEditorFixture = TestBed.createComponent(
      SkyAgGridCellEditorNumberComponent
    );
    numberEditorNativeElement = numberEditorFixture.nativeElement;
    numberEditorComponent = numberEditorFixture.componentInstance;

    numberEditorFixture.detectChanges();
  });

  it('renders a numeric input when editing a number cell in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const numberCellElement = gridNativeElement.querySelector(
      `.${SkyCellClass.Number}`
    );
    const numberCellEditorSelector = `.ag-cell-inline-editing.${SkyCellClass.Number}`;
    let inputElement = gridNativeElement.querySelector(
      numberCellEditorSelector
    );

    expect(inputElement).toBeNull();

    numberCellElement.click();

    inputElement = gridNativeElement.querySelector(numberCellEditorSelector);

    expect(inputElement).toBeVisible();
  });

  describe('agInit', () => {
    it('initializes the SkyuxNumericCellEditorComponent properties', () => {
      const value = 15;
      const columnWidth = 100;
      const column = new Column(
        {
          colId: 'col',
        },
        undefined,
        'col',
        true
      );

      column.setActualWidth(columnWidth);

      const cellEditorParams: SkyCellEditorNumberParams = {
        value,
        colDef: { headerName: 'Test number cell' },
        rowIndex: 1,
        column,
        node: undefined,
        keyPress: undefined,
        charPress: undefined,
        columnApi: undefined,
        data: undefined,
        api: undefined,
        cellStartedEdit: undefined,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
        skyComponentProperties: {
          max: undefined,
          min: undefined,
        },
      };

      expect(numberEditorComponent.editorForm.get('number').value).toBeNull();
      expect(numberEditorComponent.columnWidth).toBeUndefined();

      numberEditorComponent.agInit(cellEditorParams);

      expect(numberEditorComponent.editorForm.get('number').value).toEqual(
        value
      );
      expect(numberEditorComponent.columnWidth).toEqual(columnWidth);
    });

    it('initializes with a cleared value when Backspace triggers the edit', () => {
      const value = 15;
      const columnWidth = 100;
      const column = new Column(
        {
          colId: 'col',
        },
        undefined,
        'col',
        true
      );

      column.setActualWidth(columnWidth);

      const cellEditorParams: SkyCellEditorNumberParams = {
        value,
        colDef: { headerName: 'Test text cell' },
        rowIndex: 1,
        column,
        node: undefined,
        keyPress: KeyCode.BACKSPACE,
        charPress: undefined,
        columnApi: undefined,
        data: undefined,
        api: undefined,
        cellStartedEdit: true,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.editorForm.get('number').value).toBeNull();

      numberEditorComponent.agInit(cellEditorParams);

      expect(
        numberEditorComponent.editorForm.get('number').value
      ).toBeUndefined();
    });

    it('initializes with a cleared value when Delete triggers the edit', () => {
      const value = 15;
      const columnWidth = 100;
      const column = new Column(
        {
          colId: 'col',
        },
        undefined,
        'col',
        true
      );

      column.setActualWidth(columnWidth);

      const cellEditorParams: SkyCellEditorNumberParams = {
        value,
        colDef: { headerName: 'Test text cell' },
        rowIndex: 1,
        column,
        node: undefined,
        keyPress: KeyCode.DELETE,
        charPress: undefined,
        columnApi: undefined,
        data: undefined,
        api: undefined,
        cellStartedEdit: true,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.editorForm.get('number').value).toBeNull();

      numberEditorComponent.agInit(cellEditorParams);

      expect(
        numberEditorComponent.editorForm.get('number').value
      ).toBeUndefined();
    });

    it('initializes with the current value when F2 triggers the edit', () => {
      const value = 15;
      const columnWidth = 100;
      const column = new Column(
        {
          colId: 'col',
        },
        undefined,
        'col',
        true
      );

      column.setActualWidth(columnWidth);

      const cellEditorParams: SkyCellEditorNumberParams = {
        value,
        colDef: { headerName: 'Test text cell' },
        rowIndex: 1,
        column,
        node: undefined,
        keyPress: KeyCode.F2,
        charPress: undefined,
        columnApi: undefined,
        data: undefined,
        api: undefined,
        cellStartedEdit: true,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.editorForm.get('number').value).toBeNull();

      numberEditorComponent.agInit(cellEditorParams);

      expect(numberEditorComponent.editorForm.get('number').value).toBe(15);
    });

    it('initializes with the current value when Enter triggers the edit', () => {
      const value = 15;
      const columnWidth = 100;
      const column = new Column(
        {
          colId: 'col',
        },
        undefined,
        'col',
        true
      );

      column.setActualWidth(columnWidth);

      const cellEditorParams: SkyCellEditorNumberParams = {
        value,
        colDef: { headerName: 'Test text cell' },
        rowIndex: 1,
        column,
        node: undefined,
        keyPress: KeyCode.ENTER,
        charPress: undefined,
        columnApi: undefined,
        data: undefined,
        api: undefined,
        cellStartedEdit: true,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.editorForm.get('number').value).toBeNull();

      numberEditorComponent.agInit(cellEditorParams);

      expect(numberEditorComponent.editorForm.get('number').value).toBe(15);
    });

    it('initializes with the character pressed when a standard keyboard event triggers the edit', () => {
      const value = 15;
      const columnWidth = 100;
      const column = new Column(
        {
          colId: 'col',
        },
        undefined,
        'col',
        true
      );

      column.setActualWidth(columnWidth);

      const cellEditorParams: SkyCellEditorNumberParams = {
        value,
        colDef: { headerName: 'Test text cell' },
        rowIndex: 1,
        column,
        node: undefined,
        keyPress: undefined,
        charPress: '4',
        columnApi: undefined,
        data: undefined,
        api: undefined,
        cellStartedEdit: true,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.editorForm.get('number').value).toBeNull();

      numberEditorComponent.agInit(cellEditorParams);

      expect(numberEditorComponent.editorForm.get('number').value).toBe(4);
    });
  });

  describe('getValue', () => {
    it('returns the value if it is set', () => {
      const value = 7;
      numberEditorComponent.editorForm.get('number').setValue(value);

      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.getValue()).toBe(value);
    });

    it('returns the value if it is 0', () => {
      const value = 0;
      numberEditorComponent.editorForm.get('number').setValue(value);

      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.getValue()).toBe(value);
    });

    describe('afterGuiAttached', () => {
      it('focuses on the input after it attaches to the DOM', () => {
        numberEditorFixture.detectChanges();

        const input = numberEditorNativeElement.querySelector('input');
        spyOn(input, 'focus');

        numberEditorComponent.afterGuiAttached();

        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
      });

      it('does not select the input value if Backspace triggers the edit', () => {
        const value = 15;
        const columnWidth = 100;
        const column = new Column(
          {
            colId: 'col',
          },
          undefined,
          'col',
          true
        );

        column.setActualWidth(columnWidth);

        const cellEditorParams: SkyCellEditorNumberParams = {
          value,
          colDef: { headerName: 'Test text cell' },
          rowIndex: 1,
          column,
          node: undefined,
          keyPress: KeyCode.BACKSPACE,
          charPress: undefined,
          columnApi: undefined,
          data: undefined,
          api: undefined,
          cellStartedEdit: true,
          onKeyDown: undefined,
          context: undefined,
          $scope: undefined,
          stopEditing: undefined,
          eGridCell: undefined,
          parseValue: undefined,
          formatValue: undefined,
        };
        numberEditorFixture.detectChanges();

        numberEditorComponent.agInit(cellEditorParams);
        numberEditorFixture.detectChanges();
        const input = numberEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        numberEditorComponent.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Escape triggers the edit', () => {
        const value = 15;
        const columnWidth = 100;
        const column = new Column(
          {
            colId: 'col',
          },
          undefined,
          'col',
          true
        );

        column.setActualWidth(columnWidth);

        const cellEditorParams: SkyCellEditorNumberParams = {
          value,
          colDef: { headerName: 'Test text cell' },
          rowIndex: 1,
          column,
          node: undefined,
          keyPress: KeyCode.BACKSPACE,
          charPress: undefined,
          columnApi: undefined,
          data: undefined,
          api: undefined,
          cellStartedEdit: true,
          onKeyDown: undefined,
          context: undefined,
          $scope: undefined,
          stopEditing: undefined,
          eGridCell: undefined,
          parseValue: undefined,
          formatValue: undefined,
        };
        numberEditorFixture.detectChanges();

        numberEditorComponent.agInit(cellEditorParams);
        numberEditorFixture.detectChanges();
        const input = numberEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        numberEditorComponent.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        const value = 15;
        const columnWidth = 100;
        const column = new Column(
          {
            colId: 'col',
          },
          undefined,
          'col',
          true
        );

        column.setActualWidth(columnWidth);

        const cellEditorParams: SkyCellEditorNumberParams = {
          value,
          colDef: { headerName: 'Test text cell' },
          rowIndex: 1,
          column,
          node: undefined,
          keyPress: KeyCode.F2,
          charPress: undefined,
          columnApi: undefined,
          data: undefined,
          api: undefined,
          cellStartedEdit: true,
          onKeyDown: undefined,
          context: undefined,
          $scope: undefined,
          stopEditing: undefined,
          eGridCell: undefined,
          parseValue: undefined,
          formatValue: undefined,
        };
        numberEditorFixture.detectChanges();

        numberEditorComponent.agInit(cellEditorParams);
        numberEditorFixture.detectChanges();
        const input = numberEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        numberEditorComponent.afterGuiAttached();

        expect(input.value).toBe('15');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('selects the input value if Enter triggers the edit', () => {
        const value = 15;
        const columnWidth = 100;
        const column = new Column(
          {
            colId: 'col',
          },
          undefined,
          'col',
          true
        );

        column.setActualWidth(columnWidth);

        const cellEditorParams: SkyCellEditorNumberParams = {
          value,
          colDef: { headerName: 'Test text cell' },
          rowIndex: 1,
          column,
          node: undefined,
          keyPress: KeyCode.ENTER,
          charPress: undefined,
          columnApi: undefined,
          data: undefined,
          api: undefined,
          cellStartedEdit: true,
          onKeyDown: undefined,
          context: undefined,
          $scope: undefined,
          stopEditing: undefined,
          eGridCell: undefined,
          parseValue: undefined,
          formatValue: undefined,
        };
        numberEditorFixture.detectChanges();

        numberEditorComponent.agInit(cellEditorParams);
        numberEditorFixture.detectChanges();
        const input = numberEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        numberEditorComponent.afterGuiAttached();

        expect(input.value).toBe('15');
        expect(selectSpy).toHaveBeenCalled();
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        const value = 15;
        const columnWidth = 100;
        const column = new Column(
          {
            colId: 'col',
          },
          undefined,
          'col',
          true
        );

        column.setActualWidth(columnWidth);

        const cellEditorParams: SkyCellEditorNumberParams = {
          value,
          colDef: { headerName: 'Test text cell' },
          rowIndex: 1,
          column,
          node: undefined,
          keyPress: undefined,
          charPress: '4',
          columnApi: undefined,
          data: undefined,
          api: undefined,
          cellStartedEdit: true,
          onKeyDown: undefined,
          context: undefined,
          $scope: undefined,
          stopEditing: undefined,
          eGridCell: undefined,
          parseValue: undefined,
          formatValue: undefined,
        };
        numberEditorFixture.detectChanges();

        numberEditorComponent.agInit(cellEditorParams);
        numberEditorFixture.detectChanges();
        const input = numberEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        numberEditorComponent.afterGuiAttached();

        expect(input.value).toBe('4');
        expect(selectSpy).not.toHaveBeenCalled();
      });
    });

    it('returns undefined if the value is not set', () => {
      expect(numberEditorComponent.getValue()).toBeUndefined();
    });
  });

  it('should pass accessibility', async () => {
    numberEditorFixture.detectChanges();
    await numberEditorFixture.whenStable();

    await expectAsync(numberEditorFixture.nativeElement).toBeAccessible();
  });
});

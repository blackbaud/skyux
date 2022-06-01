import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { Column, GridApi, ICellEditorParams, KeyCode } from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellEditorCurrencyParams } from '../../types/cell-editor-currency-params';

import { SkyAgGridCellEditorCurrencyComponent } from './cell-editor-currency.component';

describe('SkyCellEditorCurrencyComponent', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  let currencyEditorFixture: ComponentFixture<SkyAgGridCellEditorCurrencyComponent>;
  let currencyEditorComponent: SkyAgGridCellEditorCurrencyComponent;
  let currencyEditorNativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    currencyEditorFixture = TestBed.createComponent(
      SkyAgGridCellEditorCurrencyComponent
    );
    currencyEditorNativeElement = currencyEditorFixture.nativeElement;
    currencyEditorComponent = currencyEditorFixture.componentInstance;

    currencyEditorFixture.detectChanges();
  });

  it('renders a numeric input when editing a currency cell in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const currencyCellElement = gridNativeElement.querySelector(
      `.${SkyCellClass.Currency}`
    );

    expect(currencyCellElement).toBeVisible();
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const api: GridApi = {
        stopEditing: () => {},
        setFocusedCell: () => {},
      };
      const cellEditorParams: ICellEditorParams = {
        value,
        colDef: { headerName: 'Test currency cell' },
        rowIndex: 1,
        column,
        node: undefined,
        keyPress: undefined,
        charPress: undefined,
        columnApi: undefined,
        data: undefined,
        api,
        cellStartedEdit: undefined,
        onKeyDown: undefined,
        context: undefined,
        $scope: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };

      expect(currencyEditorComponent.columnWidth).toBeUndefined();

      currencyEditorComponent.agInit(cellEditorParams);

      expect(currencyEditorComponent.columnWidth).toEqual(columnWidth);

      // @ts-ignore
      cellEditorParams.node = {
        rowHeight: 100,
      };

      currencyEditorComponent.agInit(cellEditorParams);

      expect(currencyEditorComponent.rowHeightWithoutBorders).toEqual(96);

      const stopEditingSpy = spyOn(api, 'stopEditing');
      const setFocusedCellSpy = spyOn(api, 'setFocusedCell');
      currencyEditorComponent.onPressEscape();
      expect(stopEditingSpy).toHaveBeenCalled();
      expect(setFocusedCellSpy).toHaveBeenCalled();
    });
  });

  describe('getValue', () => {
    it('returns the value if it is set', () => {
      const value = 7;
      currencyEditorComponent.editorForm.get('currency').setValue(value);

      currencyEditorFixture.detectChanges();

      expect(currencyEditorComponent.getValue()).toBe(value);
    });

    it('returns the value if it is 0', () => {
      const value = 0;
      currencyEditorComponent.editorForm.get('currency').setValue(value);

      currencyEditorFixture.detectChanges();

      expect(currencyEditorComponent.getValue()).toBe(value);
    });

    describe('afterGuiAttached', () => {
      it('sets the form control value correctly', () => {
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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const api: GridApi = {
          stopEditing: () => {},
          setFocusedCell: () => {},
        };
        const cellEditorParams: SkyCellEditorCurrencyParams = {
          value,
          colDef: { headerName: 'Test currency cell' },
          rowIndex: 1,
          column,
          node: undefined,
          keyPress: undefined,
          charPress: undefined,
          columnApi: undefined,
          data: undefined,
          api,
          cellStartedEdit: undefined,
          onKeyDown: undefined,
          context: undefined,
          $scope: undefined,
          stopEditing: undefined,
          eGridCell: undefined,
          parseValue: undefined,
          formatValue: undefined,
        };

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeNull();

        currencyEditorComponent.agInit(cellEditorParams);
        currencyEditorFixture.detectChanges();
        currencyEditorComponent.afterGuiAttached();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toEqual(value);
      });

      it('initializes with a cleared value unselected when Backspace triggers the edit', fakeAsync(() => {
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

        const cellEditorParams: SkyCellEditorCurrencyParams = {
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
        currencyEditorFixture.detectChanges();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeNull();

        currencyEditorComponent.agInit(cellEditorParams);
        currencyEditorFixture.detectChanges();
        const input = currencyEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');
        currencyEditorComponent.afterGuiAttached();
        tick(100);
        currencyEditorFixture.detectChanges();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeUndefined();
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('initializes with a cleared value unselected when Delete triggers the edit', fakeAsync(() => {
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

        const cellEditorParams: SkyCellEditorCurrencyParams = {
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
        currencyEditorFixture.detectChanges();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeNull();

        currencyEditorComponent.agInit(cellEditorParams);
        const input = currencyEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');
        currencyEditorComponent.afterGuiAttached();
        tick(100);
        currencyEditorFixture.detectChanges();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeUndefined();
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('initializes with the current value unselected when F2 triggers the edit', fakeAsync(() => {
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

        const cellEditorParams: SkyCellEditorCurrencyParams = {
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
        currencyEditorFixture.detectChanges();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeNull();

        currencyEditorComponent.agInit(cellEditorParams);
        currencyEditorFixture.detectChanges();
        const input = currencyEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');
        currencyEditorComponent.afterGuiAttached();
        tick(100);
        currencyEditorFixture.detectChanges();

        expect(currencyEditorComponent.editorForm.get('currency').value).toBe(
          15
        );
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('initializes with the current value selected when Enter triggers the edit', fakeAsync(() => {
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

        const cellEditorParams: SkyCellEditorCurrencyParams = {
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
        currencyEditorFixture.detectChanges();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeNull();

        currencyEditorComponent.agInit(cellEditorParams);
        currencyEditorFixture.detectChanges();
        const input = currencyEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');
        currencyEditorComponent.afterGuiAttached();
        tick(100);
        currencyEditorFixture.detectChanges();

        expect(currencyEditorComponent.editorForm.get('currency').value).toBe(
          15
        );
        expect(selectSpy).toHaveBeenCalled();
      }));

      it('initializes with the character pressed unselected when a standard keyboard event triggers the edit', fakeAsync(() => {
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

        const cellEditorParams: SkyCellEditorCurrencyParams = {
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
        currencyEditorFixture.detectChanges();

        expect(
          currencyEditorComponent.editorForm.get('currency').value
        ).toBeNull();

        currencyEditorComponent.agInit(cellEditorParams);
        currencyEditorFixture.detectChanges();
        const input = currencyEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');
        currencyEditorComponent.afterGuiAttached();
        tick(100);
        currencyEditorFixture.detectChanges();

        expect(currencyEditorComponent.editorForm.get('currency').value).toBe(
          4
        );
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('focuses on the input after it attaches to the DOM', () => {
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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const api: GridApi = {
          stopEditing: () => {},
          setFocusedCell: () => {},
        };
        const cellEditorParams: ICellEditorParams = {
          value,
          colDef: { headerName: 'Test currency cell' },
          rowIndex: 1,
          column,
          node: undefined,
          keyPress: undefined,
          charPress: undefined,
          columnApi: undefined,
          data: undefined,
          api,
          cellStartedEdit: undefined,
          onKeyDown: undefined,
          context: undefined,
          $scope: undefined,
          stopEditing: undefined,
          eGridCell: undefined,
          parseValue: undefined,
          formatValue: undefined,
        };

        currencyEditorComponent.agInit(cellEditorParams);
        currencyEditorFixture.detectChanges();

        const input = currencyEditorNativeElement.querySelector('input');
        spyOn(input, 'focus');

        currencyEditorComponent.afterGuiAttached();

        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
      });
    });

    it('returns undefined if the value is not set', () => {
      expect(currencyEditorComponent.getValue()).toBeUndefined();
    });
  });

  it('should pass accessibility', async () => {
    currencyEditorFixture.detectChanges();
    await currencyEditorFixture.whenStable();

    await expectAsync(currencyEditorFixture.nativeElement).toBeAccessible();
  });
});

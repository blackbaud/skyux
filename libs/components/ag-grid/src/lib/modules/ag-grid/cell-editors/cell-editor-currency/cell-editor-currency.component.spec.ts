import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { Column, GridApi, ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';

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
        key: undefined,
        eventKey: undefined,
        charPress: undefined,
        columnApi: undefined,
        data: undefined,
        api,
        cellStartedEdit: undefined,
        onKeyDown: undefined,
        context: undefined,
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };

      expect(currencyEditorComponent.value).toBeUndefined();
      expect(currencyEditorComponent.columnWidth).toBeUndefined();

      currencyEditorComponent.agInit(cellEditorParams);

      expect(currencyEditorComponent.value).toEqual(value);
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
      currencyEditorComponent.value = value;

      currencyEditorFixture.detectChanges();

      expect(currencyEditorComponent.getValue()).toBe(value);
    });

    it('returns the value if it is 0', () => {
      const value = 0;
      currencyEditorComponent.value = value;

      currencyEditorFixture.detectChanges();

      expect(currencyEditorComponent.getValue()).toBe(value);
    });

    describe('afterGuiAttached', () => {
      it('focuses on the input after it attaches to the DOM', () => {
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

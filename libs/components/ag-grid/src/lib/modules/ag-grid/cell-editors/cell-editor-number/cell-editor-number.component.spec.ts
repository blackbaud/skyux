import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { Column, ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
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

      let cellEditorParams: ICellEditorParams = {
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
      };

      expect(numberEditorComponent.value).toBeUndefined();
      expect(numberEditorComponent.columnWidth).toBeUndefined();

      numberEditorComponent.agInit(cellEditorParams);

      expect(numberEditorComponent.value).toEqual(value);
      expect(numberEditorComponent.columnWidth).toEqual(columnWidth);
    });
  });

  describe('getValue', () => {
    it('returns the value if it is set', () => {
      let value = 7;
      numberEditorComponent.value = value;

      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.getValue()).toBe(value);
    });

    it('returns the value if it is 0', () => {
      let value = 0;
      numberEditorComponent.value = value;

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

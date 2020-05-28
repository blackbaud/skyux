import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  Column,
  RowNode
} from 'ag-grid-community';

import {
  SkyTestComponentSelector
} from '@blackbaud/skyux-lib-testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyCellClass
} from '../../types';

import {
  SkyAgGridFixtureComponent,
  SkyAgGridFixtureModule
} from '../../fixtures';

import {
  SkyAgGridCellEditorDatepickerComponent
} from '../cell-editor-datepicker';

import {
  SkyCellEditorDatepickerParams
} from '../../types/cell-editor-datepicker-params';

describe('SkyCellEditorDatepickerComponent', () => {
  let datepickerEditorFixture: ComponentFixture<SkyAgGridCellEditorDatepickerComponent>;
  let datepickerEditorComponent: SkyAgGridCellEditorDatepickerComponent;
  let datepickerEditorNativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAgGridFixtureModule
      ]
    });

    datepickerEditorFixture = TestBed.createComponent(SkyAgGridCellEditorDatepickerComponent);
    datepickerEditorNativeElement = datepickerEditorFixture.nativeElement;
    datepickerEditorComponent = datepickerEditorFixture.componentInstance;
  });

  describe('in ag grid', () => {
    let gridFixture: ComponentFixture<SkyAgGridFixtureComponent>;
    let gridNativeElement: HTMLElement;
    let dateCellElement: HTMLElement;

    beforeEach(() => {
      gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridNativeElement = gridFixture.nativeElement;

      gridFixture.detectChanges();

      dateCellElement = gridNativeElement.querySelector(`.${SkyCellClass.Date}`) as HTMLElement;
    });

    it('renders a skyux datepicker', () => {
      const datepickerEditorSelector = `.ag-popup-editor .sky-ag-grid-cell-editor-datepicker`;
      let datepickerEditorElement = gridNativeElement.querySelector(datepickerEditorSelector);

      expect(datepickerEditorElement).toBeNull();

      dateCellElement.click();

      datepickerEditorElement = gridNativeElement.querySelector(datepickerEditorSelector);

      expect(datepickerEditorElement).toBeVisible();
    });
  });

  describe('agInit', () => {
    let cellEditorParams: SkyCellEditorDatepickerParams;
    let column: Column;
    const columnWidth = 200;
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
        value: undefined,
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

    it('initializes the SkyAgGridCellEditorDatepickerComponent properties', fakeAsync(() => {
      const dateString = '01/01/2019';
      const date = new Date(dateString);
      const datepicker = SkyTestComponentSelector.selectDatepicker(
        datepickerEditorFixture,
        'cell-datepicker'
      );

      cellEditorParams.value = date;

      expect(datepickerEditorComponent.currentDate).toBeUndefined();
      expect(datepickerEditorComponent.columnWidth).toBeUndefined();
      expect(datepickerEditorComponent.rowHeight).toBeUndefined();

      datepickerEditorComponent.agInit(cellEditorParams);
      datepickerEditorFixture.detectChanges();
      tick();
      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.currentDate).toEqual(date);
      expect(datepicker.date).toEqual(dateString);
      expect(datepickerEditorComponent.columnWidth).toEqual(columnWidth);
      expect(datepickerEditorComponent.rowHeight).toEqual(36);
    }));
  });

  describe('getValue', () => {
    it('updates value from input and returns currentDate', () => {
      const previousDate = new Date('1/1/2019');
      const elementDateValue = '12/1/2019';

      datepickerEditorComponent.columnWidth = 300;
      datepickerEditorComponent.rowHeight = 37;
      datepickerEditorComponent.currentDate = previousDate;

      datepickerEditorFixture.detectChanges();

      datepickerEditorComponent['datepickerInput'].nativeElement.value = elementDateValue;
      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.getValue()).not.toEqual(previousDate);
    });
  });

  describe('afterGuiAttached', () => {
    it('focuses on the datepicker input after it attaches to the DOM', () => {
      datepickerEditorComponent.columnWidth = 300;
      datepickerEditorComponent.rowHeight = 37;
      datepickerEditorComponent.currentDate = new Date('7/12/2019');

      datepickerEditorFixture.detectChanges();

      const input = datepickerEditorNativeElement.querySelector('input');
      spyOn(input, 'focus');

      datepickerEditorComponent.afterGuiAttached();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    });
  });

  describe('isPopup', () => {
    it('returns true', () => {
      expect(datepickerEditorComponent.isPopup()).toBeTruthy();
    });
  });

  it('should pass accessibility', async(() => {
    datepickerEditorComponent.columnWidth = 300;
    datepickerEditorComponent.rowHeight = 37;

    datepickerEditorFixture.detectChanges();

    expect(datepickerEditorNativeElement).toBeAccessible();
  }));
});

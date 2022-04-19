import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyDatepickerFixture } from '@skyux/datetime/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { Beans, Column, RowNode } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellEditorDatepickerParams } from '../../types/cell-editor-datepicker-params';
import { SkyAgGridCellEditorDatepickerComponent } from '../cell-editor-datepicker/cell-editor-datepicker.component';

describe('SkyCellEditorDatepickerComponent', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  let datepickerEditorFixture: ComponentFixture<SkyAgGridCellEditorDatepickerComponent>;
  let datepickerEditorComponent: SkyAgGridCellEditorDatepickerComponent;
  let datepickerEditorNativeElement: HTMLElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    datepickerEditorFixture = TestBed.createComponent(
      SkyAgGridCellEditorDatepickerComponent
    );
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

      dateCellElement = gridNativeElement.querySelector(
        `.${SkyCellClass.Date}`
      ) as HTMLElement;
    });

    it('renders a skyux datepicker', () => {
      const datepickerEditorSelector = `.sky-ag-grid-cell-editor-datepicker`;
      let datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector
      );

      expect(datepickerEditorElement).toBeNull();

      dateCellElement.click();

      datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector
      );

      expect(datepickerEditorElement).toBeVisible();
    });
  });

  describe('agInit', () => {
    let cellEditorParams: SkyCellEditorDatepickerParams;
    let column: Column;
    const columnWidth = 200;
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
        value: undefined,
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
        stopEditing: undefined,
        eGridCell: undefined,
        parseValue: undefined,
        formatValue: undefined,
      };
    });

    it('initializes the SkyAgGridCellEditorDatepickerComponent properties', fakeAsync(() => {
      const dateString = '01/01/2019';
      const date = new Date(dateString);
      const datepicker = new SkyDatepickerFixture(
        datepickerEditorFixture,
        'cell-datepicker'
      );

      cellEditorParams.value = date;

      expect(datepickerEditorComponent.currentDate).toBeUndefined();

      datepickerEditorComponent.agInit(cellEditorParams);
      datepickerEditorFixture.detectChanges();
      tick();
      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.currentDate).toEqual(date);
      expect(datepicker.date).toEqual(dateString);
    }));

    it('should work with theme change', fakeAsync(() => {
      datepickerEditorComponent.agInit(cellEditorParams);

      const initialColumnWidthWithoutBorders =
        datepickerEditorComponent.columnWidthWithoutBorders;
      const initialRowHeightWithoutBorders =
        datepickerEditorComponent.rowHeightWithoutBorders;

      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings: mockThemeSvc.settingsChange.value.currentSettings,
      });
      expect(
        datepickerEditorComponent.columnWidthWithoutBorders
      ).toBeGreaterThan(initialColumnWidthWithoutBorders);
      expect(datepickerEditorComponent.rowHeightWithoutBorders).toBeGreaterThan(
        initialRowHeightWithoutBorders
      );
    }));
  });

  describe('getValue', () => {
    it('should return currentDate', () => {
      const date = new Date('1/1/2019');

      datepickerEditorComponent.currentDate = date;

      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.getValue()).toEqual(date);
    });
  });

  describe('afterGuiAttached', () => {
    it('focuses on the datepicker input after it attaches to the DOM', () => {
      datepickerEditorComponent.currentDate = new Date('7/12/2019');

      datepickerEditorFixture.detectChanges();

      const input = datepickerEditorNativeElement.querySelector('input');
      spyOn(input, 'focus');

      datepickerEditorComponent.afterGuiAttached();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    });
  });

  it('should pass accessibility', async () => {
    datepickerEditorFixture.detectChanges();
    await datepickerEditorFixture.whenStable();

    await expectAsync(datepickerEditorNativeElement).toBeAccessible();
  });
});

describe('SkyCellEditorDatepickerComponent without theme', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: undefined,
        },
      ],
    });
  });

  describe('in ag grid', () => {
    let gridFixture: ComponentFixture<SkyAgGridFixtureComponent>;
    let gridNativeElement: HTMLElement;
    let dateCellElement: HTMLElement;

    beforeEach(() => {
      gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridNativeElement = gridFixture.nativeElement;

      gridFixture.detectChanges();

      dateCellElement = gridNativeElement.querySelector(
        `.${SkyCellClass.Date}`
      ) as HTMLElement;
    });

    it('renders a skyux datepicker', () => {
      const datepickerEditorSelector = `.sky-ag-grid-cell-editor-datepicker`;
      let datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector
      );

      expect(datepickerEditorElement).toBeNull();

      dateCellElement.click();

      datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector
      );

      expect(datepickerEditorElement).toBeVisible();
    });
  });
});

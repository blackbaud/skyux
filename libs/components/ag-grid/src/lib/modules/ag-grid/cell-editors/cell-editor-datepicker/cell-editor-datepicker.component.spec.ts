import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { expect, expectAsync } from '@skyux-sdk/testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SkyDatepickerFixture } from '@skyux/datetime/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { Column, KeyCode, RowNode } from 'ag-grid-community';
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
    const dateString = '01/01/2019';
    const date = new Date(dateString);
    const rowNode = new RowNode();
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
        value: date,
        column,
        node: rowNode,
        keyPress: undefined,
        charPress: undefined,
        colDef: {},
        columnApi: undefined,
        data: undefined,
        rowIndex: undefined,
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
    });

    it('initializes the SkyAgGridCellEditorDatepickerComponent properties', fakeAsync(() => {
      const datepicker = new SkyDatepickerFixture(
        datepickerEditorFixture,
        'cell-datepicker'
      );
      expect(datepickerEditorComponent.editorForm.get('date').value).toBeNull();

      datepickerEditorComponent.agInit(cellEditorParams);
      datepickerEditorFixture.detectChanges();
      tick();
      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.editorForm.get('date').value).toEqual(
        date
      );
      expect(datepicker.date).toEqual(dateString);
    }));

    it('initializes disabled if the disabled property is passed in', () => {
      const disableSpy = spyOn(
        AbstractControl.prototype,
        'disable'
      ).and.callThrough();

      datepickerEditorComponent.agInit({
        ...cellEditorParams,
        skyComponentProperties: { disabled: true },
      });

      expect(disableSpy).toHaveBeenCalled();
    });

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.BACKSPACE,
        });

        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeUndefined();
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.DELETE,
        });

        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeUndefined();
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.F2,
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          date
        );
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.ENTER,
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          date
        );
      });

      it('initializes with the character pressed when a standard keyboard event triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          charPress: 'a',
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          'a'
        );
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with the current value when Backspace triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.BACKSPACE,
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          date
        );
      });

      it('initializes with the current value when Delete triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.DELETE,
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          date
        );
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.F2,
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          date
        );
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.ENTER,
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          date
        );
      });

      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date').value
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          charPress: 'a',
        });

        expect(datepickerEditorComponent.editorForm.get('date').value).toBe(
          date
        );
      });
    });

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

      datepickerEditorComponent.editorForm.get('date').setValue(date);

      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.getValue()).toEqual(date);
    });
  });

  describe('afterGuiAttached', () => {
    let cellEditorParams: SkyCellEditorDatepickerParams;
    let column: Column;
    const columnWidth = 200;
    const dateString = '01/01/2019';
    const date = new Date(dateString);
    const rowNode = new RowNode();
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
        value: date,
        column,
        node: rowNode,
        keyPress: undefined,
        charPress: undefined,
        colDef: {},
        columnApi: undefined,
        data: undefined,
        rowIndex: undefined,
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
    });

    it('focuses on the datepicker input after it attaches to the DOM', () => {
      datepickerEditorComponent.editorForm
        .get('date')
        .setValue(new Date('7/12/2019'));

      datepickerEditorFixture.detectChanges();

      const input = datepickerEditorNativeElement.querySelector('input');
      spyOn(input, 'focus');

      datepickerEditorComponent.afterGuiAttached();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    });

    describe('cellStartedEdit is true', () => {
      it('does not select the input value if Backspace triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.BACKSPACE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.DELETE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.F2,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('selects the input value if Enter triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.ENTER,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe(dateString);
        expect(selectSpy).toHaveBeenCalledTimes(1);
      });

      it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          charPress: 'a',
        });
        datepickerEditorFixture.detectChanges();
        tick();
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select').and.callThrough();
        const eventDispatchSpy = spyOn(
          input,
          'dispatchEvent'
        ).and.callThrough();

        datepickerEditorComponent.afterGuiAttached();
        datepickerEditorFixture.detectChanges();

        expect(input.value).toBe('a');
        expect(selectSpy).toHaveBeenCalledTimes(1);

        input.dispatchEvent(new Event('blur'));
        datepickerEditorFixture.detectChanges();
        tick();
        // Ensure that we fire the change event on blur
        expect(eventDispatchSpy).toHaveBeenCalledTimes(2);
      }));
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('does not select the input value if Backspace triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.BACKSPACE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.DELETE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.F2,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('selects the input value if Enter triggers the edit', () => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          keyPress: KeyCode.ENTER,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...cellEditorParams,
          charPress: 'a',
        });
        datepickerEditorFixture.detectChanges();
        tick();
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector('input');
        const selectSpy = spyOn(input, 'select').and.callThrough();
        const eventDispatchSpy = spyOn(
          input,
          'dispatchEvent'
        ).and.callThrough();

        datepickerEditorComponent.afterGuiAttached();
        datepickerEditorFixture.detectChanges();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();

        input.dispatchEvent(new Event('blur'));
        datepickerEditorFixture.detectChanges();
        tick();
        // Ensure that we do not fire the change event on blur since we are not doing a replacement
        expect(eventDispatchSpy).toHaveBeenCalledTimes(1);
      }));
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

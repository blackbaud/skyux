import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyDatepickerFixture } from '@skyux/datetime/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import {
  AgColumn,
  BeanCollection,
  GridApi,
  ICellEditorParams,
  KeyCode,
  RowNode,
} from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
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
          SkyThemeMode.presets.light,
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
      SkyAgGridCellEditorDatepickerComponent,
    );
    datepickerEditorNativeElement = datepickerEditorFixture.nativeElement;
    datepickerEditorComponent = datepickerEditorFixture.componentInstance;
  });

  describe('in ag grid', () => {
    let gridFixture: ComponentFixture<SkyAgGridFixtureComponent>;
    let gridNativeElement: HTMLElement;

    beforeEach(() => {
      gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridNativeElement = gridFixture.nativeElement;

      gridFixture.detectChanges();
    });

    it('renders a skyux datepicker', () => {
      const datepickerEditorSelector = `.sky-ag-grid-cell-editor-datepicker`;
      let datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector,
      );

      expect(datepickerEditorElement).toBeNull();

      gridFixture.componentInstance.agGrid?.api.startEditingCell({
        rowIndex: 0,
        colKey: 'date',
      });

      datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector,
      );

      expect(datepickerEditorElement).toBeVisible();
    });

    it('should respond to changes in focus', fakeAsync(() => {
      const api = jasmine.createSpyObj<GridApi>('GridApi', [
        'getDisplayNameForColumn',
        'getGridOption',
        'stopEditing',
      ]);
      api.getGridOption.and.returnValue(true);
      datepickerEditorComponent.agInit({
        ...(datepickerEditorComponent as any).params,
        api,
        column: new AgColumn<any>({}, null, 'col', true),
        node: {
          rowHeight: 37,
        },
      });
      datepickerEditorComponent.onCalendarOpenChange(false);
      tick();
      expect(api.stopEditing).toHaveBeenCalled();

      (api.stopEditing as jasmine.Spy).calls.reset();
      datepickerEditorComponent.onFocusOut({
        target: datepickerEditorComponent.datepickerInput?.nativeElement,
      } as FocusEvent);
      tick();
      expect(api.stopEditing).toHaveBeenCalled();
    }));

    it('should set hint text in the element `title` popover based on the date format', fakeAsync(() => {
      const api = jasmine.createSpyObj<GridApi>('GridApi', [
        'getDisplayNameForColumn',
        'stopEditing',
      ]);
      datepickerEditorComponent.agInit({
        ...(datepickerEditorComponent as any).params,
        api,
        column: new AgColumn<any>({}, null, 'col', true),
        node: {
          rowHeight: 37,
        },
      });
      datepickerEditorComponent.onDateFormatChange('MM/DD/YYYY');

      datepickerEditorFixture.detectChanges();
      tick();

      const input = datepickerEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(input.getAttribute('title')).toBe('Use the format MM/DD/YYYY.');

      datepickerEditorComponent.onDateFormatChange('DD/MM/YYYY');

      datepickerEditorFixture.detectChanges();
      tick();

      expect(input.getAttribute('title')).toBe('Use the format DD/MM/YYYY.');
    }));
  });

  describe('agInit', () => {
    const api = jasmine.createSpyObj<GridApi>('api', [
      'getDisplayNameForColumn',
      'stopEditing',
      'setFocusedCell',
    ]);
    let cellEditorParams: Partial<SkyCellEditorDatepickerParams>;
    let column: AgColumn;
    const rowNode = new RowNode({} as BeanCollection);
    const dateString = '01/01/2019';
    const date = new Date(dateString);
    rowNode.rowHeight = 37;

    beforeEach(() => {
      column = new AgColumn(
        {
          colId: 'col',
        },
        null,
        'col',
        true,
      );

      cellEditorParams = {
        api,
        value: date,
        column,
        node: rowNode,
        colDef: {},
        cellStartedEdit: true,
      };
    });

    it('initializes the SkyAgGridCellEditorDatepickerComponent properties', fakeAsync(() => {
      const datepicker = new SkyDatepickerFixture(
        datepickerEditorFixture,
        'cell-datepicker',
      );
      expect(
        datepickerEditorComponent.editorForm.get('date')?.value,
      ).toBeNull();

      datepickerEditorComponent.agInit(cellEditorParams as ICellEditorParams);
      datepickerEditorFixture.detectChanges();
      tick();
      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.editorForm.get('date')?.value).toEqual(
        date,
      );
      expect(datepicker.date).toEqual(dateString);
    }));

    it('initializes disabled if the disabled property is passed in', () => {
      const disableSpy = spyOn(
        AbstractControl.prototype,
        'disable',
      ).and.callThrough();

      datepickerEditorComponent.agInit({
        ...(cellEditorParams as ICellEditorParams),
        skyComponentProperties: { disabled: true },
      });

      expect(disableSpy).toHaveBeenCalled();
    });

    it('should set the correct aria label', () => {
      api.getDisplayNameForColumn.and.returnValue('Testing');
      datepickerEditorComponent.agInit({
        ...(cellEditorParams as ICellEditorParams),
        rowIndex: 0,
      });
      datepickerEditorFixture.detectChanges();
      const input = datepickerEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      datepickerEditorFixture.detectChanges();

      expect(input.getAttribute('aria-label')).toBe(
        'Editable date Testing for row 1',
      );
    });

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeUndefined();
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeUndefined();
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          date,
        );
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          date,
        );
      });

      it('initializes with the character pressed when a standard keyboard event triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          'a',
        );
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with the current value when Backspace triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          date,
        );
      });

      it('initializes with the current value when Delete triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          date,
        );
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          date,
        );
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          date,
        );
      });

      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(
          datepickerEditorComponent.editorForm.get('date')?.value,
        ).toBeNull();

        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(datepickerEditorComponent.editorForm.get('date')?.value).toBe(
          date,
        );
      });
    });

    it('should work with theme change', fakeAsync(() => {
      spyOn(column, 'getActualWidth').and.returnValue(200);
      spyOn(column, 'fireColumnWidthChangedEvent').and.returnValue();
      datepickerEditorComponent.agInit(cellEditorParams as ICellEditorParams);

      const initialColumnWidthWithoutBorders =
        datepickerEditorComponent.columnWidthWithoutBorders;
      const initialRowHeightWithoutBorders =
        datepickerEditorComponent.rowHeightWithoutBorders;

      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings: mockThemeSvc.settingsChange.value.currentSettings,
      });
      expect(
        datepickerEditorComponent.columnWidthWithoutBorders,
      ).toBeGreaterThan(initialColumnWidthWithoutBorders as number);
      expect(datepickerEditorComponent.rowHeightWithoutBorders).toBeGreaterThan(
        initialRowHeightWithoutBorders as number,
      );
    }));
  });

  describe('getValue', () => {
    it('should return currentDate', () => {
      const date = new Date('1/1/2019');

      datepickerEditorComponent.editorForm.get('date')?.setValue(date);

      datepickerEditorFixture.detectChanges();

      expect(datepickerEditorComponent.getValue()).toEqual(date);
    });
  });

  describe('afterGuiAttached', () => {
    const api = jasmine.createSpyObj<GridApi>('api', [
      'getDisplayNameForColumn',
    ]);
    let cellEditorParams: Partial<SkyCellEditorDatepickerParams>;
    let column: AgColumn;
    let gridCell: HTMLElement;
    const dateString = '01/01/2019';
    const date = new Date(dateString);
    const rowNode = new RowNode({} as BeanCollection);
    rowNode.rowHeight = 37;

    beforeEach(() => {
      column = new AgColumn(
        {
          colId: 'col',
        },
        null,
        'col',
        true,
      );
      gridCell = document.createElement('div');

      cellEditorParams = {
        api,
        value: date,
        column,
        node: rowNode,
        colDef: {},
        cellStartedEdit: true,
        eGridCell: gridCell,
      };
    });

    it('focuses on the datepicker input after it attaches to the DOM', fakeAsync(() => {
      datepickerEditorComponent.editorForm
        .get('date')
        ?.setValue(new Date('7/12/2019'));

      datepickerEditorFixture.detectChanges();

      const input = datepickerEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      spyOn(input, 'focus');

      datepickerEditorComponent.afterGuiAttached();
      tick();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    }));

    it('should respond to reset focus', fakeAsync(() => {
      datepickerEditorComponent.agInit(
        cellEditorParams as SkyCellEditorDatepickerParams,
      );
      datepickerEditorFixture.detectChanges();
      const input = datepickerEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      spyOn(input, 'focus');
      datepickerEditorComponent.onFocusOut({
        relatedTarget: gridCell,
      } as unknown as FocusEvent);
      tick();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    }));

    describe('cellStartedEdit is true', () => {
      it('does not select the input value if Backspace triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('does not select the input value if Delete triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('does not select the input value if F2 triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('selects the input value if Enter triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe(dateString);
        expect(selectSpy).toHaveBeenCalledTimes(1);
      }));

      it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });
        datepickerEditorFixture.detectChanges();
        tick();
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();
        const eventDispatchSpy = spyOn(
          input,
          'dispatchEvent',
        ).and.callThrough();

        datepickerEditorComponent.afterGuiAttached();
        tick();
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

      it('does not select the input value if Backspace triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('does not select the input value if Delete triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('does not select the input value if F2 triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('selects the input value if Enter triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        datepickerEditorComponent.afterGuiAttached();
        tick();

        expect(input.value).toBe(dateString);
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
        datepickerEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });
        datepickerEditorFixture.detectChanges();
        tick();
        datepickerEditorFixture.detectChanges();
        const input = datepickerEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();
        const eventDispatchSpy = spyOn(
          input,
          'dispatchEvent',
        ).and.callThrough();

        datepickerEditorComponent.afterGuiAttached();
        tick();
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

    beforeEach(() => {
      gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
      gridNativeElement = gridFixture.nativeElement;

      gridFixture.detectChanges();
    });

    it('renders a skyux datepicker', () => {
      const datepickerEditorSelector = `.sky-ag-grid-cell-editor-datepicker`;
      let datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector,
      );

      expect(datepickerEditorElement).toBeNull();

      gridFixture.componentInstance.agGrid?.api.startEditingCell({
        rowIndex: 0,
        colKey: 'date',
      });

      datepickerEditorElement = gridNativeElement.querySelector(
        datepickerEditorSelector,
      );

      expect(datepickerEditorElement).toBeVisible();
    });
  });
});

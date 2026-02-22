import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { expect, expectAsync } from '@skyux-sdk/testing';

import {
  AgColumn,
  BeanCollection,
  GridApi,
  ICellEditorParams,
  KeyCode,
  RowNode,
} from 'ag-grid-community';

import {
  MinimalColumnDefs,
  MinimalRowData,
  SkyAgGridMinimalFixtureComponent,
} from '../../fixtures/ag-grid-minimal.component.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellEditorNumberParams } from '../../types/cell-editor-number-params';
import { SkyCellType } from '../../types/cell-type';
import { SkyAgGridCellEditorNumberComponent } from '../cell-editor-number/cell-editor-number.component';

describe('SkyCellEditorNumberComponent', () => {
  let numberEditorFixture: ComponentFixture<SkyAgGridCellEditorNumberComponent>;
  let numberEditorComponent: SkyAgGridCellEditorNumberComponent;
  let numberEditorNativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridMinimalFixtureComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: MinimalColumnDefs,
          useValue: [
            {
              field: 'value',
              editable: true,
              type: SkyCellType.Number,
            },
          ],
        },
        {
          provide: MinimalRowData,
          useValue: [{ value: 15 }],
        },
      ],
    });

    numberEditorFixture = TestBed.createComponent(
      SkyAgGridCellEditorNumberComponent,
    );
    numberEditorNativeElement = numberEditorFixture.nativeElement;
    numberEditorComponent = numberEditorFixture.componentInstance;
  });

  it('renders a numeric input when editing a number cell in an ag grid', () => {
    const gridFixture = TestBed.createComponent(
      SkyAgGridMinimalFixtureComponent,
    );
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const numberCellEditorSelector = `.ag-cell-inline-editing.${SkyCellClass.Number}`;
    let inputElement = gridNativeElement.querySelector(
      numberCellEditorSelector,
    );

    expect(inputElement).toBeNull();

    gridFixture.componentInstance.agGrid?.api.startEditingCell({
      rowIndex: 0,
      colKey: 'value',
    });

    inputElement = gridNativeElement.querySelector(numberCellEditorSelector);

    expect(inputElement).toBeVisible();
  });

  describe('agInit', () => {
    const api = jasmine.createSpyObj<GridApi>('api', [
      'getDisplayNameForColumn',
    ]);
    let cellEditorParams: Partial<SkyCellEditorNumberParams>;
    let column: AgColumn;
    const rowNode = new RowNode({} as BeanCollection);
    rowNode.rowHeight = 37;
    const value = 15;

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
        value: value,
        column,
        node: rowNode,
        colDef: {},
        cellStartedEdit: true,
        skyComponentProperties: {
          min: 0,
          max: 50,
        },
      };
    });

    it('initializes the SkyuxNumericCellEditorComponent properties', () => {
      expect(numberEditorComponent.editorForm.get('number')?.value).toBeNull();
      expect(numberEditorComponent.columnWidth).toBeUndefined();

      numberEditorComponent.refresh(cellEditorParams as ICellEditorParams);

      expect(numberEditorComponent.editorForm.get('number')?.value).toEqual(
        value,
      );
    });

    it('should set the correct aria label', () => {
      api.getDisplayNameForColumn.and.returnValue('Testing');
      numberEditorComponent.agInit({
        ...(cellEditorParams as ICellEditorParams),
        rowIndex: 0,
      });
      numberEditorFixture.detectChanges();
      const input = numberEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      numberEditorFixture.detectChanges();

      expect(input.getAttribute('aria-label')).toBe(
        'Editable number Testing for row 1',
      );
    });

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeUndefined();
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeUndefined();
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });

      it('initializes with the character pressed when a standard keyboard event triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: '4',
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(4);
      });

      it('initializes with undefined when a non-numeric keyboard event triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeUndefined();
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with the current value when Backspace triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });

      it('initializes with the current value when Delete triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });

      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: '4',
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });

      it('initializes with the current value when a non-numeric keyboard event triggers the edit', () => {
        expect(
          numberEditorComponent.editorForm.get('number')?.value,
        ).toBeNull();

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(numberEditorComponent.editorForm.get('number')?.value).toBe(
          value,
        );
      });
    });
  });

  describe('getValue', () => {
    it('returns the value if it is set', () => {
      const value = 7;
      numberEditorComponent.editorForm.get('number')?.setValue(value);

      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.getValue()).toBe(value);
    });

    it('returns the value if it is 0', () => {
      const value = 0;
      numberEditorComponent.editorForm.get('number')?.setValue(value);

      numberEditorFixture.detectChanges();

      expect(numberEditorComponent.getValue()).toBe(value);
    });

    describe('afterGuiAttached', () => {
      let cellEditorParams: Partial<SkyCellEditorNumberParams>;
      let column: AgColumn;
      let gridCell: HTMLDivElement;
      const rowNode = new RowNode({} as BeanCollection);
      rowNode.rowHeight = 37;
      const value = 15;

      beforeEach(() => {
        column = new AgColumn(
          {
            colId: 'col',
          },
          null,
          'col',
          true,
        );

        const gridApi = {} as GridApi;

        gridApi.getDisplayNameForColumn = (): string => {
          return '';
        };

        gridCell = document.createElement('div');

        cellEditorParams = {
          api: gridApi,
          value: value,
          column,
          eGridCell: gridCell,
          node: rowNode,
          colDef: {},
          cellStartedEdit: true,
          skyComponentProperties: {
            min: 0,
            max: 50,
          },
        };
      });

      it('focuses on the input after it attaches to the DOM', fakeAsync(() => {
        numberEditorFixture.detectChanges();

        const input = numberEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        spyOn(input, 'focus');

        numberEditorComponent.afterGuiAttached();
        tick();

        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
      }));

      it('should respond to refocus', fakeAsync(() => {
        numberEditorComponent.agInit(cellEditorParams as ICellEditorParams);
        numberEditorFixture.detectChanges();

        const input = numberEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        spyOn(input, 'focus');

        numberEditorComponent.afterGuiAttached();
        tick();

        numberEditorComponent.onFocusOut({
          relatedTarget: gridCell,
        } as unknown as FocusEvent);
        tick();
        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
      }));

      it('should call stopEditing when focusout from input and stopEditingWhenCellsLoseFocus is true', fakeAsync(() => {
        const api = jasmine.createSpyObj<GridApi>([
          'getDisplayNameForColumn',
          'stopEditing',
          'getGridOption',
        ]);
        api.getDisplayNameForColumn.and.returnValue('');
        api.getGridOption.and.returnValue(true);

        numberEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          api,
        });
        numberEditorFixture.detectChanges();

        const input = numberEditorFixture.nativeElement.querySelector(
          'input',
        ) as HTMLInputElement;

        numberEditorComponent.onFocusOut({
          target: input,
          relatedTarget: null,
        } as unknown as FocusEvent);
        tick();

        expect(api.getGridOption).toHaveBeenCalledWith(
          'stopEditingWhenCellsLoseFocus',
        );
        expect(api.stopEditing).toHaveBeenCalled();
      }));

      describe('cellStartedEdit is true', () => {
        it('does not select the input value if Backspace triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.BACKSPACE,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('');
          expect(selectSpy).not.toHaveBeenCalled();
        });

        it('does not select the input value if Delete triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.DELETE,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('');
          expect(selectSpy).not.toHaveBeenCalled();
        });

        it('does not select the input value if F2 triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.F2,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('15');
          expect(selectSpy).not.toHaveBeenCalled();
        });

        it('selects the input value if Enter triggers the edit', fakeAsync(() => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.ENTER,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe('15');
          expect(selectSpy).toHaveBeenCalled();
        }));

        it('does not select the input value when a standard keyboard event triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: '4',
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('4');
          expect(selectSpy).not.toHaveBeenCalled();
        });
      });

      describe('cellStartedEdit is true', () => {
        beforeEach(() => {
          cellEditorParams.cellStartedEdit = false;
        });

        it('does not select the input value if Backspace triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.BACKSPACE,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('15');
          expect(selectSpy).not.toHaveBeenCalled();
        });

        it('does not select the input value if Delete triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.DELETE,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('15');
          expect(selectSpy).not.toHaveBeenCalled();
        });

        it('does not select the input value if F2 triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.F2,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('15');
          expect(selectSpy).not.toHaveBeenCalled();
        });

        it('does not select the input value if Enter triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.ENTER,
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('15');
          expect(selectSpy).not.toHaveBeenCalled();
        });

        it('does not select the input value when a standard keyboard event triggers the edit', () => {
          numberEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: '4',
          });
          numberEditorFixture.detectChanges();
          const input = numberEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          numberEditorComponent.afterGuiAttached();

          expect(input.value).toBe('15');
          expect(selectSpy).not.toHaveBeenCalled();
        });
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

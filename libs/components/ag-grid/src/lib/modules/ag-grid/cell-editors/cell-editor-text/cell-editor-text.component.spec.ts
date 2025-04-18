import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import {
  AgColumn,
  BeanCollection,
  GridApi,
  ICellEditorParams,
  KeyCode,
  RowNode,
} from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellEditorTextParams } from '../../types/cell-editor-text-params';

import { SkyAgGridCellEditorTextComponent } from './cell-editor-text.component';

describe('SkyCellEditorTextComponent', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  let textEditorFixture: ComponentFixture<SkyAgGridCellEditorTextComponent>;
  let textEditorComponent: SkyAgGridCellEditorTextComponent;
  let textEditorNativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    textEditorFixture = TestBed.createComponent(
      SkyAgGridCellEditorTextComponent,
    );
    textEditorNativeElement = textEditorFixture.nativeElement;
    textEditorComponent = textEditorFixture.componentInstance;
  });

  it('renders a text input when editing a text cell in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const textCellElement = gridNativeElement.querySelector(
      `.${SkyCellClass.Text}`,
    );
    const textCellEditorSelector = `.ag-cell-inline-editing.${SkyCellClass.Text}`;
    let inputElement = gridNativeElement.querySelector(textCellEditorSelector);

    expect(inputElement).toBeNull();

    textCellElement.click();

    inputElement = gridNativeElement.querySelector(textCellEditorSelector);

    expect(inputElement).toBeVisible();
  });

  describe('agInit', () => {
    const api = jasmine.createSpyObj<GridApi>('api', [
      'getDisplayNameForColumn',
    ]);
    let cellEditorParams: Partial<SkyCellEditorTextParams>;
    let column: AgColumn;
    let gridCell: HTMLDivElement;
    const rowNode = new RowNode({} as BeanCollection);
    rowNode.rowHeight = 37;
    const value = 'testing';

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
        value: value,
        column,
        eGridCell: gridCell,
        node: rowNode,
        colDef: {},
        cellStartedEdit: true,
        skyComponentProperties: {
          maxlength: 50,
        },
      };
    });

    it('initializes the SkyCellEditorTextComponent properties', () => {
      expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

      textEditorComponent.agInit(cellEditorParams as ICellEditorParams);

      expect(textEditorComponent.editorForm.get('text')?.value).toEqual(value);
    });

    it('should set the correct aria label', () => {
      api.getDisplayNameForColumn.and.returnValue('Testing');
      textEditorComponent.agInit({
        ...(cellEditorParams as ICellEditorParams),
        rowIndex: 0,
      });
      textEditorFixture.detectChanges();
      const input = textEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      textEditorFixture.detectChanges();

      expect(input.getAttribute('aria-label')).toBe(
        'Editable text Testing for row 1',
      );
    });

    it('should respond to refocus', fakeAsync(() => {
      textEditorComponent.agInit(cellEditorParams as ICellEditorParams);
      textEditorFixture.detectChanges();

      const input = textEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      spyOn(input, 'focus');

      textEditorComponent.afterGuiAttached();
      tick();

      textEditorComponent.onFocusOut({
        relatedTarget: gridCell,
      } as unknown as FocusEvent);
      tick();
      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    }));

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(
          textEditorComponent.editorForm.get('text')?.value,
        ).toBeUndefined();
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(
          textEditorComponent.editorForm.get('text')?.value,
        ).toBeUndefined();
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe(
          'testing',
        );
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe(
          'testing',
        );
      });

      it('initializes with the character pressed when a standard keyboard event triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe('a');
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with current value when Backspace triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe(value);
      });

      it('initializes current value when Delete triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe(value);
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe(value);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe(value);
      });

      it('initializes with current value when a standard keyboard event triggers the edit', () => {
        expect(textEditorComponent.editorForm.get('text')?.value).toBeNull();

        textEditorComponent.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(textEditorComponent.editorForm.get('text')?.value).toBe(value);
      });
    });
  });

  describe('getValue', () => {
    it('returns the value if it is set', () => {
      const value = 'cat';
      textEditorComponent.editorForm.get('text')?.setValue(value);

      textEditorFixture.detectChanges();

      expect(textEditorComponent.getValue()).toBe(value);
    });

    describe('afterGuiAttached', () => {
      let cellEditorParams: Partial<SkyCellEditorTextParams>;
      let column: AgColumn;
      const rowNode = new RowNode({} as BeanCollection);
      rowNode.rowHeight = 37;
      const value = 'testing';

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

        cellEditorParams = {
          api: gridApi,
          value: value,
          column,
          node: rowNode,
          colDef: {},
          cellStartedEdit: true,
          skyComponentProperties: {
            maxlength: 50,
          },
        };
      });

      it('focuses on the input after it attaches to the DOM', fakeAsync(() => {
        textEditorFixture.detectChanges();

        const input = textEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        spyOn(input, 'focus');

        textEditorComponent.afterGuiAttached();
        tick();

        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
      }));

      describe('cellStartedEdit is true', () => {
        it('does not select the input value if Backspace triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.BACKSPACE,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe('');
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('does not select the input value if Delete triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.DELETE,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe('');
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('does not select the input value if F2 triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.F2,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('selects the input value if Enter triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.ENTER,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe(value);
          expect(selectSpy).toHaveBeenCalled();
        }));

        it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: 'a',
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe('a');
          expect(selectSpy).not.toHaveBeenCalled();
        }));
      });

      describe('cellStartedEdit is false', () => {
        beforeEach(() => {
          cellEditorParams.cellStartedEdit = false;
        });

        it('does not select the input value if Backspace triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.BACKSPACE,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('does not select the input value if Delete triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.DELETE,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('does not select the input value if F2 triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.F2,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('should not select the input value if Enter triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.ENTER,
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
          textEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: 'a',
          });
          textEditorFixture.detectChanges();
          const input = textEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');

          textEditorComponent.afterGuiAttached();
          tick();

          expect(input.value).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));
      });
    });

    it('returns undefined if the value is not set', () => {
      expect(textEditorComponent.getValue()).toBeUndefined();
    });
  });

  it('should pass accessibility', async () => {
    textEditorFixture.detectChanges();
    await textEditorFixture.whenStable();

    await expectAsync(textEditorFixture.nativeElement).toBeAccessible();
  });
});

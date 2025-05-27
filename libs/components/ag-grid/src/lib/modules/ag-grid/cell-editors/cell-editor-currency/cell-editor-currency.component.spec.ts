import type { ComponentFixture } from '@angular/core/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import type {
  BeanCollection,
  GridApi,
  ICellEditorParams,
} from 'ag-grid-community';
import { AgColumn, KeyCode, RowNode } from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
import type { SkyCellEditorCurrencyParams } from '../../types/cell-editor-currency-params';

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
      SkyAgGridCellEditorCurrencyComponent,
    );
    currencyEditorNativeElement = currencyEditorFixture.nativeElement;
    currencyEditorComponent = currencyEditorFixture.componentInstance;
  });

  it('renders a numeric input when editing a currency cell in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const currencyCellElement = gridNativeElement.querySelector(
      `.${SkyCellClass.Currency}`,
    );

    expect(currencyCellElement).toBeVisible();
  });

  describe('agInit', () => {
    let api: jasmine.SpyObj<GridApi>;
    let cellEditorParams: Partial<SkyCellEditorCurrencyParams>;
    let column: AgColumn;
    const columnWidth = 200;
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

      api = jasmine.createSpyObj<GridApi>('api', [
        'getDisplayNameForColumn',
        'stopEditing',
        'setFocusedCell',
      ]);

      cellEditorParams = {
        value: value,
        column,
        node: rowNode,
        colDef: {},
        api,
        cellStartedEdit: true,
        stopEditing: jasmine.createSpy('cellEditorParams.stopEditing'),
      };
    });

    it('initializes the SkyAgGridCellEditorCurrencyComponent properties', fakeAsync(() => {
      expect(currencyEditorComponent.columnWidth).toBeUndefined();

      cellEditorParams.node = new RowNode({} as BeanCollection);
      cellEditorParams.node.rowHeight = 100;

      spyOn(column, 'getActualWidth').and.returnValue(columnWidth);
      spyOn(column, 'fireColumnWidthChangedEvent').and.returnValue();
      currencyEditorComponent.refresh({
        ...cellEditorParams,
        value: null,
      } as ICellEditorParams);

      expect(currencyEditorComponent.columnWidth).toEqual(columnWidth);
      expect(currencyEditorComponent.rowHeightWithoutBorders).toEqual(96);

      currencyEditorComponent.onPressEscape();
      expect(api.stopEditing).toHaveBeenCalled();
      expect(api.setFocusedCell).toHaveBeenCalled();

      currencyEditorComponent.onPressEnter();
      currencyEditorComponent.afterGuiAttached();
      tick();
      expect(cellEditorParams.stopEditing).not.toHaveBeenCalled();
      currencyEditorComponent.onPressEnter();
      expect(cellEditorParams.stopEditing).toHaveBeenCalled();
    }));

    it('should set the correct aria label', () => {
      api.getDisplayNameForColumn.and.returnValue('Testing');
      currencyEditorComponent.agInit({
        ...(cellEditorParams as ICellEditorParams),
        rowIndex: 0,
      });
      currencyEditorFixture.detectChanges();
      const input = currencyEditorNativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      currencyEditorFixture.detectChanges();

      expect(input.getAttribute('aria-label')).toBe(
        'Editable currency Testing for row 1',
      );
    });
  });

  describe('getValue', () => {
    it('returns the value if it is set', () => {
      const value = 7;
      currencyEditorComponent.editorForm.get('currency')?.setValue(value);

      currencyEditorFixture.detectChanges();

      expect(currencyEditorComponent.getValue()).toBe(value);
    });

    it('returns the value if it is 0', () => {
      const value = 0;
      currencyEditorComponent.editorForm.get('currency')?.setValue(value);

      currencyEditorFixture.detectChanges();

      expect(currencyEditorComponent.getValue()).toBe(value);
    });

    describe('afterGuiAttached', () => {
      let cellEditorParams: Partial<SkyCellEditorCurrencyParams>;
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

        const api = jasmine.createSpyObj<GridApi>([
          'getDisplayNameForColumn',
          'stopEditing',
        ]);

        api.getDisplayNameForColumn.and.returnValue('');
        gridCell = document.createElement('div');

        cellEditorParams = {
          api,
          value: value,
          column,
          eGridCell: gridCell,
          node: rowNode,
          colDef: {},
          cellStartedEdit: true,
        };
      });

      it('sets the form control value correctly', fakeAsync(() => {
        expect(
          currencyEditorComponent.editorForm.get('currency')?.value,
        ).toBeNull();

        currencyEditorComponent.agInit(cellEditorParams as ICellEditorParams);
        currencyEditorFixture.detectChanges();
        currencyEditorComponent.afterGuiAttached();
        tick();

        expect(
          currencyEditorComponent.editorForm.get('currency')?.value,
        ).toEqual(value);
      }));

      describe('cellStartedEdit is true', () => {
        it('initializes with a cleared value unselected when Backspace triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.BACKSPACE,
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeUndefined();
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with a cleared value unselected when Delete triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.DELETE,
          });
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeUndefined();
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with the current value unselected when F2 triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.F2,
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with the current value selected when Enter triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.ENTER,
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).toHaveBeenCalled();
        }));

        it('initializes with the character pressed unselected when a standard keyboard event triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: '4',
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(4);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with undefined when a non-numeric keyboard event triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: 'a',
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeUndefined();
          expect(selectSpy).not.toHaveBeenCalled();
        }));
      });

      describe('cellStartedEdit is false', () => {
        beforeEach(() => {
          cellEditorParams.cellStartedEdit = false;
        });

        it('initializes with the current value unselected when Backspace triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.BACKSPACE,
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with the current value unselected when Delete triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.DELETE,
          });
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with the current value unselected when F2 triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.F2,
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with the current value unselected when Enter triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: KeyCode.ENTER,
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with the current value unselected when a standard keyboard event triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: '4',
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));

        it('initializes with the current value unselected when a non-numeric keyboard event triggers the edit', fakeAsync(() => {
          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBeNull();

          currencyEditorComponent.agInit({
            ...(cellEditorParams as ICellEditorParams),
            eventKey: 'a',
          });
          currencyEditorFixture.detectChanges();
          const input = currencyEditorNativeElement.querySelector(
            'input',
          ) as HTMLInputElement;
          const selectSpy = spyOn(input, 'select');
          currencyEditorComponent.afterGuiAttached();
          tick(100);
          currencyEditorFixture.detectChanges();

          expect(
            currencyEditorComponent.editorForm.get('currency')?.value,
          ).toBe(value);
          expect(selectSpy).not.toHaveBeenCalled();
        }));
      });

      it('focuses on the input after it attaches to the DOM', fakeAsync(() => {
        currencyEditorComponent.agInit(cellEditorParams as ICellEditorParams);
        currencyEditorFixture.detectChanges();

        const input = currencyEditorNativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        spyOn(input, 'focus');

        currencyEditorComponent.afterGuiAttached();
        tick();

        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
      }));

      it('should respond to refocus', fakeAsync(() => {
        currencyEditorComponent.agInit(cellEditorParams as ICellEditorParams);
        currencyEditorFixture.detectChanges();

        const input = currencyEditorFixture.nativeElement.querySelector(
          'input',
        ) as HTMLInputElement;
        spyOn(input, 'focus');

        currencyEditorComponent.onFocusOut({
          relatedTarget: gridCell,
        } as unknown as FocusEvent);
        tick();
        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
        expect(cellEditorParams.api?.stopEditing).not.toHaveBeenCalled();
      }));
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

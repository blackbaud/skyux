import { ElementRef } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import { SkyLookupSelectModeType } from '@skyux/lookup';

import {
  AgColumn,
  GridApi,
  GridOptions,
  ICellEditorParams,
  KeyCode,
} from 'ag-grid-community';
import { of } from 'rxjs';

import { SkyCellEditorLookupParams } from '../../types/cell-editor-lookup-params';

import { SkyAgGridCellEditorLookupComponent } from './cell-editor-lookup.component';

describe('SkyAgGridCellEditorLookupComponent', () => {
  let api: jasmine.SpyObj<GridApi>;
  let component: SkyAgGridCellEditorLookupComponent;
  const data = [
    { id: '1', name: 'John Doe', town: 'Daniel Island' },
    { id: '2', name: 'Jane Doe', town: 'Daniel Island' },
    { id: '3', name: 'John Smith', town: 'West Ashley' },
    { id: '4', name: 'Jane Smith', town: 'Mt Pleasant' }];
  let fixture: ComponentFixture<SkyAgGridCellEditorLookupComponent>;
  let gridCell: HTMLDivElement;
  let nativeElement: HTMLElement;
  let callback: ((args: Record<string, unknown>) => void) | undefined;
  const selection = [data[0]];
  let cellEditorParams: Partial<SkyCellEditorLookupParams>;
  let elementRef: ElementRef<HTMLElement>;

  beforeEach(() => {
    elementRef = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['matches']),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ElementRef,
          useValue: elementRef,
        }],
    });

    api = jasmine.createSpyObj('GridApi', [
      'addEventListener',
      'getGridOption',
      'stopEditing']);
    api.addEventListener.and.callFake(
      (_event: string, listener: (params: any) => void) => {
        callback = listener;
      },
    );
    api.getGridOption.and.returnValue(true);
    gridCell = document.createElement('div');

    cellEditorParams = {
      api,
      cellStartedEdit: true,
      colDef: {
        headerName: 'header',
      },
      column: {
        getColId: () => 'colId',
        getActualWidth: () => 123,
      } as AgColumn,
      context: {
        gridOptions: {} as Partial<GridOptions>,
      },
      data: undefined,
      eGridCell: gridCell,
      formatValue: jasmine.createSpy('formatValue'),
      onKeyDown: jasmine.createSpy('onKeyDown'),
      parseValue: jasmine.createSpy('parseValue'),
      rowIndex: 0,
      skyComponentProperties: {
        data: [],
        selectMode: 'single' as SkyLookupSelectModeType,
        addClick: jasmine.createSpy('addClick'),
        showAddButton: true,
      },
      stopEditing: jasmine.createSpy('stopEditing'),
      value: selection,
    };
    callback = undefined;
    fixture = TestBed.createComponent(SkyAgGridCellEditorLookupComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.getGui()).toBeTruthy();
    expect(component.getValue()).toEqual([]);
    expect(component.getValue()).toBeTruthy();
    expect(component.isPopup()).toBeTrue();
    expect(component.isCancelAfterEnd()).toBeFalse();
  });

  describe('agInit', () => {
    it('should initialize with empty value', () => {
      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
        value: [],
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with value', () => {
      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with different label sources', () => {
      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();

      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
        colDef: {},
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();

      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
        colDef: {},
        skyComponentProperties: {
          ...cellEditorParams.skyComponentProperties,
          ariaLabel: 'label',
        },
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();

      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
        colDef: {},
        skyComponentProperties: {
          ...cellEditorParams.skyComponentProperties,
          ariaLabelledBy: 'label-id',
        },
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with disabled control', () => {
      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
        skyComponentProperties: {
          ...cellEditorParams.skyComponentProperties,
          disabled: true,
        },
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should throw error with invalid value', () => {
      expect(() =>
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          value: false,
        }),
      ).toThrowError('Lookup value must be an array');
    });

    it('should maintain column width', () => {
      let width = 123;
      const column = {
        ...cellEditorParams.column,
        getActualWidth: (): number => width,
      } as AgColumn;
      component.agInit({ ...(cellEditorParams as ICellEditorParams) });
      fixture.detectChanges();
      expect(component.width).toBe(123);
      expect(callback).toBeTruthy();
      if (callback) {
        width = 456;
        callback({
          column,
        });
      }
      expect(component.width).toBe(456);
    });

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(component.editorForm.get('selection')?.value).toEqual([]);
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(component.editorForm.get('selection')?.value).toEqual([]);
      });

      it('initializes with the current value when F2 triggers the edit', async () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
          skyComponentProperties: {
            ...cellEditorParams.skyComponentProperties,
            searchAsync: () => of(data),
          },
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);

        fixture.detectChanges();
        await fixture.whenStable();
        const lookup = fixture.nativeElement.querySelector('.sky-lookup');
        expect(lookup).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(
          lookup.querySelector('.sky-lookup-input'),
          'focus',
        );
        const addButton = fixture.nativeElement.ownerDocument.querySelector(
          '.sky-overlay.ag-custom-component-popup button.sky-autocomplete-action-add',
        );
        expect(addButton).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(addButton, 'click');
        expect(component.skyComponentProperties?.addClick).toHaveBeenCalled();
      });

      it('initializes with the current value when Enter triggers the edit', async () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);

        fixture.detectChanges();
        await fixture.whenStable();
        const lookup = fixture.nativeElement.querySelector('.sky-lookup');
        expect(lookup).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(
          lookup.querySelector('.sky-lookup-input'),
          'focus',
        );
        const addButton = fixture.nativeElement.ownerDocument.querySelector(
          '.sky-overlay.ag-custom-component-popup button.sky-autocomplete-action-add',
        );
        expect(addButton).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(addButton, 'click');
        expect(component.skyComponentProperties?.addClick).toHaveBeenCalled();
      });

      // NOTE: This is different from other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);
      });

      it('should respond to focus changes', fakeAsync(() => {
        (elementRef.nativeElement.matches as jasmine.Spy).and.returnValue(
          false,
        );
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
        });

        component.onLookupOpenChange(false);
        tick();
        expect(cellEditorParams.api?.stopEditing).toHaveBeenCalledTimes(1);

        (cellEditorParams.api?.stopEditing as jasmine.Spy).calls.reset();
        component.onBlur({} as FocusEvent);
        tick();
        expect(cellEditorParams.api?.getGridOption).toHaveBeenCalledTimes(2);
        expect(
          (cellEditorParams.api?.getGridOption as jasmine.Spy).calls
            .all()
            .map((call) => call.args[0]),
        ).toEqual([
          'stopEditingWhenCellsLoseFocus',
          'stopEditingWhenCellsLoseFocus']);
        expect(cellEditorParams.api?.stopEditing).toHaveBeenCalledTimes(1);
      }));

      it('should respond to selection modal', fakeAsync(() => {
        (elementRef.nativeElement.matches as jasmine.Spy).and.returnValue(
          false,
        );
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
        });

        component.onSelectionModalOpenChange(false);
        tick();
        expect(cellEditorParams.api?.stopEditing).toHaveBeenCalledTimes(1);

        (cellEditorParams.api?.stopEditing as jasmine.Spy).calls.reset();
        component.onBlur({} as FocusEvent);
        tick();
        expect(cellEditorParams.api?.getGridOption).toHaveBeenCalledTimes(2);
        expect(
          (cellEditorParams.api?.getGridOption as jasmine.Spy).calls
            .all()
            .map((call) => call.args[0]),
        ).toEqual([
          'stopEditingWhenCellsLoseFocus',
          'stopEditingWhenCellsLoseFocus']);
        expect(cellEditorParams.api?.stopEditing).toHaveBeenCalledTimes(1);
      }));

      it('should respond to refocus', fakeAsync(() => {
        component.agInit(cellEditorParams as ICellEditorParams);
        fixture.detectChanges();

        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        spyOn(input, 'focus');

        component.afterGuiAttached();
        tick();

        component.onBlur({
          relatedTarget: gridCell,
        } as unknown as FocusEvent);
        tick();
        expect(input).toBeVisible();
        expect(input.focus).toHaveBeenCalled();
        expect(cellEditorParams.api?.stopEditing).not.toHaveBeenCalled();
      }));

      it('should not respond to a tertiary popup', fakeAsync(() => {
        component.agInit(cellEditorParams as ICellEditorParams);
        fixture.detectChanges();

        component.afterGuiAttached();
        tick();

        const matches = jasmine.createSpy('matches').and.returnValue(true);
        component.onBlur({
          relatedTarget: null,
          target: { matches },
        } as unknown as FocusEvent);
        tick();
        expect(cellEditorParams.api?.stopEditing).not.toHaveBeenCalled();
        expect(matches).toHaveBeenCalledWith('.ag-custom-component-popup *');
      }));
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with the current value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);
      });

      it('initializes with the current value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(component.editorForm.get('selection')?.value).toEqual(selection);
      });
    });
  });

  describe('afterGuiAttached', () => {
    describe('cellStartedEdit is true', () => {
      it('does not select the input value if F2 triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        tick();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).toHaveBeenCalledTimes(1);
        expect(window.getSelection()?.toString()).toBe('');
      }));

      it('selects the input value if Enter triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        tick();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).toHaveBeenCalledTimes(1);
        expect(window.getSelection()?.toString()).toBe(selection[0].name);
      }));

      it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        tick();
        fixture.detectChanges();

        expect(input.value).toBe('a');
        expect(selectSpy).toHaveBeenCalledTimes(1);
        expect(window.getSelection()?.toString()).toBe('');
      }));
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('does not select the input value if Backspace triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });
        fixture.detectChanges();

        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Enter triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea',
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        fixture.detectChanges();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });
    });
  });
});

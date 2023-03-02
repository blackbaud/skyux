import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule, SkyLookupSelectModeType } from '@skyux/lookup';

import { Column, ICellEditorParams, KeyCode } from 'ag-grid-community';
import { of } from 'rxjs';

import { SkyCellEditorLookupParams } from '../../types/cell-editor-lookup-params';

import { SkyAgGridCellEditorLookupComponent } from './cell-editor-lookup.component';

describe('SkyAgGridCellEditorLookupComponent', () => {
  let component: SkyAgGridCellEditorLookupComponent;
  const data = [
    { id: '1', name: 'John Doe', town: 'Daniel Island' },
    { id: '2', name: 'Jane Doe', town: 'Daniel Island' },
    { id: '3', name: 'John Smith', town: 'West Ashley' },
    { id: '4', name: 'Jane Smith', town: 'Mt Pleasant' },
  ];
  let fixture: ComponentFixture<SkyAgGridCellEditorLookupComponent>;
  let nativeElement: HTMLElement;
  let callback: ((args: Record<string, unknown>) => void) | undefined;
  const selection = [data[0]];
  let cellEditorParams: Partial<SkyCellEditorLookupParams>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyAgGridCellEditorLookupComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        SkyInputBoxModule,
        SkyLookupModule,
      ],
    });

    cellEditorParams = {
      cellStartedEdit: true,
      colDef: {
        headerName: 'header',
      },
      column: {
        getActualWidth: () => 123,
        addEventListener: (
          event: string,
          listener: (args: Record<string, unknown>) => void
        ) => {
          callback = listener;
          [event].pop();
        },
      } as Column,
      context: undefined,
      data: undefined,
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
        })
      ).toThrowError('Lookup value must be an array');
    });

    it('should maintain column width', () => {
      component.agInit({ ...(cellEditorParams as ICellEditorParams) });
      fixture.detectChanges();
      expect(component.width).toBe(123);
      expect(callback).toBeTruthy();
      if (callback) {
        callback({
          column: {
            getActualWidth: () => 456,
          } as Column,
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

        expect(component.editorForm.get('selection')?.value).toBe(selection);

        fixture.detectChanges();
        await fixture.whenStable();
        const lookup = fixture.nativeElement.querySelector('.sky-lookup');
        expect(lookup).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(
          lookup.querySelector('.sky-lookup-input'),
          'focus'
        );
        const addButton = fixture.nativeElement.ownerDocument.querySelector(
          '.sky-overlay.ag-custom-component-popup button.sky-autocomplete-action-add'
        );
        expect(addButton).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(addButton, 'mousedown');
        expect(component.skyComponentProperties?.addClick).toHaveBeenCalled();
      });

      it('initializes with the current value when Enter triggers the edit', async () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);

        fixture.detectChanges();
        await fixture.whenStable();
        const lookup = fixture.nativeElement.querySelector('.sky-lookup');
        expect(lookup).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(
          lookup.querySelector('.sky-lookup-input'),
          'focus'
        );
        const addButton = fixture.nativeElement.ownerDocument.querySelector(
          '.sky-overlay.ag-custom-component-popup button.sky-autocomplete-action-add'
        );
        expect(addButton).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(addButton, 'mousedown');
        expect(component.skyComponentProperties?.addClick).toHaveBeenCalled();
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          charPress: 'a',
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });
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

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toEqual([]);

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          charPress: 'a',
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });
    });
  });

  describe('afterGuiAttached', () => {
    describe('cellStartedEdit is true', () => {
      it('does not select the input value if Backspace triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });
        fixture.detectChanges();

        const input = nativeElement.querySelector(
          'textarea'
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea'
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea'
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('selects the input value if Enter triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea'
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).toHaveBeenCalledTimes(1);
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          charPress: 'a',
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea'
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        fixture.detectChanges();

        expect(input.value).toBe('a');
        expect(selectSpy).toHaveBeenCalledTimes(1);
      });
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
          'textarea'
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
          'textarea'
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
          'textarea'
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
          'textarea'
        ) as HTMLTextAreaElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          charPress: 'a',
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector(
          'textarea'
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

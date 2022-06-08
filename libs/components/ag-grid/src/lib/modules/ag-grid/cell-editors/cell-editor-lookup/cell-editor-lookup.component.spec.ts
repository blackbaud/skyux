import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@skyux-sdk/testing';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule, SkyLookupSelectModeType } from '@skyux/lookup';

import { Column, KeyCode } from 'ag-grid-community';
import { EventCallback } from 'typedoc/dist/lib/utils/events';

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
  let callback: EventCallback | undefined;
  const selection = [data[0]];
  let cellEditorParams: SkyCellEditorLookupParams;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkyAgGridCellEditorLookupComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        SkyInputBoxModule,
        SkyLookupModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    cellEditorParams = {
      $scope: undefined,
      api: undefined,
      cellStartedEdit: true,
      charPress: undefined,
      colDef: {
        headerName: 'header',
      },
      column: {
        getActualWidth: () => 123,
        addEventListener: (event: string, listener: EventCallback) => {
          callback = listener;
          [event].pop();
        },
      } as Column,
      columnApi: undefined,
      context: undefined,
      data: undefined,
      eGridCell: undefined,
      formatValue(): any {},
      keyPress: undefined,
      node: undefined,
      onKeyDown(): void {},
      parseValue(): any {},
      rowIndex: 0,
      skyComponentProperties: {
        data: [],
        selectMode: 'single' as SkyLookupSelectModeType,
      },
      stopEditing(): void {},
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
      component.agInit({ ...cellEditorParams, value: [] });
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with value', () => {
      component.agInit({
        ...cellEditorParams,
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with disabled control', () => {
      component.agInit({
        ...cellEditorParams,
        skyComponentProperties: {
          ...cellEditorParams.skyComponentProperties,
          disabled: true,
        },
      });
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should throw error with invalid value', () => {
      try {
        component.agInit({
          ...cellEditorParams,
          value: false,
        });
        fail(`should have thrown an error`);
      } catch (e) {
        expect(e.message).toBe('Lookup value must be an array');
      }
    });

    it('should maintain column width', () => {
      component.agInit({ ...cellEditorParams });
      fixture.detectChanges();
      expect(component.width).toBe(123);
      expect(callback).toBeTruthy();
      callback({
        column: {
          getActualWidth: () => 456,
        } as Column,
      });
      expect(component.width).toBe(456);
    });

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.BACKSPACE });

        expect(component.editorForm.get('selection').value).toEqual([]);
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.DELETE });

        expect(component.editorForm.get('selection').value).toEqual([]);
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.F2 });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.ENTER });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, charPress: 'a' });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with the current value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.BACKSPACE });

        expect(component.editorForm.get('selection').value).toEqual(selection);
      });

      it('initializes with the current value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.DELETE });

        expect(component.editorForm.get('selection').value).toEqual(selection);
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.F2 });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, keyPress: KeyCode.ENTER });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection').value).toEqual([]);

        component.agInit({ ...cellEditorParams, charPress: 'a' });

        expect(component.editorForm.get('selection').value).toBe(selection);
      });
    });
  });

  describe('afterGuiAttached', () => {
    describe('cellStartedEdit is true', () => {
      it('does not select the input value if Backspace triggers the edit', () => {
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.BACKSPACE });
        fixture.detectChanges();

        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.DELETE });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.F2 });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('selects the input value if Enter triggers the edit', () => {
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.ENTER });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).toHaveBeenCalledTimes(1);
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({ ...cellEditorParams, charPress: 'a' });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
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
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.BACKSPACE });
        fixture.detectChanges();

        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.DELETE });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.F2 });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Enter triggers the edit', () => {
        component.agInit({ ...cellEditorParams, keyPress: KeyCode.ENTER });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({ ...cellEditorParams, charPress: 'a' });
        fixture.detectChanges();
        const input = nativeElement.querySelector('textarea');
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        fixture.detectChanges();

        expect(input.value).toBe(selection[0].name);
        expect(selectSpy).not.toHaveBeenCalled();
      });
    });
  });
});

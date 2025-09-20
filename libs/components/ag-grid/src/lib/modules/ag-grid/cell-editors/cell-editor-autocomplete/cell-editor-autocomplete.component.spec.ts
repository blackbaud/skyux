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

import { SkyAgGridModule } from '../../ag-grid.module';
import { SkyCellEditorAutocompleteParams } from '../../types/cell-editor-autocomplete-params';
import { SkyAgGridCellEditorAutocompleteComponent } from '../cell-editor-autocomplete/cell-editor-autocomplete.component';

describe('SkyCellEditorAutocompleteComponent', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  let fixture: ComponentFixture<SkyAgGridCellEditorAutocompleteComponent>;
  let component: SkyAgGridCellEditorAutocompleteComponent;
  let nativeElement: HTMLElement;

  const data = [
    { id: '1', name: 'John Doe', town: 'Daniel Island' },
    { id: '2', name: 'Jane Doe', town: 'Daniel Island' },
    { id: '3', name: 'John Smith', town: 'West Ashley' },
    { id: '4', name: 'Jane Smith', town: 'Mt Pleasant' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridModule],
    });
    fixture = TestBed.createComponent(SkyAgGridCellEditorAutocompleteComponent);
    nativeElement = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should render an autocomplete input', () => {
    fixture.detectChanges();

    const element = nativeElement.querySelector('sky-autocomplete');
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    let api: jasmine.SpyObj<GridApi>;
    let cellEditorParams: Partial<SkyCellEditorAutocompleteParams>;
    let column: AgColumn;
    let gridCell: HTMLDivElement;
    const selection = data[0];
    const rowNode = new RowNode({} as BeanCollection);
    rowNode.rowHeight = 37;

    beforeEach(() => {
      api = jasmine.createSpyObj<GridApi>('api', [
        'getDisplayNameForColumn',
        'getGridOption',
        'stopEditing',
      ]);
      api.getGridOption.and.returnValue(true);
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
        value: selection,
        column,
        eGridCell: gridCell,
        node: rowNode,
        colDef: {},
        cellStartedEdit: true,
      };
    });

    it('should initialize the SkyAgGridCellEditorAutocompleteComponent properties', () => {
      expect(component.editorForm.get('selection')?.value).toBeNull();
      component.agInit(cellEditorParams as ICellEditorParams);

      expect(component.editorForm.get('selection')?.value).toEqual(selection);
    });

    it('should respond to focus changes', fakeAsync(() => {
      component.agInit(cellEditorParams as SkyCellEditorAutocompleteParams);
      tick();

      component.onAutocompleteOpenChange(true);
      component.onBlur({} as FocusEvent);
      expect(cellEditorParams.api?.stopEditing).not.toHaveBeenCalled();

      component.onAutocompleteOpenChange(false);
      component.onBlur({} as FocusEvent);
      expect(cellEditorParams.api?.stopEditing).toHaveBeenCalled();
    }));

    it('should respond to refocus', fakeAsync(() => {
      fixture.detectChanges();

      const input = nativeElement.querySelector('input') as HTMLInputElement;
      spyOn(input, 'focus');

      component.agInit(cellEditorParams as SkyCellEditorAutocompleteParams);
      component.onBlur({
        relatedTarget: gridCell,
      } as unknown as FocusEvent);
      tick();
      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
      expect(cellEditorParams.api?.stopEditing).not.toHaveBeenCalled();
    }));

    it('should set the correct aria label', () => {
      api.getDisplayNameForColumn.and.returnValue('Testing');
      component.agInit({
        ...(cellEditorParams as ICellEditorParams),
        rowIndex: 0,
      });
      fixture.detectChanges();
      const input = nativeElement.querySelector('input') as HTMLInputElement;

      fixture.detectChanges();

      expect(input.getAttribute('aria-label')).toBe(
        'Editable autocomplete Testing for row 1',
      );
    });

    describe('cellStartedEdit is true', () => {
      it('initializes with a cleared value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(component.editorForm.get('selection')?.value).toBeUndefined();
      });

      it('initializes with a cleared value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(component.editorForm.get('selection')?.value).toBeUndefined();
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });
    });

    describe('cellStartedEdit is false', () => {
      beforeEach(() => {
        cellEditorParams.cellStartedEdit = false;
      });

      it('initializes with the current value when Backspace triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      it('initializes with the current value when Delete triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      it('initializes with the current value when F2 triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      it('initializes with the current value when Enter triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });

      // NOTE: This is different than other editors due to the selection nature of autocomplete
      it('initializes with the current value when a standard keyboard event triggers the edit', () => {
        expect(component.editorForm.get('selection')?.value).toBeNull();

        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });

        expect(component.editorForm.get('selection')?.value).toBe(selection);
      });
    });
  });

  describe('getValue', () => {
    it('should return the selected object if one is selected', () => {
      const selection = data[0];
      component.editorForm.get('selection')?.setValue(selection);

      fixture.detectChanges();

      expect(component.getValue()).toEqual(selection);
    });

    it('should return undefined if no value is selected', () => {
      expect(component.getValue()).toBeUndefined();
    });
  });

  describe('afterGuiAttached', () => {
    let cellEditorParams: Partial<SkyCellEditorAutocompleteParams>;
    let column: AgColumn;
    const selection = data[0];
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

      const gridApi = {} as GridApi;

      gridApi.getDisplayNameForColumn = (): string => {
        return '';
      };

      cellEditorParams = {
        api: gridApi,
        value: selection,
        column,
        node: rowNode,
        colDef: {},
        cellStartedEdit: true,
      };
    });

    it('should focus on the input after it attaches to the DOM', fakeAsync(() => {
      fixture.detectChanges();

      const input = nativeElement.querySelector('input') as HTMLInputElement;
      spyOn(input, 'focus');

      component.afterGuiAttached();
      tick();

      expect(input).toBeVisible();
      expect(input.focus).toHaveBeenCalled();
    }));

    describe('cellStartedEdit is true', () => {
      it('does not select the input value if Backspace triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.BACKSPACE,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();
        tick();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('does not select the input value if Delete triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();
        tick();

        expect(input.value).toBe('');
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('does not select the input value if F2 triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();
        tick();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      }));

      it('selects the input value if Enter triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();
        tick();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).toHaveBeenCalledTimes(1);
      }));

      it('does not select the input value when a standard keyboard event triggers the edit', fakeAsync(() => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        tick();
        fixture.detectChanges();

        expect(input.value).toBe('a');
        expect(selectSpy).toHaveBeenCalledTimes(1);
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
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Delete triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.DELETE,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if F2 triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.F2,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value if Enter triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: KeyCode.ENTER,
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select');

        component.afterGuiAttached();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('does not select the input value when a standard keyboard event triggers the edit', () => {
        component.agInit({
          ...(cellEditorParams as ICellEditorParams),
          eventKey: 'a',
        });
        fixture.detectChanges();
        const input = nativeElement.querySelector('input') as HTMLInputElement;
        const selectSpy = spyOn(input, 'select').and.callThrough();

        component.afterGuiAttached();
        fixture.detectChanges();

        expect(input.value).toBe(selection.name);
        expect(selectSpy).not.toHaveBeenCalled();
      });
    });
  });

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ColumnResizedEvent, PopupComponent } from 'ag-grid-community';

import { applySkyLookupPropertiesDefaults } from '../../apply-lookup-properties-defaults';
import { SkyAgGridCellEditorInitialAction } from '../../types/cell-editor-initial-action';
import { SkyCellEditorLookupParams } from '../../types/cell-editor-lookup-params';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';
import { SkyAgGridLookupProperties } from '../../types/lookup-properties';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-lookup',
  templateUrl: './cell-editor-lookup.component.html',
  styleUrls: ['./cell-editor-lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellEditorLookupComponent
  extends PopupComponent
  implements ICellEditorAngularComp
{
  @HostBinding('style.width.px')
  public width: number | undefined;

  public skyComponentProperties?: SkyAgGridLookupProperties;
  public editorForm = new UntypedFormGroup({
    selection: new UntypedFormControl({
      value: [],
      disabled: false,
    }),
  });
  public useAsyncSearch = false;

  #isAlive = false;
  #lookupOpen = false;
  #params: SkyCellEditorLookupParams | undefined;
  #triggerType: SkyAgGridCellEditorInitialAction | undefined;
  #changeDetector = inject(ChangeDetectorRef);
  #elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    super();
  }

  @HostListener('blur')
  public onFocusOut(): void {
    this.#stopEditingOnBlur();
  }

  public agInit(params: SkyCellEditorLookupParams): void {
    this.#params = params;
    if (!Array.isArray(this.#params.value)) {
      throw new Error(`Lookup value must be an array`);
    }

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('selection');

    if (control) {
      switch (this.#triggerType) {
        case SkyAgGridCellEditorInitialAction.Delete:
          control.setValue([]);
          break;
        case SkyAgGridCellEditorInitialAction.Replace:
        case SkyAgGridCellEditorInitialAction.Highlighted:
        case SkyAgGridCellEditorInitialAction.Untouched:
        default:
          control.setValue(params.value);
          break;
      }

      if (this.#params.skyComponentProperties?.disabled) {
        control.disable();
      }
    }

    this.skyComponentProperties = this.#updateComponentProperties(this.#params);
    this.useAsyncSearch =
      typeof this.skyComponentProperties.searchAsync === 'function';
    this.#isAlive = true;
    this.width = this.#params.column.getActualWidth();
    this.#params.column.addEventListener(
      'uiColumnResized',
      (event: ColumnResizedEvent) => {
        this.width = event.column?.getActualWidth();
        this.#changeDetector.markForCheck();
      }
    );
    this.#changeDetector.markForCheck();
  }

  public override isAlive = (): boolean => this.#isAlive;

  public isCancelAfterEnd(): boolean {
    // Shut down components to commit values before final value syncs to grid.
    this.#isAlive = false;
    this.#changeDetector.detectChanges();
    return false;
  }

  public override getGui(): HTMLElement {
    return this.#elementRef.nativeElement;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getValue(): any[] {
    return this.editorForm.get('selection')?.value;
  }

  public afterGuiAttached(): void {
    const lookupInput: HTMLTextAreaElement =
      this.#elementRef.nativeElement.querySelector('.sky-lookup-input');
    lookupInput.focus();
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Replace) {
      lookupInput.select();
      lookupInput.setRangeText(this.#params?.charPress as string);
      // Ensure the cursor is at the end of the text.
      lookupInput.setSelectionRange(
        lookupInput.value.length,
        lookupInput.value.length
      );
      lookupInput.dispatchEvent(new Event('input'));
    }
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted) {
      lookupInput.select();
    }
  }

  public onLookupOpenChange(isOpen: boolean): void {
    this.#lookupOpen = isOpen;
    this.#stopEditingOnBlur();
  }

  #updateComponentProperties(
    params: SkyCellEditorLookupParams
  ): SkyAgGridLookupProperties {
    const skyLookupProperties = params.skyComponentProperties;
    return applySkyLookupPropertiesDefaults(skyLookupProperties);
  }

  #stopEditingOnBlur(): void {
    if (
      !this.#lookupOpen &&
      this.#params?.context?.gridOptions?.stopEditingWhenCellsLoseFocus
    ) {
      setTimeout(() => {
        if (
          !this.#lookupOpen &&
          !this.#elementRef.nativeElement.matches(':focus-within')
        ) {
          this.#params?.api.stopEditing();
        }
      });
    }
  }
}

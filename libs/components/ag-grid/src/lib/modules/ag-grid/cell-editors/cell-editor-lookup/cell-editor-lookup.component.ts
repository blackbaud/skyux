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
import { ColumnResizedEvent } from 'ag-grid-community';

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
  implements ICellEditorAngularComp
{
  @HostBinding('style.width.px')
  public width: number | undefined;

  public skyComponentProperties?: SkyAgGridLookupProperties;
  public isAlive = false;
  public editorForm = new UntypedFormGroup({
    selection: new UntypedFormControl({
      value: [],
      disabled: false,
    }),
  });
  public useAsyncSearch = false;

  protected labelText: string | undefined = undefined;

  #lookupOpen = false;
  #params: SkyCellEditorLookupParams | undefined;
  #triggerType: SkyAgGridCellEditorInitialAction | undefined;
  #changeDetector = inject(ChangeDetectorRef);
  #elementRef = inject(ElementRef<HTMLElement>);

  @HostListener('blur')
  public onBlur(): void {
    this.#stopEditingOnBlur();
  }

  public agInit(params: SkyCellEditorLookupParams): void {
    this.#params = params;
    if (!Array.isArray(this.#params.value)) {
      throw new Error(`Lookup value must be an array`);
    }

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('selection');
    this.labelText = params.skyComponentProperties?.ariaLabelledBy
      ? undefined
      : params.skyComponentProperties?.ariaLabel ||
        params.colDef.headerName ||
        params.colDef.headerTooltip ||
        params.colDef.field ||
        params.colDef.colId;

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
      } else {
        control.enable();
      }
    }

    this.skyComponentProperties = this.#updateComponentProperties(this.#params);
    this.useAsyncSearch =
      typeof this.skyComponentProperties.searchAsync === 'function';
    this.isAlive = true;
    this.width = this.#params.column.getActualWidth();
    this.#params.api.addEventListener(
      'columnResized',
      (event: ColumnResizedEvent) => {
        if (event.column?.getColId() === this.#params?.column.getColId()) {
          this.width = event.column?.getActualWidth();
          this.#changeDetector.markForCheck();
        }
      },
    );
    this.#changeDetector.markForCheck();
  }

  public isCancelAfterEnd(): boolean {
    // Shut down components to commit values before final value syncs to grid.
    this.isAlive = false;
    this.#changeDetector.detectChanges();
    return false;
  }

  public getGui(): HTMLElement {
    return this.#elementRef.nativeElement;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getValue(): any[] {
    return this.editorForm.get('selection')?.value;
  }

  public isPopup(): boolean {
    return true;
  }

  public getPopupPosition(): 'over' | 'under' | undefined {
    return 'over';
  }

  public afterGuiAttached(): void {
    const lookupInput: HTMLTextAreaElement =
      this.#elementRef.nativeElement.querySelector('.sky-lookup-input');
    lookupInput.focus();
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Replace) {
      lookupInput.select();
      lookupInput.setRangeText(`${this.#params?.eventKey}`);
      // Ensure the cursor is at the end of the text.
      lookupInput.setSelectionRange(
        lookupInput.value.length,
        lookupInput.value.length,
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
    params: SkyCellEditorLookupParams,
  ): SkyAgGridLookupProperties {
    const skyLookupProperties = params.skyComponentProperties;
    return applySkyLookupPropertiesDefaults(skyLookupProperties);
  }

  #stopEditingOnBlur(): void {
    if (
      !this.#lookupOpen &&
      this.#params?.api.getGridOption('stopEditingWhenCellsLoseFocus') &&
      !this.#elementRef.nativeElement.matches(':focus-within')
    ) {
      this.#params?.api.stopEditing();
    }
  }
}

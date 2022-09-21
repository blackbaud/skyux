import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ColumnResizedEvent } from 'ag-grid-community';
import { IPopupComponent } from 'ag-grid-community/dist/lib/interfaces/iPopupComponent';

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
  implements ICellEditorAngularComp, IPopupComponent<any>
{
  @HostBinding('style.width.px')
  public width: number;

  public skyComponentProperties?: SkyAgGridLookupProperties;
  public isAlive = false;
  public editorForm = new UntypedFormGroup({
    selection: new UntypedFormControl({
      value: [],
      disabled: false,
    }),
  });
  public useAsyncSearch = false;

  private params: SkyCellEditorLookupParams;

  #triggerType: SkyAgGridCellEditorInitialAction;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  public agInit(params: SkyCellEditorLookupParams): void {
    this.params = params;
    if (!Array.isArray(this.params.value)) {
      throw new Error(`Lookup value must be an array`);
    }

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('selection');
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
    if (this.params.skyComponentProperties.disabled) {
      control.disable();
    }
    this.skyComponentProperties = this.updateComponentProperties(this.params);
    this.useAsyncSearch =
      typeof this.skyComponentProperties.searchAsync === 'function';
    this.isAlive = true;
    this.width = this.params.column.getActualWidth();
    this.params.column.addEventListener(
      'uiColumnResized',
      (event: ColumnResizedEvent) => {
        this.width = event.column.getActualWidth();
        this.changeDetector.markForCheck();
      }
    );
    this.changeDetector.markForCheck();
  }

  public isCancelAfterEnd(): boolean {
    // Shut down components to commit values before final value syncs to grid.
    this.isAlive = false;
    this.changeDetector.detectChanges();
    return false;
  }

  public getGui(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  public getValue(): any[] {
    return this.editorForm.get('selection').value;
  }

  public isPopup(): boolean {
    return true;
  }

  public afterGuiAttached(): void {
    const lookupInput: HTMLTextAreaElement =
      this.elementRef.nativeElement.querySelector('.sky-lookup-input');
    lookupInput.focus();
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Replace) {
      lookupInput.select();
      lookupInput.setRangeText(this.params.charPress);
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

  private updateComponentProperties(
    params: SkyCellEditorLookupParams
  ): SkyAgGridLookupProperties {
    const skyLookupProperties = params.skyComponentProperties;
    return applySkyLookupPropertiesDefaults(skyLookupProperties);
  }
}

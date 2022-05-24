import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ColumnResizedEvent } from 'ag-grid-community';
import { IPopupComponent } from 'ag-grid-community/dist/lib/interfaces/iPopupComponent';

import { getEditorInitializationTrigger } from '../../ag-grid.service';
import { applySkyLookupPropertiesDefaults } from '../../apply-lookup-properties-defaults';
import { SkyCellEditorLookupParams } from '../../types/cell-editor-lookup-params';
import { SkyAgGridEditorTrigger } from '../../types/editor-trigger';
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
  public editorForm = new FormGroup({
    selection: new FormControl({
      value: [],
      disabled: false,
    }),
  });
  public useAsyncSearch = false;

  private params: SkyCellEditorLookupParams;

  #triggerType: SkyAgGridEditorTrigger;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  public agInit(params: SkyCellEditorLookupParams): void {
    this.params = params;
    if (!Array.isArray(this.params.value)) {
      throw new Error(`Lookup value must be an array`);
    }

    this.#triggerType = getEditorInitializationTrigger(params);
    const control = this.editorForm.get('selection');
    switch (this.#triggerType) {
      case SkyAgGridEditorTrigger.Delete:
        control.setValue(undefined);
        break;
      case SkyAgGridEditorTrigger.Replace:
      case SkyAgGridEditorTrigger.Highlighted:
      case SkyAgGridEditorTrigger.Untouched:
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

  /*istanbul ignore next*/
  public afterGuiAttached(): void {
    const lookupInput: HTMLTextAreaElement =
      this.elementRef.nativeElement.querySelector('.sky-lookup-input');
    lookupInput?.focus();
    if (this.#triggerType === SkyAgGridEditorTrigger.Replace) {
      lookupInput.select();
      lookupInput.setRangeText(this.params.charPress);
      // Ensure the cursor is at the end of the text.
      lookupInput.setSelectionRange(
        lookupInput.value.length,
        lookupInput.value.length
      );
      lookupInput.dispatchEvent(new Event('input'));
    }
    if (this.#triggerType === SkyAgGridEditorTrigger.Highlighted) {
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

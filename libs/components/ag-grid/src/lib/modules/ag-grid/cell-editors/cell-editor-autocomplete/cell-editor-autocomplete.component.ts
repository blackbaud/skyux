import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ICellEditorAngularComp } from 'ag-grid-angular';

import { SkyAgGridAutocompleteProperties } from '../../types/autocomplete-properties';
import { SkyCellEditorAutocompleteParams } from '../../types/cell-editor-autocomplete-params';
import { SkyAgGridCellEditorInitialAction } from '../../types/cell-editor-initial-action';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-autocomplete',
  templateUrl: './cell-editor-autocomplete.component.html',
  styleUrls: ['./cell-editor-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellEditorAutocompleteComponent
  implements ICellEditorAngularComp
{
  public columnHeader: string;
  public editorForm = new FormGroup({
    selection: new FormControl(),
  });
  public rowNumber: number;
  public skyComponentProperties: SkyAgGridAutocompleteProperties = {};
  private params: SkyCellEditorAutocompleteParams;

  #triggerType: SkyAgGridCellEditorInitialAction;

  @ViewChild('skyCellEditorAutocomplete', { read: ElementRef })
  public input: ElementRef;

  public agInit(params: SkyCellEditorAutocompleteParams) {
    this.params = params;
    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('selection');
    switch (this.#triggerType) {
      case SkyAgGridCellEditorInitialAction.Delete:
        control.setValue(undefined);
        break;
      case SkyAgGridCellEditorInitialAction.Replace:
      case SkyAgGridCellEditorInitialAction.Highlighted:
      case SkyAgGridCellEditorInitialAction.Untouched:
      default:
        control.setValue(params.value);
        break;
    }
    this.columnHeader = this.params.colDef && this.params.colDef.headerName;
    this.rowNumber = this.params.rowIndex + 1;
    this.skyComponentProperties = this.params.skyComponentProperties || {};
  }

  public afterGuiAttached(): void {
    this.input.nativeElement.focus();
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Replace) {
      this.input.nativeElement.select();
      this.input.nativeElement.setRangeText(this.params.charPress);
      // Ensure the cursor is at the end of the text.
      this.input.nativeElement.setSelectionRange(
        this.params.charPress.length,
        this.params.charPress.length
      );
      this.input.nativeElement.dispatchEvent(new Event('input'));
    }
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted) {
      this.input.nativeElement.select();
    }
  }

  public getValue(): any | undefined {
    const val = this.editorForm.get('selection').value;
    return val !== undefined && val !== null ? val : undefined;
  }
}

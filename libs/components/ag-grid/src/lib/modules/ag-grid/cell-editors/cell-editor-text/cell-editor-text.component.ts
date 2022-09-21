import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridCellEditorInitialAction } from '../../types/cell-editor-initial-action';
import { SkyCellEditorTextParams } from '../../types/cell-editor-text-params';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-text',
  templateUrl: './cell-editor-text.component.html',
  styleUrls: ['./cell-editor-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellEditorTextComponent
  implements ICellEditorAngularComp
{
  public textInputLabel: string;
  public columnHeader: string;
  public columnWidth: number;
  public editorForm = new UntypedFormGroup({
    text: new UntypedFormControl(),
  });
  public rowHeightWithoutBorders: number;
  public rowNumber: number;
  public maxlength: number;

  private params: ICellEditorParams;

  @ViewChild('skyCellEditorText', { read: ElementRef })
  private input: ElementRef;

  #triggerType: SkyAgGridCellEditorInitialAction;

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorTextParams): void {
    this.params = params;

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('text');
    switch (this.#triggerType) {
      case SkyAgGridCellEditorInitialAction.Delete:
        control.setValue(undefined);
        break;
      case SkyAgGridCellEditorInitialAction.Replace:
        control.setValue(params.charPress);
        break;
      case SkyAgGridCellEditorInitialAction.Highlighted:
      case SkyAgGridCellEditorInitialAction.Untouched:
      default:
        control.setValue(params.value);
        break;
    }

    this.maxlength = params.skyComponentProperties?.maxlength;
    this.columnHeader = this.params.colDef.headerName;
    this.rowNumber = this.params.rowIndex + 1;
    this.columnWidth = this.params.column.getActualWidth();
    this.rowHeightWithoutBorders =
      this.params.node && this.params.node.rowHeight - 4;
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    this.input.nativeElement.focus();
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted) {
      this.input.nativeElement.select();
    }
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): string | undefined {
    return this.editorForm.get('text').value || undefined;
  }
}

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
  public textInputLabel: string | undefined;
  public columnHeader: string | undefined;
  public columnWidth: number | undefined;
  public editorForm = new UntypedFormGroup({
    text: new UntypedFormControl(),
  });
  public rowHeightWithoutBorders: number | undefined;
  public rowNumber: number | undefined;
  public maxlength: number | undefined;

  @ViewChild('skyCellEditorText', { read: ElementRef })
  public input: ElementRef | undefined;

  #params: ICellEditorParams | undefined;
  #triggerType: SkyAgGridCellEditorInitialAction | undefined;

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorTextParams): void {
    this.#params = params;

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('text');

    if (control) {
      switch (this.#triggerType) {
        case SkyAgGridCellEditorInitialAction.Delete:
          control.setValue(undefined);
          break;
        case SkyAgGridCellEditorInitialAction.Replace:
          control.setValue(params.eventKey);
          break;
        case SkyAgGridCellEditorInitialAction.Highlighted:
        case SkyAgGridCellEditorInitialAction.Untouched:
        default:
          control.setValue(params.value);
          break;
      }
    }

    this.maxlength = params.skyComponentProperties?.maxlength;
    this.columnHeader = this.#params.colDef.headerName;
    this.rowNumber = this.#params.rowIndex + 1;
    this.columnWidth = this.#params.column.getActualWidth();
    this.rowHeightWithoutBorders = (this.#params.node.rowHeight as number) - 4;
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    if (this.input) {
      this.input.nativeElement.focus();
      if (this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted) {
        this.input.nativeElement.select();
      }
    }
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): string | undefined {
    return this.editorForm.get('text')?.value || undefined;
  }
}

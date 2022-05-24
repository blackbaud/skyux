import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

import { getEditorInitializationTrigger } from '../../ag-grid.service';
import { SkyCellEditorNumberParams } from '../../types/cell-editor-number-params';
import { SkyAgGridEditorTrigger } from '../../types/editor-trigger';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-number',
  templateUrl: './cell-editor-number.component.html',
  styleUrls: ['./cell-editor-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellEditorNumberComponent
  implements ICellEditorAngularComp
{
  public columnHeader: string;
  public columnWidth: number;
  public editorForm = new FormGroup({
    number: new FormControl(),
  });
  public rowHeightWithoutBorders: number;
  public rowNumber: number;
  public max: number;
  public min: number;

  private params: ICellEditorParams;

  @ViewChild('skyCellEditorNumber', { read: ElementRef })
  private input: ElementRef;

  #triggerType: SkyAgGridEditorTrigger;

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorNumberParams): void {
    this.params = params;

    this.#triggerType = getEditorInitializationTrigger(params);
    const control = this.editorForm.get('number');
    switch (this.#triggerType) {
      case SkyAgGridEditorTrigger.Delete:
        control.setValue(undefined);
        break;
      case SkyAgGridEditorTrigger.Replace:
        control.setValue(params.charPress);
        break;
      case SkyAgGridEditorTrigger.Highlighted:
      case SkyAgGridEditorTrigger.Untouched:
      default:
        control.setValue(params.value);
        break;
    }

    this.max = params.skyComponentProperties?.max;
    this.min = params.skyComponentProperties?.min;
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
    if (this.#triggerType === SkyAgGridEditorTrigger.Highlighted) {
      this.input.nativeElement.select();
    }
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): number {
    return this.editorForm.get('number').value;
  }
}

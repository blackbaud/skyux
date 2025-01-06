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
import { SkyCellEditorNumberParams } from '../../types/cell-editor-number-params';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-number',
  templateUrl: './cell-editor-number.component.html',
  styleUrls: ['./cell-editor-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyAgGridCellEditorNumberComponent
  implements ICellEditorAngularComp
{
  public columnHeader: string | undefined;
  public columnWidth: number | undefined;
  public editorForm = new UntypedFormGroup({
    number: new UntypedFormControl(),
  });
  public rowHeightWithoutBorders: number | undefined;
  public rowNumber: number | undefined;
  public max: number | undefined;
  public min: number | undefined;

  @ViewChild('skyCellEditorNumber', { read: ElementRef })
  public input: ElementRef | undefined;

  #params: ICellEditorParams | undefined;
  #triggerType: SkyAgGridCellEditorInitialAction | undefined;

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorNumberParams): void {
    this.#params = params;

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('number');
    if (control) {
      switch (this.#triggerType) {
        case SkyAgGridCellEditorInitialAction.Delete:
          control.setValue(undefined);
          break;
        case SkyAgGridCellEditorInitialAction.Replace:
          control.setValue(
            parseFloat(this.#params?.eventKey as string) || undefined,
          );
          break;
        case SkyAgGridCellEditorInitialAction.Highlighted:
        case SkyAgGridCellEditorInitialAction.Untouched:
        default:
          control.setValue(params.value);
          break;
      }
    }

    this.max = params.skyComponentProperties?.max;
    this.min = params.skyComponentProperties?.min;
    this.columnHeader = this.#params.api.getDisplayNameForColumn(
      this.#params.column,
      'header',
    );
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
  public getValue(): number | undefined {
    const val = this.editorForm.get('number')?.value;
    return val !== undefined && val !== null ? val : undefined;
  }
}

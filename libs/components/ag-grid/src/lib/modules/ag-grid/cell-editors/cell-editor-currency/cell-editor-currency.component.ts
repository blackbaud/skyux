import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ICellEditorAngularComp } from 'ag-grid-angular';

import { SkyCellEditorCurrencyParams } from '../../types/cell-editor-currency-params';
import { SkyAgGridCellEditorInitialAction } from '../../types/cell-editor-initial-action';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';
import { SkyAgGridCurrencyProperties } from '../../types/currency-properties';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-currency',
  templateUrl: './cell-editor-currency.component.html',
  styleUrls: ['./cell-editor-currency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellEditorCurrencyComponent
  implements ICellEditorAngularComp
{
  public skyComponentProperties: SkyAgGridCurrencyProperties = {};
  public columnHeader: string | undefined;
  public columnWidth: number | undefined;
  public editorForm = new UntypedFormGroup({
    currency: new UntypedFormControl(),
  });
  public params: SkyCellEditorCurrencyParams | undefined;
  public rowHeightWithoutBorders: number | undefined;
  public rowNumber: number | undefined;

  @ViewChild('skyCellEditorCurrency', { read: ElementRef })
  public input: ElementRef | undefined;

  #triggerType: SkyAgGridCellEditorInitialAction | undefined;
  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorCurrencyParams): void {
    this.params = params;
    this.columnHeader = this.params.colDef.headerName;
    this.rowNumber = this.params.rowIndex + 1;
    this.columnWidth = this.params.column.getActualWidth();
    this.rowHeightWithoutBorders = SkyAgGridCellEditorUtils.subtractOrZero(
      this.params.node?.rowHeight,
      4
    );
    this.skyComponentProperties = this.params.skyComponentProperties || {
      decimalPlaces: 2,
      currencySymbol: '$',
    };
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    this.input?.nativeElement.focus();

    // This setup is in `afterGuiAttached` due to the lifecycle of autonumeric which will highlight the initial value if it is in place when it renders.
    // Since we don't want that, we set the initial value after autonumeric initializes.
    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(
      this.params
    );
    const control = this.editorForm.get('currency');

    if (control) {
      switch (this.#triggerType) {
        case SkyAgGridCellEditorInitialAction.Delete:
          control.setValue(undefined);
          break;
        case SkyAgGridCellEditorInitialAction.Replace:
          control.setValue(
            parseFloat(String(this.params?.charPress)) || undefined
          );
          break;
        case SkyAgGridCellEditorInitialAction.Highlighted:
        case SkyAgGridCellEditorInitialAction.Untouched:
        default:
          control.setValue(parseFloat(String(this.params?.value)));
          break;
      }
    }

    this.#changeDetector.markForCheck();

    // Without the `setTimeout` there is inconsistent behavior with the highlighting when no initial value is present.
    setTimeout(() => {
      if (this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted) {
        this.input?.nativeElement.select();
      }
    }, 100);
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): number | undefined {
    const val = this.editorForm.get('currency')?.value;
    return val !== undefined && val !== null ? val : undefined;
  }

  /**
   * The autoNumeric library's event handler suppresses the escape key event. This additional handler re-enables AG Grid's default functionality.
   */
  public onPressEscape(): void {
    if (this.params) {
      this.params.api.stopEditing(true);
      this.params.api.setFocusedCell(this.params.rowIndex, this.params.column);
    }
  }
}

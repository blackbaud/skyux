import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SkyThemeService } from '@skyux/theme';

import { ICellEditorAngularComp } from 'ag-grid-angular';
import { PopupComponent } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';

import { SkyCellEditorDatepickerParams } from '../../types/cell-editor-datepicker-params';
import { SkyAgGridCellEditorInitialAction } from '../../types/cell-editor-initial-action';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';
import { SkyAgGridDatepickerProperties } from '../../types/datepicker-properties';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-datepicker',
  templateUrl: './cell-editor-datepicker.component.html',
  styleUrls: ['./cell-editor-datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkyAgGridCellEditorDatepickerComponent
  extends PopupComponent
  implements ICellEditorAngularComp
{
  public columnWidth: number;
  public columnWidthWithoutBorders: number;
  public editorForm = new FormGroup({
    date: new FormControl(),
  });
  public rowHeightWithoutBorders: number;
  public skyComponentProperties: SkyAgGridDatepickerProperties = {};
  private params: SkyCellEditorDatepickerParams;

  @ViewChild('skyCellEditorDatepickerInput', { read: ElementRef })
  private datepickerInput: ElementRef;

  #triggerType: SkyAgGridCellEditorInitialAction;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() private themeSvc?: SkyThemeService
  ) {
    super();
  }

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorDatepickerParams): void {
    this.params = params;

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('date');
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
    if (this.params.skyComponentProperties?.disabled) {
      control.disable();
    }
    this.changeDetector.markForCheck();

    this.skyComponentProperties = this.params.skyComponentProperties || {};
    this.columnWidth = this.params.column.getActualWidth();
    this.columnWidthWithoutBorders = this.columnWidth - 2;
    this.rowHeightWithoutBorders =
      this.params.node && this.params.node.rowHeight - 3;
    this.themeSvc?.settingsChange.subscribe((themeSettings) => {
      if (themeSettings.currentSettings.theme.name === 'modern') {
        this.columnWidthWithoutBorders = this.columnWidth;
        this.rowHeightWithoutBorders =
          this.params.node && this.params.node.rowHeight;
      } else {
        this.columnWidthWithoutBorders = this.columnWidth - 2;
        this.rowHeightWithoutBorders =
          this.params.node && this.params.node.rowHeight - 3;
      }
    });
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    const datepickerInputEl = this.datepickerInput
      .nativeElement as HTMLInputElement;
    datepickerInputEl.focus();

    // Programatically set the value of in the input; however, do not do this via the form control so that the value is not formatted when editing starts.
    // Watch for the first blur and fire a 'change' event as programatic changes won't queue a change event, but we need to do this so that formatting happens if the user tabs to the calendar button.
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Replace) {
      fromEvent(datepickerInputEl, 'blur')
        .pipe(first())
        .subscribe(() => {
          datepickerInputEl.dispatchEvent(new Event('change'));
        });
      datepickerInputEl.select();
      datepickerInputEl.setRangeText(this.params.charPress);
      // Ensure the cursor is at the end of the text.
      datepickerInputEl.setSelectionRange(
        this.params.charPress.length,
        this.params.charPress.length
      );
    }

    // this.changeDetector.markForCheck();
    if (this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted) {
      datepickerInputEl.select();
    }
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): Date {
    this.datepickerInput.nativeElement.blur();
    return this.editorForm.get('date').value;
  }
}

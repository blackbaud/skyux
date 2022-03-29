import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import { PopupComponent } from '@ag-grid-community/core';

import { SkyCellEditorDatepickerParams } from '../../types/cell-editor-datepicker-params';
import { SkyDatepickerProperties } from '../../types/datepicker-properties';

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
  public currentDate: Date;
  public columnWidthWithoutBorders: number;
  public rowHeightWithoutBorders: number;
  public skyComponentProperties: SkyDatepickerProperties = {};
  private params: SkyCellEditorDatepickerParams;

  @ViewChild('skyCellEditorDatepickerInput', { read: ElementRef })
  private datepickerInput: ElementRef;

  constructor(@Optional() private themeSvc?: SkyThemeService) {
    super();
  }

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorDatepickerParams): void {
    this.params = params;
    this.currentDate = this.params.value;
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
    this.focusOnDatepickerInput();
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): Date {
    this.datepickerInput.nativeElement.blur();
    return this.currentDate;
  }

  public focusOnDatepickerInput(): void {
    this.datepickerInput.nativeElement.focus();
  }
}

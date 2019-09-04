import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyDatepickerInputDirective,
  SkyDatepickerComponent
} from '@skyux/datetime';

import {
  ICellEditorAngularComp
} from 'ag-grid-angular';

import {
  ICellEditorParams
} from 'ag-grid-community';

@Component({
  selector: 'sky-ag-grid-cell-editor-datepicker',
  templateUrl: './cell-editor-datepicker.component.html',
  styleUrls: ['./cell-editor-datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAgGridCellEditorDatepickerComponent implements ICellEditorAngularComp {
  public currentDate: Date;
  public minDate: Date;
  public maxDate: Date;
  public disabled: boolean;
  public dateFormat: string;
  public startingDay: number;
  public columnWidth: number;
  public rowHeight: number;
  private params: ICellEditorParams;

  @ViewChild('skyCellEditorDatepickerInput', { read: ElementRef })
  private datepickerInput: ElementRef;

  @ViewChild(SkyDatepickerInputDirective)
  private inputDirective: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  private datepickerComponent: SkyDatepickerComponent;

  public get inputIsFocused(): boolean {
    return this.inputDirective.inputIsFocused;
  }

  public get buttonIsFocused(): boolean {
    return this.datepickerComponent.buttonIsFocused;
  }

  public get calendarIsFocused(): boolean {
    return this.datepickerComponent.calendarIsFocused;
  }

  public get calendarIsVisible(): boolean {
    return this.datepickerComponent.calendarIsVisible;
  }

  constructor() { }

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: ICellEditorParams): void {
    this.params = params;
    this.currentDate = this.params.value;
    this.columnWidth = this.params.column.getActualWidth();
    this.rowHeight = this.params.node.rowHeight + 1;

    const cellEditorParams = this.params.colDef.cellEditorParams;
    if (cellEditorParams) {
      this.minDate = cellEditorParams.minDate;
      this.maxDate = cellEditorParams.maxDate;
      this.disabled = cellEditorParams.disabled;
      this.dateFormat = cellEditorParams.dateFormat;
      this.startingDay = cellEditorParams.startingDay;
    }
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
    this.inputDirective.detectInputValueChange();
    return this.currentDate;
  }

  /**
   * isPopup is called by agGrid to determine if the editor should be rendered as a cell or as a popup over the cell being edited.
   */
  public isPopup(): boolean {
    return true;
  }

  public onDatepickerKeydown(e: KeyboardEvent): void {
    const targetEl = e.target as HTMLElement;

    if (targetEl && e.key.toLowerCase() === 'tab') {
      // stop event propagation to prevent the grid from moving to the next cell if there is an element target, the tab key was pressed,
      // the tab key press is a tab right and either the input has focus or
      if (((!e.shiftKey && (this.inputIsFocused ||
      // the calendar button has focus when the calendar is open or
      (this.buttonIsFocused && this.calendarIsVisible))) ||
      // the tab key press is a tab left and the calendar button has focus
      (e.shiftKey && this.buttonIsFocused)) ||
      // the tab key press is a tab left and the calendar has focus
      (e.shiftKey && this.calendarIsFocused)) {
        e.stopPropagation();
      }
    }
  }

  public focusOnDatepickerInput(): void {
    this.datepickerInput.nativeElement.focus();
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyI18nModule } from '@skyux/i18n';
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
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyI18nModule,
  ],
})
export class SkyAgGridCellEditorDatepickerComponent
  extends PopupComponent
  implements ICellEditorAngularComp
{
  public columnHeader: string | undefined;
  public columnWidth: number | undefined;
  public columnWidthWithoutBorders: number | undefined;
  public editorForm = new UntypedFormGroup({
    date: new UntypedFormControl(),
  });
  public rowHeightWithoutBorders: number | null | undefined;
  public rowNumber: number | undefined;
  public skyComponentProperties: SkyAgGridDatepickerProperties = {};

  @ViewChild('skyCellEditorDatepickerInput', { read: ElementRef })
  public datepickerInput: ElementRef | undefined;

  protected resolvedDateFormat = '';

  #calendarOpen = false;
  #params: SkyCellEditorDatepickerParams | undefined;
  #triggerType: SkyAgGridCellEditorInitialAction | undefined;

  #elementRef = inject(ElementRef) as ElementRef<HTMLElement>;
  #changeDetector = inject(ChangeDetectorRef);
  #themeSvc = inject(SkyThemeService, { optional: true }) || undefined;

  constructor() {
    super();
  }

  @HostListener('focusout', ['$event'])
  public onFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      event.relatedTarget === this.#params?.eGridCell
    ) {
      // If focus is being set to the grid cell, schedule focus on the datepicker input.
      // This happens when the refreshCells API is called.
      this.afterGuiAttached();
    } else if (event.target === this.datepickerInput?.nativeElement) {
      this.#stopEditingOnBlur();
    }
  }

  public onCalendarOpenChange(isOpen: boolean): void {
    this.#calendarOpen = isOpen;
    this.#stopEditingOnBlur();
  }

  public onDateFormatChange(dateFormat: string): void {
    this.resolvedDateFormat = dateFormat;
    this.#changeDetector.markForCheck();
  }

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorDatepickerParams): void {
    this.#params = params;

    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('date');

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
      if (this.#params.skyComponentProperties?.disabled) {
        control.disable();
      }
    }
    this.#changeDetector.markForCheck();

    this.skyComponentProperties = this.#params.skyComponentProperties || {};
    this.columnHeader = this.#params.api.getDisplayNameForColumn(
      this.#params.column,
      'header',
    );
    this.columnWidth = this.#params.column.getActualWidth();
    this.columnWidthWithoutBorders = this.columnWidth - 2;
    this.rowHeightWithoutBorders = (this.#params.node.rowHeight as number) - 3;
    this.rowNumber = this.#params.rowIndex + 1;

    this.#themeSvc?.settingsChange.subscribe((themeSettings) => {
      if (themeSettings.currentSettings.theme.name === 'modern') {
        this.columnWidthWithoutBorders = this.columnWidth;
        this.rowHeightWithoutBorders = this.#params?.node?.rowHeight;
      } else {
        this.columnWidthWithoutBorders =
          this.columnWidth === undefined ? undefined : this.columnWidth - 2;
        this.rowHeightWithoutBorders = SkyAgGridCellEditorUtils.subtractOrZero(
          this.#params?.node.rowHeight,
          3,
        );
      }
    });
  }

  public getPopupPosition(): 'over' | 'under' | undefined {
    return 'over';
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    // AG Grid sets focus to the cell via setTimeout, and this queues the input to focus after that.
    setTimeout(() => {
      const datepickerInputEl = this.datepickerInput?.nativeElement as
        | HTMLInputElement
        | undefined;

      if (datepickerInputEl) {
        datepickerInputEl.focus();

        // programmatically set the value of in the input; however, do not do this via the form control so that the value is not formatted when editing starts.
        // Watch for the first blur and fire a 'change' event as programmatic changes won't queue a change event, but we need to do this so that formatting happens if the user tabs to the calendar button.
        if (this.#triggerType === SkyAgGridCellEditorInitialAction.Replace) {
          fromEvent(datepickerInputEl, 'blur')
            .pipe(first())
            .subscribe(() => {
              datepickerInputEl.dispatchEvent(new Event('change'));
            });
          datepickerInputEl.select();

          const charPress = this.#params?.eventKey as string;

          if (charPress) {
            datepickerInputEl.setRangeText(charPress);
            // Ensure the cursor is at the end of the text.
            datepickerInputEl.setSelectionRange(
              charPress.length,
              charPress.length,
            );
          }
        }

        if (
          this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted
        ) {
          datepickerInputEl.select();
        }
      }
    });
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): Date {
    this.datepickerInput?.nativeElement.blur();
    return this.editorForm.get('date')?.value;
  }

  #stopEditingOnBlur(): void {
    if (
      !this.#calendarOpen &&
      this.#params?.api.getGridOption('stopEditingWhenCellsLoseFocus') &&
      !this.#elementRef.nativeElement.matches(':focus-within')
    ) {
      this.#params?.api.stopEditing();
    }
  }
}

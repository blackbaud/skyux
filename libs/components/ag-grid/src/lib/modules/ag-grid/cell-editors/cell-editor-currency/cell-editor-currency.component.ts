import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyAutonumericModule } from '@skyux/autonumeric';
import { SkyI18nModule } from '@skyux/i18n';

import type { ICellEditorAngularComp } from 'ag-grid-angular';

import type { SkyCellEditorCurrencyParams } from '../../types/cell-editor-currency-params';
import { SkyAgGridCellEditorInitialAction } from '../../types/cell-editor-initial-action';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';
import type { SkyAgGridCurrencyProperties } from '../../types/currency-properties';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-currency',
  templateUrl: './cell-editor-currency.component.html',
  styleUrls: ['./cell-editor-currency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyAutonumericModule,
    SkyI18nModule,
  ],
})
export class SkyAgGridCellEditorCurrencyComponent
  implements ICellEditorAngularComp
{
  public skyComponentProperties: SkyAgGridCurrencyProperties & {
    isCancellable: boolean;
  } = {
    isCancellable: false,
  };
  public columnHeader: string | undefined;
  public columnWidth: number | undefined;
  public currency = new UntypedFormControl();
  public editorForm = new UntypedFormGroup({
    currency: this.currency,
  });
  public params: SkyCellEditorCurrencyParams | undefined;
  public rowHeightWithoutBorders: number | undefined;
  public rowNumber: number | undefined;

  @ViewChild('skyCellEditorCurrency', { read: ElementRef })
  public input: ElementRef | undefined;

  @HostListener('focusout', ['$event'])
  public onFocusOut(event: FocusEvent): void {
    if (event.relatedTarget && event.relatedTarget === this.params?.eGridCell) {
      // If focus is being set to the grid cell, schedule focus on the input.
      // This happens when the refreshCells API is called.
      this.afterGuiAttached();
    }
  }

  #triggerType: SkyAgGridCellEditorInitialAction | undefined;
  readonly #changeDetector = inject(ChangeDetectorRef);
  #initialized = false;

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellEditorCurrencyParams): void {
    this.params = params;
    this.columnHeader = this.params.api.getDisplayNameForColumn(
      this.params.column,
      'header',
    );
    this.rowNumber = this.params.rowIndex + 1;
    this.columnWidth = this.params.column.getActualWidth();
    this.rowHeightWithoutBorders = SkyAgGridCellEditorUtils.subtractOrZero(
      this.params.node?.rowHeight,
      4,
    );
    this.skyComponentProperties = {
      ...(this.params.skyComponentProperties || {
        decimalPlaces: 2,
        currencySymbol: '$',
      }),
      isCancellable: false,
    };
  }

  public refresh(params: SkyCellEditorCurrencyParams): void {
    this.agInit(params);
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    // AG Grid sets focus to the cell via setTimeout, and this queues the input to focus after that.
    setTimeout(() => {
      this.input?.nativeElement.focus();

      // This setup is in `afterGuiAttached` due to the lifecycle of autonumeric which will highlight the initial value if it is in place when it renders.
      // Since we don't want that, we set the initial value after autonumeric initializes.
      this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(
        this.params,
      );
      const control = this.currency;

      if (control) {
        switch (this.#triggerType) {
          case SkyAgGridCellEditorInitialAction.Delete:
            control.setValue(undefined);
            break;
          case SkyAgGridCellEditorInitialAction.Replace:
            control.setValue(
              parseFloat(String(this.params?.eventKey)) || undefined,
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

      if (
        this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted &&
        (this.params?.value ?? '') !== ''
      ) {
        this.input?.nativeElement.select();
      }

      // When the cell is initialized with the Enter key, we need to suppress the first `onPressEnter`.
      this.#initialized = this.params?.eventKey !== 'Enter';
    });
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): number | undefined {
    return this.currency.value ?? undefined;
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

  public onPressEnter(): void {
    if (this.params && this.#initialized) {
      this.params.stopEditing();
    }
    this.#initialized = true;
  }
}

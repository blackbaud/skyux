import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyI18nModule } from '@skyux/i18n';

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
  imports: [FormsModule, ReactiveFormsModule, SkyI18nModule],
})
export class SkyAgGridCellEditorTextComponent implements ICellEditorAngularComp {
  public columnHeader: string | undefined;
  public editorForm = new UntypedFormGroup({
    text: new UntypedFormControl(),
  });
  public rowNumber: number | undefined;
  public maxlength: number | undefined;

  @ViewChild('skyCellEditorText', { read: ElementRef })
  public input: ElementRef | undefined;

  @HostListener('focusout', ['$event'])
  public onFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      event.relatedTarget === this.#params?.eGridCell
    ) {
      // If focus is being set to the grid cell, schedule focus on the input.
      // This happens when the refreshCells API is called.
      this.afterGuiAttached();
    } else if (event.target === this.input?.nativeElement) {
      this.#stopEditingOnBlur();
    }
  }

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
    this.columnHeader = this.#params.api.getDisplayNameForColumn(
      this.#params.column,
      'header',
    );
    this.rowNumber = this.#params.rowIndex + 1;
  }

  public refresh(params: SkyCellEditorTextParams): void {
    this.agInit(params);
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    // AG Grid sets focus to the cell via setTimeout, and this queues the input to focus after that.
    setTimeout(() => {
      if (this.input) {
        this.input.nativeElement.focus();
        if (
          this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted
        ) {
          this.input.nativeElement.select();
        }
      }
    });
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): string | undefined {
    return this.editorForm.get('text')?.value || undefined;
  }

  #stopEditingOnBlur(): void {
    if (this.#params?.api.getGridOption('stopEditingWhenCellsLoseFocus')) {
      this.#params?.api.stopEditing();
    }
  }
}

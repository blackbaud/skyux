import {
  ChangeDetectionStrategy,
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
import { SkyI18nModule } from '@skyux/i18n';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { ICellEditorAngularComp } from 'ag-grid-angular';

import { SkyAgGridAutocompleteProperties } from '../../types/autocomplete-properties';
import { SkyCellEditorAutocompleteParams } from '../../types/cell-editor-autocomplete-params';
import { SkyAgGridCellEditorInitialAction } from '../../types/cell-editor-initial-action';
import { SkyAgGridCellEditorUtils } from '../../types/cell-editor-utils';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-autocomplete',
  templateUrl: './cell-editor-autocomplete.component.html',
  styleUrls: ['./cell-editor-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyI18nModule,
  ],
})
export class SkyAgGridCellEditorAutocompleteComponent
  implements ICellEditorAngularComp
{
  public columnHeader: string | undefined;
  public editorForm = new UntypedFormGroup({
    selection: new UntypedFormControl(),
  });
  public rowNumber: number | undefined;
  public skyComponentProperties: SkyAgGridAutocompleteProperties = {};

  #autocompleteOpen = false;
  #triggerType: SkyAgGridCellEditorInitialAction | undefined;
  #params: SkyCellEditorAutocompleteParams | undefined;
  #elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

  @ViewChild('skyCellEditorAutocomplete', { read: ElementRef })
  public input: ElementRef | undefined;

  @HostListener('focusout', ['$event'])
  public onBlur(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      event.relatedTarget === this.#params?.eGridCell
    ) {
      // If focus is being set to the grid cell, schedule focus on the input.
      // This happens when the refreshCells API is called.
      this.afterGuiAttached();
    } else {
      this.#stopEditingOnBlur();
    }
  }

  public agInit(params: SkyCellEditorAutocompleteParams): void {
    this.#params = params;
    this.#triggerType = SkyAgGridCellEditorUtils.getEditorInitialAction(params);
    const control = this.editorForm.get('selection');
    if (control) {
      switch (this.#triggerType) {
        case SkyAgGridCellEditorInitialAction.Delete:
          control.setValue(undefined);
          break;
        case SkyAgGridCellEditorInitialAction.Replace:
        case SkyAgGridCellEditorInitialAction.Highlighted:
        case SkyAgGridCellEditorInitialAction.Untouched:
        default:
          control.setValue(params.value);
          break;
      }
    }

    this.columnHeader = this.#params.api.getDisplayNameForColumn(
      this.#params.column,
      'header',
    );
    this.rowNumber = (this.#params.node?.rowIndex ?? 0) + 1;
    this.skyComponentProperties = this.#params.skyComponentProperties || {};
  }

  public afterGuiAttached(): void {
    // AG Grid sets focus to the cell via setTimeout, and this queues the input to focus after that.
    setTimeout(() => {
      if (this.input) {
        this.input.nativeElement.focus();
        if (this.#triggerType === SkyAgGridCellEditorInitialAction.Replace) {
          const charPress = this.#params?.eventKey as string;

          this.input.nativeElement.select();
          this.input.nativeElement.setRangeText(charPress);
          // Ensure the cursor is at the end of the text.
          this.input.nativeElement.setSelectionRange(
            charPress.length,
            charPress.length,
          );
          this.input.nativeElement.dispatchEvent(new Event('input'));
        }
        if (
          this.#triggerType === SkyAgGridCellEditorInitialAction.Highlighted
        ) {
          this.input.nativeElement.select();
        }
      }
    });
  }

  public getValue(): any | undefined {
    const val = this.editorForm.get('selection')?.value;
    return val !== undefined && val !== null ? val : undefined;
  }

  public onAutocompleteOpenChange($event: boolean): void {
    this.#autocompleteOpen = $event;
    this.#stopEditingOnBlur();
  }

  #stopEditingOnBlur(): void {
    if (
      !this.#autocompleteOpen &&
      this.#params?.api.getGridOption('stopEditingWhenCellsLoseFocus') &&
      !this.#elementRef.nativeElement.matches(':focus-within')
    ) {
      this.#params?.api.stopEditing();
    }
  }
}

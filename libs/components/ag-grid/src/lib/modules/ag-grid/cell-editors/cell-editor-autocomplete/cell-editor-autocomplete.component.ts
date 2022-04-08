import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

import { SkyAgGridAutocompleteProperties } from '../../types/autocomplete-properties';
import { SkyCellEditorAutocompleteParams } from '../../types/cell-editor-autocomplete-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-editor-autocomplete',
  templateUrl: './cell-editor-autocomplete.component.html',
  styleUrls: ['./cell-editor-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellEditorAutocompleteComponent
  implements ICellEditorAngularComp
{
  public currentSelection: any;
  public columnHeader: string;
  public rowNumber: number;
  public skyComponentProperties: SkyAgGridAutocompleteProperties = {};
  private params: SkyCellEditorAutocompleteParams;

  @ViewChild('skyCellEditorAutocomplete', { read: ElementRef })
  public input: ElementRef;

  public agInit(params: SkyCellEditorAutocompleteParams) {
    this.params = params;
    this.currentSelection = this.params.value;
    this.columnHeader = this.params.colDef && this.params.colDef.headerName;
    this.rowNumber = this.params.rowIndex + 1;
    this.skyComponentProperties = this.params.skyComponentProperties || {};
  }

  public afterGuiAttached(): void {
    this.input.nativeElement.focus();
  }

  public getValue(): any {
    return this.currentSelection;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  ICellEditorAngularComp
} from 'ag-grid-angular';

import {
  ICellEditorParams
} from 'ag-grid-community';

import {
  Subject
} from 'rxjs/Subject';

@Component({
  selector: 'sky-ag-grid-cell-editor-number',
  templateUrl: './cell-editor-number.component.html',
  styleUrls: ['./cell-editor-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SkyAgGridCellEditorNumberComponent implements ICellEditorAngularComp, OnInit, OnDestroy {
  public value: number;
  public numberInputLabel: string;
  private params: ICellEditorParams;
  private columnHeader: string;
  private rowNumber: number;
  private ngUnsubscribe = new Subject<void>();

  @ViewChild('skyCellEditorNumber', {read: ElementRef})
  private input: ElementRef;

  constructor(
    private libResources: SkyLibResourcesService
  ) { }

  /**
   * agInit is called by agGrid once after the editor is created and provides the editor with the information it needs.
   * @param params The cell editor params that include data about the cell, column, row, and grid.
   */
  public agInit(params: ICellEditorParams): void {
    this.params = params;
    this.value = this.params.value;
    this.columnHeader = this.params.colDef.headerName;
    this.rowNumber = this.params.rowIndex + 1;
  }

  /**
   * afterGuiAttached is called by agGrid after the editor is rendered in the DOM. Once it is attached the editor is ready to be focused on.
   */
  public afterGuiAttached(): void {
    this.input.nativeElement.focus();
  }

  public ngOnInit(): void {
    this.libResources.getString('skyux_ag_grid_cell_editor_number_aria_label', this.columnHeader, this.rowNumber)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(label => {
        this.numberInputLabel = label;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * getValue is called by agGrid when editing is stopped to get the new value of the cell.
   */
  public getValue(): number {
    return this.value;
  }
}

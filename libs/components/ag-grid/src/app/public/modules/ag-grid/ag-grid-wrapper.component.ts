import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  AfterContentInit
} from '@angular/core';

import {
  AgGridAngular
} from 'ag-grid-angular';

import {
  SkyAgGridAdapterService
} from './ag-grid-adapter.service';

let idIndex = 0;

@Component({
  selector: 'sky-ag-grid-wrapper',
  templateUrl: './ag-grid-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAgGridWrapperComponent implements AfterContentInit {

  @ContentChild(AgGridAngular)
  public agGrid: AgGridAngular;

  public afterAnchorId: string;
  public beforeAnchorId: string;
  public gridId: string;
  public viewkeeperClasses: string[] = [];

  constructor(
    private adapterService: SkyAgGridAdapterService,
    private elementRef: ElementRef
  ) {
    idIndex++;
    this.afterAnchorId = 'sky-ag-grid-nav-anchor-after-' + idIndex;
    this.beforeAnchorId = 'sky-ag-grid-nav-anchor-before-' + idIndex;
    this.gridId = 'sky-ag-grid-' + idIndex;
  }

  public ngAfterContentInit(): void {
    if (this.agGrid.gridOptions && this.agGrid.gridOptions.domLayout === 'autoHeight') {
      this.viewkeeperClasses.push('.ag-header');
    }
  }

  public onGridKeydown(event: KeyboardEvent): void {
    const inEditMode = this.agGrid && this.agGrid.api.getEditingCells().length > 0;
    if (this.agGrid && !inEditMode && event.key === 'Tab') {
      const idToFocus = event.shiftKey ? this.beforeAnchorId : this.afterAnchorId;
      this.adapterService.setFocusedElementById(this.elementRef.nativeElement, idToFocus);
    }
  }

  public onAnchorFocus(event: FocusEvent): void {
    const gridId = this.gridId;
    const relatedTarget = event.relatedTarget as HTMLElement;
    const previousFocusedId = relatedTarget && relatedTarget.id;
    const previousWasCell = relatedTarget && !!this.adapterService.getElementOrParentWithClass(relatedTarget, 'ag-cell');

    if (previousFocusedId !== gridId && !previousWasCell) {
      this.adapterService.setFocusedElementById(this.elementRef.nativeElement, this.gridId);
    }
  }

  public onGridFocus(): void {
    const columns = this.agGrid.columnApi.getAllDisplayedColumns();
    const firstColumn = columns && columns[0];
    const rowIndex = this.agGrid.api.getFirstDisplayedRow();

    if (firstColumn && rowIndex >= 0) {
      this.agGrid.api.setFocusedCell(rowIndex, firstColumn);
    }
  }
}

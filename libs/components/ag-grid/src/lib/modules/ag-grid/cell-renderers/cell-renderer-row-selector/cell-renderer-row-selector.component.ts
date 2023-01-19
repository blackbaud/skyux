import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  RowNode,
  RowSelectedEvent,
} from 'ag-grid-community';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-row-selector',
  templateUrl: './cell-renderer-row-selector.component.html',
  styleUrls: ['./cell-renderer-row-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkyAgGridCellRendererRowSelectorComponent
  implements ICellRendererAngularComp
{
  public checked: boolean | undefined;
  public dataField: string | undefined;
  public rowNode: RowNode | undefined;
  public rowNumber: number | undefined;

  #params: ICellRendererParams | undefined;
  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  /**
   * agInit is called by agGrid once after the cell is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: ICellRendererParams): void {
    this.#params = params;
    this.dataField = this.#params.colDef?.field;
    this.rowNode = this.#params.node;
    this.rowNumber = this.#params.rowIndex + 1;

    if (this.dataField) {
      this.checked = this.#params.value;
      this.rowNode.setSelected(!!this.checked);
    } else {
      this.checked = this.rowNode.isSelected();
    }

    this.rowNode.addEventListener(
      RowNode.EVENT_ROW_SELECTED,
      (event: RowSelectedEvent) => {
        this.#rowSelectedListener(event);
      }
    );
  }

  /**
   * Used by agGrid to update cell value after a user triggers a refresh. It updates the cell DOM and returns true when the refresh is
   * successful, or false if the cell should be destroyed and rerendered. If consumers have external logic that changes the value of a
   * checkbox cell, rerendering it will guarantee the change applies without knowing the consumer's implementation.
   */
  public refresh(): boolean {
    return false;
  }

  public updateRow(): void {
    if (this.rowNode) {
      this.rowNode.setSelected(!!this.checked);

      if (this.dataField) {
        this.rowNode.data[this.dataField] = this.checked;
      }
    }
  }

  #rowSelectedListener(event: RowSelectedEvent): void {
    this.checked = event.node.isSelected();

    if (this.rowNode && this.dataField) {
      this.rowNode.data[this.dataField] = this.checked;
    }

    this.#changeDetector.markForCheck();
  }
}

import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  ICellRendererAngularComp
} from 'ag-grid-angular';

import {
  ICellRendererParams,
  RowNode,
  RowSelectedEvent
} from 'ag-grid-community';

import {
  Subject
} from 'rxjs/Subject';

@Component({
  selector: 'sky-ag-grid-cell-renderer-row-selector',
  templateUrl: './cell-renderer-row-selector.component.html',
  styleUrls: ['./cell-renderer-row-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAgGridCellRendererRowSelectorComponent implements ICellRendererAngularComp, OnInit, OnDestroy {
  public checked: boolean;
  public dataField: string;
  public rowNode: RowNode;
  public checkboxLabel: string;
  private params: ICellRendererParams;
  private rowNumber: number;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private changeDetection: ChangeDetectorRef,
    private libResources: SkyLibResourcesService
  ) { }

  /**
   * agInit is called by agGrid once after the cell is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: ICellRendererParams): void {
    this.params = params;
    this.checked = this.params.value;
    this.dataField = this.params.colDef && this.params.colDef.field;
    this.rowNode = this.params.node;
    this.rowNumber = this.params.rowIndex + 1;

    this.rowNode.addEventListener(RowNode.EVENT_ROW_SELECTED, (event: RowSelectedEvent) => { this.rowSelectedListener(event); });
    this.rowNode.setSelected(this.checked);
  }

  public ngOnInit(): void {
    this.libResources.getString('skyux_ag_grid_row_selector_aria_label', this.rowNumber)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(label => {
        this.checkboxLabel = label;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Used by agGrid to update cell value after a user triggers a refresh. It updates the cell DOM and returns true when the refresh is
   * successful, or false if the cell should be destroyed and rerendered. If consumers have external logic that changes the value of a
   * checkbox cell, rerendering it will gurantee the change applies without knowing the consumer's implementation.
   */
  public refresh(): boolean {
    return false;
  }

  public updateRow(): void {
    this.rowNode.setSelected(this.checked);
    this.rowNode.data[this.dataField] = this.checked;
  }

  private rowSelectedListener(event: RowSelectedEvent) {
    this.checked = event.node.isSelected();
    this.rowNode.data[this.dataField] = this.checked;
    this.changeDetection.markForCheck();
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IRowNode,
  RowNodeSelectedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, Subscription } from 'rxjs';

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
  implements ICellRendererAngularComp, OnDestroy
{
  public checked: boolean | undefined;
  public dataField: string | undefined;
  public rowNode: IRowNode | undefined;
  public rowNumber: number | undefined;

  protected readonly disabled = new BehaviorSubject(false);
  protected readonly label = new BehaviorSubject('');

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #labelResourceKey = 'sky_ag_grid_row_selector_aria_label';
  #params: ICellRendererParams | undefined;
  readonly #resources = inject(SkyLibResourcesService);
  #subscription = new Subscription();

  constructor() {
    this.#setDefaultLabel();
  }

  public ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }

  /**
   * agInit is called by agGrid once after the cell is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: ICellRendererParams): void {
    this.#setParameters(params);

    this.rowNode?.addEventListener('rowSelected', (event) => {
      this.#rowSelectedListener(event);
    });
  }

  /**
   * Used by agGrid to update cell value after a user triggers a refresh.
   * Returning true tells agGrid that the refresh was successful.
   */
  public refresh(params: ICellRendererParams): boolean {
    this.#setParameters(params);
    return true;
  }

  public updateRow(): void {
    if (this.rowNode) {
      const rowSelected = this.rowNode.isSelected();
      const rowChecked = !!this.checked;
      if (rowSelected !== rowChecked) {
        this.rowNode.setSelected(rowChecked);
      }

      if (this.dataField) {
        this.rowNode.data[this.dataField] = this.checked;
      }

      this.#changeDetector.markForCheck();
    }
  }

  #setParameters(params: ICellRendererParams): void {
    this.#params = params;
    this.disabled.next(this.#params?.node?.selectable === false);
    this.dataField = this.#params?.colDef?.field;
    this.rowNode = this.#params?.node as IRowNode | undefined;
    this.rowNumber = (this.#params?.node?.rowIndex ?? 0) + 1;

    this.#subscription.unsubscribe();
    this.#subscription = new Subscription();
    this.#subscription.add(
      this.label.subscribe(() => this.#changeDetector.markForCheck()),
    );
    if (typeof params.colDef?.cellRendererParams?.label === 'string') {
      this.label.next(params.colDef.cellRendererParams.label);
    } else if (typeof params.colDef?.cellRendererParams?.label === 'function') {
      const label = params.colDef.cellRendererParams.label(params.data);
      if (label.subscribe) {
        this.#subscription.add(
          label.subscribe((value: string) => this.label.next(value)),
        );
      } else {
        this.label.next(label);
      }
    } else {
      this.#setDefaultLabel();
    }

    const rowSelected = !!this.#params.node?.isSelected();

    if (this.dataField) {
      this.checked = !!this.#params.value;
      if (rowSelected !== this.checked) {
        this.rowNode?.setSelected(this.checked);
      }
    } else {
      this.checked = rowSelected;
    }

    this.#changeDetector.markForCheck();
  }

  #setDefaultLabel(): void {
    this.#subscription.add(
      this.#resources
        .getString(this.#labelResourceKey, this.rowNumber ?? '')
        .subscribe((value) => this.label.next(value)),
    );
  }

  #rowSelectedListener(event: RowNodeSelectedEvent): void {
    this.checked = event.node.isSelected();

    if (this.rowNode && this.dataField) {
      this.rowNode.data[this.dataField] = this.checked;
    }

    this.#changeDetector.markForCheck();
  }
}

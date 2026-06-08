import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IRowNode,
  RowNodeSelectedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, Subscription, isObservable } from 'rxjs';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-row-selector',
  templateUrl: './cell-renderer-row-selector.component.html',
  styleUrls: ['./cell-renderer-row-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [SkyCheckboxModule, AsyncPipe],
})
export class SkyAgGridCellRendererRowSelectorComponent
  implements ICellRendererAngularComp, OnDestroy
{
  public dataField: string | undefined;
  public rowNode: IRowNode | undefined;
  public rowNumber: number | undefined;

  protected checked = new BehaviorSubject(false);
  protected readonly disabled = new BehaviorSubject(false);
  protected readonly label = new BehaviorSubject('');

  readonly #labelResourceKey = 'sky_ag_grid_row_selector_aria_label';
  #params: ICellRendererParams | undefined;
  readonly #resources = inject(SkyLibResourcesService);
  #subscription = new Subscription();

  constructor() {
    this.#setLabel();
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
  }

  /**
   * Used by agGrid to update cell value after a user triggers a refresh.
   * Returning true tells agGrid that the refresh was successful.
   */
  public refresh(params: ICellRendererParams): boolean {
    this.#setParameters(params);
    return true;
  }

  public updateRow(rowChecked: boolean): void {
    this.checked.next(rowChecked);
    if (this.rowNode) {
      const rowSelected = this.rowNode.isSelected();
      if (rowSelected !== rowChecked) {
        this.rowNode.setSelected(rowChecked, undefined, 'checkboxSelected');
      }
      if (this.dataField) {
        this.rowNode.data[this.dataField] = this.checked.value;
      }
    }
  }

  #setParameters(params: ICellRendererParams): void {
    this.#params = params;
    this.disabled.next(this.#params?.node?.selectable === false);
    this.dataField = this.#params?.colDef?.field;
    this.rowNode = this.#params?.node as IRowNode | undefined;
    const rowIndex = this.rowNode?.rowIndex ?? NaN;
    this.rowNumber = Number.isNaN(rowIndex) ? undefined : rowIndex + 1;

    this.#subscription.unsubscribe();
    this.#subscription = new Subscription();
    this.#setLabel();

    const rowSelected = !!this.#params?.node?.isSelected();

    if (this.dataField) {
      this.checked.next(!!this.#params?.value);
      if (rowSelected !== this.checked.value) {
        this.rowNode?.setSelected(this.checked.value);
      }
    } else {
      this.checked.next(rowSelected);
    }

    const node = this.rowNode;
    const handler = (event: RowNodeSelectedEvent): void =>
      this.#rowSelectedListener(event);
    node?.addEventListener('rowSelected', handler);
    this.#subscription.add(() =>
      node?.removeEventListener('rowSelected', handler),
    );
  }

  #setLabel(): void {
    const cellRendererParamLabel =
      this.#params?.colDef?.cellRendererParams?.label;
    if (this.#params?.colDef && typeof cellRendererParamLabel === 'string') {
      this.label.next(this.#params.colDef.cellRendererParams.label);
    } else if (
      this.#params?.colDef &&
      typeof cellRendererParamLabel === 'function'
    ) {
      const label = this.#params.colDef.cellRendererParams.label(
        this.#params.data,
      );
      if (isObservable(label)) {
        this.#subscription.add(
          label.subscribe((value: unknown) => this.label.next(String(value))),
        );
      } else {
        this.label.next(label);
      }
    } else {
      this.#subscription.add(
        this.#resources
          .getString(this.#labelResourceKey, this.rowNumber ?? '')
          .subscribe((value) => this.label.next(value)),
      );
    }
  }

  #rowSelectedListener(event: RowNodeSelectedEvent): void {
    this.checked.next(!!event.node.isSelected());
    if (this.rowNode && this.dataField) {
      this.rowNode.data[this.dataField] = this.checked.value;
    }
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import {
  SkyCellRendererDateParams,
  SkyDatePipeOptions,
} from '../../types/cell-renderer-date-params';
import { SkyAgGridValidatorProperties } from '../../types/validator-properties';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-date',
  templateUrl: './cell-renderer-date.component.html',
  styleUrls: ['./cell-renderer-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellRendererDateComponent
  implements ICellRendererAngularComp
{
  @Input()
  public set params(value: SkyCellRendererDateParams) {
    this.agInit(value);
  }

  public columnHeader: string | undefined;
  public columnWidth: number | undefined;
  public rowHeightWithoutBorders: number | undefined;
  public rowNumber: number | undefined;
  public skyComponentProperties: SkyDatePipeOptions &
    SkyAgGridValidatorProperties = {};
  public dateOptions: SkyDatePipeOptions = {};
  public value: Date | string | undefined;

  /**
   * agInit is called by agGrid once after the renderer is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellRendererDateParams): void {
    this.#updateProperties(params);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public refresh(params: SkyCellRendererDateParams): boolean {
    return false;
  }

  #updateProperties(params: SkyCellRendererDateParams): void {
    this.value = params.value;
    this.columnHeader = params.colDef?.headerName;
    this.rowNumber = params.rowIndex + 1;
    this.columnWidth = params.column?.getActualWidth();
    this.rowHeightWithoutBorders =
      typeof params.node?.rowHeight === 'number'
        ? params.node?.rowHeight - 4
        : undefined;
    this.skyComponentProperties = params.skyComponentProperties || {};
    this.skyComponentProperties.locale ??= params.legacyLocale;
    this.skyComponentProperties.format ??= 'shortDate';
  }
}

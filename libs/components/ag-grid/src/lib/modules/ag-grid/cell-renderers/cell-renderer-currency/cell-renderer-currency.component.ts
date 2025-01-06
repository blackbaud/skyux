import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkyNumericOptions } from '@skyux/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { SkyCellRendererCurrencyParams } from '../../types/cell-renderer-currency-params';
import { SkyAgGridValidatorProperties } from '../../types/validator-properties';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-currency',
  templateUrl: './cell-renderer-currency.component.html',
  styleUrls: ['./cell-renderer-currency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyAgGridCellRendererCurrencyComponent
  implements ICellRendererAngularComp
{
  @Input()
  public set params(value: SkyCellRendererCurrencyParams) {
    this.agInit(value);
  }

  public columnWidth: number | undefined;
  public rowHeightWithoutBorders: number | undefined;
  public skyComponentProperties: SkyNumericOptions &
    SkyAgGridValidatorProperties = {};
  public numericOptions: SkyNumericOptions = {};
  public value: number | undefined;

  /**
   * agInit is called by agGrid once after the renderer is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellRendererCurrencyParams): void {
    this.#updateProperties(params);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public refresh(params: SkyCellRendererCurrencyParams): boolean {
    return false;
  }

  #updateProperties(params: SkyCellRendererCurrencyParams): void {
    this.value = params.value;
    this.columnWidth = params.column?.getActualWidth();
    this.rowHeightWithoutBorders =
      typeof params.node?.rowHeight === 'number'
        ? params.node?.rowHeight - 4
        : undefined;
    this.skyComponentProperties = params.skyComponentProperties || {};
    this.skyComponentProperties.format = 'currency';
    this.skyComponentProperties.minDigits = 2;
    this.skyComponentProperties.truncate = false;
  }
}

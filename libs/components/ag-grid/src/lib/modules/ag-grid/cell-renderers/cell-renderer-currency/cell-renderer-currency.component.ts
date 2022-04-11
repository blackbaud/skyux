import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NumericOptions } from '@skyux/core';

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
})
export class SkyAgGridCellRendererCurrencyComponent
  implements ICellRendererAngularComp
{
  @Input()
  public set params(value: SkyCellRendererCurrencyParams) {
    this.agInit(value);
  }

  public columnHeader: string;
  public columnWidth: number;
  public rowHeightWithoutBorders: number;
  public rowNumber: number;
  public skyComponentProperties: NumericOptions & SkyAgGridValidatorProperties =
    {};
  public numericOptions: NumericOptions = {};
  public value: number;

  private _params: SkyCellRendererCurrencyParams;

  /**
   * agInit is called by agGrid once after the renderer is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellRendererCurrencyParams) {
    this.updateProperties(params);
  }

  public refresh(params: SkyCellRendererCurrencyParams): boolean {
    return false;
  }

  private updateProperties(params: SkyCellRendererCurrencyParams) {
    this._params = params;
    this.value = this._params.value;
    this.columnHeader = this._params.colDef && this._params.colDef.headerName;
    this.rowNumber = this._params.rowIndex + 1;
    this.columnWidth = this._params.column?.getActualWidth();
    this.rowHeightWithoutBorders =
      this._params.node && this._params.node.rowHeight - 4;
    this.skyComponentProperties = this._params.skyComponentProperties || {};
    this.skyComponentProperties.format = 'currency';
    this.skyComponentProperties.minDigits = 2;
    this.skyComponentProperties.truncate = false;
  }
}

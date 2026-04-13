import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkyNumericModule, SkyNumericOptions } from '@skyux/core';

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
  imports: [SkyNumericModule],
})
export class SkyAgGridCellRendererCurrencyComponent implements ICellRendererAngularComp {
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
   * agInit is called by AG Grid once after the renderer is created and provides the renderer with the information it needs.
   */
  public agInit(params: SkyCellRendererCurrencyParams): void {
    this.#updateProperties(params);
  }

  /**
   * refresh is called by AG Grid to update the cell without destroying and recreating the component.
   */
  public refresh(params: SkyCellRendererCurrencyParams): boolean {
    this.agInit(params);
    return false;
  }

  #updateProperties(params: SkyCellRendererCurrencyParams): void {
    this.value = params.value;
    this.skyComponentProperties = params.skyComponentProperties || {};
    this.skyComponentProperties.format = 'currency';
    this.skyComponentProperties.minDigits = 2;
    this.skyComponentProperties.truncate = false;
  }
}

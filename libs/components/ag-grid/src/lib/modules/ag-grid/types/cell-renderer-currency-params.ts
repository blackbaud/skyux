import { SkyNumericOptions } from '@skyux/core';

import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * Parameters for the currency cell renderer.
 */
export interface SkyCellRendererCurrencyParams extends ICellRendererParams {
  /**
   * Options to pass to the `SkyNumericPipe` for formatting the cell value.
   * `format` is always set to `'currency'`. If not specified, `minDigits` defaults
   * to `2` and `truncate` defaults to `false`.
   */
  skyComponentProperties?: SkyNumericOptions & SkyAgGridValidatorProperties;
}

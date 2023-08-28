import { ICellRendererParams } from '@ag-grid-community/core';
import { NumericOptions } from '@skyux/core';

import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * @internal
 */
export interface SkyCellRendererCurrencyParams extends ICellRendererParams {
  skyComponentProperties?: NumericOptions & SkyAgGridValidatorProperties;
}

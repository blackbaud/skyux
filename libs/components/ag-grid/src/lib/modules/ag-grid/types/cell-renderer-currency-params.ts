import { NumericOptions } from '@skyux/core';

import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * @internal
 */
export interface SkyCellRendererCurrencyParams extends ICellRendererParams {
  skyComponentProperties?: NumericOptions & SkyAgGridValidatorProperties;
}

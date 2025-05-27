import type { NumericOptions } from '@skyux/core';

import type { ICellRendererParams } from 'ag-grid-community';

import type { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * @internal
 */
export interface SkyCellRendererCurrencyParams extends ICellRendererParams {
  skyComponentProperties?: NumericOptions & SkyAgGridValidatorProperties;
}

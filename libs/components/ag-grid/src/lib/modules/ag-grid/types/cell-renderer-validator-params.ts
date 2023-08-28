import { ICellRendererParams } from '@ag-grid-community/core';

import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * @internal
 */
export interface SkyCellRendererValidatorParams extends ICellRendererParams {
  skyComponentProperties?: SkyAgGridValidatorProperties;
}

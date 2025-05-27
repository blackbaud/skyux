import type { ICellRendererParams } from 'ag-grid-community';

import type { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * @internal
 */
export interface SkyCellRendererValidatorParams extends ICellRendererParams {
  skyComponentProperties?: SkyAgGridValidatorProperties;
}

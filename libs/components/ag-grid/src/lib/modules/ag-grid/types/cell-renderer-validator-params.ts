import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * @internal
 */
export interface SkyCellRendererValidatorParams extends ICellRendererParams {
  skyComponentProperties: SkyAgGridValidatorProperties;
}

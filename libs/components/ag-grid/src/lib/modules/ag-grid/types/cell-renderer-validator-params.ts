import { ICellRendererParams } from 'ag-grid-community';

import { ValidatorOptions } from './validator-options';

/**
 * @internal
 */
export interface SkyCellRendererValidatorParams extends ICellRendererParams {
  skyComponentProperties: ValidatorOptions;
}

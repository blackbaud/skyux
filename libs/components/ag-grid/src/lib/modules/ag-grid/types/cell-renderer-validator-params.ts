import { ICellRendererParams } from '@ag-grid-community/core';

import { ValidatorOptions } from './validator-options';

export interface SkyCellRendererValidatorParams extends ICellRendererParams {
  skyComponentProperties: ValidatorOptions;
}

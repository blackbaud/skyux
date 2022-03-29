import { NumericOptions } from '@skyux/core';

import { ICellRendererParams } from '@ag-grid-community/core';

import { ValidatorOptions } from './validator-options';

export interface SkyCellRendererCurrencyParams extends ICellRendererParams {
  skyComponentProperties?: NumericOptions & ValidatorOptions;
}

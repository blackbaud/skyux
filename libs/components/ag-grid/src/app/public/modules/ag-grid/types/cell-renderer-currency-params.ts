import {
  NumericOptions
} from '@skyux/core';

import {
  ICellRendererParams
} from 'ag-grid-community';

export interface SkyCellRendererCurrencyParams extends ICellRendererParams {
  skyComponentProperties?: NumericOptions;
}

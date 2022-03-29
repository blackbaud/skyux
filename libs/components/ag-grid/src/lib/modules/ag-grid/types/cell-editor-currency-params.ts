import { ICellEditorParams } from '@ag-grid-community/core';

import { SkyCurrencyProperties } from './currency-properties';

export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  skyComponentProperties?: SkyCurrencyProperties;
}

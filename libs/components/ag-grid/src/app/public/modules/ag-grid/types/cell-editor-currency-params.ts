import {
  ICellEditorParams
} from 'ag-grid-community';

import {
  SkyCurrencyProperties
} from './currency-properties';

export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  skyComponentProperties?: SkyCurrencyProperties;
}

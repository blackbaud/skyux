import { ICellEditorParams } from 'ag-grid-community';

import { SkyCurrencyProperties } from './currency-properties';

/**
 * @internal
 */
export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  skyComponentProperties?: SkyCurrencyProperties;
}

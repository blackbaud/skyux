import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridCurrencyProperties } from './currency-properties';

/**
 * @internal
 */
export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridCurrencyProperties;
}

import type { ICellEditorParams } from 'ag-grid-community';

import type { SkyAgGridCurrencyProperties } from './currency-properties';

/**
 * @internal
 */
export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridCurrencyProperties;
}

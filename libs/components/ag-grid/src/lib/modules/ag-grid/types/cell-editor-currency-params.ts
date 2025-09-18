import { ICellEditorParams } from 'ag-grid-community';

import type { SkyAgGridCurrencyProperties } from './currency-properties';

/**
 * @internal
 */
export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  /**
   * The parameters provided to the currency cell editor.
   */
  skyComponentProperties?: SkyAgGridCurrencyProperties;
}

import { ICellEditorParams } from 'ag-grid-community';

import type { SkyAgGridCurrencyProperties } from './currency-properties';

/**
 * @internal
 */
export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  /**
   * The parameters to configure the currency cell editor.
   */
  skyComponentProperties?: SkyAgGridCurrencyProperties;
}

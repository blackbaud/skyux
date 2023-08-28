import { ICellEditorParams } from '@ag-grid-community/core';

import type { SkyAgGridCurrencyProperties } from './currency-properties';

/**
 * @internal
 */
export interface SkyCellEditorCurrencyParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridCurrencyProperties;
}

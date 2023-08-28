import { ICellEditorParams } from '@ag-grid-community/core';

import { SkyAgGridNumberProperties } from './number-properties';

/**
 * @internal
 */
export interface SkyCellEditorNumberParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridNumberProperties;
}

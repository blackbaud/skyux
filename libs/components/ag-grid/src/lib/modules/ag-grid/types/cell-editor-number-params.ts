import type { ICellEditorParams } from 'ag-grid-community';

import type { SkyAgGridNumberProperties } from './number-properties';

/**
 * @internal
 */
export interface SkyCellEditorNumberParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridNumberProperties;
}

import { ICellEditorParams } from 'ag-grid-community';

import { SkyNumberProperties } from './number-properties';

/**
 * @internal
 */
export interface SkyCellEditorNumberParams extends ICellEditorParams {
  skyComponentProperties?: SkyNumberProperties;
}

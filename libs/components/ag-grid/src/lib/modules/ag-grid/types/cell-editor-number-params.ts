import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridNumberProperties } from './number-properties';

/**
 * @internal
 */
export interface SkyCellEditorNumberParams extends ICellEditorParams {
  /**
   * The parameters provided to the number cell editor.
   */
  skyComponentProperties?: SkyAgGridNumberProperties;
}

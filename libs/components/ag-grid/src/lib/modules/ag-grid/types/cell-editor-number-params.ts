import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridNumberProperties } from './number-properties';

/**
 * @internal
 */
export interface SkyCellEditorNumberParams extends ICellEditorParams {
  /**
   * The parameters to configure the number cell editor.
   */
  skyComponentProperties?: SkyAgGridNumberProperties;
}

import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridTextProperties } from './text-properties';

/**
 * @internal
 */
export interface SkyCellEditorTextParams extends ICellEditorParams {
  /**
   * The parameters to configure the text cell editor.
   */
  skyComponentProperties?: SkyAgGridTextProperties;
}

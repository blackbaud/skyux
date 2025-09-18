import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridTextProperties } from './text-properties';

/**
 * @internal
 */
export interface SkyCellEditorTextParams extends ICellEditorParams {
  /**
   * The parameters provided to the text cell editor.
   */
  skyComponentProperties?: SkyAgGridTextProperties;
}

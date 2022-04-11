import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridTextProperties } from './text-properties';

/**
 * @internal
 */
export interface SkyCellEditorTextParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridTextProperties;
}

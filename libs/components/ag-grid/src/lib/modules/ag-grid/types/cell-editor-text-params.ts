import type { ICellEditorParams } from 'ag-grid-community';

import type { SkyAgGridTextProperties } from './text-properties';

/**
 * @internal
 */
export interface SkyCellEditorTextParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridTextProperties;
}

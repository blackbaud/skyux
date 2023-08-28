import { ICellEditorParams } from '@ag-grid-community/core';

import { SkyAgGridTextProperties } from './text-properties';

/**
 * @internal
 */
export interface SkyCellEditorTextParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridTextProperties;
}

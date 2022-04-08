import { ICellEditorParams } from 'ag-grid-community';

import { SkyTextProperties } from './text-properties';

/**
 * @internal
 */
export interface SkyCellEditorTextParams extends ICellEditorParams {
  skyComponentProperties?: SkyTextProperties;
}

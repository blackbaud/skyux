import { ICellEditorParams } from 'ag-grid-community';

import { SkyTextProperties } from './text-properties';

export interface SkyCellEditorTextParams extends ICellEditorParams {
  skyComponentProperties?: SkyTextProperties;
}

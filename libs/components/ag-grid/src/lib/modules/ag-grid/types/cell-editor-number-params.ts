import { ICellEditorParams } from 'ag-grid-community';

import { SkyNumberProperties } from './number-properties';

export interface SkyCellEditorNumberParams extends ICellEditorParams {
  skyComponentProperties?: SkyNumberProperties;
}

import { ICellEditorParams } from 'ag-grid-community';

import { SkyDatepickerProperties } from './datepicker-properties';

export interface SkyCellEditorDatepickerParams extends ICellEditorParams {
  skyComponentProperties?: SkyDatepickerProperties;
}

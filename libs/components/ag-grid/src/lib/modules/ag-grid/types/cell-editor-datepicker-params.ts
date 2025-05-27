import type { ICellEditorParams } from 'ag-grid-community';

import type {
  SkyAgGridDatepickerProperties,
  SkyDatepickerProperties,
} from './datepicker-properties';

export interface SkyCellEditorDatepickerParams extends ICellEditorParams {
  skyComponentProperties?:
    | SkyDatepickerProperties
    | SkyAgGridDatepickerProperties;
}

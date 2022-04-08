import { ICellEditorParams } from 'ag-grid-community';

import {
  SkyAgGridDatepickerProperties,
  SkyDatepickerProperties,
} from './datepicker-properties';

/**
 * @internal
 */
export interface SkyCellEditorDatepickerParams extends ICellEditorParams {
  skyComponentProperties?:
    | SkyDatepickerProperties
    | SkyAgGridDatepickerProperties;
}

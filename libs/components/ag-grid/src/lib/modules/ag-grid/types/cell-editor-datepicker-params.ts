import { ICellEditorParams } from 'ag-grid-community';

import {
  SkyAgGridDatepickerProperties,
  SkyDatepickerProperties,
} from './datepicker-properties';

export interface SkyCellEditorDatepickerParams extends ICellEditorParams {
  /**
   * The parameters provided to the datepicker component.
   */
  skyComponentProperties?:
    | SkyDatepickerProperties
    | SkyAgGridDatepickerProperties;
}

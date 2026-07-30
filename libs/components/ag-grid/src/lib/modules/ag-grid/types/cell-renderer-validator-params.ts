import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * Parameters for cell renderers of columns that use validator cell types.
 */
export interface SkyCellRendererValidatorParams extends ICellRendererParams {
  /**
   * The validator properties used to validate the cell value and display a
   * validation message.
   */
  skyComponentProperties?: SkyAgGridValidatorProperties;
}

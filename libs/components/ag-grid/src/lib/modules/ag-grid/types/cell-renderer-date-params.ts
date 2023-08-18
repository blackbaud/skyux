import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridValidatorProperties } from './validator-properties';

/**
 * @internal
 */
export interface SkyCellRendererDateParams extends ICellRendererParams {
  skyComponentProperties?: SkyDatePipeOptions & SkyAgGridValidatorProperties;
  legacyLocale?: string;
}

/**
 * @internal
 */
export interface SkyDatePipeOptions {
  format?: string;
  locale?: string;
  placeholder?: string;
}

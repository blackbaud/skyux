import {
  GridOptions
} from 'ag-grid-community';

export interface SkyGetGridOptionsArgs {
  /**
   * agGrid gridOptions to override the default SKY UX grid options.
   */
  gridOptions: GridOptions;
  /**
   * the locale used in the date value formatter.
   */
  locale?: string;
}

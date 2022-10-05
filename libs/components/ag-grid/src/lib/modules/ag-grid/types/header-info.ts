import { Column } from 'ag-grid-community';

export interface SkyAgGridHeaderInfo {
  column: Column;
  displayName: string;
  /**
   * Application context as set on `gridOptions.context`.
   */
  context: any;
}

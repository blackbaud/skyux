import { ColumnGroup } from 'ag-grid-community';

export interface SkyAgGridHeaderGroupInfo {
  columnGroup: ColumnGroup;
  displayName: string;
  /**
   * Application context as set on `gridOptions.context`.
   */
  context: any;
}

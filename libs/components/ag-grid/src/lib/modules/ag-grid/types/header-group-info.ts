import { Injectable } from '@angular/core';

import { ColumnGroup } from 'ag-grid-community';

/**
 *
 */
@Injectable()
export class SkyAgGridHeaderGroupInfo {
  columnGroup: ColumnGroup;
  displayName: string;
  /**
   * Application context as set on `gridOptions.context`.
   */
  context: any;
}

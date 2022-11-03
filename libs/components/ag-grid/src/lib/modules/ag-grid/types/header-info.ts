import { Injectable } from '@angular/core';

import { Column } from 'ag-grid-community';

@Injectable()
export class SkyAgGridHeaderInfo {
  column: Column;
  displayName: string;
  /**
   * Application context as set on `gridOptions.context`.
   */
  context: any;
}

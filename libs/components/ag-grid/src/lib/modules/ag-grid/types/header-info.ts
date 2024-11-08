import { Injectable } from '@angular/core';

import { Column } from 'ag-grid-community';

/**
 * To display a help button beside the column header, create a component containing
 * [`sky-help-inline`](https://developer.blackbaud.com/skyux/components/help-inline),
 * and inject SkyAgGridHeaderInfo to access the column information, such
 * as display name.
 * Add the component to the `headerComponentParams.inlineHelpComponent`
 * property of the [column definition](https://www.ag-grid.com/angular-data-grid/column-definitions/).
 * @see SkyAgGridHeaderParams
 */
@Injectable()
export class SkyAgGridHeaderInfo {
  /**
   * [Column information from AG Grid](https://www.ag-grid.com/angular-data-grid/column-object/).
   */
  public column: Column | undefined;
  /**
   * Display name of the column.
   */
  public displayName: string | undefined;
  /**
   * AG Grid's [`context` field](https://www.ag-grid.com/angular-data-grid/context/).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public context: any;
}

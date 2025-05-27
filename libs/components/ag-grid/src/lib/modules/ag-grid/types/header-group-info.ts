import { Injectable } from '@angular/core';

import type { ColumnGroup } from 'ag-grid-community';

/**
 * To display a help button beside the column group header, create a component containing
 * [`sky-help-inline`](https://developer.blackbaud.com/skyux/components/help-inline),
 * and inject SkyAgGridHeaderGroupInfo to access the column group
 * information, such as display name.
 * Add the component to the `headerGroupComponentParams.inlineHelpComponent`
 * property of the [column group definition](https://www.ag-grid.com/angular-data-grid/column-groups/).
 * @see SkyAgGridHeaderGroupParams
 */
@Injectable()
export class SkyAgGridHeaderGroupInfo {
  /**
   * [Column group information from AG Grid](https://www.ag-grid.com/angular-data-grid/column-object-group/).
   */
  public columnGroup: ColumnGroup | undefined;
  /**
   * Display name of the column group.
   */
  public displayName: string | undefined;
  /**
   * AG Grid's [`context` field](https://www.ag-grid.com/angular-data-grid/context/).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public context: any;
}

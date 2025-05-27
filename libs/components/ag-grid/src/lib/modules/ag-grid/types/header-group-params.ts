import type { Type } from '@angular/core';

import type { IHeaderGroupParams } from 'ag-grid-community';

/**
 * Interface to use for the
 * [`headerGroupComponentParams`](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-groupsHeader-headerGroupComponentParams)
 * property on `ColGroupDef`.
 */
export interface SkyAgGridHeaderGroupParams extends IHeaderGroupParams {
  /**
   * The component to display as inline help beside the column group header.
   * @see SkyAgGridHeaderGroupInfo
   */
  inlineHelpComponent?: Type<unknown>;
}

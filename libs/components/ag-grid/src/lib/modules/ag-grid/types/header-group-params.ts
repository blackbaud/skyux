import { ComponentType } from '@angular/cdk/portal';

import { IHeaderGroupParams } from 'ag-grid-community';

/**
 * Interface to use for the
 * [`headerGroupComponentParams`](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-groupsHeader-headerGroupComponentParams)
 * property on `ColDef`.
 */
export interface SkyAgGridHeaderGroupParams extends IHeaderGroupParams {
  inlineHelpComponent?: ComponentType<unknown>;
}

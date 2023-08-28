import { IHeaderGroupParams } from '@ag-grid-community/core';
import { Type } from '@angular/core';

/**
 * Interface to use for the
 * [`headerGroupComponentParams`](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-groupsHeader-headerGroupComponentParams)
 * property on `ColDef`.
 */
export interface SkyAgGridHeaderGroupParams extends IHeaderGroupParams {
  inlineHelpComponent?: Type<unknown>;
}

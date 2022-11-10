import { Type } from '@angular/core';

import { IHeaderParams } from 'ag-grid-community/dist/lib/headerRendering/cells/column/headerComp';

/**
 * Interface to use for the
 * [`headerComponentParams`](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-header-headerComponentParams)
 * property on `ColDef`.
 */
export interface SkyAgGridHeaderParams extends IHeaderParams {
  inlineHelpComponent?: Type<unknown>;
}

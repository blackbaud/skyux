import { IHeaderParams } from '@ag-grid-community/core';
import { Type } from '@angular/core';

/**
 * Interface to use for the
 * [`headerComponentParams`](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-header-headerComponentParams)
 * property on `ColDef`.
 */
export interface SkyAgGridHeaderParams extends IHeaderParams {
  inlineHelpComponent?: Type<unknown>;
}

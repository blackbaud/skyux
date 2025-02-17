import { AsyncList } from '@skyux/list-builder-common';

import { SkyGridColumnModel } from '../../grid/grid-column.model';

/**
 * @internal
 * @deprecated
 */
export class GridStateModel {
  public columns: AsyncList<SkyGridColumnModel> =
    new AsyncList<SkyGridColumnModel>();
  public displayedColumns: AsyncList<SkyGridColumnModel> =
    new AsyncList<SkyGridColumnModel>();
}

import { SkyGridColumnModel } from '@skyux/grids';
import { AsyncList } from '@skyux/list-builder-common';

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

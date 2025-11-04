import { AsyncList } from '@skyux/list-builder-common';

import { SkyGridLegacyColumnModel } from '../../grid/grid-column.model';

/**
 * @internal
 * @deprecated
 */
export class GridStateModel {
  public columns: AsyncList<SkyGridLegacyColumnModel> =
    new AsyncList<SkyGridLegacyColumnModel>();
  public displayedColumns: AsyncList<SkyGridLegacyColumnModel> =
    new AsyncList<SkyGridLegacyColumnModel>();
}

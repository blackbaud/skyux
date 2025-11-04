import { SkyGridLegacyColumnModel } from '../../../grid/grid-column.model';

/**
 * @internal
 * @deprecated
 */
export class ListViewDisplayedGridColumnsLoadAction {
  constructor(
    public columns: SkyGridLegacyColumnModel[],
    public refresh = false,
  ) {}
}

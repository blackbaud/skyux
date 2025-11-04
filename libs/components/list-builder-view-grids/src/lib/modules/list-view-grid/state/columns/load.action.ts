import { SkyGridLegacyColumnModel } from '../../../grid/grid-column.model';

/**
 * @internal
 * @deprecated
 */
export class ListViewGridColumnsLoadAction {
  constructor(
    public columns: SkyGridLegacyColumnModel[],
    public refresh = false,
  ) {}
}

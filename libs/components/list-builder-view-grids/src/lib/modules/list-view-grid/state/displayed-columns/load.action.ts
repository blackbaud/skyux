import { SkyGridColumnModel } from '@skyux/grids';

/**
 * @internal
 * @deprecated
 */
export class ListViewDisplayedGridColumnsLoadAction {
  constructor(
    public columns: SkyGridColumnModel[],
    public refresh = false,
  ) {}
}

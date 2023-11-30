import { SkyGridColumnModel } from '@skyux/grids';

/**
 * @internal
 * @deprecated
 */
export class ListViewDisplayedGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {}
}

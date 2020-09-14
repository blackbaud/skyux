import { SkyGridColumnModel } from '@skyux/grids';

/**
 * @internal
 */
export class ListViewDisplayedGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {
  }
}

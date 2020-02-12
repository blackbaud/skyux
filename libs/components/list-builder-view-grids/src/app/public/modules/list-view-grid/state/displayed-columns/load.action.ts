import { SkyGridColumnModel } from '@skyux/grids';

export class ListViewDisplayedGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {
  }
}

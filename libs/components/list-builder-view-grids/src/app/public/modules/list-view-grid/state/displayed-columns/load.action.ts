import { SkyGridColumnModel } from '@skyux/grids/modules/grid/grid-column.model';

export class ListViewDisplayedGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {
  }
}

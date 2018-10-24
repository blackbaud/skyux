import { SkyGridColumnModel } from '@skyux/grids/modules/grid/grid-column.model';

export class ListViewGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {
  }
}

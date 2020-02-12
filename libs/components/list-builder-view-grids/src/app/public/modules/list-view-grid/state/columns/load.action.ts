import { SkyGridColumnModel } from '@skyux/grids';

export class ListViewGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {
  }
}

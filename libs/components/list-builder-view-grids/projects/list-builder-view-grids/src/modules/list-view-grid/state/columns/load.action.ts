import { SkyGridColumnModel } from '@skyux/grids';

/**
 * @internal
 */
export class ListViewGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {
  }
}

import { SkyGridColumnModel } from '@skyux/grids';

/**
 * @internal
 * @deprecated
 */
export class ListViewGridColumnsLoadAction {
  constructor(
    public columns: Array<SkyGridColumnModel>,
    public refresh: boolean = false
  ) {}
}

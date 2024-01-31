import { SkyGridColumnModel } from '@skyux/grids';

/**
 * @internal
 * @deprecated
 */
export class ListViewGridColumnsLoadAction {
  constructor(
    public columns: SkyGridColumnModel[],
    public refresh = false,
  ) {}
}

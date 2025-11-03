import { SkyGridColumnModel } from '../../../grid/grid-column.model';

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

import { SkyGridColumnModel } from '../../../grid/grid-column.model';

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

import { ListItemModel } from '@skyux/list-builder-common';

/**
 * @internal
 * @deprecated
 */
export class ListItemsLoadAction {
  constructor(
    public items: ListItemModel[],
    public refresh = false,
    public dataChanged = true,
    public count?: number,
  ) {}
}

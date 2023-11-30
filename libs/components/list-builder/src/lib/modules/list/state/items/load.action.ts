import { ListItemModel } from '@skyux/list-builder-common';

/**
 * @internal
 * @deprecated
 */
export class ListItemsLoadAction {
  constructor(
    public items: Array<ListItemModel>,
    public refresh: boolean = false,
    public dataChanged: boolean = true,
    public count?: number
  ) {}
}

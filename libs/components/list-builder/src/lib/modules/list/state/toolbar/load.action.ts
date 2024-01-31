import { ListToolbarItemModel } from './toolbar-item.model';

/**
 * @internal
 * @deprecated
 */
export class ListToolbarItemsLoadAction {
  constructor(
    public items: ListToolbarItemModel[],
    public index = -1,
  ) {}
}

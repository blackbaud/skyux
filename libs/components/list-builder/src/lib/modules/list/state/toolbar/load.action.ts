import { ListToolbarItemModel } from './toolbar-item.model';

/**
 * @internal
 */
export class ListToolbarItemsLoadAction {
  constructor(
    public items: ListToolbarItemModel[],
    public index: number = -1
  ) {}
}

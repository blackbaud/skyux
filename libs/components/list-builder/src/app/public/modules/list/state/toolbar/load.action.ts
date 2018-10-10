import { ListToolbarItemModel } from './toolbar-item.model';

export class ListToolbarItemsLoadAction {
  constructor(public items: ListToolbarItemModel[], public index: number = -1) {

  }
}

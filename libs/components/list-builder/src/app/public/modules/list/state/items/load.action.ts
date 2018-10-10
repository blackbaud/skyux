import { ListItemModel } from './item.model';

export class ListItemsLoadAction {
  constructor(
    public items: Array<ListItemModel>,
    public refresh: boolean = false,
    public dataChanged: boolean = true,
    public count?: number
  ) {
  }
}

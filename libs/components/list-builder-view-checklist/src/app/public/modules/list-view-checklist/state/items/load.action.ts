import { ListViewChecklistItemModel } from './item.model';

export class ListViewChecklistItemsLoadAction {
  constructor(
    public items: Array<ListViewChecklistItemModel> = [],
    public refresh: boolean = false,
    public dataChanged: boolean = true,
    public itemCount: number = items.length
  ) {

  }
}

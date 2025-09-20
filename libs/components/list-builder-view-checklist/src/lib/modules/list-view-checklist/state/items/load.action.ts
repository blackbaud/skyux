import { ListViewChecklistItemModel } from './item.model';

/**
 * @deprecated
 */
export class ListViewChecklistItemsLoadAction {
  constructor(
    public items: ListViewChecklistItemModel[] = [],
    public refresh = false,
    public dataChanged = true,
    public itemCount: number = items.length,
  ) {}
}

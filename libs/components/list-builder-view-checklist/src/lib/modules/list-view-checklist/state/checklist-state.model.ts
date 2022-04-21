import { AsyncList } from '@skyux/list-builder-common';

import { ListViewChecklistItemModel } from './items/item.model';

/**
 * @deprecated
 */
export class ChecklistStateModel {
  public items: AsyncList<ListViewChecklistItemModel> =
    new AsyncList<ListViewChecklistItemModel>();
}

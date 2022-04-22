import { AsyncList } from '@skyux/list-builder-common';

import { ChecklistStateOrchestrator } from '../checklist-state.rxstate';

import { ListViewChecklistItemModel } from './item.model';
import { ListViewChecklistItemsLoadAction } from './load.action';

/**
 * @deprecated
 */
export class ListViewChecklistItemsOrchestrator extends ChecklistStateOrchestrator<
  AsyncList<ListViewChecklistItemModel>
> {
  /* istanbul ignore next */
  constructor() {
    super();
    this.register(ListViewChecklistItemsLoadAction, this.load);
  }

  private load(
    state: AsyncList<ListViewChecklistItemModel>,
    action: ListViewChecklistItemsLoadAction
  ): AsyncList<ListViewChecklistItemModel> {
    const newListItems = action.items.map(
      (item) => new ListViewChecklistItemModel(item.id, item)
    );

    if (action.refresh) {
      return new AsyncList<ListViewChecklistItemModel>(
        [...newListItems],
        action.dataChanged ? Date.now() : state.lastUpdate,
        false,
        state.count
      );
    }

    return new AsyncList<ListViewChecklistItemModel>(
      [...state.items, ...newListItems],
      action.dataChanged ? Date.now() : state.lastUpdate,
      false,
      action.itemCount
    );
  }
}

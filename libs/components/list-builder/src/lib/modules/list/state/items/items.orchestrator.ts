import { ListItemModel } from '@skyux/list-builder-common';

import { AsyncList } from '@skyux/list-builder-common';

import { ListStateOrchestrator } from '../list-state.rxstate';

import { ListItemsLoadAction } from './load.action';

import { ListItemsSetLoadingAction } from './set-loading.action';

import { ListItemsSetSelectedAction } from './set-items-selected.action';

/**
 * @internal
 */
export class ListItemsOrchestrator extends ListStateOrchestrator<
  AsyncList<ListItemModel>
> {
  /* istanbul ignore next */
  constructor() {
    super();

    this.register(ListItemsSetLoadingAction, this.setLoading)
      .register(ListItemsLoadAction, this.load)
      .register(ListItemsSetSelectedAction, this.setItemsSelected);
  }

  private setLoading(
    state: AsyncList<ListItemModel>,
    action: ListItemsSetLoadingAction
  ): AsyncList<ListItemModel> {
    return new AsyncList<ListItemModel>(
      state.items,
      state.lastUpdate,
      action.loading,
      state.count
    );
  }

  private load(
    state: AsyncList<ListItemModel>,
    action: ListItemsLoadAction
  ): AsyncList<ListItemModel> {
    const newListItems = action.items.map(
      (g) => new ListItemModel(g.id, g.data, g.isSelected)
    );
    const resultItems = action.refresh
      ? [...newListItems]
      : [...state.items, ...newListItems];

    const count = action.count === undefined ? resultItems.length : action.count;
    return new AsyncList<ListItemModel>(
      resultItems,
      action.dataChanged ? Date.now() : state.lastUpdate,
      false,
      count
    );
  }

  private setItemsSelected(
    state: AsyncList<ListItemModel>,
    action: ListItemsSetSelectedAction
  ): AsyncList<ListItemModel> {
    /* istanbul ignore next */
    const newSelectedIds = action.items || [];
    const newListItemModels = this.cloneListItemModelArray(state.items);

    if (action.refresh) {
      newListItemModels.forEach((item) => (item.isSelected = undefined));
    }

    newSelectedIds.map((s) => {
      const newItem = newListItemModels.find((i) => i.id === s);
      /* istanbul ignore next */
      if (newItem) {
        newItem.isSelected = action.selected;
      }
    });

    return new AsyncList<ListItemModel>(
      newListItemModels,
      Date.now(),
      state.loading,
      state.count
    );
  }

  private cloneListItemModelArray(
    source: Array<ListItemModel>
  ): ListItemModel[] {
    const newListItems: Array<ListItemModel> = [];
    source.forEach((item) => {
      newListItems.push(
        new ListItemModel(
          item.id,
          Object.assign({}, item.data),
          item.isSelected
        )
      );
    });
    return newListItems;
  }
}

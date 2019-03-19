import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  AsyncList
} from 'microedge-rxstate/dist';

import {
  ListStateOrchestrator
} from '../list-state.rxstate';

import {
  ListItemsLoadAction,
  ListItemsSetLoadingAction,
  ListItemsSetSelectedAction
} from './actions';

export class ListItemsOrchestrator extends ListStateOrchestrator<AsyncList<ListItemModel>> {
  /* istanbul ignore next */
  constructor() {
    super();

    this
      .register(ListItemsSetLoadingAction, this.setLoading)
      .register(ListItemsLoadAction, this.load)
      .register(ListItemsSetSelectedAction, this.setItemsSelected);
  }

  private setLoading(
    state: AsyncList<ListItemModel>,
    action: ListItemsSetLoadingAction
  ): AsyncList<ListItemModel> {
    return new AsyncList<ListItemModel>(state.items, state.lastUpdate, action.loading, state.count);
  }

  private load(
    state: AsyncList<ListItemModel>,
    action: ListItemsLoadAction
  ): AsyncList<ListItemModel> {
    const newListItems = action.items.map(g => new ListItemModel(g.id, g.data, g.isSelected));
    const resultItems = (action.refresh) ? [...newListItems] : [...state.items, ...newListItems];

    let count = action.count === undefined ? resultItems.length : action.count;
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
    let newListItems = this.cloneListItemModelArray(state.items);

    action.items.map(s => {
      let newItem = newListItems.find(i => i.id === s);
      if (newItem) {
        newItem.isSelected = action.selected;
      }
    });

    return new AsyncList<ListItemModel>(
      newListItems,
      Date.now(),
      state.loading,
      state.count
    );
  }

  private cloneListItemModelArray(source: Array<ListItemModel>) {
    let newListItems: Array<ListItemModel> = [];
    source.forEach(item => {
      newListItems.push(
        new ListItemModel(item.id, Object.assign({}, item.data), item.isSelected)
      );
    });
    return newListItems;
  }
}

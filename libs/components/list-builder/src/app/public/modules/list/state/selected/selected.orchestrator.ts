import { ListStateOrchestrator } from '../list-state.rxstate';
import { AsyncItem } from 'microedge-rxstate/dist';

import { ListSelectedModel } from './selected.model';
import {
  ListSelectedLoadAction,
  ListSelectedSetLoadingAction,
  ListSelectedSetItemSelectedAction,
  ListSelectedSetItemsSelectedAction
} from './actions';

export class ListSelectedOrchestrator extends ListStateOrchestrator<AsyncItem<ListSelectedModel>> {
  /* istanbul ignore next */
  constructor() {
    super();

    this
      .register(ListSelectedSetLoadingAction, this.setLoading)
      .register(ListSelectedSetItemSelectedAction, this.setItemSelected)
      .register(ListSelectedSetItemsSelectedAction, this.setItemsSelected)
      .register(ListSelectedLoadAction, this.load);
  }

  private setLoading(
    state: AsyncItem<ListSelectedModel>,
    action: ListSelectedSetLoadingAction
  ): AsyncItem<ListSelectedModel> {
    return new AsyncItem<ListSelectedModel>(state.item, state.lastUpdate, action.loading);
  }

  private load(
    state: AsyncItem<ListSelectedModel>,
    action: ListSelectedLoadAction
  ): AsyncItem<ListSelectedModel> {
    const newSelected = new ListSelectedModel();
    action.items.map(s => newSelected.selectedIdMap.set(s, true));

    return new AsyncItem<ListSelectedModel>(
      Object.assign({}, state.item, newSelected),
      Date.now(),
      false
    );
  }

  private setItemSelected(
    state: AsyncItem<ListSelectedModel>,
    action: ListSelectedSetItemSelectedAction
  ): AsyncItem<ListSelectedModel> {
    const newSelected = this.cloneListSelectedModel(state.item);

    newSelected.selectedIdMap.set(action.id, action.selected);

    return new AsyncItem<ListSelectedModel>(newSelected, state.lastUpdate, state.loading);
  }

  private setItemsSelected(
    state: AsyncItem<ListSelectedModel>,
    action: ListSelectedSetItemsSelectedAction
  ): AsyncItem<ListSelectedModel> {
    const newSelected = action.refresh ? new ListSelectedModel() : this.cloneListSelectedModel(state.item);

    action.items.map(s => newSelected.selectedIdMap.set(s, action.selected));

    return new AsyncItem<ListSelectedModel>(newSelected, state.lastUpdate, state.loading);
  }

  private cloneListSelectedModel(source: ListSelectedModel) {
    let newListItems = new ListSelectedModel();
    newListItems.selectedIdMap = new Map<string, boolean>(source.selectedIdMap);

    return newListItems;
  }
}

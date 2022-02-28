import { AsyncItem } from '@skyux/list-builder-common';

import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';

import { ListStateOrchestrator } from '../list-state.rxstate';

import { ListSelectedModel } from './selected.model';

import { ListSelectedSetLoadingAction } from './set-loading.action';

import { ListSelectedSetItemSelectedAction } from './set-item-selected.action';

import { ListSelectedSetItemsSelectedAction } from './set-items-selected.action';

import { ListSelectedLoadAction } from './load.action';

/**
 * @internal
 */
export class ListSelectedOrchestrator extends ListStateOrchestrator<
  AsyncItem<ListSelectedModel>
> {
  /* istanbul ignore next */
  constructor() {
    super();

    this.register(ListSelectedSetLoadingAction, this.setLoading)
      .register(ListSelectedSetItemSelectedAction, this.setItemSelected)
      .register(ListSelectedSetItemsSelectedAction, this.setItemsSelected)
      .register(ListSelectedLoadAction, this.load);
  }

  private setLoading(
    state: AsyncItem<ListSelectedModel>,
    action: ListSelectedSetLoadingAction
  ): AsyncItem<ListSelectedModel> {
    return new AsyncItem<ListSelectedModel>(
      state.item,
      state.lastUpdate,
      action.loading
    );
  }

  private load(
    state: AsyncItem<ListSelectedModel>,
    action: ListSelectedLoadAction
  ): AsyncItem<ListSelectedModel> {
    const newSelected = new ListSelectedModel();
    action.items.map((s) => newSelected.selectedIdMap.set(s, true));

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

    return new AsyncItem<ListSelectedModel>(
      newSelected,
      state.lastUpdate,
      state.loading
    );
  }

  private setItemsSelected(
    state: AsyncItem<ListSelectedModel>,
    action: ListSelectedSetItemsSelectedAction
  ): AsyncItem<ListSelectedModel> {
    const newSelectedIds = action.items || [];
    const newListSelectedModel = action.refresh
      ? new ListSelectedModel()
      : this.cloneListSelectedModel(state.item);

    if (newSelectedIds instanceof Observable) {
      newSelectedIds.pipe(take(1)).subscribe((selectedIds) => {
        selectedIds.map((s) =>
          newListSelectedModel.selectedIdMap.set(s, action.selected)
        );
      });
    } else {
      newSelectedIds.map((s) =>
        newListSelectedModel.selectedIdMap.set(s, action.selected)
      );
    }

    return new AsyncItem<ListSelectedModel>(
      newListSelectedModel,
      state.lastUpdate,
      state.loading
    );
  }

  private cloneListSelectedModel(source: ListSelectedModel) {
    const newListItems = new ListSelectedModel();
    newListItems.selectedIdMap = new Map<string, boolean>(source.selectedIdMap);

    return newListItems;
  }
}

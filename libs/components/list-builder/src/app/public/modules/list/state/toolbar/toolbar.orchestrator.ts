import {
  ListStateOrchestrator
} from '../list-state.rxstate';

import {
  ListToolbarModel
} from './toolbar.model';

import {
  ListToolbarItemModel
} from './toolbar-item.model';

import {
  ListToolbarItemsLoadAction
} from './load.action';

import {
  ListToolbarItemsRemoveAction
} from './remove.action';

import {
  ListToolbarSetExistsAction
} from './set-exists.action';

import {
  ListToolbarSetTypeAction
} from './set-type.action';

import {
  ListToolbarItemsDisableAction
} from './disable.action';

import {
  ListToolbarShowMultiselectToolbarAction
} from './show-multiselect-toolbar.action';

export class ListToolbarOrchestrator
  extends ListStateOrchestrator<ListToolbarModel> {
  /* istanbul ignore next */
  constructor() {
    super();

    this
      .register(ListToolbarSetExistsAction, this.setExists)
      .register(ListToolbarItemsDisableAction, this.setDisabled)
      .register(ListToolbarItemsLoadAction, this.load)
      .register(ListToolbarSetTypeAction, this.setType)
      .register(ListToolbarItemsRemoveAction, this.remove)
      .register(ListToolbarShowMultiselectToolbarAction, this.showMultiselectToolbar);
  }

  private setExists(
    state: ListToolbarModel,
    action: ListToolbarSetExistsAction
  ): ListToolbarModel {
    const newModel = new ListToolbarModel(state);
    newModel.exists = action.exists;
    return newModel;
  }

  private setDisabled(
    state: ListToolbarModel,
    action: ListToolbarItemsDisableAction
  ): ListToolbarModel {
    const newModel = new ListToolbarModel(state);
    newModel.disabled = action.disable;
    return newModel;
  }

  private setType(
    state: ListToolbarModel,
    action: ListToolbarSetTypeAction
  ): ListToolbarModel {
    const newModel = new ListToolbarModel(state);
    newModel.type = action.type;
    return newModel;
  }

  private load(
    state: ListToolbarModel,
    action: ListToolbarItemsLoadAction
  ): ListToolbarModel {
    const newModel = new ListToolbarModel(state);

    const newListItems = action.items.map(item => {
      /**
       * NOTE: Originally this function went off the action index and item models did not include
       * the index. We changed this but must leave functionality to convert the action index for
       * backwards compatibility.
       */
      if (!item.index) {
        item.index = action.index;
      }
      return new ListToolbarItemModel(item);
    });

    let items = [...state.items, ...newListItems];
    items = items.sort((a, b) => {
      if (a.index < b.index) {
        return -1;
      } else if (a.index > b.index) {
        return 1;
      } else {
        return 0;
      }
    });

    newModel.items = items;

    return newModel;
  }

  private remove(
    state: ListToolbarModel,
    action: ListToolbarItemsRemoveAction
  ): ListToolbarModel {
    const newModel = new ListToolbarModel(state);

    newModel.items = newModel.items.filter((item: ListToolbarItemModel) => {
      return action.ids.indexOf(item.id) === -1;
    });

    return newModel;
  }

  private showMultiselectToolbar(
    state: ListToolbarModel,
    action: ListToolbarShowMultiselectToolbarAction
  ): ListToolbarModel {
    const newModel = new ListToolbarModel(state);
    newModel.showMultiselectToolbar = action.exists;
    return newModel;
  }
}

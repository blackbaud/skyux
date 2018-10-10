import { ListStateOrchestrator } from '../list-state.rxstate';
import { ListToolbarModel } from './toolbar.model';
import { ListToolbarItemModel } from './toolbar-item.model';
import {
  ListToolbarItemsLoadAction,
  ListToolbarItemsRemoveAction,
  ListToolbarSetExistsAction,
  ListToolbarSetTypeAction,
  ListToolbarItemsDisableAction
} from './actions';

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
      .register(ListToolbarItemsRemoveAction, this.remove);
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
    const newListItems = action.items.map(item => new ListToolbarItemModel(item));

    let resultItems = [...state.items];
    if (action.index === -1 || action.index > state.items.length) {
      resultItems = [...resultItems, ...newListItems];
    } else if (action.index === 0) {
      resultItems = [...newListItems, ...resultItems];
    } else {
      newListItems.reverse().forEach(item => resultItems.splice(action.index, 0, item));
    }

    newModel.items = resultItems;

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
}

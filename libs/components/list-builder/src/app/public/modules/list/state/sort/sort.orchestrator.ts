import { ListStateOrchestrator } from '../list-state.rxstate';
import { ListSortModel } from './sort.model';
import { ListSortLabelModel } from './label.model';
import {
  ListSortSetFieldSelectorsAction,
  ListSortSetAvailableAction,
  ListSortSetGlobalAction
} from './actions';

export class ListSortOrchestrator extends ListStateOrchestrator<ListSortModel> {
  /* istanbul ignore next */
  constructor() {
    super();

    this
      .register(ListSortSetFieldSelectorsAction, this.setFieldSelectors)
      .register(ListSortSetAvailableAction, this.setAvailable)
      .register(ListSortSetGlobalAction, this.setGlobal);
  }

  private setFieldSelectors(
    state: ListSortModel,
    action: ListSortSetFieldSelectorsAction
  ): ListSortModel {
    return new ListSortModel(Object.assign({}, state, { fieldSelectors: action.fieldSelectors }));
  }

  private setAvailable(state: ListSortModel, action: ListSortSetAvailableAction): ListSortModel {
    const newAvailable = action.available.map(available => new ListSortLabelModel(available));
    return new ListSortModel(Object.assign({}, state, { available: newAvailable }));
  }

  private setGlobal(state: ListSortModel, action: ListSortSetGlobalAction): ListSortModel {
    const newGlobal = action.global.map(global => new ListSortLabelModel(global));
    return new ListSortModel(Object.assign({}, state, { global: newGlobal }));
  }
}

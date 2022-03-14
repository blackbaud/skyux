import { ListStateOrchestrator } from '../list-state.rxstate';

import { ListSortLabelModel } from './label.model';
import { ListSortSetAvailableAction } from './set-available.action';
import { ListSortSetFieldSelectorsAction } from './set-field-selectors.action';
import { ListSortSetGlobalAction } from './set-global.action';
import { ListSortModel } from './sort.model';

/**
 * @internal
 */
export class ListSortOrchestrator extends ListStateOrchestrator<ListSortModel> {
  /* istanbul ignore next */
  constructor() {
    super();

    this.register(ListSortSetFieldSelectorsAction, this.setFieldSelectors)
      .register(ListSortSetAvailableAction, this.setAvailable)
      .register(ListSortSetGlobalAction, this.setGlobal);
  }

  private setFieldSelectors(
    state: ListSortModel,
    action: ListSortSetFieldSelectorsAction
  ): ListSortModel {
    return new ListSortModel(
      Object.assign({}, state, { fieldSelectors: action.fieldSelectors })
    );
  }

  private setAvailable(
    state: ListSortModel,
    action: ListSortSetAvailableAction
  ): ListSortModel {
    const newAvailable = action.available.map(
      (available) => new ListSortLabelModel(available)
    );
    return new ListSortModel(
      Object.assign({}, state, { available: newAvailable })
    );
  }

  private setGlobal(
    state: ListSortModel,
    action: ListSortSetGlobalAction
  ): ListSortModel {
    const newGlobal = action.global.map(
      (global) => new ListSortLabelModel(global)
    );
    return new ListSortModel(Object.assign({}, state, { global: newGlobal }));
  }
}

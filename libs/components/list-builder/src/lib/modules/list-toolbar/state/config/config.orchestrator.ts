import { ListToolbarStateOrchestrator } from '../toolbar-state.rxstate';

import { ListToolbarConfigModel } from './config.model';
import { ListToolbarConfigSetSearchEnabledAction } from './set-search-enabled.action';
import { ListToolbarConfigSetSortSelectorEnabledAction } from './set-sort-selector-enabled.action';

/**
 * @internal
 */
export class ListToolbarConfigOrchestrator extends ListToolbarStateOrchestrator<ListToolbarConfigModel> {
  /* istanbul ignore next */
  constructor() {
    super();

    this.register(
      ListToolbarConfigSetSearchEnabledAction,
      this.setSearchEnabled,
    ).register(
      ListToolbarConfigSetSortSelectorEnabledAction,
      this.setSortSelectorEnabled,
    );
  }

  private setSearchEnabled(
    state: ListToolbarConfigModel,
    action: ListToolbarConfigSetSearchEnabledAction,
  ): ListToolbarConfigModel {
    return new ListToolbarConfigModel(
      Object.assign({}, state, { searchEnabled: action.enabled }),
    );
  }

  private setSortSelectorEnabled(
    state: ListToolbarConfigModel,
    action: ListToolbarConfigSetSortSelectorEnabledAction,
  ): ListToolbarConfigModel {
    return new ListToolbarConfigModel(
      Object.assign({}, state, { sortSelectorEnabled: action.enabled }),
    );
  }
}

import { ListToolbarConfigSetSearchEnabledAction } from './config/set-search-enabled.action';

import { ListToolbarConfigSetSortSelectorEnabledAction } from './config/set-sort-selector-enabled.action';

/**
 * @internal
 */
export type ListToolbarStateAction =
  | ListToolbarConfigSetSearchEnabledAction
  | ListToolbarConfigSetSortSelectorEnabledAction;

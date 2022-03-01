import { ListFiltersUpdateAction } from './filters/update.action';
import { ListItemsLoadAction } from './items/load.action';
import { ListItemsSetSelectedAction } from './items/set-items-selected.action';
import { ListItemsSetLoadingAction } from './items/set-loading.action';
import { ListPagingSetItemsPerPageAction } from './paging/set-items-per-page.action';
import { ListPagingSetMaxPagesAction } from './paging/set-max-pages.action';
import { ListPagingSetPageNumberAction } from './paging/set-page-number.action';
import { ListSearchSetFieldSelectorsAction } from './search/set-field-selectors.action';
import { ListSearchSetFunctionsAction } from './search/set-functions.action';
import { ListSearchSetOptionsAction } from './search/set-options.action';
import { ListSearchSetSearchTextAction } from './search/set-search-text.action';
import { ListSelectedLoadAction } from './selected/load.action';
import { ListSelectedSetItemSelectedAction } from './selected/set-item-selected.action';
import { ListSelectedSetItemsSelectedAction } from './selected/set-items-selected.action';
import { ListSelectedSetLoadingAction } from './selected/set-loading.action';
import { ListSortSetAvailableAction } from './sort/set-available.action';
import { ListSortSetFieldSelectorsAction } from './sort/set-field-selectors.action';
import { ListSortSetGlobalAction } from './sort/set-global.action';
import { ListToolbarItemsDisableAction } from './toolbar/disable.action';
import { ListToolbarItemsLoadAction } from './toolbar/load.action';
import { ListToolbarItemsRemoveAction } from './toolbar/remove.action';
import { ListToolbarSetExistsAction } from './toolbar/set-exists.action';
import { ListToolbarSetTypeAction } from './toolbar/set-type.action';
import { ListViewsLoadAction } from './views/load.action';
import { ListViewsSetActiveAction } from './views/set-active.action';

/**
 * @internal
 */
export type ListStateAction =
  | ListItemsSetLoadingAction
  | ListItemsLoadAction
  | ListItemsSetSelectedAction
  | ListPagingSetMaxPagesAction
  | ListPagingSetItemsPerPageAction
  | ListPagingSetPageNumberAction
  | ListViewsLoadAction
  | ListViewsSetActiveAction
  | ListToolbarItemsLoadAction
  | ListToolbarSetExistsAction
  | ListSearchSetSearchTextAction
  | ListSearchSetFunctionsAction
  | ListSearchSetFieldSelectorsAction
  | ListSearchSetOptionsAction
  | ListSelectedSetLoadingAction
  | ListSelectedLoadAction
  | ListSelectedSetItemSelectedAction
  | ListSelectedSetItemsSelectedAction
  | ListToolbarSetTypeAction
  | ListSortSetFieldSelectorsAction
  | ListSortSetAvailableAction
  | ListSortSetGlobalAction
  | ListFiltersUpdateAction
  | ListToolbarItemsRemoveAction
  | ListToolbarItemsDisableAction;

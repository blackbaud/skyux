import { ListItemsSetLoadingAction } from './items/set-loading.action';
import { ListItemsLoadAction } from './items/load.action';
import { ListItemsSetSelectedAction } from './items/set-items-selected.action';
import { ListPagingSetMaxPagesAction } from './paging/set-max-pages.action';
import { ListPagingSetItemsPerPageAction } from './paging/set-items-per-page.action';
import { ListPagingSetPageNumberAction } from './paging/set-page-number.action';
import { ListViewsLoadAction } from './views/load.action';
import { ListViewsSetActiveAction } from './views/set-active.action';
import { ListToolbarItemsLoadAction } from './toolbar/load.action';
import { ListToolbarSetExistsAction } from './toolbar/set-exists.action';
import { ListSearchSetSearchTextAction } from './search/set-search-text.action';
import { ListSearchSetFunctionsAction } from './search/set-functions.action';
import { ListSearchSetFieldSelectorsAction } from './search/set-field-selectors.action';
import { ListSearchSetOptionsAction } from './search/set-options.action';
import { ListSelectedSetLoadingAction } from './selected/set-loading.action';
import { ListSelectedLoadAction } from './selected/load.action';
import { ListSelectedSetItemSelectedAction } from './selected/set-item-selected.action';
import { ListSelectedSetItemsSelectedAction } from './selected/set-items-selected.action';
import { ListToolbarSetTypeAction } from './toolbar/set-type.action';
import { ListSortSetFieldSelectorsAction } from './sort/set-field-selectors.action';
import { ListSortSetAvailableAction } from './sort/set-available.action';
import { ListSortSetGlobalAction } from './sort/set-global.action';
import { ListFiltersUpdateAction } from './filters/update.action';
import { ListToolbarItemsRemoveAction } from './toolbar/remove.action';
import { ListToolbarItemsDisableAction } from './toolbar/disable.action';

export type ListStateAction =
  ListItemsSetLoadingAction | ListItemsLoadAction | ListItemsSetSelectedAction |
  ListPagingSetMaxPagesAction | ListPagingSetItemsPerPageAction | ListPagingSetPageNumberAction |
  ListViewsLoadAction | ListViewsSetActiveAction | ListToolbarItemsLoadAction |
  ListToolbarSetExistsAction | ListSearchSetSearchTextAction | ListSearchSetFunctionsAction |
  ListSearchSetFieldSelectorsAction | ListSearchSetOptionsAction | ListSelectedSetLoadingAction |
  ListSelectedLoadAction | ListSelectedSetItemSelectedAction | ListSelectedSetItemsSelectedAction |
  ListToolbarSetTypeAction | ListSortSetFieldSelectorsAction | ListSortSetAvailableAction |
  ListSortSetGlobalAction | ListFiltersUpdateAction | ListToolbarItemsRemoveAction | ListToolbarItemsDisableAction;

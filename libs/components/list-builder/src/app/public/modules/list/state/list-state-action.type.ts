import {
  ListItemsLoadAction,
  ListItemsSetLoadingAction,
  ListItemsSetSelectedAction
} from './items/actions';

import {
  ListPagingSetMaxPagesAction,
  ListPagingSetItemsPerPageAction,
  ListPagingSetPageNumberAction
} from './paging/actions';

import {
  ListViewsLoadAction,
  ListViewsSetActiveAction
} from './views/actions';

import {
  ListToolbarItemsLoadAction,
  ListToolbarItemsRemoveAction,
  ListToolbarSetExistsAction,
  ListToolbarSetTypeAction,
  ListToolbarItemsDisableAction
} from './toolbar/actions';

import {
  ListSearchSetSearchTextAction,
  ListSearchSetFunctionsAction,
  ListSearchSetFieldSelectorsAction,
  ListSearchSetOptionsAction
} from './search/actions';

import {
  ListSelectedSetLoadingAction,
  ListSelectedLoadAction,
  ListSelectedSetItemSelectedAction,
  ListSelectedSetItemsSelectedAction
} from './selected/actions';

import {
   ListSortSetFieldSelectorsAction,
   ListSortSetAvailableAction,
   ListSortSetGlobalAction
 } from './sort/actions';

import {
  ListFiltersUpdateAction
} from './filters/actions';

export type ListStateAction =
  ListItemsSetLoadingAction | ListItemsLoadAction | ListItemsSetSelectedAction |
  ListPagingSetMaxPagesAction | ListPagingSetItemsPerPageAction | ListPagingSetPageNumberAction |
  ListViewsLoadAction | ListViewsSetActiveAction | ListToolbarItemsLoadAction |
  ListToolbarSetExistsAction | ListSearchSetSearchTextAction | ListSearchSetFunctionsAction |
  ListSearchSetFieldSelectorsAction | ListSearchSetOptionsAction | ListSelectedSetLoadingAction |
  ListSelectedLoadAction | ListSelectedSetItemSelectedAction | ListSelectedSetItemsSelectedAction |
  ListToolbarSetTypeAction | ListSortSetFieldSelectorsAction | ListSortSetAvailableAction |
  ListSortSetGlobalAction | ListFiltersUpdateAction | ListToolbarItemsRemoveAction | ListToolbarItemsDisableAction;

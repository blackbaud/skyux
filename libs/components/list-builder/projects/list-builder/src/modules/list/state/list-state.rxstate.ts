import {
  Injectable
} from '@angular/core';

import {
  StateDispatcher,
  StateOrchestrator
} from '@skyux/list-builder-common';

import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import {
  ListFilterModel
} from '../../list-filters/filter.model';

import {
  ListFiltersUpdateAction
} from './filters/update.action';

import {
  ListStateAction
} from './list-state-action.type';

import {
  ListSearchSetFunctionsAction
} from './search/set-functions.action';

import {
  ListSearchSetSearchTextAction
} from './search/set-search-text.action';

import {
  ListSearchSetFieldSelectorsAction
} from './search/set-field-selectors.action';

import {
  ListSearchSetOptionsAction
} from './search/set-options.action';

import {
  ListSearchModel
} from './search/search.model';

import {
  ListSelectedSetItemsSelectedAction
} from './selected/set-items-selected.action';

import {
  ListSortSetAvailableAction
} from './sort/set-available.action';

import {
  ListSortSetFieldSelectorsAction
} from './sort/set-field-selectors.action';

import {
  ListSortSetGlobalAction
} from './sort/set-global.action';

import {
  ListSortLabelModel
} from './sort/label.model';

import {
  ListToolbarItemsDisableAction
} from './toolbar/disable.action';

import {
  ListToolbarItemsLoadAction
} from './toolbar/load.action';

import {
  ListToolbarItemsRemoveAction
} from './toolbar/remove.action';

import {
  ListToolbarSetExistsAction
} from './toolbar/set-exists.action';

import {
  ListToolbarShowMultiselectToolbarAction
} from './toolbar/show-multiselect-toolbar.action';

import {
  ListToolbarItemModel
} from './toolbar/toolbar-item.model';

import {
  ListViewsSetActiveAction
} from './views/set-active.action';

/**
 * @internal
 */
export class ListStateOrchestrator<T> extends StateOrchestrator<T, ListStateAction> {
}

/**
 * @internal
 */
@Injectable()
export class ListStateDispatcher extends StateDispatcher<ListStateAction> {

  public viewsSetActive(id: string) {
    this.next(new ListViewsSetActiveAction(id));
  }

  public toolbarExists(exists: boolean): void {
    this.next(new ListToolbarSetExistsAction(exists));
  }

  public toolbarSetDisabled(disabled: boolean): void {
    this.next(new ListToolbarItemsDisableAction(disabled));
  }

  public toolbarAddItems(items: ListToolbarItemModel[], index: number = -1): void {
    this.next(new ListToolbarItemsLoadAction(items, index));
  }

  public toolbarRemoveItems(ids: string[]): void {
    this.next(new ListToolbarItemsRemoveAction(ids));
  }

  public toolbarShowMultiselectToolbar(show: boolean): void {
    this.next(new ListToolbarShowMultiselectToolbarAction(show));
  }

  public searchSetFunctions(sortFunctions: ((data: any, searchText: string) => boolean)[]): void {
    this.next(new ListSearchSetFunctionsAction(sortFunctions));
  }

  /* istanbul ignore next */
  public searchSetFieldSelectors(fieldSelectors: Array<string>): void {
    this.next(new ListSearchSetFieldSelectorsAction(fieldSelectors));
  }

  public searchSetText(searchText: string) {
    this.next(new ListSearchSetSearchTextAction(searchText));
  }

  public searchSetOptions(searchOptions: ListSearchModel) {
    this.next(new ListSearchSetOptionsAction(
      new ListSearchSetSearchTextAction(searchOptions.searchText),
      new ListSearchSetFieldSelectorsAction(searchOptions.fieldSelectors),
      new ListSearchSetFunctionsAction(searchOptions.functions)
    ));
  }

  public sortSetAvailable(sortLabels: ListSortLabelModel[]): void {
    this.next(new ListSortSetAvailableAction(sortLabels));
  }

  public sortSetFieldSelectors(fieldSelectors: ListSortFieldSelectorModel[]): void {
    this.next(new ListSortSetFieldSelectorsAction(fieldSelectors));
  }

  public sortSetGlobal(sortLabels: ListSortLabelModel[]): void {
    this.next(new ListSortSetGlobalAction(sortLabels));
  }

  public filtersUpdate(filters: ListFilterModel[]): void {
    this.next(new ListFiltersUpdateAction(filters));
  }

  public setSelected(selectedIds: string[], selected: boolean, refresh: boolean = false): void {
    this.next(new ListSelectedSetItemsSelectedAction(selectedIds, selected, refresh));
  }
}

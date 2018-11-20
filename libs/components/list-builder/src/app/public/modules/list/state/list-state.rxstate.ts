import { Injectable } from '@angular/core';
import {
  StateDispatcher,
  StateOrchestrator
} from 'microedge-rxstate/dist';

import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import { ListStateAction } from './list-state-action.type';

import { ListViewsSetActiveAction } from './views/actions';

import {
  ListToolbarItemsLoadAction,
  ListToolbarItemsRemoveAction,
  ListToolbarSetExistsAction,
  ListToolbarItemsDisableAction
} from './toolbar/actions';

import { ListToolbarItemModel } from './toolbar/toolbar-item.model';

import {
  ListSearchSetFunctionsAction,
  ListSearchSetSearchTextAction,
  ListSearchSetFieldSelectorsAction,
  ListSearchSetOptionsAction
} from './search/actions';

import {
  ListSortSetAvailableAction,
  ListSortSetFieldSelectorsAction,
  ListSortSetGlobalAction
} from './sort/actions';
import { ListSortLabelModel } from './sort/label.model';
import { ListFilterModel } from './filters/filter.model';
import { ListSearchModel } from './search/search.model';
import {
  ListFiltersUpdateAction
} from './filters/actions';

export class ListStateOrchestrator<T> extends StateOrchestrator<T, ListStateAction> {
}

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

  public searchSetFunctions(sortFunctions: ((data: any, searchText: string) => boolean)[]): void {
    this.next(new ListSearchSetFunctionsAction(sortFunctions));
  }

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
}

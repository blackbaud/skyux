import { Injectable } from '@angular/core';
import { StateNode } from '@skyux/list-builder-common';

import { ListFiltersOrchestrator } from './filters/filters.orchestrator';
import { ListItemsOrchestrator } from './items/items.orchestrator';
import { ListStateModel } from './list-state.model';
import { ListStateDispatcher } from './list-state.rxstate';
import { ListPagingOrchestrator } from './paging/paging.orchestrator';
import { ListSearchOrchestrator } from './search/search.orchestrator';
import { ListSelectedOrchestrator } from './selected/selected.orchestrator';
import { ListSortOrchestrator } from './sort/sort.orchestrator';
import { ListToolbarOrchestrator } from './toolbar/toolbar.orchestrator';
import { ListViewsOrchestrator } from './views/views.orchestrator';

/**
 * @internal
 */
@Injectable()
export class ListState extends StateNode<ListStateModel> {
  constructor(dispatcher: ListStateDispatcher) {
    super(new ListStateModel(), dispatcher);

    this.register('filters', ListFiltersOrchestrator)
      .register('items', ListItemsOrchestrator)
      .register('paging', ListPagingOrchestrator)
      .register('search', ListSearchOrchestrator)
      .register('sort', ListSortOrchestrator)
      .register('toolbar', ListToolbarOrchestrator)
      .register('views', ListViewsOrchestrator)
      .register('selected', ListSelectedOrchestrator)
      .begin();
  }
}

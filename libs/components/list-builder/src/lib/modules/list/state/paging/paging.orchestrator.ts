import { ListStateOrchestrator } from '../list-state.rxstate';

import { ListPagingModel } from './paging.model';
import { ListPagingSetItemsPerPageAction } from './set-items-per-page.action';
import { ListPagingSetMaxPagesAction } from './set-max-pages.action';
import { ListPagingSetPageNumberAction } from './set-page-number.action';

/**
 * @internal
 */
export class ListPagingOrchestrator extends ListStateOrchestrator<ListPagingModel> {
  /* istanbul ignore next */
  constructor() {
    super();

    this.register(ListPagingSetMaxPagesAction, this.setMaxPages)
      .register(ListPagingSetItemsPerPageAction, this.setItemsPerPage)
      .register(ListPagingSetPageNumberAction, this.setPageNumber);
  }

  private setMaxPages(
    state: ListPagingModel,
    action: ListPagingSetMaxPagesAction
  ): ListPagingModel {
    return new ListPagingModel(
      Object.assign({}, state, { maxDisplayedPages: Number(action.maxPages) })
    );
  }

  private setItemsPerPage(
    state: ListPagingModel,
    action: ListPagingSetItemsPerPageAction
  ): ListPagingModel {
    return new ListPagingModel(
      Object.assign({}, state, { itemsPerPage: Number(action.itemsPerPage) })
    );
  }

  private setPageNumber(
    state: ListPagingModel,
    action: ListPagingSetPageNumberAction
  ): ListPagingModel {
    return new ListPagingModel(
      Object.assign({}, state, { pageNumber: Number(action.pageNumber) })
    );
  }
}

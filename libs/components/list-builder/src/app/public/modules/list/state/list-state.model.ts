import { AsyncList, AsyncItem } from 'microedge-rxstate/dist';

import { ListFilterModel } from './filters/filter.model';
import { ListItemModel } from './items/item.model';
import { ListPagingModel } from './paging/paging.model';
import { ListSearchModel } from './search/search.model';
import { ListSelectedModel } from './selected/selected.model';
import { ListSortModel } from './sort/sort.model';
import { ListToolbarModel } from './toolbar/toolbar.model';
import { ListViewsModel } from './views/views.model';

export class ListStateModel {

  public filters: ListFilterModel[] = [];
  public items: AsyncList<ListItemModel> = new AsyncList<ListItemModel>();
  public paging: ListPagingModel = new ListPagingModel();
  public search: ListSearchModel = new ListSearchModel();
  public selected: AsyncItem<ListSelectedModel> = new AsyncItem<ListSelectedModel>();
  public sort: ListSortModel = new ListSortModel();
  public toolbar: ListToolbarModel = new ListToolbarModel();
  public views: ListViewsModel = new ListViewsModel();

  constructor() {
    this.selected.item = new ListSelectedModel();
  }

}

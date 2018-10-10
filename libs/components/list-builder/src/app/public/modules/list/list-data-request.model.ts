import { ListFilterModel } from './state/filters/filter.model';
import { ListSearchModel } from './state/search/search.model';
import { ListSortModel } from './state/sort/sort.model';

export class ListDataRequestModel {
  public filters: ListFilterModel[];
  public pageSize: number;
  public pageNumber: number;
  public search: ListSearchModel;
  public sort: ListSortModel;
  public isToolbarDisabled: boolean = false;

  constructor(data?: any) {
    if (data !== undefined) {
      this.filters = data.filters;
      this.pageSize = data.pageSize;
      this.pageNumber = data.pageNumber;
      this.search = data.search;
      this.sort = data.sort;
      this.isToolbarDisabled = data.isToolbarDisabled;
    }
  }
}

import { ListFilterModel } from '../list-filters/filter.model';

import { ListSearchModel } from './state/search/search.model';
import { ListSortModel } from './state/sort/sort.model';

export class ListDataRequestModel {
  /**
   * Specifies a function to determine whether items are filtered.
   * This property is required when using an in-memory data provider.
   */
  public filters: ListFilterModel[];
  /**
   * Specifies the number of items to display per page.
   */
  public pageSize: number;
  /**
   * Specifies the current page number.
   */
  public pageNumber: number;
  /**
   * Specifies a function to dynamically manage the data source when users
   * change the text in the list field. The search function must return an
   * array or a promise of an array. The `search` property is particularly useful
   * when the data source does not live in the source code.
   */
  public search: ListSearchModel;
  /**
   * Specifies a set of fields to sort by.
   */
  public sort: ListSortModel;
  /**
   * Indicates whether to disable the search bar and filter button.
   * @default false
   */
  public isToolbarDisabled = false;

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

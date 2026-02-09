import { SkyDataGridSort } from './data-grid-sort';

export interface SkyDataGridPageRequest {
  /**
   * The current page number (1-based).
   */
  pageNumber: number;

  /**
   * The number of items per page. When `undefined`, paging is not applied and all items are returned.
   */
  pageSize: number | undefined;

  /**
   * The data property and direction for sorting. When `undefined`, no sorting is applied.
   */
  sortField: SkyDataGridSort | undefined;
}

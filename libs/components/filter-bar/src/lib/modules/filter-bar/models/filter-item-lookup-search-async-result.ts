/**
 * The result of searching for items to display in a filter item lookup selection modal.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 */
export interface SkyFilterItemLookupSearchAsyncResult<TValue = unknown> {
  /**
   * Data provided on "load more" search result requests. Use this property for
   * information such as a continuation token for paged database queries.
   */
  continuationData?: unknown;
  /**
   * Whether there are more results that match the search criteria.
   */
  hasMore?: boolean;
  /**
   * A list of items that match the search criteria. When more items match
   * the search criteria, set the `hasMore` property to `true`. More records can be lazy-loaded
   * as users scrolls through the search results.
   */
  items: TValue[];
  /**
   * The total number of records that match the search criteria, including items not returned in
   * the current list.
   */
  totalCount: number;
}

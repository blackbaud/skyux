/**
 * The result of searching for items to display in an autocomplete or lookup field.
 */
export interface SkyAutocompleteSearchAsyncResult {
  /**
   * Data provided on "load more" search result requests. Use this property for
   * information such as a continuation token for paged database queries.
   */
  continuationData?: unknown;
  /**
   * Indicates whether there are more results that match the search criteria.
   */
  hasMore?: boolean;
  /**
   * A list of items matching the search criteria. When there are more items that match
   * the search criteria, set the `hasMore` property to `true` more records can be lazy-loaded
   * as the user scrolls through the search results.
   */
  items: unknown[];
  /**
   * The total number of records that match the search criteria, including items not returned in
   * the current list of items.
   */
  totalCount: number;
}

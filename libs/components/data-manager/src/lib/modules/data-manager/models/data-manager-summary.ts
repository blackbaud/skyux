/**
 * Contains summary details of the data displayed within the data manager.
 */
export interface SkyDataManagerSummary {
  /**
   * The total number of items in the data set.
   */
  totalItems: number;
  /**
   * The total number of items that match the search and filter criteria.
   */
  itemsMatching: number;
}

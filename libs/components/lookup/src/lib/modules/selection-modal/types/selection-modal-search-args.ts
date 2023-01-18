/**
 * Arguments passed when an asynchronous search is executed from the
 * selection modal service.
 */
export interface SkySelectionModalSearchArgs {
  /**
   * The search text entered by the user.
   */
  searchText: string;

  /**
   * The offset index of the first result to return. When search is executed
   * as a result of an infinite scroll event, for example, offset will be set
   * to the number of items already displayed.
   */
  offset: number;

  /**
   * A continuation token which can be set and then will be passed back with any future searches.
   * This is helpful for applications which utilize a token instead of an offset when fetching data.
   */
  continuationData?: unknown;
}

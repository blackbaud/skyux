import { Observable } from 'rxjs';

import { SkyFilterItemLookupSearchAsyncResult } from './filter-item-lookup-search-async-result';

/**
 * Arguments passed when an asynchronous search is executed from the selection modal opened by a
 * filter item lookup component.
 */
export interface SkyFilterItemLookupSearchAsyncArgs {
  /**
   * The unique identifier for the filter.
   */
  filterId: string;

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

  /**
   * An Observable representing the search results. Consumers should set this
   * when the event fires so the filter item lookup component can subscribe
   * to it and then display the results.
   */
  result?: Observable<SkyFilterItemLookupSearchAsyncResult>;
}

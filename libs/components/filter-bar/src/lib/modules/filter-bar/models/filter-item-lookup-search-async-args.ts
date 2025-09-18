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
   * The offset index of the first result to return. For example, when search is executed
   * as a result of an infinite scroll event, the offset is set
   * to the number of items already displayed.
   */
  offset: number;

  /**
   * A continuation token that can be set and then passed back with any future searches.
   * This is helpful for applications that use a token to fetch data instead of an offset.
   */
  continuationData?: unknown;

  /**
   * An observable that represents the search results. Consumers should set this
   * when the event fires so the filter item lookup component can subscribe
   * to it and then display the results.
   */
  result?: Observable<SkyFilterItemLookupSearchAsyncResult>;
}

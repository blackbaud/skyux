import { Observable } from 'rxjs';

import { SkyAutocompleteSearchAsyncResult } from './autocomplete-search-async-result';
import { AutocompleteSearchAsyncResultDisplayType } from './autocomplete-search-async-result-display-type';

/**
 * Arguments passed when an asynchronous search is executed from the
 * autocomplete or lookup component.
 */
export interface SkyAutocompleteSearchAsyncArgs {
  /**
   * The search text entered by the user.
   */
  searchText: string;

  /**
   * How the search results will be displayed. Use this value to determine
   * how many results to return.
   */
  displayType: AutocompleteSearchAsyncResultDisplayType;

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
   * when the event fires so the autocomplete or lookup component can subscribe
   * to it and then display the results.
   */
  result?: Observable<SkyAutocompleteSearchAsyncResult>;
}

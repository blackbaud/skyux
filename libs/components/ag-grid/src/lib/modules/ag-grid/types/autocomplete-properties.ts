import { TemplateRef } from '@angular/core';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';

export interface SkyAgGridAutocompleteProperties {
  /**
   * Allows the user to specify arbitrary values not in the search results.
   * @default false
   */
  allowAnyValue?: boolean;
  /**
   * The static data source for the autocomplete cell to search when users enter text. For a dynamic data source such as an array that changes due to server calls, use search instead.
   */
  data?: unknown[];
  /**
   * How many milliseconds to wait before searching while users enter text in the autocomplete field.
   * @default 0
   */
  debounceTime?: number;
  /**
   * The object property to display in the text input after users select an item in the dropdown list.
   * @default "name"
   */
  descriptorProperty?: string;
  /**
   * Highlights the search text in each search result. Set this to false when your search finds results that are not exact text matches, e.g. returning "Bob" for the term "Robert."
   * @default true
   */
  highlightSearchText?: boolean;
  /**
   * The object properties to search.
   * @default ["name"]
   */
  propertiesToSearch?: string[];
  /**
   * The function that dynamically manages the data source when users change the text in the autocomplete cell. The search function must return an array or a promise of an array.
   */
  search?: (
    searchText: string,
    data?: unknown[],
  ) => unknown[] | Promise<unknown[]>;
  /**
   * The array of functions to call against each search result in order to filter the search results when using the default search function. When using the search property to specify a custom search function, you must manually apply filters inside that function. The function must return true or false for each result to indicate whether to display it in the dropdown list.
   */
  searchFilters?: ((searchText: string, item: unknown) => boolean)[];
  searchResultsLimit?: number;
  searchResultTemplate?: TemplateRef<unknown>;
  searchTextMinimumCharacters?: number;
  selectionChange?: (event: SkyAutocompleteSelectionChange) => void;
}

/**
 * @deprecated Use SkyAgGridAutocompleteProperties instead.
 */
// eslint-disable-next-line
export interface SkyAutocompleteProperties
  extends SkyAgGridAutocompleteProperties {}

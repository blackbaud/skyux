import { TemplateRef } from '@angular/core';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';

export interface SkyAgGridAutocompleteProperties {
  /**
   * Allows users to specify arbitrary values not in the search results.
   * @default false
   */
  allowAnyValue?: boolean;
  /**
   * The static data source for the autocomplete cell to search when users enter text. For a dynamic data source, such as an array that changes due to server calls, use search instead. You can specify static data, such as an array of objects, or you can pull data from a database.
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
   * Highlights the search text in each search result. Set this to `false` when your search returns results that aren't exact text matches, such as returning "Bob" for "Robert."
   * @default true
   */
  highlightSearchText?: boolean;
  /**
   * The array of object properties to search when utilizing the `data` property and the built-in search function.

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
   * The array of functions to call against each search result. This filters the search results when using the default search function. When the `search` property specifies a custom search function, you must manually apply filters inside that function. The function must return `true` or `false` for each result to indicate whether to display it in the dropdown list.
   */
  searchFilters?: ((searchText: string, item: unknown) => boolean)[];
  /**
   * The maximum number of search results to display in the dropdown list. By default, the autocomplete component displays all matching results.
   */
  searchResultsLimit?: number;
  /**
   * The template that formats each search result in the dropdown list. The autocomplete component injects search result values into the template as `item` variables that reference all of the object properties of the search results.
   */
  searchResultTemplate?: TemplateRef<unknown>;
  /**
   * The minimum number of characters that users must enter before the autocomplete component searches the data source and displays search results in the dropdown list.
   * @default 1
   */
  searchTextMinimumCharacters?: number;
  /**
   * Output that fires when users select items in the dropdown list.
   */
  selectionChange?: (event: SkyAutocompleteSelectionChange) => void;
}

/**
 * @deprecated Use SkyAgGridAutocompleteProperties instead.
 */
// eslint-disable-next-line
export interface SkyAutocompleteProperties
  extends SkyAgGridAutocompleteProperties {}

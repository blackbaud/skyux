import {
  Input,
  TemplateRef
} from '@angular/core';

import {
  SkyAutocompleteSearchFunction
} from '../autocomplete/types/autocomplete-search-function';

import {
  SkyAutocompleteSearchFunctionFilter
} from '../autocomplete/types/autocomplete-search-function-filter';

/**
 * @internal
 */
export class SkyLookupAutocompleteAdapter {

/**
 * Specifies a data source for the lookup component to search when users
 * enter text. You can specify static data such as an array of objects, or
 * you can pull data from a database.
 * @default []
 */
  @Input()
  public data: any[];

/**
 * Specifies how many milliseconds to wait before searching while users
 * enter text in the lookup field.
 * @default 0
 */
  @Input()
  public debounceTime: number;

/**
 * Specifies an object property to display in the text input after users
 * select an item in the dropdown list.
 * @default name
 */
  @Input()
  public descriptorProperty: string;

/**
 * Specifies an array of object properties to search.
 * @default ['name']
 */
  @Input()
  public propertiesToSearch: string[];

/**
 * Specifies a function to dynamically manage the data source when users
 * change the text in the lookup field. The search function must return
 * an array or a promise of an array. The `search` property is particularly
 * useful when the data source does not live in the source code.
 */
  @Input()
  public search: SkyAutocompleteSearchFunction;

/**
 * Specifies a template to format each search result in the dropdown list.
 * The lookup component injects search result values into the template as
 * `item` variables that reference all of the object properties of the search results.
 */
  @Input()
  public searchResultTemplate: TemplateRef<any>;

/**
 * Specifies the minimum number of characters that users must enter before
 * the lookup component searches the data source and displays search results
 * in the dropdown list.
 * @default 1
 */
  @Input()
  public searchTextMinimumCharacters: number;

/**
 * Specifies an array of functions to call against each search result in order
 * to filter the search results when using the default search function. When
 * using a custom search function via the `search` property filters must be
 * applied manually inside that function. The function must return `true` or
 * `false` for each result to indicate whether to display it in the dropdown list.
 */
  @Input()
  public searchFilters: SkyAutocompleteSearchFunctionFilter[];

/**
 * Specifies the maximum number of search results to display in the dropdown
 * list. By default, the lookup component displays all matching results.
 */
  @Input()
  public searchResultsLimit: number;
}

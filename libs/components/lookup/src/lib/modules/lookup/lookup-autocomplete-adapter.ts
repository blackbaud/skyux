import {
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { skyAutocompleteDefaultSearchFunction } from '../autocomplete/autocomplete-default-search-function';
import { SkyAutocompleteSearchAsyncArgs } from '../autocomplete/types/autocomplete-search-async-args';
import { SkyAutocompleteSearchFunction } from '../autocomplete/types/autocomplete-search-function';
import { SkyAutocompleteSearchFunctionFilter } from '../autocomplete/types/autocomplete-search-function-filter';

/**
 * @internal
 */
@Directive()
export class SkyLookupAutocompleteAdapter {
  /**
   * How many milliseconds to wait before searching while users
   * enter text in the lookup field.
   * @default 0
   */
  @Input()
  public debounceTime: number | undefined;

  /**
   * The object property to display in the text input after users
   * select an item in the dropdown list.
   * @default "name"
   */
  @Input()
  public set descriptorProperty(value: string | undefined) {
    this.#_descriptorProperty = value || 'name';
  }

  public get descriptorProperty(): string {
    return this.#_descriptorProperty;
  }

  /**
   * The array of object properties to search when utilizing the `data` property and the built-in search function.
   * @default ["name"]
   * @deprecated Use the `searchAsync` event emitter and callback instead to provide data to the lookup component.
   */
  @Input()
  public set propertiesToSearch(value: string[] | undefined) {
    this.#_propertiesToSearch = value ?? ['name'];

    this.#updateDefaultSearchOptions();
  }

  public get propertiesToSearch(): string[] {
    return this.#_propertiesToSearch;
  }

  /**
   * The function that dynamically manages the data to display in search results when users
   * change the text in the lookup field. The search function must return
   * an array or a promise of an array. The `search` property is particularly
   * useful when the data source does not live in the source code.
   * @deprecated Use the `searchAsync` event emitter and callback instead to provide searched data to the lookup component.
   */
  @Input()
  public set search(value: SkyAutocompleteSearchFunction | undefined) {
    this.#_search = value;
    this.searchOrDefault =
      value ||
      skyAutocompleteDefaultSearchFunction({
        propertiesToSearch: this.propertiesToSearch,
        searchFilters: this.searchFilters,
      });
  }

  public get search(): SkyAutocompleteSearchFunction | undefined {
    return this.#_search;
  }

  /**
   * The template that formats each option in the dropdown list. The lookup component
   * injects values into the template as `item` variables that reference all of the object
   * properties of the search results.
   */
  @Input()
  public searchResultTemplate: TemplateRef<unknown> | undefined;

  /**
   * The minimum number of characters that users must enter before
   * the lookup component searches the data source and displays search results
   * in the dropdown list.
   * @default 1
   */
  @Input()
  public searchTextMinimumCharacters: number | undefined;

  /**
   * The array of functions to call against each search result in order
   * to filter the search results when using the `data` input and the default search function. When
   * using a custom search function via the `search` property filters must be
   * applied manually inside that function. The function must return `true` or
   * `false` for each result to indicate whether to display it in the dropdown list.
   * @deprecated Use the `searchAsync` event emitter and callback instead to provide searched data to the lookup component.
   */
  @Input()
  public set searchFilters(
    value: SkyAutocompleteSearchFunctionFilter[] | undefined,
  ) {
    this.#_searchFilters = value;

    this.#updateDefaultSearchOptions();
  }

  public get searchFilters():
    | SkyAutocompleteSearchFunctionFilter[]
    | undefined {
    return this.#_searchFilters;
  }

  /**
   * The maximum number of search results to display in the dropdown
   * list. By default, the lookup component displays all matching results.
   * This property has no effect on the results in the "Show more" picker.
   */
  @Input()
  public searchResultsLimit: number | undefined;

  /**
   * Fires when users enter new search information and allows results to be
   * returned via an observable. The event is also fired
   * when the "Show more" picker is opened without search text.
   */
  @Output()
  public searchAsync = new EventEmitter<SkyAutocompleteSearchAsyncArgs>();

  public searchOrDefault = skyAutocompleteDefaultSearchFunction({
    propertiesToSearch: ['name'],
    searchFilters: undefined,
  });

  #_descriptorProperty = 'name';

  #_propertiesToSearch = ['name'];

  #_search: SkyAutocompleteSearchFunction | undefined;

  #_searchFilters: SkyAutocompleteSearchFunctionFilter[] | undefined;

  #updateDefaultSearchOptions(): void {
    // Reset default search if it is what is being used.
    if (this.search !== this.searchOrDefault) {
      this.searchOrDefault = skyAutocompleteDefaultSearchFunction({
        propertiesToSearch: this.propertiesToSearch,
        searchFilters: this.searchFilters,
      });
    }
  }
}

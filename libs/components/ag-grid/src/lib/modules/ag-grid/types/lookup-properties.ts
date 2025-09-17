import { TemplateRef } from '@angular/core';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupAddClickEventArgs,
  SkyLookupSelectModeType,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

export interface SkyAgGridLookupProperties {
  /**
   * Fires when users select the button to add options to the list.
   */
  addClick?: (args: SkyLookupAddClickEventArgs) => void;
  /**
   * The `aria-label` text for the lookup cell. If neither `ariaLabel` nor `ariaLabelledBy` are specified, the `aria-label` defaults to the column's `headerName`, `headerTooltip`, `field`, or `colId`.
   */
  ariaLabel?: string;
  /**
   * The ID of the HTML element that labels the lookup cell. If neither `ariaLabel` nor `ariaLabelledBy` are specified, the `aria-label` defaults to the column's `headerName`, `headerTooltip`, `field`, or `colId`.
   */
  ariaLabelledBy?: string;
  /**
   * The value to provide to the autocomplete attribute on the form input.
   * @default "off"
   * @deprecated
   */
  autocompleteAttribute?: string;
  /**
   * The data source for the lookup cell to search when users enter text. You can specify static data, such as an array of objects, or you can pull data from a database.
   * @deprecated Use the `searchAsync` event emitter and callback instead to provide data to the lookup component.
   */
  data?: unknown[];
  /**
   * How many milliseconds to wait before searching while users enter text in the lookup field.
   * @default 0
   */
  debounceTime?: number;
  /**
   * The object property to display in the text input after users select an item in the dropdown list.
   * @default "name"
   */
  descriptorProperty?: string;
  /**
   * Whether to disable the lookup cell.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether to enable users to open a picker where they can view all options.
   * @default false
   */
  enableShowMore?: boolean;
  /**
   * The object property that represents the object's unique identifier. Specifying this property enables token animations and more efficient rendering. This property is required when using `enableShowMore` and `searchAsync` together.
   */
  idProperty?: string;
  /**
   * Placeholder text to display in the lookup field.
   */
  placeholderText?: string;
  /**
   * The array of object properties to search when using the `data` property and the built-in search function.
   * @default ["name"]
   * @deprecated Use the `searchAsync` event emitter and callback instead to provide data to the lookup component.
   */
  propertiesToSearch?: string[];
  /**
   * The function that dynamically manage the data source when users change the text in the lookup field. The search function must return an array or a promise of an array.
   * @deprecated Use the `searchAsync` event emitter and callback instead to provide searched data to the lookup component.
   */
  search?: SkyAutocompleteSearchFunction;
  /**
   * Fires when users enter new search information and allows results to be returned via an observable. The event is also fired when the "Show more" picker is opened without search text.
   */
  searchAsync?: (args: SkyAutocompleteSearchAsyncArgs) => void;
  /**
   * The array of functions to call against each search result. This filters the search results when using the data input and the default search function. When the `search` property specifies a custom search function, you must manually apply filters inside that function. The function must return `true` or `false` for each result to indicate whether to display it in the dropdown list.
   * @deprecated  Use the `searchAsync` event emitter and callback instead to provide searched data to the lookup component.
   */
  searchFilters?: SkyAutocompleteSearchFunctionFilter[];
  /**
   * The maximum number of search results to display in the dropdown list. By default, the lookup component displays all matching results. This property has no effect on the results in the "Show more" picker.
   */
  searchResultsLimit?: number;
  /**
   * The template that formats each option in the dropdown list. The lookup component injects values into the template as `item` variables that reference all of the object properties of the search results.
   */
  searchResultTemplate?: TemplateRef<unknown>;
  /**
   * The minimum number of characters that users must enter before the lookup component searches the data source and displays search results in the dropdown list.
   * @default 1
   */
  searchTextMinimumCharacters?: number;
  /**
   * The ability for users to select one option or multiple options.
   * @default "multiple"
   */
  selectMode?: SkyLookupSelectModeType;
  /**
   * Whether to display a button that lets users add options to the list.
   * @default false
   */
  showAddButton?: boolean;
  /**
   * Configuration options for the picker that displays all options.
   */
  showMoreConfig?: SkyLookupShowMoreConfig;
  /**
   * @internal
   */
  wrapperClass?: string;
}

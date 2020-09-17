import {
  SkyAutocompleteSearchFunctionFilter
} from './autocomplete-search-function-filter';

/**
 * @internal
 */
export interface SkyAutocompleteDefaultSearchFunctionOptions {
  propertiesToSearch?: string[];
  searchFilters?: SkyAutocompleteSearchFunctionFilter[];
  searchResultsLimit?: number;
}

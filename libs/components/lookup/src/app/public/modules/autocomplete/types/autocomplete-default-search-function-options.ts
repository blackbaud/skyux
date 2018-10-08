import {
  SkyAutocompleteSearchFunctionFilter
} from './autocomplete-search-function-filter';

export interface SkyAutocompleteDefaultSearchFunctionOptions {
  propertiesToSearch?: string[];
  searchFilters?: SkyAutocompleteSearchFunctionFilter[];
  searchResultsLimit?: number;
}

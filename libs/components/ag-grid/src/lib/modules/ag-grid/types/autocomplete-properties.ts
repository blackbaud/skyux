import { TemplateRef } from '@angular/core';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';

import { SkyAgGridAutocompleteSearchFilterFunction } from './autocomplete-search-filter-function';

export interface SkyAgGridAutocompleteProperties {
  data?: unknown[];
  debounceTime?: number;
  descriptorProperty?: string;
  propertiesToSearch?: string[];
  search?: (
    searchText: string,
    data?: unknown[],
  ) => unknown[] | Promise<unknown[]>;
  searchFilters?: SkyAgGridAutocompleteSearchFilterFunction[];
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

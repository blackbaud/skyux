import { TemplateRef } from '@angular/core';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';

export interface SkyAgGridAutocompleteProperties {
  allowAnyValue?: boolean;
  data?: unknown[];
  debounceTime?: number;
  descriptorProperty?: string;
  highlightSearchText?: boolean;
  propertiesToSearch?: string[];
  search?: (
    searchText: string,
    data?: unknown[],
  ) => unknown[] | Promise<unknown[]>;
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

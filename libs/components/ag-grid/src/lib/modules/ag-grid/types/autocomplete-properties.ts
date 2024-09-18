import { TemplateRef } from '@angular/core';
import { SkyAutocompleteSelectionChange } from '@skyux/lookup';

export interface SkyAgGridAutocompleteProperties {
  data?: unknown[];
  debounceTime?: number;
  descriptorProperty?: string;
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
export type SkyAutocompleteProperties = SkyAgGridAutocompleteProperties;

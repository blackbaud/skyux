import { TemplateRef } from '@angular/core';

/**
 * @internal
 */
export interface SkyAutocompleteProperties {
  data?: any[];
  debounceTime?: number;
  descriptorProperty?: string;
  propertiesToSearch?: string[];
  search?: (searchText: string, data?: any[]) => any[] | Promise<any[]>;
  searchFilters?: (searchText: string, item: any) => boolean;
  searchResultsLimit?: number;
  searchResultTemplate?: TemplateRef<any>;
  searchTextMinimumCharacters?: number;
  selectionChange?: () => void;
}

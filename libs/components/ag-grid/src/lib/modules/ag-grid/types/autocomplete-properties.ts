import { TemplateRef } from '@angular/core';

export interface SkyAgGridAutocompleteProperties {
  data?: any[];
  debounceTime?: number;
  descriptorProperty?: string;
  propertiesToSearch?: string[];
  search?: (searchText: string, data?: any[]) => any[] | Promise<any[]>;
  searchFilters?: (searchText: string, item: any) => boolean;
  searchResultsLimit?: number;
  searchResultTemplate?: TemplateRef<any>;
  searchTextMinimumCharacters?: number;
  selectionChange?: Function;
}

/**
 * @deprecated Use SkyAgGridAutocompleteProperties instead.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkyAutocompleteProperties
  extends SkyAgGridAutocompleteProperties {}

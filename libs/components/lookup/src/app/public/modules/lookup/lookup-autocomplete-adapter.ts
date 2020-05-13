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

export class SkyLookupAutocompleteAdapter {
  @Input()
  public data: any[];

  @Input()
  public debounceTime: number;

  @Input()
  public descriptorProperty: string;

  @Input()
  public propertiesToSearch: string[];

  @Input()
  public search: SkyAutocompleteSearchFunction;

  @Input()
  public searchResultTemplate: TemplateRef<any>;

  @Input()
  public searchTextMinimumCharacters: number;

  @Input()
  public searchFilters: SkyAutocompleteSearchFunctionFilter[];

  @Input()
  public searchResultsLimit: number;
}

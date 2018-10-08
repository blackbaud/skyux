import {
  Input,
  TemplateRef
} from '@angular/core';

import {
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionFilter
} from '../autocomplete';

export class SkyLookupAutocompleteAdapter {
  @Input()
  public data: any[];

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

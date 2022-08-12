import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface SkyAutocompleteSearchResultHarnessFilters
  extends Omit<BaseHarnessFilters, 'selector'> {
  textContent?: string | RegExp;
}

import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of SkyAutocompleteSearchResultHarness instances.
 */
export interface SkyAutocompleteSearchResultHarnessFilters
  extends Omit<BaseHarnessFilters, 'selector'> {
  /**
   * Find an autocomplete search result based on its text content.
   */
  textContent?: string | RegExp;
}

import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of SkyAutocompleteSearchResultHarness instances.
 */
export interface SkyAutocompleteSearchResultHarnessFilters
  extends Omit<BaseHarnessFilters, 'selector'> {
  /**
   * The string or regular expression to match against the search results text content.
   */
  textContent?: string | RegExp;
}

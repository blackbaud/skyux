import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of SkyAutocompleteSearchResultHarness instances.
 */
export interface SkyAutocompleteSearchResultHarnessFilters
  extends Omit<BaseHarnessFilters, 'selector'> {
  /**
   * The value of the "descriptor" property of the search result.
   */
  descriptorPropertyValue?: string | RegExp;
}

import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of SkyAutocompleteSearchResultHarness instances.
 */
export interface SkyAutocompleteSearchResultHarnessFilters extends Omit<
  BaseHarnessFilters,
  'selector'
> {
  /**
   * Only find instances whose content matches the given value.
   */
  text?: string | RegExp;
}

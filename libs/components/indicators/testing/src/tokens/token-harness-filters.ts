import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTokenHarness` instances.
 */
export interface SkyTokenHarnessFilters extends BaseHarnessFilters {
  textContent?: string | RegExp;
}

import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTokenHarness` instances.
 */
export interface SkyTokenHarnessFilters extends BaseHarnessFilters {
  /**
   * Only find instances whose text content matches the given value.
   */
  text?: string | RegExp;
}

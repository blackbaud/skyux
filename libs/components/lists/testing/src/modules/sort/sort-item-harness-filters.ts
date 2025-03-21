import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkySortItemHarness` instances.
 */

export interface SkySortItemHarnessFilters extends BaseHarnessFilters {
  /**
   * Only find instances whose text content matches the given value.
   */
  text?: string;
}

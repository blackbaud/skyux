import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyFilterBarItemHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyFilterBarItemHarnessFilters extends BaseHarnessFilters {
  /**
   * Finds a filter bar item whose id matches the given value.
   */
  id?: string;
  /**
   * Finds a filter bar item whose name matches the given value.
   */
  name?: string;
}

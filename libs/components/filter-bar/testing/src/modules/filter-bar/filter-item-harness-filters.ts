import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyFilterItemHarness` instances.
 */
export interface SkyFilterItemHarnessFilters extends BaseHarnessFilters {
  /**
   * Finds a filter item whose filter id matches the given value.
   */
  filterId?: string;
  /**
   * Finds a filter item whose label text matches the given value.
   */
  labelText?: string;
}

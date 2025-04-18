import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyFileItemHarness` instances.
 * @internal
 */
export interface SkyPageControlHarnessFilters extends BaseHarnessFilters {
  /**
   * Finds files whose file name matches this value.
   */
  pageNumber: number;
}

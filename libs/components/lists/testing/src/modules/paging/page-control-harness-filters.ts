import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyFileItemHarness` instances.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyPageControlHarnessFilters extends BaseHarnessFilters {
  /**
   * Finds files whose file name matches this value.
   */
  pageNumber: number;
}

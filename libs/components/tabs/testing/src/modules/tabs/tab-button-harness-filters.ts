import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTabButtonHarness` instances.
 */
export interface SkyTabButtonHarnessFilters extends BaseHarnessFilters {
  /**
   * Finds tab button whose tab heading matches this value.
   */
  tabHeading?: string;
}

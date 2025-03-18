import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of  `SkyVerticalTabButtonHarness` instances.
 */
export interface SkyVerticalTabButtonHarnessFilters extends SkyHarnessFilters {
  /**
   * Find a tab whose heading matches the given value.
   */
  tabHeading?: string;
}

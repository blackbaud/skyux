import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of  `SkyVerticalTabsetGroupHarness` instances.
 */
export interface SkyVerticalTabsetGroupHarnessFilters
  extends SkyHarnessFilters {
  /**
   * Find tabset groups whose heading matches the given value.
   */
  groupHeading?: string;
}

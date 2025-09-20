import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyVerticalTabContentHarness` instances.
 */
export interface SkyVerticalTabContentHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds tabs whose id matches given value.
   * @internal
   */
  tabId: string;
}

import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTabContentHarness` instances.
 */
export interface SkyTabContentHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds tabs whose id matches given value.
   * @internal
   */
  tabId: string;
}

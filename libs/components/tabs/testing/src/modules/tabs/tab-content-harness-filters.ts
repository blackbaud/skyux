import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTabContentHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyTabContentHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds tabs whose id matches given value.
   * @internal
   */
  tabId: string;
}

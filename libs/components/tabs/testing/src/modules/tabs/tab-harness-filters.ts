import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTabHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyTabHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds tabs whose tab heading matches this value.
   */
  tabHeading: string;
}

import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTabButtonHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyTabButtonHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds tab button whose tab heading matches this value.
   */
  tabHeading: string;
}

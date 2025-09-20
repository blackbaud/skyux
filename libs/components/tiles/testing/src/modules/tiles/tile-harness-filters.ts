import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTileHarness` instances.
 */
export interface SkyTileHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose title matches the given value.
   */
  titleText?: string | RegExp;
}

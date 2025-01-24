import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyTileHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyTileHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose title matches the given value.
   */
  titleText?: string | RegExp;
}

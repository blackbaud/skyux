import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyFileItemHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyFileItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds files whose file name matches this value.
   */
  fileName: string;
}

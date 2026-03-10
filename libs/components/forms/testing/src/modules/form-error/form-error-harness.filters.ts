import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyFormErrorHarness` instances.
 */
export interface SkyFormErrorHarnessFilters extends SkyHarnessFilters {
  /**
   * The name of the error.
   */
  errorName?: string;
}

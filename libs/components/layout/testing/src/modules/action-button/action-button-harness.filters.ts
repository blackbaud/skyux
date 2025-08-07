import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyActionButtonHarness` instances.
 */
export interface SkyActionButtonHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds action buttons whose header matches given value.
   */
  header?: string;
}

import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyActionButtonHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyActionButtonHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds action buttons whose header matches given value.
   */
  header: string;
}

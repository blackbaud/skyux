import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyDropdownItemHarness` instances.
 */

export interface SkyDropdownItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose role matches the given value.
   */
  ariaRole?: string;

  /**
   * Only find instances whose text content matches the given value.
   */
  text?: string;
}

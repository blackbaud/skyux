import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of SkyListSummaryItemHarness instances.
 */
export interface SkyListSummaryItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose label text matches the given value.
   */
  labelText?: string | RegExp;

  /**
   * Only find instances whose value text matches the given value.
   */
  valueText?: string | RegExp;
}

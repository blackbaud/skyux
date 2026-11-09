import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria for filtering `SkyChartLegendItemHarness` instances.
 */
export interface SkyChartLegendItemHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose label text matches the given value.
   */
  labelText?: string | RegExp;
}

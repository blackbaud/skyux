import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria for filtering `SkyChartDataPointHarness` instances.
 */
export interface SkyChartDataPointHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose category matches the given value.
   */
  category?: string | RegExp;

  /**
   * Only find instances whose series label text matches the given value.
   */
  seriesLabelText?: string | RegExp;
}

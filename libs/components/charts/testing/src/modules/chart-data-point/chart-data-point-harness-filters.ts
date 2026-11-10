import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria for filtering `SkyChartDataPointHarness` instances.
 */
export interface SkyChartDataPointHarnessFilters extends BaseHarnessFilters {
  /**
   * Only find instances whose category matches the given value.
   */
  category?: string | RegExp;

  /**
   * Only find instances whose series label text matches the given value.
   */
  seriesLabelText?: string | RegExp;
}

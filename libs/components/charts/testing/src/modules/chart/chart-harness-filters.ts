import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria for filtering `SkyChartHarness` instances.
 */
export interface SkyChartHarnessFilters extends SkyHarnessFilters {
  /**
   * Only find instances whose heading text matches the given value.
   */
  headingText?: string | RegExp;
}

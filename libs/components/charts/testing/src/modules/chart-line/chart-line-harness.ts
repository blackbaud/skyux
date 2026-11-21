import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyChartPlotHarness } from '../chart-plot/chart-plot-harness';

import { SkyChartLineHarnessFilters } from './chart-line-harness-filters';

/**
 * Harness for interacting with a line chart component in tests.
 * @preview
 */
export class SkyChartLineHarness extends SkyChartPlotHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = 'sky-chart-line';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartLineHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartLineHarnessFilters,
  ): HarnessPredicate<SkyChartLineHarness> {
    return SkyChartLineHarness.getDataSkyIdPredicate(filters);
  }
}

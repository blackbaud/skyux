import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyChartPlotHarness } from '../chart-plot/chart-plot-harness';

import { SkyChartPieHarnessFilters } from './chart-pie-harness-filters';

/**
 * Harness for interacting with a pie chart component in tests.
 * @preview
 */
export class SkyChartPieHarness extends SkyChartPlotHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = 'sky-chart-pie';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartPieHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartPieHarnessFilters,
  ): HarnessPredicate<SkyChartPieHarness> {
    return SkyChartPieHarness.getDataSkyIdPredicate(filters);
  }
}

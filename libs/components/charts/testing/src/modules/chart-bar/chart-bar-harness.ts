import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyChartPlotHarness } from '../chart-plot/chart-plot-harness';

import { SkyChartBarHarnessFilters } from './chart-bar-harness-filters';

/**
 * Harness for interacting with a bar chart component in tests.
 * @preview
 */
export class SkyChartBarHarness extends SkyChartPlotHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = 'sky-chart-bar';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartBarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartBarHarnessFilters,
  ): HarnessPredicate<SkyChartBarHarness> {
    return SkyChartBarHarness.getDataSkyIdPredicate(filters);
  }
}

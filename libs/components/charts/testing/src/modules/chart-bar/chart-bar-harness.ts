import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartBarHarnessFilters } from './chart-bar-harness.filters';

/**
 * Harness for interacting with a bar chart component in tests.
 */
export class SkyChartBarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-chart-bar';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartBarHarness` that meets certain criteria
   */
  public static with(
    filters: SkyChartBarHarnessFilters,
  ): HarnessPredicate<SkyChartBarHarness> {
    return SkyChartBarHarness.getDataSkyIdPredicate(filters);
  }
}

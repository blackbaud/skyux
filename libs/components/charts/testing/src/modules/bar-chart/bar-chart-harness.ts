import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyBarChartHarnessFilters } from './bar-chart-harness.filters';

/**
 * Harness for interacting with a bar chart component in tests.
 */
export class SkyBarChartHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-bar-chart';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyBarChartHarness` that meets certain criteria
   */
  public static with(
    filters: SkyBarChartHarnessFilters,
  ): HarnessPredicate<SkyBarChartHarness> {
    return SkyBarChartHarness.getDataSkyIdPredicate(filters);
  }
}

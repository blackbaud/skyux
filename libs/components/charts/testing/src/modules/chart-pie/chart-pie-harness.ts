import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartPieHarnessFilters } from './chart-pie-harness-filters';

/**
 * Harness for interacting with a pie chart component in tests.
 * @preview
 */
export class SkyChartPieHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = 'sky-chart-pie';

  readonly #getCanvas = this.locatorForOptional('canvas');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartPieHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartPieHarnessFilters,
  ): HarnessPredicate<SkyChartPieHarness> {
    return SkyChartPieHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Whether the pie chart has rendered its plot. The plot renders once the
   * chart is given at least one slice.
   */
  public async isChartRendered(): Promise<boolean> {
    return (await this.#getCanvas()) !== null;
  }
}

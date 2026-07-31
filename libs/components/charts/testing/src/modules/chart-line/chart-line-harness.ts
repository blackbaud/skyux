import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartLineHarnessFilters } from './chart-line-harness-filters';

/**
 * Harness for interacting with a line chart component in tests.
 * @preview
 */
export class SkyChartLineHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = 'sky-chart-line';

  readonly #getCanvas = this.locatorForOptional('canvas');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartLineHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartLineHarnessFilters,
  ): HarnessPredicate<SkyChartLineHarness> {
    return SkyChartLineHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Whether the line chart has rendered its plot. The plot renders once the
   * chart is given a category axis, a value axis, and at least one series.
   */
  public async isChartRendered(): Promise<boolean> {
    return (await this.#getCanvas()) !== null;
  }
}

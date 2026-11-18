import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartDataPointHarness } from '../chart-data-point/chart-data-point-harness';
import { SkyChartDataPointHarnessFilters } from '../chart-data-point/chart-data-point-harness-filters';
import { SkyChartLegendItemHarness } from '../chart-legend/chart-legend-item-harness';
import { SkyChartLegendItemHarnessFilters } from '../chart-legend/chart-legend-item-harness-filters';

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
   * Gets the harness for the data point (slice) that meets the given criteria.
   * A slice's category is its label text.
   */
  public async getDataPoint(
    filters: SkyChartDataPointHarnessFilters,
  ): Promise<SkyChartDataPointHarness> {
    return await this.locatorFor(SkyChartDataPointHarness.with(filters))();
  }

  /**
   * Gets the harnesses for the data points (slices) that meet the given
   * criteria. Hidden slices are excluded.
   */
  public async getDataPoints(
    filters?: SkyChartDataPointHarnessFilters,
  ): Promise<SkyChartDataPointHarness[]> {
    return await this.locatorForAll(
      SkyChartDataPointHarness.with(filters ?? {}),
    )();
  }

  /**
   * Gets the harness for the legend item that meets the given criteria. The
   * legend lists one item per slice.
   */
  public async getLegendItem(
    filters: SkyChartLegendItemHarnessFilters,
  ): Promise<SkyChartLegendItemHarness> {
    return await this.locatorFor(SkyChartLegendItemHarness.with(filters))();
  }

  /**
   * Gets the harnesses for the legend items that meet the given criteria. The
   * legend lists one item per slice.
   */
  public async getLegendItems(
    filters?: SkyChartLegendItemHarnessFilters,
  ): Promise<SkyChartLegendItemHarness[]> {
    return await this.locatorForAll(
      SkyChartLegendItemHarness.with(filters ?? {}),
    )();
  }

  /**
   * Whether the pie chart has rendered its plot. The plot renders once the
   * chart is given at least one slice.
   */
  public async isChartRendered(): Promise<boolean> {
    return (await this.#getCanvas()) !== null;
  }
}

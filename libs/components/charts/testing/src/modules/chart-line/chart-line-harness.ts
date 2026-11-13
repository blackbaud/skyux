import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartDataPointHarness } from '../chart-data-point/chart-data-point-harness';
import { SkyChartDataPointHarnessFilters } from '../chart-data-point/chart-data-point-harness-filters';
import { SkyChartLegendItemHarness } from '../chart-legend/chart-legend-item-harness';
import { SkyChartLegendItemHarnessFilters } from '../chart-legend/chart-legend-item-harness-filters';

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
   * Gets the harness for the data point that meets the given criteria.
   */
  public async getDataPoint(
    filters: SkyChartDataPointHarnessFilters,
  ): Promise<SkyChartDataPointHarness> {
    return await this.locatorFor(SkyChartDataPointHarness.with(filters))();
  }

  /**
   * Gets the harnesses for the data points that meet the given criteria.
   * Data points of hidden series are excluded.
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
   * legend renders only when the chart has multiple series.
   */
  public async getLegendItem(
    filters: SkyChartLegendItemHarnessFilters,
  ): Promise<SkyChartLegendItemHarness> {
    return await this.locatorFor(SkyChartLegendItemHarness.with(filters))();
  }

  /**
   * Gets the harnesses for the legend items that meet the given criteria. The
   * legend renders only when the chart has multiple series.
   */
  public async getLegendItems(
    filters?: SkyChartLegendItemHarnessFilters,
  ): Promise<SkyChartLegendItemHarness[]> {
    return await this.locatorForAll(
      SkyChartLegendItemHarness.with(filters ?? {}),
    )();
  }

  /**
   * Whether the line chart has rendered its plot. The plot renders once the
   * chart is given a category axis, a value axis, and at least one series.
   */
  public async isChartRendered(): Promise<boolean> {
    return (await this.#getCanvas()) !== null;
  }
}

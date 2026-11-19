import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartDataPointHarness } from '../chart-data-point/chart-data-point-harness';
import { SkyChartDataPointHarnessFilters } from '../chart-data-point/chart-data-point-harness-filters';
import { SkyChartLegendItemHarness } from '../chart-legend/chart-legend-item-harness';
import { SkyChartLegendItemHarnessFilters } from '../chart-legend/chart-legend-item-harness-filters';

/**
 * Shared harness behavior for the bar, line, and pie chart harnesses.
 * @internal
 */
export abstract class SkyChartPlotHarness extends SkyComponentHarness {
  readonly #getCanvas = this.locatorForOptional('canvas');

  /**
   * Gets the harness for the data point that meets the given criteria. A pie
   * chart's data points are its slices, and a slice's category is its label
   * text.
   */
  public async getDataPoint(
    filters: SkyChartDataPointHarnessFilters,
  ): Promise<SkyChartDataPointHarness> {
    return await this.locatorFor(SkyChartDataPointHarness.with(filters))();
  }

  /**
   * Gets the harnesses for the data points that meet the given criteria.
   * Data points of hidden series and hidden pie slices are excluded.
   */
  public async getDataPoints(
    filters?: SkyChartDataPointHarnessFilters,
  ): Promise<SkyChartDataPointHarness[]> {
    return await this.locatorForAll(
      SkyChartDataPointHarness.with(filters ?? {}),
    )();
  }

  /**
   * Gets the harness for the legend item that meets the given criteria. A bar
   * or line chart renders its legend only when it has multiple series; a pie
   * chart's legend lists one item per slice.
   */
  public async getLegendItem(
    filters: SkyChartLegendItemHarnessFilters,
  ): Promise<SkyChartLegendItemHarness> {
    return await this.locatorFor(SkyChartLegendItemHarness.with(filters))();
  }

  /**
   * Gets the harnesses for the legend items that meet the given criteria. A
   * bar or line chart renders its legend only when it has multiple series; a
   * pie chart's legend lists one item per slice.
   */
  public async getLegendItems(
    filters?: SkyChartLegendItemHarnessFilters,
  ): Promise<SkyChartLegendItemHarness[]> {
    return await this.locatorForAll(
      SkyChartLegendItemHarness.with(filters ?? {}),
    )();
  }

  /**
   * Whether the chart has rendered its plot. A bar or line chart renders once
   * it is given a category axis, a value axis, and at least one series; a pie
   * chart renders once it is given at least one slice.
   */
  public async isChartRendered(): Promise<boolean> {
    return (await this.#getCanvas()) !== null;
  }
}

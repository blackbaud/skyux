import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartDataPointHarnessFilters } from './chart-data-point-harness-filters';

/**
 * Harness for interacting with a chart data point (for example, a bar or a
 * line point) in tests.
 */
export class SkyChartDataPointHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = '.sky-chart-data-point';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartDataPointHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartDataPointHarnessFilters,
  ): HarnessPredicate<SkyChartDataPointHarness> {
    return SkyChartDataPointHarness.getDataSkyIdPredicate(filters)
      .addOption(
        'category',
        filters.category,
        async (harness, category) =>
          await HarnessPredicate.stringMatches(
            await harness.getCategory(),
            category,
          ),
      )
      .addOption(
        'seriesLabelText',
        filters.seriesLabelText,
        async (harness, text) =>
          await HarnessPredicate.stringMatches(
            await harness.getSeriesLabelText(),
            text,
          ),
      );
  }

  /**
   * Clicks the data point, which emits the chart's `dataPointClick` event.
   */
  public async click(): Promise<void> {
    await (await this.host()).click();
  }

  /**
   * Gets the category the data point is plotted against.
   */
  public async getCategory(): Promise<string> {
    return (await (
      await this.host()
    ).getAttribute('data-sky-chart-category')) as string;
  }

  /**
   * Gets the label text of the data point's series.
   */
  public async getSeriesLabelText(): Promise<string> {
    return (await (
      await this.host()
    ).getAttribute('data-sky-chart-series')) as string;
  }
}

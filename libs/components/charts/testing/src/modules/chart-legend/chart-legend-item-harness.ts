import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyChartLegendItemHarnessFilters } from './chart-legend-item-harness-filters';

/**
 * Harness for interacting with a chart legend item in tests. Each legend item
 * represents a series and toggles that series' visibility when clicked.
 * @preview
 */
export class SkyChartLegendItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = 'button.sky-chart-legend-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartLegendItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartLegendItemHarnessFilters,
  ): HarnessPredicate<SkyChartLegendItemHarness> {
    return SkyChartLegendItemHarness.getDataSkyIdPredicate(filters).addOption(
      'labelText',
      filters.labelText,
      async (harness, text) =>
        await HarnessPredicate.stringMatches(
          await harness.getLabelText(),
          text,
        ),
    );
  }

  /**
   * Clicks the legend item, which toggles the visibility of its series.
   */
  public async click(): Promise<void> {
    await (await this.host()).click();
  }

  /**
   * Gets the label text of the series the legend item represents.
   */
  public async getLabelText(): Promise<string> {
    return await (await this.host()).text();
  }

  /**
   * Whether the series the legend item represents is visible in the chart.
   */
  public async isSeriesVisible(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-pressed')) === 'true';
  }
}

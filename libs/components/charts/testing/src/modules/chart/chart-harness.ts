import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyChartHeadingLevel, SkyChartHeadingStyle } from '@skyux/charts';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyChartHarnessFilters } from './chart-harness-filters';

/**
 * Harness for interacting with a chart component in tests. Query the plot's
 * harness (for example, `SkyChartBarHarness`) with `queryHarness`.
 */
export class SkyChartHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-chart';

  #getContent = this.locatorFor('.sky-chart-content');
  #getHeading = this.locatorForOptional(
    'sky-chart-heading h2, sky-chart-heading h3, sky-chart-heading h4, sky-chart-heading h5',
  );
  #getHelpInline = this.locatorForOptional(SkyHelpInlineHarness);
  #getSubheading = this.locatorForOptional('sky-chart-subheading');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyChartHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyChartHarnessFilters,
  ): HarnessPredicate<SkyChartHarness> {
    return SkyChartHarness.getDataSkyIdPredicate(filters).addOption(
      'headingText',
      filters.headingText,
      async (harness, text) =>
        await HarnessPredicate.stringMatches(
          (await harness.getHeadingText()) ?? null,
          text,
        ),
    );
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInlineOrThrow()).click();
  }

  /**
   * Whether the chart's heading is hidden.
   */
  public async getHeadingHidden(): Promise<boolean> {
    return (await this.#getHeading()) === null;
  }

  /**
   * Gets the semantic heading level of the chart's heading, or `undefined`
   * when the heading is hidden.
   */
  public async getHeadingLevel(): Promise<SkyChartHeadingLevel | undefined> {
    const heading = await this.#getHeading();

    if (!heading) {
      return undefined;
    }

    const tagName = await heading.getProperty<string>('tagName');

    return Number(tagName.charAt(1)) as SkyChartHeadingLevel;
  }

  /**
   * Gets the font style of the chart's heading, or `undefined` when the
   * heading is hidden.
   */
  public async getHeadingStyle(): Promise<SkyChartHeadingStyle | undefined> {
    const heading = await this.#getHeading();

    if (!heading) {
      return undefined;
    }

    return (await heading.hasClass('sky-font-heading-2'))
      ? 2
      : (await heading.hasClass('sky-font-heading-3'))
        ? 3
        : (await heading.hasClass('sky-font-heading-4'))
          ? 4
          : 5;
  }

  /**
   * Gets the chart's heading text, or `undefined` when the heading is hidden.
   */
  public async getHeadingText(): Promise<string | undefined> {
    return await (await this.#getHeading())?.text();
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInlineOrThrow()).getPopoverContent();
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInlineOrThrow()).getPopoverTitle();
  }

  /**
   * Gets the chart's subheading text, or `undefined` when no subheading is
   * displayed.
   */
  public async getSubheadingText(): Promise<string | undefined> {
    return await (await this.#getSubheading())?.text();
  }

  /**
   * Whether the chart displays its loading wait indicator.
   */
  public async isLoading(): Promise<boolean> {
    return await (
      await this.#getContent()
    ).hasClass('sky-chart-content-loading');
  }

  async #getHelpInlineOrThrow(): Promise<SkyHelpInlineHarness> {
    const helpInline = await this.#getHelpInline();

    if (!helpInline) {
      throw new Error('No help inline found.');
    }

    return helpInline;
  }
}

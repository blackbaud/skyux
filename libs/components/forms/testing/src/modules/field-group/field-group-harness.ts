import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  SkyFieldGroupHeadingLevel,
  SkyFieldGroupHeadingStyle,
} from '@skyux/forms';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFieldGroupHarnessFilters } from './field-group-harness-filters';

/**
 * Harness for interacting with a field group component in tests.
 */
export class SkyFieldGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-field-group';

  #getLegend = this.locatorFor('legend');
  #getLegendH3 = this.locatorForOptional('legend h3');
  #getLegendH4 = this.locatorForOptional('legend h4');
  #getLegendHeading = this.locatorFor('legend h3,h4');
  #getHintText = this.locatorForOptional('.sky-field-group-hint-text');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFieldGroupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFieldGroupHarnessFilters,
  ): HarnessPredicate<SkyFieldGroupHarness> {
    return SkyFieldGroupHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the field group's heading text. If `headingHidden` is true,
   * the text will still be returned.
   */
  public async getHeadingText(): Promise<string | undefined> {
    return await (await this.#getLegendHeading()).text();
  }

  /**
   * Gets the field group's hint text.
   */
  public async getHintText(): Promise<string> {
    const hintText = await this.#getHintText();

    return (await hintText?.text())?.trim() ?? '';
  }

  /**
   * Whether the heading is hidden.
   */
  public async getHeadingHidden(): Promise<boolean> {
    return await (await this.#getLegend()).hasClass('sky-screen-reader-only');
  }

  /**
   * Whether the field group is stacked.
   */
  public async getStacked(): Promise<boolean> {
    const host = await this.host();

    return await host.hasClass('sky-field-group-stacked');
  }

  /**
   * The semantic heading level used for the field group.
   */
  public async getHeadingLevel(): Promise<SkyFieldGroupHeadingLevel> {
    const h3 = await this.#getLegendH3();

    return h3 ? 3 : 4;
  }

  /**
   * The heading style used for the field group.
   */
  public async getHeadingStyle(): Promise<SkyFieldGroupHeadingStyle> {
    const heading = (await this.#getLegendH3()) || (await this.#getLegendH4());

    return (await heading?.hasClass('sky-font-heading-3')) ? 3 : 4;
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Gets the help popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(
      SkyHelpInlineHarness.with({
        ancestor: '.sky-field-group > .sky-field-group-legend',
      }),
    )();

    if (harness) {
      return harness;
    }
    throw Error('No help inline found.');
  }
}

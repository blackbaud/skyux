import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
import { SkyHelpInlinePopoverHarness } from '@skyux/help-inline/testing';
import { SkyChevronHarness } from '@skyux/indicators/testing';

import { SkyTileContentHarness } from './tile-content-harness';
import { SkyTileHarnessFilters } from './tile-harness-filters';

/**
 * Harness to interact with a tile component in tests.
 */
export class SkyTileHarness extends SkyHelpInlinePopoverHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-tile';

  #getChevron = this.locatorFor(SkyChevronHarness);
  #getContent = this.locatorFor(SkyTileContentHarness);
  #getTitle = this.locatorFor('sky-tile-title');
  #getSummary = this.locatorFor('sky-tile-summary');
  #getSettings = this.locatorForOptional('button.sky-tile-settings');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyTileHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyTileHarnessFilters,
  ): HarnessPredicate<SkyTileHarness> {
    return SkyTileHarness.getDataSkyIdPredicate(filters).addOption(
      'titleText',
      filters.titleText,
      async (harness, text) => {
        const title = await harness.getTitleText();
        return await HarnessPredicate.stringMatches(title, text);
      },
    );
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Clicks the settings button.
   */
  public async clickSettingsButton(): Promise<void> {
    const settings = await this.#getSettings();

    if (!settings) {
      throw Error('No settings button found.');
    }

    await settings.click();
  }

  /**
   * Collapses the tile, or does nothing if already collapsed.
   */
  public async collapse(): Promise<void> {
    const chevron = await this.#getChevron();
    if ((await chevron.getDirection()) === 'up') {
      await chevron.toggle();
    }
  }

  /**
   * Expands the tile, or does nothing if already expanded.
   */
  public async expand(): Promise<void> {
    const chevron = await this.#getChevron();
    if ((await chevron.getDirection()) === 'down') {
      await chevron.toggle();
    }
  }

  /**
   * Gets a harness for the tile content.
   */
  public async getContent(): Promise<SkyTileContentHarness> {
    return await this.#getContent();
  }

  /**
   * Gets the tile summary text.
   */
  public async getSummaryText(): Promise<string> {
    return await (await this.#getSummary()).text();
  }

  /**
   * Gets the tile title text.
   */
  public async getTitleText(): Promise<string> {
    return await (await this.#getTitle()).text();
  }

  /**
   * Whether the tile is expanded.
   */
  public async isExpanded(): Promise<boolean> {
    const chevron = await this.#getChevron();

    return (await chevron.getDirection()) === 'up';
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}

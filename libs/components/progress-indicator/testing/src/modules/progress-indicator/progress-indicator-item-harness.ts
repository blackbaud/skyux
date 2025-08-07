import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyProgressIndicatorItemFilters } from './progress-indicator-item-harness-filters';

/**
 * Harness for interacting with a progress indicator item component in tests.
 */
export class SkyProgressIndicatorItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-progress-indicator-item';

  #getHeading = this.locatorFor('.sky-progress-indicator-item-heading');
  #getIndicator = this.locatorFor('.sky-progress-indicator-status-marker');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyProgressIndicatorItemHarness` that meets certain criteria
   */
  public static with(
    filters: SkyProgressIndicatorItemFilters,
  ): HarnessPredicate<SkyProgressIndicatorItemHarness> {
    return SkyProgressIndicatorItemHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    await (await this.#getHelpInline()).click();
  }

  /**
   * Gets the help inline popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help inline popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * Gets the progress indicator item's title text.
   */
  public async getTitle(): Promise<string> {
    const title = await (await this.#getHeading()).text();
    return title.substring(title.indexOf('-') + 1).trim();
  }

  /**
   * Whether the indicator item step is completed.
   */
  public async isCompleted(): Promise<boolean> {
    return await (
      await this.#getIndicator()
    ).hasClass('sky-progress-indicator-status-marker-status-complete');
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}

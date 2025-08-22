import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyProgressIndicatorFilters } from './progress-indicator-harness-filters';
import { SkyProgressIndicatorItemHarness } from './progress-indicator-item-harness';
import { SkyProgressIndicatorItemFilters } from './progress-indicator-item-harness-filters';

/**
 * Harness for interacting with a progress indicator component in tests.
 */
export class SkyProgressIndicatorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-progress-indicator';

  #getProgressIndicator = this.locatorFor('.sky-progress-indicator');
  #getResetButton = this.locatorFor(
    'sky-progress-indicator-reset-button > .sky-btn-link',
  );
  #getTitle = this.locatorFor('.sky-progress-indicator-title');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyProgressIndicatorHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyProgressIndicatorFilters,
  ): HarnessPredicate<SkyProgressIndicatorHarness> {
    return SkyProgressIndicatorHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the reset button.
   */
  public async clickResetButton(): Promise<void> {
    try {
      await (await this.#getResetButton()).click();
    } catch {
      throw new Error('Unable to find reset button.');
    }
  }

  /**
   * Gets a specific progress indicator item that meets certain criteria.
   */
  public async getItem(
    filter: SkyProgressIndicatorItemFilters,
  ): Promise<SkyProgressIndicatorItemHarness> {
    return await this.locatorFor(
      SkyProgressIndicatorItemHarness.with(filter),
    )();
  }

  /**
   * Gets an array of all progress indicator items.
   */
  public async getItems(
    filters?: SkyProgressIndicatorItemFilters,
  ): Promise<SkyProgressIndicatorItemHarness[]> {
    return await this.locatorForAll(
      SkyProgressIndicatorItemHarness.with(filters || {}),
    )();
  }

  /**
   * Gets the progress indicator title.
   */
  public async getTitle(): Promise<string> {
    try {
      return (await (await this.#getTitle()).text()).trim();
    } catch {
      throw new Error('Unable to find title.');
    }
  }

  /**
   * Whether the progress indicator is passive.
   */
  public async isPassive(): Promise<boolean> {
    return await (
      await this.#getProgressIndicator()
    ).hasClass('sky-progress-indicator-passive');
  }
}

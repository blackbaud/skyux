import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
import { SkyHelpInlinePopoverHarness } from '@skyux/help-inline/testing';
import type {
  SkyIndicatorDescriptionType,
  SkyIndicatorIconType,
} from '@skyux/indicators';

import { SkyStatusIndicatorHarnessFilters } from './status-indicator-harness-filters';

/**
 * Harness for interacting with a status indicator component in tests.
 */
export class SkyStatusIndicatorHarness extends SkyHelpInlinePopoverHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-status-indicator';

  #getIconWrapper = this.locatorFor('.sky-status-indicator-icon');
  #getMessage = this.locatorForOptional('.sky-status-indicator-message');
  #getScreenReaderTextEl = this.locatorForOptional('.sky-screen-reader-only');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyStatusIndicatorHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyStatusIndicatorHarnessFilters,
  ): HarnessPredicate<SkyStatusIndicatorHarness> {
    return SkyStatusIndicatorHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return await (await this.#getHelpInline()).click();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }

  /**
   * Gets the current status indicator type.
   */
  public async getIndicatorType(): Promise<SkyIndicatorIconType | undefined> {
    const wrapper = await this.#getIconWrapper();

    if (await wrapper.hasClass('sky-status-indicator-icon-danger')) {
      return 'danger';
    }

    if (await wrapper.hasClass('sky-status-indicator-icon-info')) {
      return 'info';
    }

    if (await wrapper.hasClass('sky-status-indicator-icon-success')) {
      return 'success';
    }

    return 'warning';
  }

  /**
   * Gets the current status indicator text.
   */
  public async getText(): Promise<string> {
    const message = await this.#getMessage();

    if (message) {
      return await message.text();
    }

    throw new Error(
      'Status indicator text was not found. Did you set the descriptionType input?',
    );
  }

  /**
   * Gets the `descriptionType` of the status indicator component.
   */
  public async getDescriptionType(): Promise<SkyIndicatorDescriptionType> {
    const srEl = await this.#getScreenReaderTextEl();

    if (!srEl) {
      return 'none';
    }

    const srText = await srEl.text();

    switch (srText) {
      case 'Attention:':
        return 'attention';
      case 'Caution:':
        return 'caution';
      case 'Completed:':
        return 'completed';
      case 'Danger:':
        return 'danger';
      case 'Error:':
        return 'error';
      case 'Important information:':
        return 'important-info';
      case 'Important warning:':
        return 'important-warning';
      case 'Success:':
        return 'success';
      case 'Warning:':
        return 'warning';
      default:
        return 'custom';
    }
  }

  /**
   * Gets the custom text used for the screen reader description of the status indicator component icon.
   */
  public async getCustomDescription(): Promise<string> {
    const descriptionType = await this.getDescriptionType();

    if (descriptionType === 'custom') {
      const srEl = await this.#getScreenReaderTextEl();

      if (srEl) {
        return await srEl.text();
      }
    }

    return '';
  }
}

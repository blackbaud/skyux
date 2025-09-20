import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import type {
  SkyIndicatorDescriptionType,
  SkyIndicatorIconType,
} from '@skyux/indicators';

import { SkyAlertHarnessFilters } from './alert-harness-filters';

/**
 * Harness for interacting with an alert component in tests.
 */
export class SkyAlertHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-alert';

  #getAlert = this.locatorFor('.sky-alert');
  #getContent = this.locatorFor('.sky-alert-content');
  #getCloseButton = this.locatorFor('.sky-alert-close');
  #getScreenReaderTextEl = this.locatorForOptional('.sky-screen-reader-only');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAlertHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyAlertHarnessFilters,
  ): HarnessPredicate<SkyAlertHarness> {
    return SkyAlertHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the current alert type.
   */
  public async getAlertType(): Promise<SkyIndicatorIconType | undefined> {
    const alert = await this.#getAlert();

    if (await alert.hasClass('sky-alert-danger')) {
      return 'danger';
    }

    if (await alert.hasClass('sky-alert-info')) {
      return 'info';
    }

    if (await alert.hasClass('sky-alert-success')) {
      return 'success';
    }

    return 'warning';
  }

  /**
   * Gets the current alert text.
   */
  public async getText(): Promise<string> {
    return await (await this.#getContent()).text();
  }

  /**
   * Closes the alert.
   */
  public async close(): Promise<void> {
    if (!(await this.isCloseable())) {
      throw new Error('The alert is not closeable.');
    }

    await (await this.#getCloseButton()).click();
  }

  /**
   * Whether the user closed the alert.
   */
  public async isClosed(): Promise<boolean> {
    const alert = await this.#getAlert();

    return await alert.getProperty('hidden');
  }

  /**
   * Whether the user can close the alert.
   */
  public async isCloseable(): Promise<boolean> {
    const closeBtn = await this.#getCloseButton();
    return !(await closeBtn.getProperty('hidden'));
  }

  /**
   * Gets the `descriptionType` of the label component.
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
   * Gets the custom text used for the screen reader description of the label component icon.
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

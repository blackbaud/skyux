import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyIndicatorIconType } from '@skyux/indicators';

import { SkyAlertHarnessFilters } from './alert-harness-filters';

/**
 * Harness for interacting with an alert component in tests.
 */
export class SkyAlertHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-alert';

  #getAlert = this.locatorFor('.sky-alert');
  #getContent = this.locatorFor('.sky-alert-content');
  #getCloseButton = this.locatorFor('.sky-alert-close');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAlertHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyAlertHarnessFilters
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

    if (await alert.hasClass('sky-alert-warning')) {
      return 'warning';
    }

    return undefined;
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

    (await this.#getCloseButton()).click();
  }

  /**
   * Indicates whether the user has closed the alert.
   */
  public async isClosed(): Promise<boolean> {
    const alert = await this.#getAlert();

    return await alert.getProperty('hidden');
  }

  /**
   * Indicates whether the user can close the alert.
   */
  public async isCloseable(): Promise<boolean> {
    const closeBtn = await this.#getCloseButton();
    return !(await closeBtn.getProperty('hidden'));
  }
}

import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyModalHarnessFilters } from './modal-harness-filters';

/**
 * Harness for interacting with a modal component in tests.
 */
export class SkyModalHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-modal';

  #getModal = this.locatorFor('.sky-modal');
  #getModalDialog = this.locatorFor('.sky-modal-dialog');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyModalHarness` that meets certain criteria
   */
  public static with(
    filters: SkyModalHarnessFilters
  ): HarnessPredicate<SkyModalHarness> {
    return SkyModalHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the aria-describedBy property of the modal
   */
  public async getAriaDescribedBy(): Promise<string | null> {
    return (await this.#getModalDialog()).getAttribute('aria-describedby');
  }

  /**
   * Gets the aria-labelledBy property of the modal
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return (await this.#getModalDialog()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the role of the modal.
   */
  public async getAriaRole(): Promise<string | null> {
    return (await this.#getModalDialog()).getAttribute('role');
  }

  /**
   * Gets the modal size.
   */
  public async getSize(): Promise<string> {
    if (await this.isFullPage()) {
      throw new Error(
        'Size cannot be determined because size property is overridden when modal is full page'
      );
    }

    const modal = await this.#getModal();

    if (await modal.hasClass('sky-modal-small')) {
      return 'small';
    }

    if (await modal.hasClass('sky-modal-large')) {
      return 'large';
    }

    return 'medium';
  }

  /**
   * Gets the wrapper class of the modal.
   */
  public async getWrapperClass(): Promise<string | undefined> {
    return await (await this.host()).getProperty('className');
  }

  /**
   * Whether the modal is full page.
   */
  public async isFullPage(): Promise<boolean> {
    const modal = this.#getModal();
    return (await modal).hasClass('sky-modal-full-page');
  }
}

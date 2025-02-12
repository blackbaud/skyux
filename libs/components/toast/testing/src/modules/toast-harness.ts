import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';
import { SkyToastType } from '@skyux/toast';

import { SkyToastHarnessFilters } from './toast-harness-filters';

/**
 * Harness for interacting with the toast component in tests.
 */
export class SkyToastHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-toast';

  #getToast = this.locatorFor('.sky-toast');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyToastHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyToastHarnessFilters,
  ): HarnessPredicate<SkyToastHarness> {
    return new HarnessPredicate(SkyToastHarness, filters).addOption(
      'message',
      filters.message,
      async (harness, message) => {
        const harnessMessage = await harness.getMessage();
        return await HarnessPredicate.stringMatches(message, harnessMessage);
      },
    );
  }

  /**
   * Clicks the toast close button.
   */
  public async close(): Promise<void> {
    const button = await this.locatorFor('.sky-toast-btn-close')();
    return await button.click();
  }

  /**
   * Gets the toast message.
   */
  public async getMessage(): Promise<string> {
    const toastBody = await this.locatorForOptional('.sky-toast-body')();

    if (toastBody) {
      return (await toastBody.text()).trim();
    } else {
      throw new Error(
        'No toast message found. This method cannot be used to query toasts with custom components.',
      );
    }
  }

  /**
   * Gets the toast type.
   */
  public async getType(): Promise<SkyToastType> {
    const toast = await this.#getToast();
    if (await toast.hasClass('sky-toast-danger')) {
      return SkyToastType.Danger;
    } else if (await toast.hasClass('sky-toast-warning')) {
      return SkyToastType.Warning;
    } else if (await toast.hasClass('sky-toast-success')) {
      return SkyToastType.Success;
    }
    return SkyToastType.Info;
  }
}

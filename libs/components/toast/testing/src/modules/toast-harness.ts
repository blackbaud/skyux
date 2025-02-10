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
      'toastId',
      filters.dataToastIdNumber,
      async (harness, toastId) => {
        const id = await harness.#getToastId();
        return await HarnessPredicate.stringMatches(id, toastId.toString());
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
  public async getMessage(): Promise<string | undefined> {
    const toastBody = await this.locatorForOptional('.sky-toast-body')();

    if (toastBody) {
      return (await toastBody.text()).trim();
    }

    return undefined;
  }

  /**
   * Gets the toast type.
   */
  public async getType(): Promise<SkyToastType> {
    const toast = await this.#getToast();
    if (await toast.hasClass('.sky-toast-danger')) {
      return SkyToastType.Danger;
    } else if (await toast.hasClass('.sky-toast-warning')) {
      return SkyToastType.Warning;
    } else if (await toast.hasClass('.sky-toast-success')) {
      return SkyToastType.Success;
    }
    return SkyToastType.Info;
  }

  async #getToastId(): Promise<string> {
    const wrapper = await this.locatorFor('div[data-toast-id]')();
    return await wrapper.getProperty('data-toast-id');
  }
}

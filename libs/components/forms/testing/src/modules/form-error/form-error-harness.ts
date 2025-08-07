import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';

import { SkyFormErrorHarnessFilters } from './form-error-harness.filters';

export class SkyFormErrorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-form-error';

  async #getStatusIndicator(): Promise<SkyStatusIndicatorHarness> {
    return await this.locatorFor(SkyStatusIndicatorHarness)();
  }

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFormErrorHarness` that meets certain criteria
   */
  public static with(
    filters: SkyFormErrorHarnessFilters,
  ): HarnessPredicate<SkyFormErrorHarness> {
    return SkyFormErrorHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the error name.
   */
  public async getErrorName(): Promise<string | null> {
    return await (await this.host()).getAttribute('data-error-name');
  }

  /**
   * Gets the error text.
   */
  public async getErrorText(): Promise<string | null> {
    return await (await this.#getStatusIndicator()).getText();
  }

  /**
   * Gets the error text.
   */
  public async getErrorText(): Promise<string | null> {
    return await (await this.#getStatusIndicator()).getText();
  }
}

import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorHarnessFilters } from './form-error-harness.filters';

export class SkyFormErrorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-form-error';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFormErrorHarness` that meets certain criteria
   */
  public static with(
    filters: SkyFormErrorHarnessFilters,
  ): HarnessPredicate<SkyFormErrorHarness> {
    return SkyFormErrorHarness.getDataSkyIdPredicate(filters);
  }

  async #getFormErrorClasses(): Promise<string[]> {
    const formErrorClasses = await (await this.host()).getProperty('classList');
    return Array.from(formErrorClasses);
  }

  /*
   * Gets the error class that signifies which error has fired.
   */
  public async getFirstClassError(): Promise<string> {
    return (await this.#getFormErrorClasses())[0];
  }
}

import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';

import { SkyFormErrorsHarnessFilters } from './form-errors-harness.filters';

export class SkyFormErrorsHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-form-errors';

  #getFormError = this.locatorForAll('sky-form-error');

  async #getFormErrorsClasses(): Promise<string[]> {
    return this.#getFormError().then((formErrors) => {
      formErrors.map((formError) => {
        return formError.getProperty('classList');
      });
    });
  }

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFormErrorsHarness` that meets certain criteria
   */
  public static with(
    filters: SkyFormErrorsHarnessFilters,
  ): HarnessPredicate<SkyFormErrorsHarness> {
    return SkyFormErrorsHarness.getDataSkyIdPredicate(filters);
  }

  public async getErrors(): Promise<string[] | void> {
    const harnesses = await this.locatorForAll(
      SkyStatusIndicatorHarness.with({}),
    )();
    return await Promise.all(
      harnesses.map((harness) => {
        return harness.getText();
      }),
    );
  }

  public async getNumberOfErrors(): Promise<number> {
    return (await this.#getFormError()).length;
  }

  public async isRequiredError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'skyux_form_error_required',
    );
  }
}

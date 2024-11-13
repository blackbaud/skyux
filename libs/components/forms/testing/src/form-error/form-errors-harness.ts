import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorHarness } from './form-error-harness';
import { SkyFormErrorsHarnessFilters } from './form-errors-harness.filters';

export class SkyFormErrorsHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-form-errors';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFormErrorsHarness` that meets certain criteria
   */
  public static with(
    filters: SkyFormErrorsHarnessFilters,
  ): HarnessPredicate<SkyFormErrorsHarness> {
    return SkyFormErrorsHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets a list of all errors fired.
   */
  public async getFormErrors(): Promise<{ errorName: string | null }[]> {
    const formErrorHarnesses = await this.locatorForAll(
      SkyFormErrorHarness.with({}),
    )();

    return await Promise.all(
      formErrorHarnesses.map(async (formError) => {
        return { errorName: await formError.getErrorName() };
      }),
    );
  }

  /**
   * Whether an error with the given name has fired.
   */
  public async hasError(errorName: string): Promise<boolean> {
    const formErrors = await this.getFormErrors();
    return formErrors.some((error) => {
      return error.errorName === errorName;
    });
  }
}

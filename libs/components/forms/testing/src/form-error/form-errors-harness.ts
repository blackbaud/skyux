import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorHarness } from './form-error-harness';
import { SkyFormErrorsHarnessFilters } from './form-errors-harness.filters';

export class SkyFormErrorsHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-form-errors';

  public async getFormErrors(): Promise<{ errorName: string | null }[]> {
    const formErrorHarnesses = await this.locatorForAll(
      SkyFormErrorHarness.with({}),
    )();

    return Promise.all(
      formErrorHarnesses.map(async (formError) => {
        return { errorName: await formError.getErrorName() };
      }),
    );
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
}

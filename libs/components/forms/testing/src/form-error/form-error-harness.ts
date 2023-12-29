import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';

import { SkyFormErrorHarnessFilters } from './form-error-harness.filters';

export class SkyFormErrorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-form-errors';

  #getFormError = this.locatorForAll('sky-form-error');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFormErrorHarness` that meets certain criteria
   */
  public static with(
    filters: SkyFormErrorHarnessFilters,
  ): HarnessPredicate<SkyFormErrorHarness> {
    return SkyFormErrorHarness.getDataSkyIdPredicate(filters);
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
}

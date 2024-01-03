import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorHarness } from './form-error-harness';
import { SkyFormErrorsHarnessFilters } from './form-errors-harness.filters';

export class SkyFormErrorsHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-form-errors';

  #getFormError = this.locatorForAll('sky-form-error');

  async #getFormErrorsClasses(): Promise<string[]> {
    const formErrorHarnesses = await this.locatorForAll(
      SkyFormErrorHarness.with({}),
    )();

    return Promise.all(
      formErrorHarnesses.map((formError) => {
        return formError.getFirstClassError();
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

  public async getNumberOfErrors(): Promise<number> {
    return (await this.#getFormError()).length;
  }

  public async isRequiredError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-required',
    );
  }

  public async isMaxLengthError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-maxlength',
    );
  }

  public async isMinLengthError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-minlength',
    );
  }

  public async isCharacterCountError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-character-counter',
    );
  }

  public async isDateError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-date');
  }

  public async isEmailError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-email',
    );
  }

  public async isPhoneFieldError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-phone',
    );
  }

  public async isTimeError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-time');
  }

  public async isUrlError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-url');
  }
}

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

  /*
   * Gets total number of errors.
   */
  public async getNumberOfErrors(): Promise<number> {
    return (await this.#getFormError()).length;
  }

  /*
   * Gets if the required error is triggered.
   */
  public async isRequiredError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-required',
    );
  }

  /*
   * Gets if the maximum length error is triggered.
   */
  public async isMaxLengthError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-maxlength',
    );
  }

  /*
   * Gets if the minimum length is triggered.
   */
  public async isMinLengthError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-minlength',
    );
  }

  /*
   * Gets if the character count error is triggered.
   */
  public async isCharacterCountError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-character-counter',
    );
  }

  /*
   * Gets if the date error is triggered.
   */
  public async isDateError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-date');
  }

  /*
   * Gets if the email error is triggered.
   */
  public async isEmailError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-email',
    );
  }

  /*
   * Gets if the phone field error is triggered.
   */
  public async isPhoneFieldError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-phone',
    );
  }

  /*
   * Gets if the time field error is triggered.
   */
  public async isTimeError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-time');
  }

  /*
   * Gets if the URL error is triggered.
   */
  public async isUrlError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-url');
  }
}

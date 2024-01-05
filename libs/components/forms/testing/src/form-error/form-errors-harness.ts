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
   * Gets if the required error has triggered.
   */
  public async hasRequiredError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-required',
    );
  }

  /*
   * Gets if the maximum length error has triggered.
   */
  public async hasMaxLengthError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-maxlength',
    );
  }

  /*
   * Gets if the minimum length has triggered.
   */
  public async hasMinLengthError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-minlength',
    );
  }

  /*
   * Gets if the character count error has triggered.
   */
  public async hasCharacterCountError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-character-counter',
    );
  }

  /*
   * Gets if the date error has triggered.
   */
  public async hasDateError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-date');
  }

  /*
   * Gets if the email error has triggered.
   */
  public async hasEmailError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-email',
    );
  }

  /*
   * Gets if the phone field error has triggered.
   */
  public async hasPhoneFieldError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes(
      'sky-form-error-phone',
    );
  }

  /*
   * Gets if the time field error has triggered.
   */
  public async hasTimeError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-time');
  }

  /*
   * Gets if the URL error has triggered.
   */
  public async hasUrlError(): Promise<boolean> {
    return (await this.#getFormErrorsClasses()).includes('sky-form-error-url');
  }
}

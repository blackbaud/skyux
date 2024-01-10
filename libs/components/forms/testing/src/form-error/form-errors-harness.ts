import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFormErrorHarness } from './form-error-harness';
import { SkyFormErrorsHarnessFilters } from './form-errors-harness.filters';

/**
 * Harness for interacting with form errors in tests.
 */
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

  /*
   * Whether the required field is set to an empty value.
   */
  public async hasRequiredError(): Promise<boolean> {
    return this.#hasErrorOfType('required');
  }

  /*
   * Whether the field has more characters than is allowed.
   */
  public async hasMaxLengthError(): Promise<boolean> {
    return this.#hasErrorOfType('maxlength');
  }

  /*
   * Whether the field has fewer characters than is allowed.
   */
  public async hasMinLengthError(): Promise<boolean> {
    return this.#hasErrorOfType('minlength');
  }

  /*
   * Whether the field has exceeded its maximum character count allowance.
   */
  public async hasCharacterCountError(): Promise<boolean> {
    return this.#hasErrorOfType('character-counter');
  }

  /*
   * Gets the field is set to an invalid date.
   */
  public async hasDateError(): Promise<boolean> {
    return this.#hasErrorOfType('date');
  }

  /*
   * Whether the field is set to an invalid email address.
   */
  public async hasEmailError(): Promise<boolean> {
    return this.#hasErrorOfType('email');
  }

  /*
   * Whether the field is set to an invalid phone number.
   */
  public async hasPhoneFieldError(): Promise<boolean> {
    return this.#hasErrorOfType('phone');
  }

  /*
   * Whether the field is set to an invalid time.
   */
  public async hasTimeError(): Promise<boolean> {
    return this.#hasErrorOfType('time');
  }

  /*
   * Whether the field is set to an invalid URL.
   */
  public async hasUrlError(): Promise<boolean> {
    return this.#hasErrorOfType('url');
  }

  async #hasErrorOfType(errorType: string): Promise<boolean> {
    const found = await this.locatorForOptional(
      SkyFormErrorHarness.with({ selector: `.sky-form-error-${errorType}` }),
    )();

    return !!found;
  }
}

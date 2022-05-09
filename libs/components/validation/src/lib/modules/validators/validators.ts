import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { SkyUrlValidationOptions } from '../url-validation/url-validation-options';
import { SkyValidation } from '../validation/validation';

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
export class SkyValidators {
  /**
   * Validates email addresses in reactive forms. Add this validator directly to the form control
   * model in the component class. If users enter values that are not valid email addresses, the
   * validator throws an error. Since this is a sync validator, it returns a set of validation
   * errors or `undefined` immediately when users enter values.
   * @param control
   */
  public static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return undefined;
    }

    return SkyValidation.isEmail(value)
      ? undefined
      : { skyEmail: { invalid: value } };
  }

  /**
   * Validates URLs in reactive forms. Add this validator directly to the form control model in
   * the component class. If users enter values that are not valid URLs, the validator throws an
   * error. Since this is a sync validator, it returns a set of validation errors or `undefined`
   * immediately when users enter values.
   * @param control
   */
  public static url(
    abstractControl: AbstractControl
  ): ValidationErrors | undefined;

  /**
   * Validates URLs in reactive forms. Add this validator with ruleset parameters directly to
   * the form control model in the component class. If users enter values that are not valid
   * URLs, the validator throws an error. Since this is a sync validator, it returns a set of
   * validation errors or `undefined` immediately when users enter values.
   * @param control
   */
  public static url(
    skyUrlValidationOptions: SkyUrlValidationOptions
  ): ValidatorFn | undefined;

  public static url(
    value: AbstractControl | SkyUrlValidationOptions
  ): ValidatorFn | ValidationErrors | undefined {
    const typeTester = value as SkyUrlValidationOptions;
    if (typeTester.rulesetVersion === undefined) {
      // there are no SkyUrlValidationOptions passed in, so return ValidationErrors | undefined
      const abstractControl = value as AbstractControl;
      const abstractControlValue = abstractControl.value;
      if (!abstractControlValue) {
        return;
      }
      return SkyValidation.isUrl(abstractControlValue)
        ? undefined
        : { skyUrl: { invalid: abstractControlValue } };
    } else {
      // there are SkyUrlValidationOptions passed in, so return ValidatorFn
      const skyUrlValidationOptions = value as SkyUrlValidationOptions;
      return (
        abstractControl: AbstractControl
      ): ValidationErrors | undefined => {
        const abstractControlValue = abstractControl.value;
        if (!abstractControlValue) {
          return;
        }

        return SkyValidation.isUrl(
          abstractControl.value,
          skyUrlValidationOptions
        )
          ? undefined
          : { skyUrl: { invalid: abstractControl.value } };
      };
    }
  }
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { SkyUrlValidationOptions } from '../url-validation/url-validation-options';
import { SkyValidation } from '../validation/validation';

export class SkyValidators {
  /**
   * Validates email addresses in reactive forms. Add this validator directly to the form control
   * model in the component class. If users enter values that are not valid email addresses, the
   * validator throws an error. Since this is a sync validator, it returns a set of validation
   * errors or `null` immediately when users enter values.
   */
  public static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    return SkyValidation.isEmail(value)
      ? null
      : { skyEmail: { invalid: value } };
  }

  /**
   * Validates URLs in reactive forms. Add this validator directly to the form control model in
   * the component class. If users enter values that are not valid URLs, the validator throws an
   * error. Since this is a sync validator, it returns a set of validation errors or `null`
   * immediately when users enter values.
   */
  public static url(abstractControl: AbstractControl): ValidationErrors | null;

  /**
   * Validates URLs in reactive forms. Add this validator with ruleset parameters directly to
   * the form control model in the component class. If users enter values that are not valid
   * URLs, the validator throws an error. Since this is a sync validator, it returns a set of
   * validation errors or `null` immediately when users enter values.
   */
  public static url(
    skyUrlValidationOptions: SkyUrlValidationOptions,
  ): ValidatorFn;

  public static url(
    value: AbstractControl | SkyUrlValidationOptions,
  ): ValidatorFn | ValidationErrors | null {
    const typeTester = value as SkyUrlValidationOptions;
    if (typeTester.rulesetVersion === undefined) {
      // there are no SkyUrlValidationOptions passed in, so return ValidationErrors | null
      const abstractControl = value as AbstractControl;
      const abstractControlValue = abstractControl.value;
      if (!abstractControlValue) {
        return null;
      }
      return SkyValidation.isUrl(abstractControlValue)
        ? null
        : { skyUrl: { invalid: abstractControlValue } };
    } else {
      // there are SkyUrlValidationOptions passed in, so return ValidatorFn
      const skyUrlValidationOptions = value as SkyUrlValidationOptions;
      return (abstractControl: AbstractControl): ValidationErrors | null => {
        const abstractControlValue = abstractControl.value;
        if (!abstractControlValue) {
          return null;
        }

        return SkyValidation.isUrl(
          abstractControl.value,
          skyUrlValidationOptions,
        )
          ? null
          : { skyUrl: { invalid: abstractControl.value } };
      };
    }
  }
}

import {
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import {
  SkyValidation
} from '../validation/validation';

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

    return SkyValidation.isEmail(value) ? undefined : { 'skyEmail': { invalid: value } };
  }

  /**
   * Validates URLs in reactive forms. Add this validator directly to the form control model in
   * the component class. If users enter values that are not valid URLs, the validator throws an
   * error. Since this is a sync validator, it returns a set of validation errors or `undefined`
   * immediately when users enter values.
   * @param control
   */
  public static url(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return undefined;
    }

    return SkyValidation.isUrl(value) ? undefined : { 'skyUrl': { invalid: value } };
  }
}

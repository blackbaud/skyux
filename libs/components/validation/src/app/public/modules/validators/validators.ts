import {
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import {
  SkyValidation
} from '../validation';

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
export class SkyValidators {

  public static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return undefined;
    }

    return SkyValidation.isEmail(value) ? undefined : { 'skyEmail': { invalid: value } };
  }

  public static url(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return undefined;
    }

    return SkyValidation.isUrl(value) ? undefined : { 'skyUrl': { invalid: value } };
  }
}

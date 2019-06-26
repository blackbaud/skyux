import {
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import {
  SkyValidation
} from '../validation';

export class SkyValidators {
  public static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value === undefined || value.length === 0) {
      return undefined;
    }

    return SkyValidation.isEmail(value) ? undefined : { 'skyEmail': { invalid: value } };
  }

  public static url(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value === undefined || value.length === 0) {
      return undefined;
    }

    return SkyValidation.isUrl(value) ? undefined : { 'skyUrl': { invalid: value } };
  }
}

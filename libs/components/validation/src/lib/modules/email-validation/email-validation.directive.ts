import { Directive, forwardRef } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { SkyValidation } from '../validation/validation';

const SKY_EMAIL_VALIDATION_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyEmailValidationDirective),
  multi: true,
};

/**
 * Adds email address validation to an input element. The directive uses `NgModel` to bind data.
 */
@Directive({
  selector: '[skyEmailValidation]',
  providers: [SKY_EMAIL_VALIDATION_VALIDATOR],
  standalone: false,
})
export class SkyEmailValidationDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || this.emailIsValid(value)) {
      return null;
    }

    return {
      skyEmail: {
        invalid: control.value,
      },
    };
  }

  public emailIsValid(email: string): boolean {
    return SkyValidation.isEmail(email);
  }
}

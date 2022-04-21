import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

import { SkyValidation } from '../validation/validation';

const SKY_EMAIL_VALIDATION_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyEmailValidationDirective),
  multi: true,
};

/**
 * Creates an input to validate email addresses. Place this attribute on an `input` element.
 * If users enter values that are not valid email addresses, an error message appears.
 * The directive uses `NgModel` to bind data.
 */
@Directive({
  selector: '[skyEmailValidation]',
  providers: [SKY_EMAIL_VALIDATION_VALIDATOR],
})
export class SkyEmailValidationDirective implements Validator {
  public validate(control: AbstractControl): { [key: string]: any } {
    const value = control.value;

    if (!value) {
      return;
    }

    if (!this.emailIsValid(value)) {
      return {
        skyEmail: {
          invalid: control.value,
        },
      };
    }
  }

  public emailIsValid(email: string): boolean {
    return SkyValidation.isEmail(email);
  }
}

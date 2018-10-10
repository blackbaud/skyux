import {
  Directive,
  forwardRef
} from '@angular/core';
import {
  Validator,
  NG_VALIDATORS,
  AbstractControl
} from '@angular/forms';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_EMAIL_VALIDATION_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyEmailValidationDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: '[skyEmailValidation]',
  providers: [SKY_EMAIL_VALIDATION_VALIDATOR]
})

export class SkyEmailValidationDirective implements Validator {

  public validate(control: AbstractControl): {[key: string]: any} {
    let value = control.value;

    if (!value) {
      return;
    }

    if (!this.emailIsValid(value)) {
      return {
        'skyEmail': {
          invalid: control.value
        }
      };
    }

  }

  public emailIsValid(email: string): boolean {
    // The regex was obtained from http://emailregex.com/
    // which claims to correctly handle ~99% of all email addresses.
    // tslint:disable-next-line:max-line-length
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }
}

import {
  Directive,
  forwardRef
} from '@angular/core';

import {
  Validator,
  NG_VALIDATORS,
  AbstractControl
} from '@angular/forms';

import {
  SkyValidation
} from '../validation/validation';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_URL_VALIDATION_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyUrlValidationDirective),
  multi: true
};
// tslint:enable
@Directive({
  selector: '[skyUrlValidation]',
  providers: [SKY_URL_VALIDATION_VALIDATOR]
})

export class SkyUrlValidationDirective implements Validator {
  public validate(control: AbstractControl): {[key: string]: any} {
    const value = control.value;

    if (!value) {
      return;
    }

    if (!this.urlIsValid(value)) {
      return {
        'skyUrl': {
          invalid: control.value
        }
      };
    }
  }

  public urlIsValid(url: string): boolean {
    return SkyValidation.isUrl(url);
  }
}

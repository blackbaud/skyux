import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

import { SkyValidation } from '../validation/validation';

const SKY_URL_VALIDATION_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyUrlValidationDirective),
  multi: true,
};

/**
 * Creates an input to validate URLs. Place this attribute on an `input` element.
 * If users enters values that are not valid URLs, an error message appears.
 * This directive uses `NgModel` to bind data.
 */
@Directive({
  selector: '[skyUrlValidation]',
  providers: [SKY_URL_VALIDATION_VALIDATOR],
})
export class SkyUrlValidationDirective implements Validator {
  public validate(control: AbstractControl): { [key: string]: any } {
    const value = control.value;

    if (!value) {
      return;
    }

    if (!this.urlIsValid(value)) {
      return {
        skyUrl: {
          invalid: control.value,
        },
      };
    }
  }

  public urlIsValid(url: string): boolean {
    return SkyValidation.isUrl(url);
  }
}

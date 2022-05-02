import { Directive, Input, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

import { SkyValidation } from '../validation/validation';

import { SkyUrlValidationOptions } from './url-validation-options';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_URL_VALIDATION_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyUrlValidationDirective),
  multi: true,
};
// tslint:enable

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
  /**
   * Specifies configuration options for the URL validation component.
   */
  @Input()
  public set skyUrlValidation(value: SkyUrlValidationOptions) {
    this.skyUrlValidationOptions = value;
  }

  private skyUrlValidationOptions: SkyUrlValidationOptions;

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
    if (this.skyUrlValidationOptions) {
      return SkyValidation.isUrl(url, this.skyUrlValidationOptions);
    } else {
      return SkyValidation.isUrl(url);
    }
  }
}

import { Directive, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { SkyValidation } from '../validation/validation';

import { SkyUrlValidationOptions } from './url-validation-options';

const SKY_URL_VALIDATION_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyUrlValidationDirective),
  multi: true,
};

/**
 * Adds URL validation to an input element. The directive uses `NgModel` to bind data.
 */
@Directive({
  selector: '[skyUrlValidation]',
  providers: [SKY_URL_VALIDATION_VALIDATOR],
  standalone: false,
})
export class SkyUrlValidationDirective implements Validator {
  /**
   * Configuration options for the URL validation component.
   */
  @Input()
  public set skyUrlValidation(value: SkyUrlValidationOptions | undefined) {
    this.#_skyUrlValidationOptions = value;
    this.#validatorChange();
  }

  #_skyUrlValidationOptions: SkyUrlValidationOptions | undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #validatorChange = (): void => {};

  public validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    return SkyValidation.isUrl(value, this.#_skyUrlValidationOptions)
      ? null
      : { skyUrl: { invalid: value } };
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.#validatorChange = fn;
  }
}

import { Directive, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { SkyValidation } from '../validation/validation';

import { SkyUrlValidationOptions } from './url-validation-options';

// tslint:disable:no-forward-ref no-use-before-declare
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
})
export class SkyUrlValidationDirective implements Validator {
  /**
   * Specifies configuration options for the URL validation component.
   */
  @Input()
  public set skyUrlValidation(value: SkyUrlValidationOptions | undefined) {
    this._skyUrlValidationOptions = value;
    this._validatorChange();
  }

  private _skyUrlValidationOptions: SkyUrlValidationOptions | undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _validatorChange = () => {};

  public validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    return SkyValidation.isUrl(value, this._skyUrlValidationOptions)
      ? null
      : { skyUrl: { invalid: value } };
  }

  public registerOnValidatorChange(fn: () => void): void {
    this._validatorChange = fn;
  }
}

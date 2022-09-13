import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { SkyCharacterCounterIndicatorComponent } from './character-counter-indicator.component';

/**
 * Creates an input field that validates the number of characters. Place this directive on
 * an `input` or `textarea` element. If users enter more characters than allowed, then the
 * input field is invalid and the component displays an error indicator.
 * @required
 */
@Directive({
  selector: '[skyCharacterCounter]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SkyCharacterCounterInputDirective,
      multi: true,
    },
  ],
})
export class SkyCharacterCounterInputDirective implements Validator {
  /**
   * Specifies the character count indicator component that displays the character count,
   * character limit, and over-the-limit indicator. Place this directive on an `input` or
   * `textarea` element.
   */
  @Input()
  public skyCharacterCounterIndicator:
    | SkyCharacterCounterIndicatorComponent
    | undefined;

  /**
   * Specifies the maximum number of characters allowed in the input field. Place this directive
   * on an `input` or `textarea` element. This property accepts `number` values.
   * @required
   */
  @Input()
  public set skyCharacterCounterLimit(value: number | undefined) {
    this.#skyCharacterCounterLimitOrDefault = value ?? 0;
    this.#updateIndicatorLimit(this.#skyCharacterCounterLimitOrDefault);
    this.#validatorChange();
  }

  #skyCharacterCounterLimitOrDefault = 0;

  public validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    this.#updateIndicatorCount((value && value.length) || 0);

    if (!value) {
      return null;
    }

    if (value.length > this.#skyCharacterCounterLimitOrDefault) {
      // This is needed to apply the appropriate error styles to the input.
      control.markAsTouched();

      return {
        skyCharacterCounter: {
          invalid: value,
        },
      };
    }

    return null;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.#validatorChange = fn;
  }

  #updateIndicatorCount(count: number): void {
    if (this.skyCharacterCounterIndicator) {
      this.skyCharacterCounterIndicator.characterCount = count;
    }
  }

  #updateIndicatorLimit(limit: number): void {
    if (this.skyCharacterCounterIndicator) {
      this.skyCharacterCounterIndicator.characterCountLimit = limit;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #validatorChange = () => {};
}

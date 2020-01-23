import {
  Directive,
  Input
} from '@angular/core';

import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  SkyCharacterCounterIndicatorComponent
} from './character-counter-indicator.component';

@Directive({
  selector: '[skyCharacterCounter]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SkyCharacterCounterInputDirective,
      multi: true
    }
  ]
})
export class SkyCharacterCounterInputDirective implements Validator {

  @Input()
  public skyCharacterCounterIndicator: SkyCharacterCounterIndicatorComponent;

  @Input()
  public set skyCharacterCounterLimit(value: number) {
    this._skyCharacterCounterLimit = value;
    this.updateIndicatorLimit(this.skyCharacterCounterLimit);
    this._validatorChange();
  }

  public get skyCharacterCounterLimit(): number {
    return this._skyCharacterCounterLimit || 0;
  }

  private _skyCharacterCounterLimit: number;

  public validate(control: AbstractControl): ValidationErrors {
    const value = control.value;

    this.updateIndicatorCount(value && value.length || 0);

    if (!value) {
      return;
    }

    if (value.length > this.skyCharacterCounterLimit) {
      // This is needed to apply the appropriate error styles to the input.
      control.markAsTouched();

      return {
        'skyCharacterCounter': {
          invalid: value
        }
      };
    }
  }

  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  private updateIndicatorCount(count: number): void {
    if (this.skyCharacterCounterIndicator) {
      this.skyCharacterCounterIndicator.characterCount = count;
    }
  }

  private updateIndicatorLimit(limit: number): void {
    if (this.skyCharacterCounterIndicator) {
      this.skyCharacterCounterIndicator.characterCountLimit = limit;
    }
  }

  private _validatorChange = () => { };

}

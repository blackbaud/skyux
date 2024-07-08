import { Directive, HostListener, inject } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

import { SkyPhoneFieldComponent } from './phone-field.component';

@Directive({
  selector: '[skyPhoneFieldInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SkyPhoneFieldInputDirective,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SkyPhoneFieldInputDirective,
      multi: true,
    },
  ],
})
export class SkyPhoneFieldInputDirective
  implements ControlValueAccessor, Validator
{
  @HostListener('change', ['$event'])
  protected onChange(evt: Event): void {
    const value = (evt.target as HTMLInputElement).value;
    console.log('notify change, change evt', value);

    const formatted = this.#formatPhoneNumber(value);

    this.#notifyChange?.(formatted ?? value);
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.#notifyTouched?.();
  }

  #hostControl: AbstractControl | undefined;
  #notifyChange: ((value: string) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  readonly #hostComponent = inject(SkyPhoneFieldComponent, {
    host: true,
    optional: true,
  });

  readonly #phoneUtils = PhoneNumberUtil.getInstance();

  public registerOnChange(fn: (value: string) => void): void {
    this.#notifyChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    this.#hostControl ??= control;

    const value = control.value;

    if (!value) {
      return null;
    }

    console.log('validate()', value);

    if (!this.#isValidPhoneNumber(value)) {
      return {
        skyPhoneField: {
          invalid: value,
        },
      };
    }

    return null;
  }

  public writeValue(value: unknown): void {
    value = typeof value === 'string' ? value : '';

    console.log('writeValue:', value);

    // Update the input with formatted value.
    // If value !== formattedValue, notifyChange()
  }

  #formatPhoneNumber(value: string): string | undefined {
    const defaultCountry = this.#hostComponent?.defaultCountry;
    const iso2 = this.#hostComponent?.selectedCountry?.iso2;
    const returnFormat = this.#hostComponent?.returnFormat;

    try {
      const phoneNumber = this.#phoneUtils.parseAndKeepRawInput(value, iso2);

      if (this.#phoneUtils.isPossibleNumber(phoneNumber)) {
        switch (returnFormat) {
          case 'international':
            return this.#phoneUtils.format(
              phoneNumber,
              PhoneNumberFormat.INTERNATIONAL,
            );

          case 'national':
            return this.#phoneUtils.format(
              phoneNumber,
              PhoneNumberFormat.NATIONAL,
            );

          case 'default':
          default:
            return iso2 !== defaultCountry
              ? this.#phoneUtils.format(
                  phoneNumber,
                  PhoneNumberFormat.INTERNATIONAL,
                )
              : this.#phoneUtils.format(
                  phoneNumber,
                  PhoneNumberFormat.NATIONAL,
                );
        }
      } else {
        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }

  #isValidPhoneNumber(value: string): boolean {
    const iso2 = this.#hostComponent?.selectedCountry?.iso2;
    const allowExtensions = !!this.#hostComponent?.allowExtensions;

    try {
      const phoneNumber = this.#phoneUtils.parseAndKeepRawInput(value, iso2);

      if (!allowExtensions && phoneNumber.getExtension()) {
        return false;
      }

      return this.#phoneUtils.isValidNumberForRegion(phoneNumber, iso2);
    } catch (e) {
      return false;
    }
  }
}

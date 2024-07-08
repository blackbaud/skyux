import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  booleanAttribute,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

import { SkyPhoneFieldAdapterService } from './phone-field-adapter.service';
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
  implements ControlValueAccessor, OnInit, Validator
{
  @Input({ transform: booleanAttribute })
  public set disabled(value: boolean) {
    if (this.#hostComponent) {
      this.#hostComponent.countrySelectDisabled = value;
      this.#adapterSvc?.setElementDisabledState(this.#elementRef, value);
    }

    this.#_disabled = value;
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  @Input({ transform: booleanAttribute })
  public skyPhoneFieldNoValidate = false;

  #_controlValue = '';
  #_disabled = false;
  #hostControl: AbstractControl | undefined;
  #notifyChange: ((value: string) => void) | undefined;
  #notifyTouched: (() => void) | undefined;
  #rerunValidation: (() => void) | undefined;

  readonly #adapterSvc = inject(SkyPhoneFieldAdapterService, {
    host: true,
    optional: true,
    skipSelf: true,
  });

  readonly #elementRef = inject(ElementRef);
  readonly #hostComponent = inject(SkyPhoneFieldComponent, {
    host: true,
    optional: true,
  });

  readonly #phoneUtils = PhoneNumberUtil.getInstance();

  public ngOnInit(): void {
    if (!this.#hostComponent) {
      throw new Error(
        'You must wrap the `skyPhoneFieldInput` directive within a ' +
          '`<sky-phone-field>` component!',
      );
    }

    this.#adapterSvc?.setElementType(this.#elementRef);
    this.#adapterSvc?.addElementClass(this.#elementRef, 'sky-form-control');

    this.#hostComponent?.selectedCountryChange.subscribe((x) => {
      this.#rerunValidation?.();
    });
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.#notifyChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.#rerunValidation = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    this.#hostControl ??= control;

    const value = control.value;

    if (!value || this.skyPhoneFieldNoValidate) {
      return null;
    }

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

  @HostListener('change')
  protected onChange(): void {
    const value = this.#adapterSvc?.getInputValue(this.#elementRef);
    this.#setValue(value);
    this.#notifyChange?.(this.#getValue());
  }

  @HostListener('input')
  protected onInput(): void {
    const value = this.#adapterSvc?.getInputValue(this.#elementRef);

    if (value !== undefined) {
      this.#hostComponent?.setCountryByDialCode(value);
    }
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.#notifyTouched?.();
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

  #setValue(value = ''): void {
    const formatted = this.#formatPhoneNumber(value);
    this.#_controlValue = formatted ?? value;
  }

  #getValue(): string {
    return this.#_controlValue;
  }
}

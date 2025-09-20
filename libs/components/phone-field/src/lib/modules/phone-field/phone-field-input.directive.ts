import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
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

import {
  PhoneNumber,
  PhoneNumberFormat,
  PhoneNumberUtil,
} from 'google-libphonenumber';
import { Subject, take, takeUntil } from 'rxjs';

import { SkyPhoneFieldAdapterService } from './phone-field-adapter.service';
import { SkyPhoneFieldComponent } from './phone-field.component';
import { SkyPhoneFieldNumberReturnFormat } from './types/number-return-format';

/**
 * Creates a button, search input, and text input for entering and validating
 * international phone numbers. Place this attribute on an `input` element, and wrap
 * that element in a `sky-phone-field` component. By default, the country selector
 * button displays a flag icon for the default country, and the phone number input
 * displays a sample of the correct phone number format. When users select the country
 * selector button, they expose the country search input, which is
 * [an autocomplete input](https://developer.blackbaud.com/skyux/components/autocomplete)
 * that allows them to select different countries. When users enter `+` followed by an
 * international dial code in the phone number input, the country automatically switches
 * to the country associated with the dial code.
 * @required
 */
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
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * Whether to disable the phone field on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input({ transform: booleanAttribute })
  public set disabled(value: boolean) {
    if (this.#phoneFieldComponent) {
      this.#phoneFieldComponent.countrySelectDisabled = value;
      this.#adapterSvc?.setElementDisabledState(this.#elRef, value);
    }

    this.#_disabled = value;
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Whether to prevent validation on the phone number input. For validation,
   * phone numbers are driven through the `ngModel` attribute that you specify on an
   * `input` element or on a `FormControl` in a reactive form. To prevent validation,
   * set this property to `true`.
   * @default false
   */
  @Input({ transform: booleanAttribute })
  public skyPhoneFieldNoValidate = false;

  #_disabled = false;
  #_value = '';
  #control: AbstractControl | undefined;
  #ngUnsubscribe = new Subject<void>();
  #notifyChange: ((value: string) => void) | undefined;
  #notifyTouched: (() => void) | undefined;
  #phoneUtils = PhoneNumberUtil.getInstance();

  readonly #adapterSvc = inject(SkyPhoneFieldAdapterService, {
    host: true,
    optional: true,
    skipSelf: true,
  });

  readonly #elRef = inject(ElementRef);
  readonly #phoneFieldComponent = inject(SkyPhoneFieldComponent, {
    host: true,
    optional: true,
  });

  public ngOnInit(): void {
    if (!this.#phoneFieldComponent) {
      throw new Error(
        'You must wrap the `skyPhoneFieldInput` directive within a ' +
          '`<sky-phone-field>` component!',
      );
    }

    this.#adapterSvc?.setElementType(this.#elRef);
    this.#adapterSvc?.addElementClass(this.#elRef, 'sky-form-control');

    this.#phoneFieldComponent?.selectedCountryChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        const value = this.#adapterSvc?.getInputValue(this.#elRef);
        this.#setValue(value);
        this.#control?.updateValueAndValidity();
      });

    this.#phoneFieldComponent.countrySearchForm
      .get('countrySearch')
      ?.valueChanges.pipe(takeUntil(this.#ngUnsubscribe), take(1))
      .subscribe(() => {
        this.#control?.markAsDirty();
        this.#control?.markAsTouched();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.#notifyChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    this.#control ??= control;

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
    const rawValue = typeof value === 'string' ? value : '';

    this.#phoneFieldComponent?.setCountryByDialCode(rawValue);
    this.#adapterSvc?.setElementValue(this.#elRef, rawValue);

    this.#setValue(rawValue);
    const newValue = this.#getValue();

    if (rawValue !== newValue) {
      // If the value is set before the control is initialized, wait for the
      // first cycle to complete before triggering a value change event.
      // (This occurs when the control is initialized with an unformatted value
      // but is formatted into a new value immediately in the `writeValue`
      // method.)
      if (!this.#control) {
        setTimeout(() => {
          this.#notifyChange?.(newValue);
        });
      } else {
        this.#notifyChange?.(newValue);
      }
    }
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.#notifyTouched?.();
  }

  @HostListener('input')
  protected onInput(): void {
    const value = this.#adapterSvc?.getInputValue(this.#elRef);
    this.#phoneFieldComponent?.setCountryByDialCode(value);
    this.#setValue(value);
    this.#notifyChange?.(this.#getValue());
  }

  #maybeFormatPhoneNumber(value: string | undefined): string | undefined {
    if (!value) {
      return;
    }

    const defaultCountry = this.#getDefaultCountry();
    const regionCode = this.#getRegionCode();
    const returnFormat = this.#phoneFieldComponent?.returnFormat;

    try {
      const phoneNumber = this.#phoneUtils.parseAndKeepRawInput(
        value,
        regionCode ?? defaultCountry,
      );

      if (this.#phoneUtils.isPossibleNumber(phoneNumber)) {
        return this.#formatPhoneNumber(
          phoneNumber,
          returnFormat,
          defaultCountry,
          regionCode,
        );
      }
    } catch {
      /* */
    }

    return;
  }

  #formatPhoneNumber(
    phoneNumber: PhoneNumber,
    returnFormat?: SkyPhoneFieldNumberReturnFormat,
    defaultCountry?: string,
    regionCode?: string,
  ): string {
    switch (returnFormat) {
      case 'international':
        return this.#phoneUtils.format(
          phoneNumber,
          PhoneNumberFormat.INTERNATIONAL,
        );

      case 'national':
        return this.#phoneUtils.format(phoneNumber, PhoneNumberFormat.NATIONAL);

      case 'default':
      default:
        return regionCode && regionCode !== defaultCountry
          ? this.#phoneUtils.format(
              phoneNumber,
              PhoneNumberFormat.INTERNATIONAL,
            )
          : this.#phoneUtils.format(phoneNumber, PhoneNumberFormat.NATIONAL);
    }
  }

  #getDefaultCountry(): string | undefined {
    return this.#phoneFieldComponent?.defaultCountry;
  }

  #getRegionCode(): string | undefined {
    return this.#phoneFieldComponent?.selectedCountry?.iso2;
  }

  #getValue(): string {
    return this.#_value;
  }

  #isValidPhoneNumber(value: string): boolean {
    const defaultCountry = this.#getDefaultCountry();
    const regionCode = this.#getRegionCode() ?? defaultCountry;
    const allowExtensions = !!this.#phoneFieldComponent?.allowExtensions;

    try {
      const phoneNumber = this.#phoneUtils.parseAndKeepRawInput(
        value,
        regionCode,
      );

      if (!allowExtensions && phoneNumber.getExtension()) {
        return false;
      }

      return this.#phoneUtils.isValidNumberForRegion(phoneNumber, regionCode);
    } catch {
      return false;
    }
  }

  #setValue(value: string | undefined): void {
    /* istanbul ignore else */
    if (value !== undefined) {
      const formatted = this.#maybeFormatPhoneNumber(value);
      this.#_value = formatted ?? value;
    }
  }
}

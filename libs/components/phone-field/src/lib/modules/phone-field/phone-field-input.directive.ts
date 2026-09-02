import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  booleanAttribute,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { skyIsAbstractControl } from '@skyux/forms';

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
  host: {
    '(blur)': 'onBlur()',
    '(input)': 'onInput()',
  },
})
export class SkyPhoneFieldInputDirective
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * Whether to disable the phone field on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to prevent validation on the phone number input. For validation,
   * phone numbers are driven through the `ngModel` attribute that you specify on an
   * `input` element or on a `FormControl` in a reactive form. To prevent validation,
   * set this property to `true`.
   * @default false
   */
  public readonly skyPhoneFieldNoValidate = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  readonly #disabled = linkedSignal(() => this.disabled());
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

  constructor() {
    effect(() => {
      const value = this.#disabled();
      if (this.#phoneFieldComponent) {
        this.#phoneFieldComponent.countrySelectDisabled.set(value);
        this.#adapterSvc?.setElementDisabledState(this.#elRef, value);
      }
    });
  }

  public ngOnInit(): void {
    if (!this.#phoneFieldComponent) {
      throw new Error(
        'You must wrap the `skyPhoneFieldInput` directive within a ' +
          '`<sky-phone-field>` component!',
      );
    }

    this.#adapterSvc?.setElementType(this.#elRef);
    this.#adapterSvc?.addElementClass(this.#elRef, 'sky-form-control');

    this.#phoneFieldComponent?.selectedCountryChange.subscribe(() => {
      const value = this.#adapterSvc?.getInputValue(this.#elRef);
      const previousValue = this.#getValue();
      this.#setValue(value);
      const newValue = this.#getValue();

      // When changing the country reformats the existing number (i.e. the
      // number is formattable for the newly selected country), push the
      // reformatted value — including its country code — to the form control so
      // downstream consumers receive a correctly formatted number without the
      // user having to edit the field again. `#setValue` leaves the value
      // untouched when it isn't formattable for the new country, so comparing
      // against the raw input skips that case and leaves validation to flag it.
      if (newValue !== previousValue && newValue !== value) {
        this.#notifyChange?.(newValue);
      }

      this.#control?.updateValueAndValidity();
    });

    this.#phoneFieldComponent.countrySearchForm
      .get('countrySearch')
      ?.valueChanges.pipe(takeUntil(this.#ngUnsubscribe), take(1))
      .subscribe(() => {
        // Interacting with the country search box is a user action, so it
        // marks the field dirty for every form flavor, the same way typing
        // in the phone number input does -- `#notifyChange` marks a
        // signal-forms field dirty unconditionally, and Angular's own
        // reactive/template-driven forms plumbing does the same for the
        // registered `onChange` callback.
        this.#notifyChange?.(this.#getValue());
        this.#notifyTouched?.();
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
    this.#disabled.set(isDisabled);
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control && skyIsAbstractControl(control)) {
      this.#control = control;
    }

    const value = control.value;

    if (!value || this.skyPhoneFieldNoValidate()) {
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

    // `writeValue` is always an externally-driven write (model-to-view),
    // never a user action, so it must never call `#notifyChange` --
    // `#notifyChange` marks the field dirty unconditionally, for every form
    // flavor. Normalize a reactive/template-driven control's value to the
    // formatted number by writing directly to it instead, which doesn't
    // mark it dirty. `emitModelToViewChange: false` is required (not just
    // `emitEvent: false`) to avoid `writeValue` recursively re-running:
    // `AbstractControl.setValue()` calls back into the CVA's `writeValue`
    // unless that's explicitly suppressed. Signal forms' interop control
    // has no `setValue`, so its field keeps the raw value until the user
    // edits it.
    if (rawValue !== newValue) {
      if (!this.#control) {
        // `validate()` (which captures `#control`) may not have run yet on
        // the very first `writeValue` call -- wait for the current cycle to
        // complete before normalizing.
        setTimeout(() => {
          this.#normalizeControlValue(newValue);
        });
      } else {
        this.#normalizeControlValue(newValue);
      }
    }
  }

  #normalizeControlValue(newValue: string): void {
    if (
      skyIsAbstractControl(this.#control) &&
      this.#control.value !== newValue
    ) {
      this.#control.setValue(newValue, {
        emitEvent: false,
        emitModelToViewChange: false,
      });
    }
  }

  protected onBlur(): void {
    this.#notifyTouched?.();
  }

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
    const returnFormat = this.#phoneFieldComponent?.returnFormat();

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
    return this.#phoneFieldComponent?.defaultCountry();
  }

  #getRegionCode(): string | undefined {
    return this.#phoneFieldComponent?.selectedCountry()?.iso2;
  }

  #getValue(): string {
    return this.#_value;
  }

  #isValidPhoneNumber(value: string): boolean {
    const defaultCountry = this.#getDefaultCountry();
    const regionCode = this.#getRegionCode() ?? defaultCountry;
    const allowExtensions = !!this.#phoneFieldComponent?.allowExtensions();

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

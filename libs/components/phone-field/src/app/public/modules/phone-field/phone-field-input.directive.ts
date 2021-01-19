import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  BehaviorSubject,
  Subject
} from 'rxjs';

import {
  debounceTime,
  takeUntil
} from 'rxjs/operators';

import {
  PhoneNumberFormat,
  PhoneNumberUtil
} from 'google-libphonenumber';

import {
  SkyPhoneFieldComponent
} from './phone-field.component';

import {
  SkyPhoneFieldAdapterService
} from './phone-field-adapter.service';

import {
  SkyPhoneFieldCountry
} from './types/country';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_PHONE_FIELD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyPhoneFieldInputDirective),
  multi: true
};

const SKY_PHONE_FIELD_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyPhoneFieldInputDirective),
  multi: true
};
// tslint:enable

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
    SKY_PHONE_FIELD_VALUE_ACCESSOR,
    SKY_PHONE_FIELD_VALIDATOR
  ]
})
export class SkyPhoneFieldInputDirective implements OnInit, OnDestroy, AfterViewInit,
  ControlValueAccessor, Validator {

  /**
   * Indicates whether to disable the phone field.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    this.phoneFieldComponent.countrySelectDisabled = value;
    this.adapterService.setElementDisabledState(this.elRef, value);
    this._disabled = value;
  }

  public get disabled(): boolean {
    return this._disabled || false;
  }

  /**
   * Indicates whether to prevent validation on the phone number input. For validation,
   * phone numbers are driven through the `ngModel` attribute that you specify on an
   * `input` element or on a `FormControl` in a reactive form. To prevent validation,
   * set this property to `true`.
   * @default false
   */
  @Input()
  public skyPhoneFieldNoValidate: boolean = false;

  private set modelValue(value: string) {
    this._modelValue = value;

    this.adapterService.setElementValue(this.elRef, value);

    if (value) {
      let formattedValue = this.formatNumber(value.toString());

      this.onChange(formattedValue);
    } else {
      this.onChange(value);
    }
    this.validatorChange();
  }

  private get modelValue(): string {
    return this._modelValue;
  }

  private control: AbstractControl;

  private textChanges: BehaviorSubject<string>;

  private ngUnsubscribe = new Subject();

  private phoneUtils = PhoneNumberUtil.getInstance();

  private _disabled: boolean;

  private _modelValue: string;

  public constructor(
    private changeDetector: ChangeDetectorRef,
    private elRef: ElementRef,
    @Optional() private adapterService: SkyPhoneFieldAdapterService,
    @Optional() private phoneFieldComponent: SkyPhoneFieldComponent
  ) { }

  public ngOnInit(): void {
    if (!this.phoneFieldComponent) {
      throw new Error(
        'You must wrap the `skyPhoneFieldInput` directive within a ' +
        '`<sky-phone-field>` component!'
      );
    }

    this.adapterService.setElementType(this.elRef);
    this.adapterService.addElementClass(this.elRef, 'sky-form-control');
    if (this.phoneFieldComponent.selectedCountry) {
      this.adapterService.setElementPlaceholder(this.elRef,
        this.phoneFieldComponent.selectedCountry.exampleNumber);
    }

    this.adapterService.setAriaLabel(this.elRef);
  }

  public ngAfterViewInit(): void {
    this.phoneFieldComponent.selectedCountryChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((country: SkyPhoneFieldCountry) => {
        this.modelValue = this.elRef.nativeElement.value;
        this.adapterService.setElementPlaceholder(this.elRef, country.exampleNumber);
      });

    // This is needed to address a bug in Angular 4, where the value is not changed on the view.
    // See: https://github.com/angular/angular/issues/13792
    /* istanbul ignore else */
    if (this.control && this.modelValue) {
      this.control.setValue(this.modelValue, { emitEvent: false });
      this.changeDetector.detectChanges();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Writes the new value for reactive forms on change events on the input element
   * @param event The change event that was received
   */
  @HostListener('change', ['$event'])
  public onInputChange(event: any): void {
    if (!this.textChanges) {
      this.setupTextChangeSubscription(event.target.value);
    } else {
      this.textChanges.next(event.target.value);
    }
  }

  /**
   * Marks reactive form controls as touched on input blur events
   */
  @HostListener('blur')
  public onInputBlur(): void {
    this.onTouched();
  }

  @HostListener('input', ['$event'])
  public onInputTyping(event: any): void {
    if (!this.textChanges) {
      this.setupTextChangeSubscription(event.target.value);
    } else {
      this.textChanges.next(event.target.value);
    }
  }

  /**
   * Writes the new value for reactive forms
   * @param value The new value for the input
   */
  public writeValue(value: string): void {
    this.phoneFieldComponent.setCountryByDialCode(value);

    this.modelValue = value;
  }

  public registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  public registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  public registerOnValidatorChange(fn: () => void): void { this.validatorChange = fn; }

  /**
   * Sets the disabled state on the input
   * @param isDisabled the new value of the input's disabled state
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Validate's the form control's current value
   * @param control the form control for the input
   */
  public validate(control: AbstractControl): ValidationErrors {

    if (!this.control) {
      this.control = control;
    }

    if (this.skyPhoneFieldNoValidate) {
      return;
    }

    const value = control.value;

    if (!value) {
      return;
    }

    if (this.phoneFieldComponent.selectedCountry && !this.validateNumber(value)) {

      if (!this.textChanges) {
        // Mark the invalid control as touched so that the input's invalid CSS styles appear.
        // (This is only required when the invalid value is set by the FormControl constructor.)
        // We don't do this if the input is the active element so that we don't show validation
        // errors unless it is invalid on initialization or the input has been blurred.
        control.markAsTouched();
      }

      return {
        'skyPhoneField': {
          invalid: value
        }
      };
    }
  }

  private setupTextChangeSubscription(text: string) {
    this.textChanges = new BehaviorSubject(text);

    this.textChanges.pipe(
      debounceTime(500),
      takeUntil(this.ngUnsubscribe)
    )
      .subscribe((newValue) => {
        this.writeValue(newValue);
      });
  }

  private validateNumber(phoneNumber: string): boolean {
    try {
      const numberObj = this.phoneUtils.parseAndKeepRawInput(phoneNumber,
        this.phoneFieldComponent.selectedCountry.iso2);

      if (!this.phoneFieldComponent.allowExtensions && numberObj.getExtension()) {
        return false;
      }

      return this.phoneUtils.isValidNumber(numberObj);
    } catch (e) {
      return false;
    }
  }

  /**
   * Format's the given phone number based on the currently selected country.
   * @param phoneNumber The number to format
   */
  private formatNumber(phoneNumber: string): string {
    try {
      const numberObj = this.phoneUtils.parseAndKeepRawInput(phoneNumber,
        this.phoneFieldComponent.selectedCountry.iso2);
      if (this.phoneUtils.isPossibleNumber(numberObj)) {
        switch (this.phoneFieldComponent.returnFormat) {
          case 'international':
            return this.phoneUtils.format(numberObj, PhoneNumberFormat.INTERNATIONAL);
          case 'national':
            return this.phoneUtils.format(numberObj, PhoneNumberFormat.NATIONAL);
          case 'default':
          default:
            if (this.phoneFieldComponent.selectedCountry.iso2 !== this.phoneFieldComponent.defaultCountry) {
              return this.phoneUtils.format(numberObj, PhoneNumberFormat.INTERNATIONAL);
            } else {
              return this.phoneUtils.format(numberObj, PhoneNumberFormat.NATIONAL);
            }
        }

      } else {
        return phoneNumber;
      }
    } catch (e) {
      /* sanity check */
      /* istanbul ignore next */
      return phoneNumber;
    }
  }

  private onChange = (_: any) => { };

  /* istanbul ignore next */
  private onTouched = () => { };

  private validatorChange = () => { };
}

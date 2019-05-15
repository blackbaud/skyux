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
  Subject
} from 'rxjs/Subject';

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
} from './types';

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

@Directive({
  selector: '[skyPhoneFieldInput]',
  providers: [
    SKY_PHONE_FIELD_VALUE_ACCESSOR,
    SKY_PHONE_FIELD_VALIDATOR,
    SkyPhoneFieldAdapterService
  ]
})
export class SkyPhoneFieldInputDirective implements OnInit, OnDestroy, AfterViewInit,
  ControlValueAccessor, Validator {

  @Input()
  public set disabled(value: boolean) {
    this.phoneFieldComponent.countrySelectDisabled = value;
    this.adapterService.setElementDisabledState(this.elRef.nativeElement, value);
    this._disabled = value;
  }

  public get disabled(): boolean {
    return this._disabled || false;
  }

  @Input()
  public skyPhoneFieldNoValidate: boolean = false;

  private set modelValue(value: string) {
    this._modelValue = value;

    this.adapterService.setElementValue(this.elRef.nativeElement, value);

    if (value) {
      let formattedValue = this.formatNumber(value.toString());

      if (this.phoneFieldComponent.selectedCountry.iso2 !== this.phoneFieldComponent.defaultCountry) {
        formattedValue = '+' + this.phoneFieldComponent.selectedCountry.dialCode +
          ' ' + formattedValue;
      }

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

  private ngUnsubscribe = new Subject();

  private phoneUtils = PhoneNumberUtil.getInstance();

  private _disabled: boolean;

  private _modelValue: string;

  public constructor(
    private adapterService: SkyPhoneFieldAdapterService,
    private changeDetector: ChangeDetectorRef,
    private elRef: ElementRef,
    @Optional() private phoneFieldComponent: SkyPhoneFieldComponent
  ) { }

  public ngOnInit(): void {
    if (!this.phoneFieldComponent) {
      throw new Error(
        'You must wrap the `skyPhoneFieldInput` directive within a ' +
        '`<sky-phone-field>` component!'
      );
    }

    const element = this.elRef.nativeElement;

    this.adapterService.addElementClass(element, 'sky-form-control');
    this.adapterService.setElementPlaceholder(element,
      this.phoneFieldComponent.selectedCountry.exampleNumber);

    this.adapterService.setAriaLabel(element);
  }

  public ngAfterViewInit(): void {
    this.phoneFieldComponent.selectedCountryChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((country: SkyPhoneFieldCountry) => {
        // Write the value again to cause validation to refire
        this.writeValue(this.modelValue);
        this.adapterService.setElementPlaceholder(this.elRef.nativeElement, country.exampleNumber);
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
    this.writeValue(event.target.value);
  }

  /**
   * Marks reactive form controls as touched on input blur events
   */
  @HostListener('blur')
  public onInputBlur(): void {
    this.onTouched();
  }

  /**
   * Writes the new value for reactive forms
   * @param value The new value for the input
   */
  public writeValue(value: any): void {
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

    if (!this.validateNumber(value)) {

      // Mark the invalid control as touched so that the input's invalid CSS styles appear.
      // (This is only required when the invalid value is set by the FormControl constructor.)
      control.markAsTouched();

      return {
        'skyPhoneField': {
          invalid: value
        }
      };
    }
  }

  private validateNumber(phoneNumber: string): boolean {
    const numberObj = this.phoneUtils.parseAndKeepRawInput(phoneNumber,
      this.phoneFieldComponent.selectedCountry.iso2);

    return this.phoneUtils.isValidNumber(numberObj);
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
          return this.phoneUtils.format(numberObj, PhoneNumberFormat.NATIONAL);
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

  private onTouched = () => { };

  private validatorChange = () => { };
}

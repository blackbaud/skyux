import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  SkyAutonumericOptions
} from './autonumeric-options';

import {
  SkyAutonumericOptionsProvider
} from './autonumeric-options-provider';

const autoNumeric: any = require('autonumeric');

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_AUTONUMERIC_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyAutonumericDirective),
  multi: true
};

const SKY_AUTONUMERIC_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyAutonumericDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: 'input[skyAutonumeric]',
  providers: [
    SKY_AUTONUMERIC_VALUE_ACCESSOR,
    SKY_AUTONUMERIC_VALIDATOR
  ]
})
export class SkyAutonumericDirective implements OnInit, ControlValueAccessor, Validator {

  @Input()
  public set skyAutonumeric(value: SkyAutonumericOptions) {
    this.autonumericOptions = this.mergeOptions(value);
    this.updateAutonumericInstance();
  }

  private autonumericInstance: any;
  private autonumericOptions: SkyAutonumericOptions;
  private control: AbstractControl;
  private value: number;

  constructor (
    private elementRef: ElementRef,
    private globalConfig: SkyAutonumericOptionsProvider
  ) {
    this.createAutonumericInstance();
  }

  public ngOnInit(): void {
    this.updateAutonumericInstance();
  }

  public writeValue(value: number): void {
    this.value = value;

    if (value) {
      this.autonumericInstance.set(value);
    } else {
      this.autonumericInstance.clear();
    }
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    return;
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('blur')
  public onBlur(): void {
    const numericValue = this.autonumericInstance.getNumber();

    /* istanbul ignore else */
    if (this.value !== numericValue) {
      this.value = numericValue;
      this.onChange(numericValue);
    }

    this.onTouched();
  }

  @HostListener('keyup')
  public onKeyUp(): void {
    this.control.markAsDirty();
  }

  private createAutonumericInstance(): void {
    this.autonumericInstance = new autoNumeric(this.elementRef.nativeElement);
  }

  private updateAutonumericInstance(): void {
    this.autonumericInstance.update(this.autonumericOptions);
  }

  private mergeOptions(value: SkyAutonumericOptions): SkyAutonumericOptions {
    const globalOptions = this.globalConfig.getConfig();

    let newOptions: SkyAutonumericOptions = {};
    if (typeof value === 'string') {
      const predefinedOptions = autoNumeric.getPredefinedOptions();
      newOptions = predefinedOptions[value];
    } else {
      newOptions = value;
    }

    return Object.assign(
      {},
      globalOptions,
      newOptions
    );
  }

  /* istanbul ignore next */
  private onChange = (_: number) => {};
  /* istanbul ignore next */
  private onTouched = () => {};
}

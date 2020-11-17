import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  fromEvent
} from 'rxjs';

import {
  debounceTime
} from 'rxjs/operators';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import AutoNumeric, {
  Options
} from 'autonumeric';

import {
  SkyAutonumericOptions
} from './autonumeric-options';

import {
  SkyAutonumericOptionsProvider
} from './autonumeric-options-provider';

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

  /**
   * Wraps the [`autoNumeric` utility](https://github.com/autoNumeric/autoNumeric) to format
   * any type of number, including currency.
   */
  @Directive({
  selector: 'input[skyAutonumeric]',
  providers: [
    SKY_AUTONUMERIC_VALUE_ACCESSOR,
    SKY_AUTONUMERIC_VALIDATOR
  ]
})
export class SkyAutonumericDirective implements OnInit, ControlValueAccessor, Validator {

  /**
   * Assigns the name of a property from `SkyAutonumericOptionsProvider`.
   */
  @Input()
  public set skyAutonumeric(value: SkyAutonumericOptions) {
    this.autonumericOptions = this.mergeOptions(value);
    this.updateAutonumericInstance();
  }

  private autonumericInstance: AutoNumeric;
  private autonumericOptions: SkyAutonumericOptions;
  private control: AbstractControl;
  private isFirstChange = true;
  private value: number;

  constructor(
    private elementRef: ElementRef,
    private globalConfig: SkyAutonumericOptionsProvider,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) {
    this.createAutonumericInstance();
  }

  public ngOnInit(): void {
    this.updateAutonumericInstance();

    fromEvent(this.elementRef.nativeElement, 'keyup')
      .pipe(debounceTime(250))
      .subscribe(() => {
        const inputValue = this.getInputValue();
        /**
         * Due to autocomplete's hover logic - when autocomplete has a currency symbol the value that we will get back on empty fields
         * will be the currency symbol. The currency sybol logic here ensures that we don't accidentally set
         * a form value when the only input was this programaticaly added currency symbol.
         */
        const currencySymbol = (<{ [key: string]: any; }>this.autonumericOptions)['currencySymbol'];
        const numericValue = (inputValue && (!currencySymbol || inputValue !== currencySymbol.trim())) ?
          this.autonumericInstance.getNumber() : undefined;

        /* istanbul ignore else */
        if (this.value !== numericValue) {
          this.value = numericValue;
          this.onChange(numericValue);
        }

        /* istanbul ignore else */
        if (this.control && !this.control.dirty) {
          this.control.markAsDirty();
        }

        this.changeDetector.markForCheck();
      });
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(value: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  public writeValue(value: number): void {

    if (this.value !== value) {
      this.value = value;
      this.onChange(value);

      // Mark the control as "pristine" if it is initialized with a value.
      if (
        this.isFirstChange &&
        this.control &&
        this.value !== null
      ) {
        this.isFirstChange = false;
        this.control.markAsPristine();
      }
    }

    if (typeof value === 'number' && value !== null && value !== undefined) {
      this.autonumericInstance.set(value);
    } else {
      this.autonumericInstance.clear();
    }
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    if (control.value === null || control.value === undefined) {
      return;
    }

    if (typeof control.value !== 'number') {
      return {
        'notTypeOfNumber': { value: control.value }
      };
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
    this.onTouched();
  }

  private getInputValue(): string {
    return this.elementRef.nativeElement.value;
  }

  private createAutonumericInstance(): void {
    this.autonumericInstance = new AutoNumeric(this.elementRef.nativeElement);
  }

  private updateAutonumericInstance(): void {
    this.autonumericInstance.update(this.autonumericOptions as Options);
  }

  private mergeOptions(value: SkyAutonumericOptions): SkyAutonumericOptions {
    const globalOptions = this.globalConfig.getConfig();

    let newOptions: SkyAutonumericOptions = {};
    if (typeof value === 'string') {
      const predefinedOptions = AutoNumeric.getPredefinedOptions();
      newOptions = predefinedOptions[value as keyof Options] as Options;
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
  private onChange = (_: number) => { };
  /* istanbul ignore next */
  private onTouched = () => { };
}

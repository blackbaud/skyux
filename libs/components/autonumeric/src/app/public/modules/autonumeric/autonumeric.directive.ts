import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  takeUntil
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
  Options as AutoNumericOptions
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
export class SkyAutonumericDirective implements OnInit, OnDestroy, ControlValueAccessor, Validator {

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

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private globalConfig: SkyAutonumericOptionsProvider,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) {
    this.createAutonumericInstance();
  }

  public ngOnInit(): void {
    // Ensure that we set the global config even if no local config has been given.
    if (!this.autonumericOptions) {
      this.autonumericOptions = this.globalConfig.getConfig();
    }
    this.updateAutonumericInstance();

    fromEvent(this.elementRef.nativeElement, 'keyup')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        const numericValue: number | undefined = this.getNumericValue();

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

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      const initializedWithValue = this.isFirstChange && this.control && this.value !== null;
      if (initializedWithValue) {
        this.isFirstChange = false;
        this.control.markAsPristine();
      }
    }

    const isNumber = typeof value === 'number' && value !== null && value !== undefined;
    if (isNumber) {
      this.autonumericInstance.set(value);
    } else {
      this.autonumericInstance.clear();
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    const noErrors: null = null; // tslint:disable-line: no-null-keyword

    if (!this.control) {
      this.control = control;
    }

    if (control.value === null || control.value === undefined) {
      return noErrors;
    }

    if (typeof control.value !== 'number') {
      return {
        'notTypeOfNumber': { value: control.value }
      };
    }

    return noErrors;
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

  private getNumericValue(): number | undefined {
    const inputValue = this.getInputValue();
    const numericValue = (inputValue && !this.isInputValueTheCurrencySymbol(inputValue))
      ? this.autonumericInstance.getNumber()
      : undefined;

    return numericValue;
  }

  /**
   * Due to AutoNumeric's hover logic - when AutoNumeric has a currency symbol the value
   * that we get back on empty fields will be the currency symbol.
   * The following logic ensures that we don't accidentally set
   * a form value when the only input was the programatically-added currency symbol.
   */
  private isInputValueTheCurrencySymbol(inputValue: string): boolean {
    const currencySymbol = ((this.autonumericOptions as AutoNumericOptions)?.currencySymbol ?? '').trim();
    return (currencySymbol && inputValue === currencySymbol);
  }

  private getInputValue(): string {
    return this.elementRef.nativeElement.value;
  }

  private createAutonumericInstance(): void {
    this.autonumericInstance = new AutoNumeric(this.elementRef.nativeElement);
  }

  private updateAutonumericInstance(): void {
    this.autonumericInstance.update(this.autonumericOptions as AutoNumericOptions);
  }

  private mergeOptions(value: SkyAutonumericOptions): SkyAutonumericOptions {
    const globalOptions = this.globalConfig.getConfig();

    let newOptions: SkyAutonumericOptions = {};
    if (typeof value === 'string') {
      const predefinedOptions = AutoNumeric.getPredefinedOptions();
      newOptions = predefinedOptions[value as keyof AutoNumericOptions] as AutoNumericOptions;
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

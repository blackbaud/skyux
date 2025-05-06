import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import AutoNumeric from 'autonumeric';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAutonumericOptions } from './autonumeric-options';
import { SkyAutonumericOptionsProvider } from './autonumeric-options-provider';

const SKY_AUTONUMERIC_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyAutonumericDirective),
  multi: true,
};

const SKY_AUTONUMERIC_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyAutonumericDirective),
  multi: true,
};

/**
 * Wraps the [autoNumeric utility](https://github.com/autoNumeric/autoNumeric) to format
 * any type of number, including currency.
 */
@Directive({
  selector: 'input[skyAutonumeric]',
  providers: [SKY_AUTONUMERIC_VALUE_ACCESSOR, SKY_AUTONUMERIC_VALIDATOR],
  standalone: false,
})
export class SkyAutonumericDirective
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * Assigns the name of a property from `SkyAutonumericOptionsProvider`.
   */
  @Input()
  public set skyAutonumeric(value: SkyAutonumericOptions | undefined) {
    this.#autonumericOptions = this.#mergeOptions(value);
    this.#updateAutonumericInstance();
  }

  /**
   * @internal
   */
  @Input()
  public skyAutonumericFormChangesUnformatted: boolean | undefined = false;

  #autonumericInstance: AutoNumeric;
  #autonumericOptions: SkyAutonumericOptions | undefined;
  #control: AbstractControl | undefined;
  #isFirstChange = true;
  #value: number | undefined;

  #ngUnsubscribe = new Subject<void>();

  #elementRef: ElementRef;
  #globalConfig: SkyAutonumericOptionsProvider;
  #renderer: Renderer2;
  #changeDetector: ChangeDetectorRef;

  constructor(
    elementRef: ElementRef,
    globalConfig: SkyAutonumericOptionsProvider,
    renderer: Renderer2,
    changeDetector: ChangeDetectorRef,
  ) {
    this.#elementRef = elementRef;
    this.#globalConfig = globalConfig;
    this.#renderer = renderer;
    this.#changeDetector = changeDetector;

    this.#autonumericInstance = new AutoNumeric(elementRef.nativeElement);
  }

  public ngOnInit(): void {
    // Ensure that we set the global config even if no local config has been given.
    if (!this.#autonumericOptions) {
      this.#autonumericOptions = this.#globalConfig.getConfig();
    }
    this.#updateAutonumericInstance();

    fromEvent(this.#elementRef.nativeElement, 'input')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        const numericValue: number | undefined = this.#getNumericValue();

        /* istanbul ignore else */
        if (this.#value !== numericValue) {
          this.#value = numericValue;
          this.#onChange(numericValue);
        }

        /* istanbul ignore else */
        if (this.#control && !this.#control.dirty) {
          this.#control.markAsDirty();
        }

        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#autonumericInstance.remove();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(value: boolean): void {
    this.#renderer.setProperty(
      this.#elementRef.nativeElement,
      'disabled',
      value,
    );
  }

  public writeValue(value: number | undefined): void {
    if (this.#value !== value) {
      this.#value = value;
      this.#onChange(value);

      // Mark the control as "pristine" if it is initialized with a value.
      if (this.#isFirstChange && this.#control && this.#value !== null) {
        this.#isFirstChange = false;
        this.#control.markAsPristine();
      }
    }

    if (typeof value === 'number') {
      if (this.skyAutonumericFormChangesUnformatted) {
        this.#autonumericInstance.setUnformatted(value.toString());
      } else {
        this.#autonumericInstance.set(value.toString());
      }
    } else {
      this.#autonumericInstance.clear();
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    const noErrors = null;

    if (!this.#control) {
      this.#control = control;
    }

    if (control.value === null || control.value === undefined) {
      return noErrors;
    }

    if (typeof control.value !== 'number') {
      return {
        notTypeOfNumber: { value: control.value },
      };
    }

    return noErrors;
  }

  public registerOnChange(fn: (value: number | undefined) => void): void {
    this.#onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  @HostListener('blur')
  public onBlur(): void {
    this.#onTouched();
  }

  #getNumericValue(): number | undefined {
    const inputValue = this.#getInputValue();
    const numericValue = this.#autonumericInstance.getNumber();
    return inputValue &&
      !this.#isInputValueTheCurrencySymbol(inputValue) &&
      typeof numericValue === 'number'
      ? numericValue
      : undefined;
  }

  /**
   * Due to AutoNumeric's hover logic - when AutoNumeric has a currency symbol, the value
   * that we get back on empty fields will be the currency symbol.
   * The following logic ensures that we don't accidentally set
   * a form value when the only input was the programmatically-added currency symbol.
   */
  #isInputValueTheCurrencySymbol(inputValue: string): boolean {
    /* istanbul ignore next */
    const currencySymbol = (
      (this.#autonumericOptions as AutoNumeric.Options)?.currencySymbol ?? ''
    ).trim();
    return !!currencySymbol && inputValue === currencySymbol;
  }

  #getInputValue(): string {
    return this.#elementRef.nativeElement.value;
  }

  #updateAutonumericInstance(): void {
    this.#autonumericInstance.update(
      this.#autonumericOptions as AutoNumeric.Options,
    );
  }

  #mergeOptions(
    value: SkyAutonumericOptions | undefined,
  ): SkyAutonumericOptions {
    const globalOptions: SkyAutonumericOptions = this.#globalConfig.getConfig();

    let newOptions: SkyAutonumericOptions | undefined;
    if (typeof value === 'string') {
      const predefinedOptions = AutoNumeric.getPredefinedOptions();
      newOptions = predefinedOptions[
        value as keyof AutoNumeric.Options
      ] as AutoNumeric.Options;
    } else {
      newOptions = value;
    }

    return Object.assign({}, globalOptions, newOptions);
  }

  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-empty-function , @typescript-eslint/no-unused-vars
  #onChange = (_: number | undefined): void => {};
  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onTouched = (): void => {};
}

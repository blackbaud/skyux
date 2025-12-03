import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  forwardRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import AutoNumeric from 'autonumeric';
import { filter, fromEvent } from 'rxjs';

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
  host: {
    '(blur)': 'onBlur()',
  },
})
export class SkyAutonumericDirective
  implements OnDestroy, ControlValueAccessor, Validator
{
  readonly #destroyRef = inject(DestroyRef);
  readonly #elementRef = inject(ElementRef<HTMLInputElement>);
  readonly #globalConfig = inject(SkyAutonumericOptionsProvider);
  readonly #renderer = inject(Renderer2);
  readonly #changeDetector = inject(ChangeDetectorRef);

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

  #control: AbstractControl | undefined;
  #value: number | undefined;
  #isFirstChange = true;
  #isWritingValue = false;
  #userInteracted = false;

  #autonumericInstance: AutoNumeric;
  #autonumericOptions = this.#globalConfig.getConfig();

  constructor() {
    this.#autonumericInstance = new AutoNumeric(this.#elementRef.nativeElement);
    this.#updateAutonumericInstance();
    this.#setupValueChangeListeners();
  }

  public ngOnDestroy(): void {
    this.#autonumericInstance.remove();
  }

  public writeValue(value: number | undefined): void {
    this.#value = value;
    this.#markPristineOnFirstChange();
    this.#updateViewValue(value);
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    this.#control ??= control;

    if (control.value === null || control.value === undefined) {
      return null;
    }

    return typeof control.value === 'number'
      ? null
      : { notTypeOfNumber: { value: control.value } };
  }

  public setDisabledState(value: boolean): void {
    this.#renderer.setProperty(
      this.#elementRef.nativeElement,
      'disabled',
      value,
    );
  }

  public registerOnChange(fn: (value: number | undefined) => void): void {
    this.#onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  public onBlur(): void {
    this.#onTouched();
  }

  /**
   * Setup event listeners for value changes.
   * Workaround for https://github.com/autoNumeric/autoNumeric/issues/781
   * On Android Chrome, the 'input' event may lag behind actual input.
   * We listen to both 'input' and 'autoNumeric:rawValueModified' events.
   */
  #setupValueChangeListeners(): void {
    // The 'input' event indicates user interaction.
    fromEvent(this.#elementRef.nativeElement, 'input')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#userInteracted = true;
        this.#handleValueChange();
      });

    // The 'autoNumeric:rawValueModified' event can fire on both user interaction
    // and programmatic changes, so we handle value updates here.
    fromEvent(this.#elementRef.nativeElement, 'autoNumeric:rawValueModified')
      .pipe(
        // Ignore events during writeValue to prevent interfering with validation
        filter(() => !this.#isWritingValue),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => this.#handleValueChange());
  }

  /**
   * Handle value changes from user input or AutoNumeric events.
   */
  #handleValueChange(): void {
    const numericValue = this.#getNumericValue();

    if (this.#value !== numericValue) {
      this.#value = numericValue;
      this.#onChange(numericValue);
    }

    if (this.#control && !this.#control.dirty && this.#userInteracted) {
      this.#control.markAsDirty();
    }

    this.#changeDetector.markForCheck();
  }

  /**
   * Mark the control as pristine on first change with a value.
   */
  #markPristineOnFirstChange(): void {
    if (
      this.#isFirstChange &&
      this.#control &&
      this.#value !== null &&
      this.#value !== undefined
    ) {
      this.#isFirstChange = false;
      this.#control.markAsPristine();
    }
  }

  /**
   * Get the current numeric value from the input.
   * Returns undefined if the input is empty or contains only the currency symbol.
   */
  #getNumericValue(): number | undefined {
    const inputValue = this.#elementRef.nativeElement.value;
    if (!inputValue || this.#isInputValueTheCurrencySymbol(inputValue)) {
      return undefined;
    }

    const numericValue = this.#autonumericInstance.getNumber();
    if (typeof numericValue === 'number') {
      return numericValue;
    }

    /* istanbul ignore next: safety check */
    return undefined;
  }

  /**
   * Update the view (input element) with the new value.
   */
  #updateViewValue(value: number | undefined): void {
    this.#isWritingValue = true;
    try {
      if (typeof value === 'number') {
        this.#setNumericValue(value);
      } else {
        this.#autonumericInstance.clear();
      }
    } finally {
      this.#isWritingValue = false;
    }
  }

  /**
   * Set a numeric value using AutoNumeric.
   */
  #setNumericValue(value: number): void {
    const valueString = value.toString();
    if (this.skyAutonumericFormChangesUnformatted) {
      this.#autonumericInstance.setUnformatted(valueString);
    } else {
      this.#autonumericInstance.set(valueString);
    }
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

  #updateAutonumericInstance(): void {
    this.#autonumericInstance.update(
      this.#autonumericOptions as AutoNumeric.Options,
    );
  }

  /**
   * Merge global and local AutoNumeric options.
   */
  #mergeOptions(
    value: SkyAutonumericOptions | undefined,
  ): SkyAutonumericOptions {
    const globalOptions = this.#globalConfig.getConfig();
    const localOptions = this.#resolveOptions(value);

    return Object.assign({}, globalOptions, localOptions);
  }

  /**
   * Resolve options from string preset name or return as-is.
   */
  #resolveOptions(
    value: SkyAutonumericOptions | undefined,
  ): SkyAutonumericOptions | undefined {
    if (typeof value === 'string') {
      const predefinedOptions = AutoNumeric.getPredefinedOptions();

      return predefinedOptions[
        value as keyof AutoNumeric.Options
      ] as AutoNumeric.Options;
    }

    return value;
  }

  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-empty-function , @typescript-eslint/no-unused-vars
  #onChange = (_: number | undefined): void => {};

  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onTouched = (): void => {};
}

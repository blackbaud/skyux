import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  forwardRef,
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

import moment from 'moment';
import { Subscription } from 'rxjs';

import { SkyTimepickerTimeFormatType } from './timepicker-time-format-type';
import { SkyTimepickerTimeOutput } from './timepicker-time-output';
import { SkyTimepickerComponent } from './timepicker.component';

const SKY_TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyTimepickerInputDirective),
  multi: true,
};

const SKY_TIMEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyTimepickerInputDirective),
  multi: true,
};

@Directive({
  selector: '[skyTimepickerInput]',
  providers: [SKY_TIMEPICKER_VALUE_ACCESSOR, SKY_TIMEPICKER_VALIDATOR],
})
export class SkyTimepickerInputDirective
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    Validator,
    OnChanges,
    AfterContentInit
{
  public pickerChangedSubscription: Subscription | undefined;
  #_timeFormat: SkyTimepickerTimeFormatType = 'hh';

  // TODO: In a future breaking change - grab the parent component through dependency injection and remove this setter.
  // Also remove the HostBinding that references it.
  /**
   * Creates the timepicker input field and picker. Place this attribute on an `input` element,
   * and wrap the input in a `sky-timepicker` component.
   * This attribute must be set to the instance of the `sky-timepicker`.
   * @required
   */
  @Input()
  public get skyTimepickerInput(): SkyTimepickerComponent | undefined {
    return this.#_skyTimepickerInput;
  }

  public set skyTimepickerInput(value: SkyTimepickerComponent | undefined) {
    this.#_skyTimepickerInput = value;
    this.#updateTimepickerInput();
  }

  @HostBinding('attr.skyTimepickerInput')
  public get hostTimepickerInput(): SkyTimepickerComponent | undefined {
    return this.skyTimepickerInput;
  }

  // TODO: In a future breaking change - make this more specific than "string"
  /**
   * The 12-hour `hh` or 24-hour `HH` time format for the input.
   * @default "hh"
   */
  @Input()
  public set timeFormat(value: SkyTimepickerTimeFormatType | undefined) {
    this.#_timeFormat = value || 'hh';
  }

  public get timeFormat(): SkyTimepickerTimeFormatType {
    return this.#_timeFormat;
  }

  /**
   * The custom time format. For examples,
   * see the [moment.js](https://momentjs.com/docs/#/displaying/format/) docs.
   */
  @Input()
  public returnFormat: string | undefined;

  /**
   * Whether to disable the timepicker on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input()
  public get disabled(): boolean {
    return this.#_disabled;
  }

  public set disabled(value: boolean | undefined) {
    this.#_disabled = value || false;

    this.#updateTimepickerInput();

    this.#renderer.setProperty(this.#elRef.nativeElement, 'disabled', value);
  }

  get #modelValue(): SkyTimepickerTimeOutput | undefined {
    return this.#_modelValue;
  }

  set #modelValue(value: SkyTimepickerTimeOutput | undefined) {
    // A retained invalid entry must be cleaned up even when the model value is
    // unchanged (e.g. a form reset while `undefined` is the model value).
    if (value !== this.#_modelValue || this.#hasRetainedInvalidValue) {
      this.#_modelValue = value;
      this.#hasRetainedInvalidValue = false;
      this.#updateTimepickerInput();
      this.#setInputValue(value);
      this.#_validatorChange();
      this.#_onChange(value);
    }
  }

  #control: AbstractControl | undefined;

  #_disabled = false;
  #_modelValue: SkyTimepickerTimeOutput | undefined;
  #_skyTimepickerInput: SkyTimepickerComponent | undefined;

  // Set while an invalid entry is retained on the control instead of cleared.
  #hasRetainedInvalidValue = false;

  readonly #renderer = inject(Renderer2);
  readonly #elRef = inject(ElementRef);
  readonly #changeDetector = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.#renderer.addClass(this.#elRef.nativeElement, 'sky-form-control');
    this.pickerChangedSubscription =
      this.skyTimepickerInput?.selectedTimeChanged.subscribe(
        (newTime: string) => {
          this.writeValue(newTime);
          this.#_onTouched();
        },
      );
  }

  public ngAfterContentInit(): void {
    // Watch for the control to be added and initialize the value immediately.
    /* istanbul ignore else */
    if (this.#control && this.#control.parent) {
      // When an invalid entry is being retained, the raw string is already on
      // the control and flagged invalid by the validator; overwriting it with
      // the (undefined) model value would discard the entry and clear the error.
      if (!this.#hasRetainedInvalidValue) {
        this.#control.setValue(this.#modelValue, { emitEvent: false });
      }

      this.#changeDetector.markForCheck();
    }
  }

  public ngOnDestroy(): void {
    /* istanbul ignore else */
    if (this.pickerChangedSubscription) {
      this.pickerChangedSubscription.unsubscribe();
    }
  }

  public ngOnChanges(): void {
    if (this.skyTimepickerInput) {
      this.skyTimepickerInput.setFormat(this.timeFormat);
      this.skyTimepickerInput.returnFormat = this.returnFormat;
    }
  }

  @HostListener('change', ['$event'])
  public onChange(event: any): void {
    this.writeValue(event.target.value);
  }

  /* istanbul ignore next */
  @HostListener('blur')
  public onBlur(): void {
    this.#_onTouched();
  }

  public registerOnChange(fn: (value: any) => any): void {
    this.#_onChange = fn;
  }
  public registerOnTouched(fn: () => any): void {
    this.#_onTouched = fn;
  }
  public registerOnValidatorChange(fn: () => void): void {
    this.#_validatorChange = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(value: any): void {
    const formatted = this.#formatter(value);

    // Keep invalid entries in the input instead of clearing them so the user
    // can see and correct their entry (matching the datepicker's behavior).
    if (
      typeof value === 'string' &&
      value.length > 0 &&
      formatted.local === 'Invalid date'
    ) {
      this.#applyInvalidValue(value);
      return;
    }

    this.#modelValue = formatted;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control) {
      this.#control = control;
    }

    const value = control.value;
    if (!value) {
      return null;
    }

    // A raw string value only remains on the control when it could not be
    // parsed into a time and was retained as-is.
    if (typeof value === 'string') {
      if (this.#formatter(value).local === 'Invalid date') {
        // Mark as touched so the invalid CSS styles appear even when the value
        // is set programmatically.
        this.#control.markAsTouched();

        return { skyTime: { invalid: value } };
      }

      return null;
    }

    /* istanbul ignore next */
    if (value.local === 'Invalid date') {
      return { skyTime: { invalid: control.value } };
    }

    return null;
  }

  #applyInvalidValue(rawValue: string): void {
    // There is no valid model value while an invalid entry is retained.
    this.#_modelValue = undefined;
    this.#hasRetainedInvalidValue = true;

    // Keep the user's raw entry in the input element.
    this.#renderer.setProperty(this.#elRef.nativeElement, 'value', rawValue);

    // Push the raw string to the form control and re-run validation. The
    // validator supplies the `skyTime` error, so we avoid calling `setErrors`
    // here to preserve any errors contributed by other validators.
    this.#_onChange(rawValue);
    this.#_validatorChange();
  }

  #setInputValue(value: SkyTimepickerTimeOutput | undefined): void {
    let formattedValue = '';
    if (value) {
      const output = moment(value).format(value.customFormat);
      /* istanbul ignore else */
      if (output !== 'Invalid date') {
        formattedValue = output;
      }
    }

    this.#renderer.setProperty(
      this.#elRef.nativeElement,
      'value',
      formattedValue,
    );
  }

  // TODO: This method technically returns `SkyTimepickerTimeOutput | string | undefined`. However, the value it is set to is set to `SkyTimepickerTimeOutput | undefined`. We need to clean this up.
  #formatter(time: any): any {
    if (time && typeof time !== 'string' && 'local' in time) {
      return time;
    }
    if (typeof time === 'string') {
      if (time.length === 0) {
        return '';
      }
      const currentFormat = this.timeFormat === 'HH' ? 'H:mm' : 'h:mm A';

      if (typeof this.returnFormat === 'undefined') {
        this.returnFormat = currentFormat;
      }

      const formatTime: SkyTimepickerTimeOutput = {
        hour: moment(time, currentFormat).hour(),
        minute: moment(time, currentFormat).minute(),
        meridie: moment(time, currentFormat).format('A'),
        timezone: parseInt(moment(time, currentFormat).format('Z'), 10),
        iso8601: moment(time, currentFormat).toDate(),
        local: moment(time, currentFormat).format(currentFormat),
        customFormat: this.returnFormat,
      };
      return formatTime;
    }
  }

  #updateTimepickerInput(): void {
    if (this.skyTimepickerInput) {
      this.skyTimepickerInput.disabled = this.disabled;

      /* istanbul ignore else */
      if (this.skyTimepickerInput.selectedTime !== this.#modelValue) {
        this.skyTimepickerInput.selectedTime = this.#modelValue;
      }
    }
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  #_onChange = (_: any): void => {};
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #_onTouched = (): void => {};
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #_validatorChange = (): void => {};
}

import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
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
import { SkyLibResourcesService } from '@skyux/i18n';

import moment from 'moment';
import { Subscription } from 'rxjs';

import { SkyTimepickerComponent } from './timepicker.component';
import { SkyTimepickerTimeOutput } from './timepicker.interface';

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
  #_timeFormat = 'hh';

  // TODO: In a future breaking change - grab the parent component through dependency injection and remove this setter.
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

  // TODO: In a future breaking change - make this more specific than "string"
  /**
   * Specifies the 12-hour `hh` or 24-hour `HH` time format for the input.
   * @default "hh"
   */
  @Input()
  public set timeFormat(value: string | undefined) {
    this.#_timeFormat = value || 'hh';
  }

  public get timeFormat(): string {
    return this.#_timeFormat;
  }

  /**
   * Specifies a custom time format. For examples,
   * see the [moment.js](https://momentjs.com/docs/#/displaying/format/) docs.
   */
  @Input()
  public returnFormat: string | undefined;

  /**
   * Indicates whether to disable the timepicker.
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
    if (value !== this.#_modelValue) {
      this.#_modelValue = value;
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

  #renderer: Renderer2;
  #elRef: ElementRef;
  #resourcesService: SkyLibResourcesService;
  #changeDetector: ChangeDetectorRef;

  constructor(
    renderer: Renderer2,
    elRef: ElementRef,
    resourcesService: SkyLibResourcesService,
    changeDetector: ChangeDetectorRef
  ) {
    this.#renderer = renderer;
    this.#elRef = elRef;
    this.#resourcesService = resourcesService;
    this.#changeDetector = changeDetector;
  }

  public ngOnInit() {
    this.#renderer.addClass(this.#elRef.nativeElement, 'sky-form-control');
    this.pickerChangedSubscription =
      this.skyTimepickerInput?.selectedTimeChanged.subscribe(
        (newTime: string) => {
          this.writeValue(newTime);
          this.#_onTouched();
        }
      );

    /* istanbul ignore else */
    if (!this.#elRef.nativeElement.getAttribute('aria-label')) {
      this.#resourcesService
        .getString('skyux_timepicker_input_default_label')
        .subscribe((value: string) => {
          this.#renderer.setAttribute(
            this.#elRef.nativeElement,
            'aria-label',
            value
          );
        });
    }
  }

  public ngAfterContentInit(): void {
    // Watch for the control to be added and initialize the value immediately.
    /* istanbul ignore else */
    if (this.#control && this.#control.parent) {
      this.#control.setValue(this.#modelValue, {
        emitEvent: false,
      });
      this.#changeDetector.markForCheck();
    }
  }

  public ngOnDestroy() {
    /* istanbul ignore else */
    if (this.pickerChangedSubscription) {
      this.pickerChangedSubscription.unsubscribe();
    }
  }

  public ngOnChanges() {
    if (this.skyTimepickerInput) {
      this.skyTimepickerInput.setFormat(this.timeFormat);
      this.skyTimepickerInput.returnFormat = this.returnFormat;
    }
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    this.writeValue(event.target.value);
  }

  /* istanbul ignore next */
  @HostListener('blur')
  public onBlur() {
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

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public writeValue(value: any) {
    this.#modelValue = this.#formatter(value);
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control) {
      this.#control = control;
    }

    const value = control.value;
    if (!value) {
      return null;
    }

    /* istanbul ignore next */
    if (value.local === 'Invalid date') {
      return {
        skyTime: {
          invalid: control.value,
        },
      };
    }

    return null;
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
      formattedValue
    );
  }

  #formatter(time: any) {
    if (time && typeof time !== 'string' && 'local' in time) {
      return time;
    }
    if (typeof time === 'string') {
      if (time.length === 0) {
        return '';
      }
      let currentFormat: string | undefined;
      if (this.timeFormat === 'hh') {
        currentFormat = 'h:mm A';
      }
      if (this.timeFormat === 'HH') {
        currentFormat = 'H:mm';
      }
      if (typeof this.returnFormat === 'undefined') {
        // TODO: Remove this non-null when the typing of the `timeFormat` input is made stricter.
        this.returnFormat = currentFormat!;
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

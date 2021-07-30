import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Subscription
} from 'rxjs';

import {
  SkyTimepickerComponent
} from './timepicker.component';

import {
  SkyTimepickerTimeOutput
} from './timepicker.interface';

import * as moment_ from 'moment';
const moment = moment_;

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyTimepickerInputDirective),
  multi: true
};

const SKY_TIMEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyTimepickerInputDirective),
  multi: true
};

// tslint:enable
@Directive({
  selector: '[skyTimepickerInput]',
  providers: [
    SKY_TIMEPICKER_VALUE_ACCESSOR,
    SKY_TIMEPICKER_VALIDATOR
  ]
})
export class SkyTimepickerInputDirective implements
  OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges, AfterContentInit {

  public pickerChangedSubscription: Subscription;
  private _timeFormat: string = 'hh';

  /**
   * Creates the timepicker input field and picker. Place this attribute on an `input` element,
   * and wrap the input in a `sky-timepicker` component.
   * This attribute must be set to the instance of the `sky-timepicker`.
   * @required
   */
  @Input()
  public get skyTimepickerInput(): SkyTimepickerComponent {
    return this._skyTimepickerInput;
  }

  public set skyTimepickerInput(value: SkyTimepickerComponent) {
    this._skyTimepickerInput = value;
    this.updateTimepickerInput();
  }

  /**
   * Specifies the 12-hour `hh` or 24-hour `HH` time format for the input.
   * @default hh
   */
  @Input()
  public set timeFormat(value: string) {
    this._timeFormat = value;
  }

  public get timeFormat(): string {
    return this._timeFormat || 'hh';
  }

  /**
   * Specifies a custom time format. For examples,
   * see the [moment.js](https://momentjs.com/docs/#/displaying/format/) docs.
   */
  @Input()
  public returnFormat: string;

  /**
   * Indicates whether to disable the timepicker.
   * @default false
   */
  @Input()
  public get disabled(): boolean {
    return this._disabled || false;
  }

  public set disabled(value: boolean) {
    this._disabled = value;

    this.updateTimepickerInput();

    this.renderer.setProperty(
      this.elRef.nativeElement,
      'disabled',
      value);
  }

  private get modelValue(): SkyTimepickerTimeOutput {
    return this._modelValue;
  }

  private set modelValue(value: SkyTimepickerTimeOutput) {
    if (value !== this._modelValue) {
      this._modelValue = value;
      this.updateTimepickerInput();
      this.setInputValue(value);
      this._validatorChange();
      this._onChange(value);
    }
  }

  private control: AbstractControl;

  private _disabled: boolean;
  private _modelValue: SkyTimepickerTimeOutput;
  private _skyTimepickerInput: SkyTimepickerComponent;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private resourcesService: SkyLibResourcesService,
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this.renderer.addClass(this.elRef.nativeElement, 'sky-form-control');
    this.pickerChangedSubscription = this.skyTimepickerInput.selectedTimeChanged
      .subscribe((newTime: String) => {
        this.writeValue(newTime);
        this._onTouched();
      });

    if (!this.elRef.nativeElement.getAttribute('aria-label')) {
      this.resourcesService.getString('skyux_timepicker_input_default_label')
        .subscribe((value: string) => {
          this.renderer.setAttribute(
            this.elRef.nativeElement,
            'aria-label',
            value
          );
        });
    }
  }

  public ngAfterContentInit(): void {
    // Watch for the control to be added and initialize the value immediately.
    /* istanbul ignore else */
    if (this.control && this.control.parent) {
      this.control.setValue(this.modelValue, {
        emitEvent: false
      });
      this.changeDetector.markForCheck();
    }
  }

  public ngOnDestroy() {
    this.pickerChangedSubscription.unsubscribe();
  }

  public ngOnChanges() {
    this.skyTimepickerInput.setFormat(this.timeFormat);
    this.skyTimepickerInput.returnFormat = this.returnFormat;
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    this.writeValue(event.target.value);
  }

  @HostListener('blur')
  public onBlur() {
    /* istanbul ignore next */
    this._onTouched();
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }
  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public writeValue(value: any) {
    this.modelValue = this.formatter(value);
  }

  public validate(control: AbstractControl): { [key: string]: any } {
    if (!this.control) {
      this.control = control;
    }

    let value = control.value;
    if (!value) {
      return undefined;
    }

    /* istanbul ignore next */
    if (value.local === 'Invalid date') {
      return {
        'skyTime': {
          invalid: control.value
        }
      };
    }

    return undefined;
  }

  private setInputValue(value: SkyTimepickerTimeOutput): void {
    let formattedValue = '';
    if (value) {
      const output = moment(value).format(value.customFormat);
      /* istanbul ignore else */
      if (output !== 'Invalid date') {
        formattedValue = output;
      }
    }

    this.renderer.setProperty(
      this.elRef.nativeElement,
      'value',
      formattedValue
    );
  }

  private formatter(time: any) {
    if (time && typeof time !== 'string' && 'local' in time) { return time; }
    if (typeof time === 'string') {
      if (time.length === 0) { return ''; }
      let currentFormat: string;
      let formatTime: SkyTimepickerTimeOutput;
      if (this.timeFormat === 'hh') {
        currentFormat = 'h:mm A';
      }
      if (this.timeFormat === 'HH') {
        currentFormat = 'H:mm';
      }
      if (typeof this.returnFormat === 'undefined') { this.returnFormat = currentFormat; }
      formatTime = {
        'hour': moment(time, currentFormat).hour(),
        'minute': moment(time, currentFormat).minute(),
        'meridie': moment(time, currentFormat).format('A'),
        'timezone': parseInt(moment(time, currentFormat).format('Z'), 10),
        'iso8601': moment(time, currentFormat).toDate(),
        'local': moment(time, currentFormat).format(currentFormat),
        'customFormat': this.returnFormat
      };
      return formatTime;
    }
  }

  private updateTimepickerInput(): void {
    if (this.skyTimepickerInput) {
      this.skyTimepickerInput.disabled = this.disabled;

      if (this.skyTimepickerInput.selectedTime !== this.modelValue) {
        this.skyTimepickerInput.selectedTime = this.modelValue;
      }
    }
  }

  /*istanbul ignore next */
  private _onChange = (_: any) => { };
  /*istanbul ignore next */
  private _onTouched = () => { };
  private _validatorChange = () => { };
}

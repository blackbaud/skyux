import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer,
  SimpleChanges
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
} from 'rxjs/Subscription';

import {
  SkyTimepickerComponent
} from './timepicker.component';

import {
  SkyTimepickerTimeOutput
} from './timepicker.interface';

const moment = require('moment');

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
  OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges {

  public pickerChangedSubscription: Subscription;
  private _timeFormat: string = 'hh';

  @Input()
  public skyTimepickerInput: SkyTimepickerComponent;

  @Input()
  public set timeFormat(value: string) {
    this._timeFormat = value;
  }
  public get timeFormat(): string {
    return this._timeFormat || 'hh';
  }

  @Input()
  public returnFormat: string;

  @Input()
  public get disabled(): boolean {
    return this._disabled || false;
  }
  public set disabled(value: boolean) {
    this.skyTimepickerInput.disabled = value;
    this.renderer.setElementProperty(
      this.elRef.nativeElement,
      'disabled',
      value);
    this._disabled = value;
  }

  private modelValue: SkyTimepickerTimeOutput;
  private _disabled: boolean;

  constructor(
    private renderer: Renderer,
    private elRef: ElementRef,
    private resourcesService: SkyLibResourcesService
  ) { }

  public ngOnInit() {
    this.renderer.setElementClass(this.elRef.nativeElement, 'sky-form-control', true);
    this.pickerChangedSubscription = this.skyTimepickerInput.selectedTimeChanged
      .subscribe((newTime: String) => {
        this.writeValue(this.formatter(newTime));
        this._onChange(newTime);
      });

    if (!this.elRef.nativeElement.getAttribute('aria-label')) {
      this.resourcesService.getString('skyux_timepicker_input_default_label')
        .subscribe((value: string) => {
          this.renderer.setElementAttribute(
            this.elRef.nativeElement,
            'aria-label',
            value
          );
        });
    }
  }

  public ngOnDestroy() {
    this.pickerChangedSubscription.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges) {
    this._validatorChange();
    this.skyTimepickerInput.setFormat(this.timeFormat);
    this.skyTimepickerInput.returnFormat = this.returnFormat;
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    let newValue = event.target.value;
    this.modelValue = this.formatter(newValue);
    this._validatorChange();
    this._onChange(this.modelValue);
    this.writeModelValue(this.modelValue);
  }

  @HostListener('blur')
  public onBlur /* istanbul ignore next */ () {
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
    this.writeModelValue(this.modelValue);
  }
  public validate(control: AbstractControl): { [key: string]: any } {
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

  private writeModelValue(model: SkyTimepickerTimeOutput) {
    let setElementValue: string;
    /* istanbul ignore next */
    if (model && moment(model).format(model.customFormat) === 'Invalid date') {
      setElementValue = '';
    } else if (model) {
      setElementValue = moment(model).format(model.customFormat);
    } else {
      setElementValue = '';
    }
    this.renderer.setElementProperty(this.elRef.nativeElement, 'value', setElementValue);
    this.skyTimepickerInput.selectedTime = model;
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

  /*istanbul ignore next */
  private _onChange = (_: any) => { };
  /*istanbul ignore next */
  private _onTouched = () => { };
  private _validatorChange = () => { };
}

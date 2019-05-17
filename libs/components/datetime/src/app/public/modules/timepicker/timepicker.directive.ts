import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  FormControl,
  NgControl
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
  OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges, AfterViewInit {

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

  private get modelValue(): SkyTimepickerTimeOutput {
    return this._modelValue;
  }

  private set modelValue(value: SkyTimepickerTimeOutput) {
    if (value !== this._modelValue) {
      this._modelValue = value;
      this.skyTimepickerInput.selectedTime = value;
      this.setInputValue(value);
      this._validatorChange();
      this._onChange(value);
    }
  }

  private _disabled: boolean;
  private _modelValue: SkyTimepickerTimeOutput;

  constructor(
    private renderer: Renderer,
    private elRef: ElementRef,
    private resourcesService: SkyLibResourcesService,
    @Optional() private changeDetector: ChangeDetectorRef,
    @Optional() private injector: Injector
  ) { }

  public ngOnInit() {
    this.renderer.setElementClass(this.elRef.nativeElement, 'sky-form-control', true);
    this.pickerChangedSubscription = this.skyTimepickerInput.selectedTimeChanged
      .subscribe((newTime: String) => {
        this.writeValue(newTime);
        this._onTouched();
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

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 4, where the value is not changed on the view.
    // See: https://github.com/angular/angular/issues/13792
    const control = (<NgControl>this.injector.get(NgControl)).control as FormControl;
    /* istanbul ignore else */
    if (control && this.modelValue) {
      control.setValue(this.modelValue, { emitEvent: false });
      /* istanbul ignore else */
      if (this.changeDetector) {
        this.changeDetector.markForCheck();
      }
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

  private setInputValue(value: SkyTimepickerTimeOutput): void {
    let formattedValue = '';
    if (value) {
      const output = moment(value).format(value.customFormat);
      /* istanbul ignore else */
      if (output !== 'Invalid date') {
        formattedValue = output;
      }
    }

    this.renderer.setElementProperty(
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

  /*istanbul ignore next */
  private _onChange = (_: any) => { };
  /*istanbul ignore next */
  private _onTouched = () => { };
  private _validatorChange = () => { };
}

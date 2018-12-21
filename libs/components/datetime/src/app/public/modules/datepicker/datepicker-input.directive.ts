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
  Renderer,
  SimpleChanges
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validator
} from '@angular/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyDatepickerComponent
} from './datepicker.component';
import {
  SkyDateFormatter
} from './date-formatter';
import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyDatepickerInputDirective),
  multi: true
};

const SKY_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyDatepickerInputDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: '[skyDatepickerInput]',
  providers: [
    SKY_DATEPICKER_VALUE_ACCESSOR,
    SKY_DATEPICKER_VALIDATOR
  ]
})
export class SkyDatepickerInputDirective implements
  OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges, AfterViewInit {

  public pickerChangedSubscription: Subscription;

  @Input()
  public skyDatepickerInput: SkyDatepickerComponent;

  @Input()
  public dateFormat: string;

  @Input()
  public skyDatepickerNoValidate: boolean = false;

  @Input()
  public minDate: Date;

  @Input()
  public maxDate: Date;

  @Input()
  public startingDay: number = 0;

  @Input()
  public get disabled(): boolean {
    return this._disabled || false;
  }
  public set disabled(value: boolean) {
    this.skyDatepickerInput.disabled = value;
    this.renderer.setElementProperty(
      this.elRef.nativeElement,
      'disabled',
      value);
    this._disabled = value;
  }

  private get modelValue(): Date {
    return this._modelValue;
  }

  private set modelValue(value: Date) {
    let dateValue = value;
    let formattedValue = '';

    if (dateValue !== this.modelValue) {
      if (typeof value === 'string') {
        dateValue = this.dateFormatter.getDateFromString(value as any, this.dateFormat);
      }

      const isValid = this.dateFormatter.dateIsValid(dateValue);
      if (isValid) {
        formattedValue = this.dateFormatter.format(dateValue, this.dateFormat);
      } else {
        dateValue = value;
        if (typeof value === 'string') {
          formattedValue = value;
        }
      }

      this._modelValue = dateValue;
      this.setInputValue(formattedValue);
      this.skyDatepickerInput.setSelectedDate(dateValue);
      this._onChange(dateValue);
      this._validatorChange();
    }
  }

  private dateFormatter = new SkyDateFormatter();

  private _disabled: boolean;
  private _modelValue: Date;

  public constructor(
    private renderer: Renderer,
    private elRef: ElementRef,
    private config: SkyDatepickerConfigService,
    private resourcesService: SkyLibResourcesService,
    @Optional() private changeDetector: ChangeDetectorRef,
    @Optional() private injector: Injector
  ) {
    this.configureOptions();
  }

  public configureOptions(): void {
    Object.assign(this, this.config);
  }

  public ngOnInit() {
    this.renderer.setElementClass(this.elRef.nativeElement, 'sky-form-control', true);
    this.pickerChangedSubscription = this.skyDatepickerInput.dateChanged
      .subscribe((newDate: Date) => {
        this.writeValue(newDate);
        this._onTouched();
      });

    if (!this.elRef.nativeElement.getAttribute('aria-label')) {
      this.resourcesService.getString('skyux_date_field_default_label')
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
        this.changeDetector.detectChanges();
      }
    }
  }

  public ngOnDestroy() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.pickerChangedSubscription) {
      this.pickerChangedSubscription.unsubscribe();
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['minDate']) {
      this._validatorChange();
      this.skyDatepickerInput.setMinDate(this.minDate);
    }

    if (changes['maxDate']) {
      this._validatorChange();
      this.skyDatepickerInput.setMaxDate(this.maxDate);
    }

    if (changes['startingDay']) {
      this._validatorChange();
      this.skyDatepickerInput.startingDay = this.startingDay;
    }
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    this.writeValue(event.target.value);
  }

  @HostListener('blur')
  public onBlur() {
    this._onTouched();
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }

  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public writeValue(value: any) {
    this.modelValue = value;
  }

  public validate(control: AbstractControl): {[key: string]: any} {
    let value = control.value;

    if (!value) {
      return undefined;
    }

    let dateValue = this.dateFormatter.getDateFromString(value, this.dateFormat);

    if (!this.dateFormatter.dateIsValid(dateValue) && !this.skyDatepickerNoValidate) {
      return {
        'skyDate': {
          invalid: control.value
        }
      };
    }

    if (this.minDate &&
      this.dateFormatter.dateIsValid(this.minDate) &&
      this.dateFormatter.dateIsValid(value) &&
      value < this.minDate) {

      return {
        'skyDate': {
          minDate: this.minDate
        }
      };
    }

    if (this.maxDate &&
      this.dateFormatter.dateIsValid(this.maxDate) &&
      this.dateFormatter.dateIsValid(value) &&
      value > this.maxDate) {
        return {
          'skyDate': {
            maxDate: this.maxDate
          }
        };
      }

    return undefined;
  }

  private setInputValue(value: string): void {
    this.renderer.setElementProperty(
      this.elRef.nativeElement,
      'value',
      value
    );
  }

  /*istanbul ignore next */
  private _onChange = (_: any) => {};
  /*istanbul ignore next */
  private _onTouched = () => {};
  private _validatorChange = () => {};
}

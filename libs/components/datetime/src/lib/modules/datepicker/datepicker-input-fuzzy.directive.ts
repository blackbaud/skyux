import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
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
import { SkyAppLocaleProvider, SkyLibResourcesService } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { SkyDateFormatter } from './date-formatter';
import { SkyDatepickerConfigService } from './datepicker-config.service';
import { SkyDatepickerComponent } from './datepicker.component';
import { SkyFuzzyDate } from './fuzzy-date';
import { SkyFuzzyDateService } from './fuzzy-date.service';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_FUZZY_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyFuzzyDatepickerInputDirective),
  multi: true,
};

const SKY_FUZZY_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyFuzzyDatepickerInputDirective),
  multi: true,
};
// tslint:enable

@Directive({
  selector: '[skyFuzzyDatepickerInput]',
  providers: [
    SKY_FUZZY_DATEPICKER_VALUE_ACCESSOR,
    SKY_FUZZY_DATEPICKER_VALIDATOR,
  ],
})
export class SkyFuzzyDatepickerInputDirective
  implements
    OnInit,
    OnDestroy,
    AfterViewInit,
    AfterContentInit,
    ControlValueAccessor,
    Validator
{
  /**
   * Specifies the date format for the input. Place this attribute on the `input` element
   * to override the default in `SkyDatepickerConfigService`.
   * @default "MM/DD/YYYY"
   */
  @Input()
  public set dateFormat(value: string) {
    this._dateFormat = value;

    if (this.value) {
      const formattedDate = this.fuzzyDateService.format(
        this.value,
        this.dateFormat,
        this.locale
      );
      this.setInputElementValue(formattedDate);
      this.changeDetector.markForCheck();
    }
  }

  public get dateFormat(): string {
    return (
      this._dateFormat ||
      this.configService.dateFormat ||
      this.preferredShortDateFormat
    );
  }

  /**
   * Indicates whether to disable the datepicker.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    this.datepickerComponent.disabled = value;

    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Indicates whether to prevent users from specifying dates that are in the future.
   * Place this attribute on the `input` element.
   * @default false
   */
  @Input()
  public set futureDisabled(value: boolean) {
    this._futureDisabled = value;
    this.onValidatorChange();
  }

  public get futureDisabled(): boolean {
    return this._futureDisabled;
  }

  /**
   * Specifies the latest fuzzy date allowed. Place this attribute on the `input` element
   * to prevent fuzzy dates after a specified date. This property accepts
   * a `SkyFuzzyDate` value that includes numeric month, day, and year values.
   * For example: `{ month: 1, day: 1, year: 2027 }`.
   */
  @Input()
  public set maxDate(value: SkyFuzzyDate) {
    this._maxDate = value;
    this.datepickerComponent.maxDate = this.getMaxDate();
    this.onValidatorChange();
  }

  public get maxDate(): SkyFuzzyDate {
    return this._maxDate;
  }

  /**
   * Specifies the earliest fuzzy date allowed. Place this attribute on the `input` element
   * to prevent fuzzy dates before a specified date. This property accepts a `SkyFuzzyDate` value
   * that includes numeric month, day, and year values.
   * For example: `{ month: 1, day: 1, year: 2007 }`.
   */
  @Input()
  public set minDate(value: SkyFuzzyDate) {
    this._minDate = value;
    this.datepickerComponent.minDate = this.getMinDate();
    this.onValidatorChange();
  }

  public get minDate(): SkyFuzzyDate {
    return this._minDate;
  }

  /**
   * Indicates whether to disable date validation on the fuzzy datepicker input.
   * @default false
   */
  @Input()
  public skyDatepickerNoValidate = false;

  /**
   * Creates the fuzzy datepicker input and calendar to let users specify dates that are
   * not complete. For example, if users know the year but not the month or day, they can
   * enter just the year. Place this directive on an `input` element, and wrap the `input`
   * in a `sky-datepicker` component. The value that users select is driven
   * through the `ngModel` attribute specified on the `input` element.
   * @required
   */
  @Input()
  public set skyFuzzyDatepickerInput(
    value: SkyDatepickerComponent | undefined | ''
  ) {
    // TODO: Remove this property in a future version of SKY UX.
  }

  /**
   * Specifies the starting day of the week in the calendar, where `0` sets the starting day
   * to Sunday. Place this attribute on the `input` element to override the default
   * in `SkyDatepickerConfigService`.
   * @default 0
   */
  @Input()
  public set startingDay(value: number) {
    this._startingDay = value;
    this.datepickerComponent.startingDay = this.startingDay;

    this.onValidatorChange();
  }

  public get startingDay(): number {
    return this._startingDay || this.configService.startingDay;
  }

  /**
   * Indicates whether to require the year in fuzzy dates.
   * @default false
   */
  @Input()
  public set yearRequired(value: boolean) {
    this._yearRequired = value;
    this.onValidatorChange();
  }

  public get yearRequired(): boolean {
    return this._yearRequired;
  }

  private get value(): any {
    return this._value;
  }

  private set value(value: any) {
    let fuzzyDate: SkyFuzzyDate;
    let fuzzyMoment: any;
    let dateValue: Date;
    let formattedDate: string;

    if (value instanceof Date) {
      dateValue = value;
      formattedDate = this.dateFormatter.format(value, this.dateFormat);
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromSelectedDate(
        value,
        this.dateFormat
      );
    } else if (typeof value === 'string') {
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromString(
        value,
        this.dateFormat
      );
      formattedDate = this.fuzzyDateService.format(
        fuzzyDate,
        this.dateFormat,
        this.locale
      );

      if (!formattedDate) {
        formattedDate = value;
      }

      fuzzyMoment = this.fuzzyDateService.getMomentFromFuzzyDate(fuzzyDate);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }
    } else {
      fuzzyDate = value as SkyFuzzyDate;
      formattedDate = this.fuzzyDateService.format(
        fuzzyDate,
        this.dateFormat,
        this.locale
      );
      fuzzyMoment = this.fuzzyDateService.getMomentFromFuzzyDate(fuzzyDate);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }
    }

    const areFuzzyDatesEqual = this.fuzzyDatesEqual(this._value, fuzzyDate);
    const isNewValue = fuzzyDate !== this._value || !areFuzzyDatesEqual;

    this._value = fuzzyDate || value;

    if (isNewValue) {
      this.onChange(this._value);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.control) {
        this.control.markAsPristine();
      }

      if (this.isFirstChange && this._value) {
        this.isFirstChange = false;
      }

      this.datepickerComponent.selectedDate = dateValue;
    }

    this.setInputElementValue(formattedDate || '');
  }

  private control: AbstractControl;

  private dateFormatter = new SkyDateFormatter();

  private isFirstChange = true;

  private locale: string;

  private preferredShortDateFormat: string;

  private ngUnsubscribe = new Subject<void>();

  private _futureDisabled = false;

  private _dateFormat: string;

  private _disabled = false;

  private _maxDate: SkyFuzzyDate;

  private _minDate: SkyFuzzyDate;

  private _startingDay: number;

  private _value: any;

  private _yearRequired = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private configService: SkyDatepickerConfigService,
    private elementRef: ElementRef,
    private fuzzyDateService: SkyFuzzyDateService,
    private localeProvider: SkyAppLocaleProvider,
    private renderer: Renderer2,
    private resourcesService: SkyLibResourcesService,
    @Optional() private datepickerComponent: SkyDatepickerComponent
  ) {
    this.localeProvider
      .getLocaleInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((localeInfo) => {
        this.locale = localeInfo.locale;
        SkyDateFormatter.setLocale(this.locale);
        this.preferredShortDateFormat =
          SkyDateFormatter.getPreferredShortDateFormat();
      });
  }

  public ngOnInit(): void {
    if (this.yearRequired) {
      if (this.dateFormat.toLowerCase().indexOf('y') === -1) {
        throw new Error(
          'You have configured conflicting settings. Year is required and dateFormat does not include year.'
        );
      }
    }

    if (!this.datepickerComponent) {
      throw new Error(
        'You must wrap the `skyFuzzyDatepickerInput` directive within a ' +
          '`<sky-datepicker>` component!'
      );
    }

    const element = this.elementRef.nativeElement;

    this.renderer.addClass(element, 'sky-form-control');

    const hasAriaLabel = element.getAttribute('aria-label');

    /* istanbul ignore else */
    if (!hasAriaLabel) {
      this.resourcesService
        .getString('skyux_date_field_default_label')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value: string) => {
          this.renderer.setAttribute(element, 'aria-label', value);
        });
    }
  }

  public ngAfterContentInit(): void {
    this.datepickerComponent.dateChange
      .pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((value: Date) => {
        this.isFirstChange = false;
        this.value = value;
        this.onTouched();
      });
  }

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 4.
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    // Of note is the parent check which allows us to determine if the form is reactive.
    // Without this check there is a changed before checked error
    /* istanbul ignore else */

    if (this.control && this.control.parent) {
      setTimeout(() => {
        this.control.setValue(this.value, {
          emitEvent: false,
        });

        this.changeDetector.markForCheck();
      });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('change', ['$event'])
  public onInputChange(event: any) {
    this.onValueChange(event.target.value);
  }

  @HostListener('blur')
  public onInputBlur(): void {
    this.onTouched();

    const formattedDate = this.fuzzyDateService.format(
      this.value,
      this.dateFormat,
      this.locale
    );

    if (this.control.valid) {
      this.setInputElementValue(formattedDate);
    }
  }

  @HostListener('keyup')
  public onInputKeyup(): void {
    this.control.markAsDirty();
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    if (this.skyDatepickerNoValidate) {
      return;
    }

    if (!this.control.value) {
      return;
    }

    const value: any = control.value;

    let fuzzyDate: SkyFuzzyDate;
    let validationError: ValidationErrors;

    if (typeof value === 'string') {
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromString(
        value,
        this.dateFormat
      );
    } else {
      fuzzyDate = value;
    }

    if (!fuzzyDate) {
      validationError = {
        skyFuzzyDate: {
          invalid: value,
        },
      };
    }

    if (!validationError && !fuzzyDate.year && this.yearRequired) {
      validationError = {
        skyFuzzyDate: {
          yearRequired: value,
        },
      };
    }

    if (!validationError && fuzzyDate.year) {
      let fuzzyDateRange;

      if (this.maxDate) {
        fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(
          fuzzyDate,
          this.maxDate
        );

        if (!fuzzyDateRange.valid) {
          validationError = {
            skyFuzzyDate: {
              maxDate: value,
            },
          };
        }
      }

      if (!validationError && this.minDate) {
        fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(
          this.minDate,
          fuzzyDate
        );
        if (!fuzzyDateRange.valid) {
          validationError = {
            skyFuzzyDate: {
              minDate: value,
            },
          };
        }
      }

      if (!validationError && this.futureDisabled) {
        fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(
          fuzzyDate,
          this.fuzzyDateService.getCurrentFuzzyDate()
        );
        if (!fuzzyDateRange.valid) {
          validationError = {
            skyFuzzyDate: {
              futureDisabled: value,
            },
          };
        }
      }
    }

    if (validationError) {
      // Mark the invalid control as touched so that the input's invalid CSS styles appear.
      // (This is only required when the invalid value is set by the FormControl constructor.)
      this.control.markAsTouched();
    }

    return validationError;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.datepickerComponent.disabled = disabled;
  }

  /**
   * Detects changes to the underlying input element's value and updates the ngModel accordingly.
   * This is useful if you need to update the ngModel value before the input element loses focus.
   */
  public detectInputValueChange(): void {
    this.onValueChange(this.elementRef.nativeElement.value);
  }

  private onValueChange(newValue: string): void {
    this.isFirstChange = false;
    this.value = newValue;
  }

  private setInputElementValue(value: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  private getMaxDate(): Date {
    if (this.maxDate) {
      const maxDate = this.fuzzyDateService.getMomentFromFuzzyDate(
        this.maxDate
      );
      if (maxDate.isValid()) {
        return maxDate.toDate();
      }
    } else if (this.futureDisabled) {
      return new Date();
    }
    return this.configService.maxDate;
  }

  private getMinDate(): Date {
    if (this.minDate) {
      const minDate = this.fuzzyDateService.getMomentFromFuzzyDate(
        this.minDate
      );
      if (minDate.isValid()) {
        return minDate.toDate();
      }
    }
    return this.configService.minDate;
  }

  /* istanbul ignore next */
  private fuzzyDatesEqual(dateA: SkyFuzzyDate, dateB: SkyFuzzyDate): boolean {
    return (
      dateA &&
      dateB &&
      ((!dateA.day && !dateB.day) || dateA.day === dateB.day) &&
      ((!dateA.month && !dateB.month) || dateA.month === dateB.month) &&
      ((!dateA.year && !dateB.year) || dateA.year === dateB.year)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange = (_: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onValidatorChange = () => {};
}

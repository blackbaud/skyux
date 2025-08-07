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
import { SkyAppLocaleProvider } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { SkyDateFormatter } from '../date-formatter';
import { SkyDatepickerConfigService } from '../datepicker-config.service';
import { SkyDatepickerHostService } from '../datepicker-host.service';
import { SkyDatepickerComponent } from '../datepicker.component';

import { SkyFuzzyDate } from './fuzzy-date';
import { SkyFuzzyDateService } from './fuzzy-date.service';

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

@Directive({
  host: {
    '(focusout)': 'onFocusout($event)',
  },
  providers: [
    SKY_FUZZY_DATEPICKER_VALUE_ACCESSOR,
    SKY_FUZZY_DATEPICKER_VALIDATOR,
  ],
  selector: '[skyFuzzyDatepickerInput]',
  standalone: true,
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
   * The date format for the input. Place this attribute on the `input` element
   * to override the default in `SkyDatepickerConfigService`.
   * @default "MM/DD/YYYY"
   */
  @Input()
  public set dateFormat(value: string | undefined) {
    this.#_dateFormat = value;

    if (this.#value) {
      const formattedDate = this.#fuzzyDateService.format(
        this.#value,
        this.dateFormat,
        this.#locale,
      );
      this.#setInputElementValue(formattedDate);
      this.#changeDetector.markForCheck();
    }
  }

  // TODO: Refactor to not have getter logic
  public get dateFormat(): string | undefined {
    return (
      this.#_dateFormat ||
      this.#configService.dateFormat ||
      this.#preferredShortDateFormat
    );
  }

  /**
   * Whether to disable the datepicker on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value;
    this.#datepickerComponent.disabled = value;

    this.#renderer.setProperty(
      this.#elementRef.nativeElement,
      'disabled',
      value,
    );
  }

  public get disabled(): boolean | undefined {
    return this.#_disabled;
  }

  /**
   * Whether to prevent users from specifying dates that are in the future.
   * Place this attribute on the `input` element.
   * @default false
   */
  @Input()
  public set futureDisabled(value: boolean | undefined) {
    this.#_futureDisabled = value;
    this.#datepickerComponent.maxDate = this.#getMaxDate();
    this.#onValidatorChange();
  }

  public get futureDisabled(): boolean | undefined {
    return this.#_futureDisabled;
  }

  /**
   * The latest fuzzy date allowed. Place this attribute on the `input` element
   * to prevent fuzzy dates after a specified date. This property accepts
   * a `SkyFuzzyDate` value that includes numeric month, day, and year values.
   * For example: `{ month: 1, day: 1, year: 2027 }`.
   */
  @Input()
  public set maxDate(value: SkyFuzzyDate | undefined) {
    this.#_maxDate = value;
    this.#datepickerComponent.maxDate = this.#getMaxDate();
    this.#onValidatorChange();
  }

  public get maxDate(): SkyFuzzyDate | undefined {
    return this.#_maxDate;
  }

  /**
   * The earliest fuzzy date allowed. Place this attribute on the `input` element
   * to prevent fuzzy dates before a specified date. This property accepts a `SkyFuzzyDate` value
   * that includes numeric month, day, and year values.
   * For example: `{ month: 1, day: 1, year: 2007 }`.
   */
  @Input()
  public set minDate(value: SkyFuzzyDate | undefined) {
    this.#_minDate = value;
    this.#datepickerComponent.minDate = this.#getMinDate();
    this.#onValidatorChange();
  }

  public get minDate(): SkyFuzzyDate | undefined {
    return this.#_minDate;
  }

  /**
   * The fuzzy date to open the calendar to initially.
   * This property accepts a `SkyFuzzyDate` value that includes numeric month, day, and year values.
   * For example: `{ month: 1, day: 1, year: 2007 }`.
   * @default The current date
   */
  @Input()
  public set startAtDate(value: SkyFuzzyDate | undefined) {
    this.#_startAtDate = value;
    this.#datepickerComponent.startAtDate = this.#getStartAtDate();
  }

  // TODO: Refactor to not have getter logic
  public get startAtDate(): SkyFuzzyDate | undefined {
    return this.#_startAtDate;
  }

  /**
   * Whether to disable date validation on the fuzzy datepicker input.
   * @default false
   */
  @Input()
  public skyDatepickerNoValidate: boolean | undefined = false;

  /**
   * The starting day of the week in the calendar, where `0` sets the starting day
   * to Sunday. Place this attribute on the `input` element to override the default
   * in `SkyDatepickerConfigService`.
   * @default 0
   */
  @Input()
  public set startingDay(value: number | undefined) {
    this.#_startingDay = value;
    this.#datepickerComponent.startingDay = this.startingDay;

    this.#onValidatorChange();
  }

  // TODO: Refactor to not have getter logic
  public get startingDay(): number {
    return this.#_startingDay || this.#configService.startingDay;
  }

  /**
   * Whether to require the year in fuzzy dates.
   * @default false
   */
  @Input()
  public set yearRequired(value: boolean | undefined) {
    this.#_yearRequired = value;
    this.#onValidatorChange();
  }

  public get yearRequired(): boolean | undefined {
    return this.#_yearRequired;
  }

  get #value(): any {
    return this.#_value;
  }

  set #value(value: any) {
    this.#updateValue(value);
  }

  #control: AbstractControl | undefined;

  #dateFormatter = new SkyDateFormatter();

  #locale: string;

  #preferredShortDateFormat: string | undefined;

  #ngUnsubscribe = new Subject<void>();

  #notifyTouched: (() => void) | undefined;

  #_futureDisabled: boolean | undefined = false;

  #_dateFormat: string | undefined;

  #_disabled: boolean | undefined = false;

  #_maxDate: SkyFuzzyDate | undefined;

  #_minDate: SkyFuzzyDate | undefined;

  #_startAtDate: SkyFuzzyDate | undefined;

  #_startingDay: number | undefined;

  #_value: any;

  #_yearRequired: boolean | undefined = false;

  #changeDetector: ChangeDetectorRef;
  #configService: SkyDatepickerConfigService;
  #elementRef: ElementRef;
  #fuzzyDateService: SkyFuzzyDateService;
  #renderer: Renderer2;
  #datepickerComponent: SkyDatepickerComponent;

  readonly #datepickerHostSvc = inject(SkyDatepickerHostService, {
    optional: true,
  });

  constructor(
    changeDetector: ChangeDetectorRef,
    configService: SkyDatepickerConfigService,
    elementRef: ElementRef,
    fuzzyDateService: SkyFuzzyDateService,
    localeProvider: SkyAppLocaleProvider,
    renderer: Renderer2,
    @Optional() datepickerComponent?: SkyDatepickerComponent,
  ) {
    if (!datepickerComponent) {
      throw new Error(
        'You must wrap the `skyFuzzyDatepickerInput` directive within a ' +
          '`<sky-datepicker>` component!',
      );
    }

    this.#changeDetector = changeDetector;
    this.#configService = configService;
    this.#elementRef = elementRef;
    this.#fuzzyDateService = fuzzyDateService;
    this.#renderer = renderer;
    this.#datepickerComponent = datepickerComponent;

    this.#locale = localeProvider.defaultLocale;
    localeProvider
      .getLocaleInfo()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((localeInfo) => {
        this.#locale = localeInfo.locale;
        SkyDateFormatter.setLocale(this.#locale);
        this.#preferredShortDateFormat =
          SkyDateFormatter.getPreferredShortDateFormat();
      });

    this.#datepickerHostSvc?.focusout
      .pipe(takeUntilDestroyed())
      .subscribe((evt) => {
        const isFocusingInput =
          evt.relatedTarget === this.#elementRef.nativeElement;

        if (!isFocusingInput) {
          this.#notifyTouched?.();
        }
      });
  }

  public ngOnInit(): void {
    if (this.yearRequired) {
      if (this.dateFormat?.toLowerCase().indexOf('y') === -1) {
        throw new Error(
          'You have configured conflicting settings. Year is required and dateFormat does not include year.',
        );
      }
    }

    const element = this.#elementRef.nativeElement;

    this.#renderer.addClass(element, 'sky-form-control');
  }

  public ngAfterContentInit(): void {
    this.#datepickerComponent.dateChange
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((value: Date) => {
        this.#value = value;
      });
  }

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 4.
    // When a control value is set initially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    // Of note is the parent check which allows us to determine if the form is reactive.
    // Without this check there is a changed before checked error
    /* istanbul ignore else */

    if (this.#control && this.#control.parent) {
      setTimeout(() => {
        this.#control?.setValue(this.#value, {
          emitEvent: false,
        });

        this.#changeDetector.markForCheck();
      });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  @HostListener('change', ['$event'])
  public onInputChange(event: any): void {
    this.#onValueChange(event.target.value);
  }

  @HostListener('blur')
  public onInputBlur(): void {
    const formattedDate = this.#fuzzyDateService.format(
      this.#value,
      this.dateFormat,
      this.#locale,
    );

    if (this.#control?.valid) {
      this.#setInputElementValue(formattedDate);
    }
  }

  @HostListener('input')
  public onInput(): void {
    this.#control?.markAsDirty();
  }

  public writeValue(value: any): void {
    this.#updateValue(value, false);
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control) {
      this.#control = control;
    }

    if (this.skyDatepickerNoValidate) {
      return null;
    }

    if (!this.#control.value) {
      return null;
    }

    const value: any = control.value;

    let fuzzyDate: SkyFuzzyDate | undefined;
    let validationError: ValidationErrors | null = null;

    if (typeof value === 'string') {
      fuzzyDate = this.#fuzzyDateService.getFuzzyDateFromString(
        value,
        this.dateFormat,
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
    } else {
      if (!fuzzyDate.year && this.yearRequired) {
        validationError = {
          skyFuzzyDate: {
            yearRequired: value,
          },
        };
      }

      if (!validationError && fuzzyDate.year) {
        let fuzzyDateRange;

        if (this.maxDate) {
          fuzzyDateRange = this.#fuzzyDateService.getFuzzyDateRange(
            fuzzyDate,
            this.maxDate,
          );

          if (!fuzzyDateRange.valid) {
            validationError = {
              skyFuzzyDate: {
                maxDate: value,
                maxDateFormatted: this.#dateFormatter.format(
                  fuzzyDateRange.endDate,
                  this.dateFormat,
                ),
              },
            };
          }
        }

        if (!validationError && this.minDate) {
          fuzzyDateRange = this.#fuzzyDateService.getFuzzyDateRange(
            this.minDate,
            fuzzyDate,
          );
          if (!fuzzyDateRange.valid) {
            validationError = {
              skyFuzzyDate: {
                minDate: value,
                minDateFormatted: this.#dateFormatter.format(
                  fuzzyDateRange.startDate,
                  this.dateFormat,
                ),
              },
            };
          }
        }

        if (!validationError && this.futureDisabled) {
          fuzzyDateRange = this.#fuzzyDateService.getFuzzyDateRange(
            fuzzyDate,
            this.#fuzzyDateService.getCurrentFuzzyDate(),
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
    }

    if (validationError) {
      // Mark the invalid control as touched so that the input's invalid CSS styles appear.
      // (This is only required when the invalid value is set by the FormControl constructor.)
      this.#control.markAsTouched();
    }

    return validationError;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.#onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.#onValidatorChange = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.#datepickerComponent.disabled = disabled;
  }

  /**
   * Detects changes to the underlying input element's value and updates the ngModel accordingly.
   * This is useful if you need to update the ngModel value before the input element loses focus.
   */
  public detectInputValueChange(): void {
    this.#onValueChange(this.#elementRef.nativeElement.value);
  }

  protected onFocusout(evt: FocusEvent): void {
    if (!this.#datepickerHostSvc?.isFocusingDatepicker(evt)) {
      this.#notifyTouched?.();
    }
  }

  #onValueChange(newValue: string): void {
    this.#value = newValue;
  }

  #setInputElementValue(value: string): void {
    this.#renderer.setProperty(this.#elementRef.nativeElement, 'value', value);
  }

  #getMaxDate(): Date | undefined {
    if (this.maxDate) {
      const maxDate = this.#fuzzyDateService.getMomentFromFuzzyDate(
        this.maxDate,
      );
      if (maxDate.isValid()) {
        return maxDate.toDate();
      }
    } else if (this.futureDisabled) {
      return new Date();
    }
    return this.#configService.maxDate;
  }

  #getMinDate(): Date | undefined {
    if (this.minDate) {
      const minDate = this.#fuzzyDateService.getMomentFromFuzzyDate(
        this.minDate,
      );
      if (minDate.isValid()) {
        return minDate.toDate();
      }
    }
    return this.#configService.minDate;
  }

  #getStartAtDate(): Date | undefined {
    if (this.startAtDate) {
      const startAtDate = this.#fuzzyDateService.getMomentFromFuzzyDate(
        this.startAtDate,
      );
      if (startAtDate.isValid()) {
        return startAtDate.toDate();
      }
    }
    return this.#configService.startAtDate;
  }

  /* istanbul ignore next */
  #fuzzyDatesEqual(dateA?: SkyFuzzyDate, dateB?: SkyFuzzyDate): boolean {
    return !!(
      dateA &&
      dateB &&
      ((!dateA.day && !dateB.day) || dateA.day === dateB.day) &&
      ((!dateA.month && !dateB.month) || dateA.month === dateB.month) &&
      ((!dateA.year && !dateB.year) || dateA.year === dateB.year)
    );
  }

  // istanbul ignore next
  #onChange = (_: any): void => {};
  // istanbul ignore next
  #onValidatorChange = (): void => {};

  /**
   * Update the value of the form control and input element
   * @param emitEvent Denotes if we emit an event to the consumer's form control. We do not want to do this if the value is being updated via a `setValue` call or a `patchValue` call as this is already handled by Angular.
   * In these cases we do not want to fire `onChange` as it will cause extra `valueChange` and `statusChange` events and the status of the form should not be affected by these changes.
   */
  #updateValue(value: any, emitEvent = true): void {
    if (
      this.#_value === value ||
      (this.#_value === undefined && value === null)
    ) {
      return;
    }

    let fuzzyDate: SkyFuzzyDate | undefined;
    let fuzzyMoment: any;
    let dateValue: Date | undefined;
    let formattedDate: string | undefined;

    if (value instanceof Date) {
      dateValue = value;
      formattedDate = this.#dateFormatter.format(value, this.dateFormat);
      fuzzyDate = this.#fuzzyDateService.getFuzzyDateFromSelectedDate(
        value,
        this.dateFormat,
      );
    } else if (typeof value === 'string') {
      fuzzyDate = this.#fuzzyDateService.getFuzzyDateFromString(
        value,
        this.dateFormat,
      );
      if (fuzzyDate) {
        formattedDate = this.#fuzzyDateService.format(
          fuzzyDate,
          this.dateFormat,
          this.#locale,
        );
      }

      if (!formattedDate) {
        formattedDate = value;
      }

      fuzzyMoment = this.#fuzzyDateService.getMomentFromFuzzyDate(fuzzyDate);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }
    } else {
      fuzzyDate = value as SkyFuzzyDate;
      formattedDate = this.#fuzzyDateService.format(
        fuzzyDate,
        this.dateFormat,
        this.#locale,
      );
      fuzzyMoment = this.#fuzzyDateService.getMomentFromFuzzyDate(fuzzyDate);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }
    }

    const areFuzzyDatesEqual = this.#fuzzyDatesEqual(this.#_value, fuzzyDate);
    const isNewValue = fuzzyDate !== this.#_value || !areFuzzyDatesEqual;

    this.#_value = fuzzyDate || value;

    if (isNewValue) {
      if (emitEvent) {
        this.#onChange(this.#_value);
      } else {
        this.#control?.setValue(this.#_value, { emitEvent: false });
      }

      this.#datepickerComponent.selectedDate = dateValue;
    }

    this.#setInputElementValue(formattedDate || '');
  }
}

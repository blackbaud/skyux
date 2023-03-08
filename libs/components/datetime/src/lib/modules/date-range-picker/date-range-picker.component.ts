import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SkyAppLocaleProvider } from '@skyux/i18n';
import { SkyThemeService } from '@skyux/theme';

import { Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, first, takeUntil } from 'rxjs/operators';

import { SkyDateFormatter } from '../datepicker/date-formatter';

import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';

const SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true,
};

const SKY_DATE_RANGE_PICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true,
};

let uniqueId = 0;

/**
 * Acts as a form control with a form model of type `SkyDateRangeCalculation`.
 * @example
 * ```
 * <sky-date-range-picker
 *   formControlName="myPicker"
 * >
 * </sky-date-range-picker>
 * ```
 */
@Component({
  selector: 'sky-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR,
    SKY_DATE_RANGE_PICKER_VALIDATOR,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDateRangePickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * IDs for the date range options to include in the picker's dropdown.
   * The options specify calculator objects that return two `Date` objects to represent date ranges.
   * By default, this property includes all `SkyDateRangeCalculatorId` values.
   */
  @Input()
  public set calculatorIds(value: SkyDateRangeCalculatorId[] | undefined) {
    this.#_calculatorIds = value || [
      SkyDateRangeCalculatorId.AnyTime,
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorId.SpecificRange,
      SkyDateRangeCalculatorId.Yesterday,
      SkyDateRangeCalculatorId.Today,
      SkyDateRangeCalculatorId.Tomorrow,
      SkyDateRangeCalculatorId.LastWeek,
      SkyDateRangeCalculatorId.ThisWeek,
      SkyDateRangeCalculatorId.NextWeek,
      SkyDateRangeCalculatorId.LastMonth,
      SkyDateRangeCalculatorId.ThisMonth,
      SkyDateRangeCalculatorId.NextMonth,
      SkyDateRangeCalculatorId.LastQuarter,
      SkyDateRangeCalculatorId.ThisQuarter,
      SkyDateRangeCalculatorId.NextQuarter,
      SkyDateRangeCalculatorId.LastCalendarYear,
      SkyDateRangeCalculatorId.ThisCalendarYear,
      SkyDateRangeCalculatorId.NextCalendarYear,
      SkyDateRangeCalculatorId.LastFiscalYear,
      SkyDateRangeCalculatorId.ThisFiscalYear,
      SkyDateRangeCalculatorId.NextFiscalYear,
    ];
  }

  public get calculatorIds(): SkyDateRangeCalculatorId[] {
    return this.#_calculatorIds;
  }

  /**
   * The date format for
   * [the `sky-datepicker` components](https://developer.blackbaud.com/skyux/components/datepicker)
   * that make up the date range picker. The text input is a composite component of
   * up to two `sky-datepicker` components.
   * @default "MM/DD/YYYY"
   */
  @Input()
  public set dateFormat(value: string | undefined) {
    this.#_dateFormat = value;
    this.dateFormatOrDefault = value || this.#preferredShortDateFormat;
  }

  public get dateFormat(): string | undefined {
    return this.#_dateFormat;
  }

  /**
   * Whether to disable the date range picker.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = coerceBooleanProperty(value);

    if (this.formGroup) {
      if (this.#_disabled) {
        this.formGroup.disable();
      } else {
        this.formGroup.enable();
      }
    }

    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * The label for the date range picker.
   * @required
   */
  @Input()
  public label: string | undefined;

  /**
   * Whether to require users to specify a start date.
   * @default false
   */
  @Input()
  public startDateRequired: boolean | undefined = false;

  /**
   * Whether to require users to specify a end date.
   * @default false
   */
  @Input()
  public endDateRequired: boolean | undefined = false;

  public selectedCalculator: SkyDateRangeCalculator | undefined;

  public readonly dateRangePickerId = `sky-date-range-picker-${uniqueId++}`;

  public calculators: SkyDateRangeCalculator[] = [];
  public dateFormatOrDefault: string | undefined;
  public formGroup: UntypedFormGroup | undefined;
  public isReady = false;
  public showEndDatePicker = false;
  public showStartDatePicker = false;

  get #calculatorIdControl(): AbstractControl | undefined | null {
    return this.formGroup?.get('calculatorId');
  }

  get #defaultCalculator(): SkyDateRangeCalculator | undefined {
    return this.calculators[0];
  }

  get #defaultValue(): SkyDateRangeCalculation | undefined {
    return this.#defaultCalculator?.getValue();
  }

  get #endDateControl(): AbstractControl | undefined | null {
    return this.formGroup?.get('endDate');
  }

  get #startDateControl(): AbstractControl | undefined | null {
    return this.formGroup?.get('startDate');
  }

  #value: SkyDateRangeCalculation | undefined;

  set #valueOrDefault(value: SkyDateRangeCalculation | undefined) {
    this.#_valueOrDefault = value;
    this.#updateSelectedCalculator();
  }

  get #valueOrDefault(): SkyDateRangeCalculation | undefined {
    return this.#_valueOrDefault;
  }

  #control: AbstractControl | undefined;
  #preferredShortDateFormat: string | undefined;
  #ngUnsubscribe = new Subject<void>();

  #_calculatorIds: SkyDateRangeCalculatorId[] = [
    SkyDateRangeCalculatorId.AnyTime,
    SkyDateRangeCalculatorId.Before,
    SkyDateRangeCalculatorId.After,
    SkyDateRangeCalculatorId.SpecificRange,
    SkyDateRangeCalculatorId.Yesterday,
    SkyDateRangeCalculatorId.Today,
    SkyDateRangeCalculatorId.Tomorrow,
    SkyDateRangeCalculatorId.LastWeek,
    SkyDateRangeCalculatorId.ThisWeek,
    SkyDateRangeCalculatorId.NextWeek,
    SkyDateRangeCalculatorId.LastMonth,
    SkyDateRangeCalculatorId.ThisMonth,
    SkyDateRangeCalculatorId.NextMonth,
    SkyDateRangeCalculatorId.LastQuarter,
    SkyDateRangeCalculatorId.ThisQuarter,
    SkyDateRangeCalculatorId.NextQuarter,
    SkyDateRangeCalculatorId.LastCalendarYear,
    SkyDateRangeCalculatorId.ThisCalendarYear,
    SkyDateRangeCalculatorId.NextCalendarYear,
    SkyDateRangeCalculatorId.LastFiscalYear,
    SkyDateRangeCalculatorId.ThisFiscalYear,
    SkyDateRangeCalculatorId.NextFiscalYear,
  ];
  #_dateFormat: string | undefined;
  #_disabled = false;
  #_valueOrDefault: SkyDateRangeCalculation | undefined;

  #changeDetector: ChangeDetectorRef;
  #dateRangeService: SkyDateRangeService;
  #formBuilder: UntypedFormBuilder;
  #localeProvider: SkyAppLocaleProvider;
  #ngZone: NgZone;

  constructor(
    changeDetector: ChangeDetectorRef,
    dateRangeService: SkyDateRangeService,
    formBuilder: UntypedFormBuilder,
    localeProvider: SkyAppLocaleProvider,
    ngZone: NgZone,
    @Optional() themeSvc?: SkyThemeService
  ) {
    this.#changeDetector = changeDetector;
    this.#dateRangeService = dateRangeService;
    this.#formBuilder = formBuilder;
    this.#localeProvider = localeProvider;
    this.#ngZone = ngZone;

    this.dateFormatOrDefault = this.dateFormat;

    this.#localeProvider
      .getLocaleInfo()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((localeInfo) => {
        SkyDateFormatter.setLocale(localeInfo.locale);
        this.#preferredShortDateFormat =
          SkyDateFormatter.getPreferredShortDateFormat();
        this.dateFormatOrDefault =
          this.dateFormat || this.#preferredShortDateFormat;
      });

    // Update icons when theme changes.
    /* istanbul ignore next */
    themeSvc?.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnInit(): void {
    this.#createForm();

    this.#updateCalculators().then(() => {
      if (!this.#value || !this.#value.calculatorId) {
        this.#valueOrDefault = this.#defaultValue;
      }

      this.#addEventListeners();

      this.isReady = true;

      this.#showRelevantFormFields();

      // We need to let Angular be stable and have rendered the components prior to setting the values and form controls. This ensures all initial validation will be ran correctly.
      this.#ngZone.onStable.pipe(first()).subscribe(() => {
        // Fill in any unprovided values after the calculators have been initialized.
        // For example, if the control is initialized with only the `calculatorId`,
        // allow the calculator to fill in the missing start and end dates.
        const defaultValue = this.selectedCalculator?.getValue(
          this.#valueOrDefault?.startDate,
          this.#valueOrDefault?.endDate
        );
        const newValue = Object.assign({}, defaultValue, this.#valueOrDefault);

        this.#setValue(newValue, false);

        this.#resetFormGroupValue();

        // This is needed to address a bug in Angular 4.
        // When a control value is set initially, its value is not represented on the view.
        // See: https://github.com/angular/angular/issues/13792
        /* istanbul ignore else */
        if (this.#control) {
          this.#control.setValue(this.#valueOrDefault, {
            emitEvent: false,
          });
        }
      });
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.calculatorIds && changes.calculatorIds.firstChange === false) {
      this.#updateCalculators().then(() => {
        const id = this.#calculatorIdControl?.value;

        // Maintain the currently selected values if the calculators change after
        // a value has been chosen.
        const found = this.calculators.find((calculator) => {
          return calculator.calculatorId === id;
        });

        /* istanbul ignore else */
        if (!found) {
          const newValue = this.#defaultCalculator?.getValue();
          this.#setValue(newValue);
          this.#resetFormGroupValue(newValue);
          this.#showRelevantFormFields();
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onFieldBlur(): void {
    this.#onTouched();
  }

  public writeValue(value: SkyDateRangeCalculation): void {
    // Only update the underlying controls when the calculators are ready.
    const notifyChange = false;

    // (We still need to save the initial value set by the consumer's form, however.)
    this.#setValue(value, notifyChange);

    if (this.isReady) {
      // When the control's value is set to `null`,
      // set it to the default value.
      if (!value) {
        this.#onChange(this.#defaultValue);
      }

      this.#resetFormGroupValue();
      this.#showRelevantFormFields();
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control) {
      this.#control = control;
    }

    if (!this.isReady) {
      return null;
    }

    const value = control.value;
    const idControl = this.#calculatorIdControl;
    const result = this.selectedCalculator?.validate(value);

    let errors: ValidationErrors | null = null;

    if (result) {
      errors = {
        skyDateRange: {
          calculatorId: idControl?.value,
          errors: result,
        },
      };
    } else {
      let startErrors: ValidationErrors | null = null;
      let endErrors: ValidationErrors | null = null;
      if (this.#startDateControl) {
        startErrors = this.#startDateControl.errors;
      }
      if (this.#endDateControl) {
        endErrors = this.#endDateControl.errors;
      }

      errors = startErrors || endErrors;
    }

    if (!errors) {
      // Clear any errors on the calculator select.
      idControl?.setErrors(null);
      return null;
    }

    idControl?.setErrors(errors);
    idControl?.markAsTouched();
    idControl?.markAsDirty();

    // Need to mark the control as touched for the error messages to appear.
    this.#control.markAsTouched();

    // Notify the view to display any errors.
    this.#changeDetector.markForCheck();

    return errors;
  }

  public registerOnChange(
    fn: (value: SkyDateRangeCalculation | undefined) => SkyDateRangeCalculation
  ): void {
    this.#onChange = fn;
  }

  public registerOnTouched(fn: () => SkyDateRangeCalculation): void {
    this.#onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  #setValue(
    value: SkyDateRangeCalculation | undefined,
    notifyChange = true
  ): void {
    const isNewValue = !this.#dateRangesEqual(this.#value, value);

    if (isNewValue) {
      this.#value = value;
      if (!value || value.calculatorId === undefined) {
        this.#valueOrDefault = this.#defaultValue;
      } else {
        this.#valueOrDefault = value;
      }

      if (notifyChange) {
        this.#onChange(this.#valueOrDefault);
      }
    }
  }

  #patchValue(value: any): void {
    const newValue = Object.assign({}, this.#valueOrDefault, value);

    this.#setValue(newValue);
  }

  #createForm(): void {
    this.formGroup = this.#formBuilder.group({
      calculatorId: new UntypedFormControl(),
      startDate: new UntypedFormControl(),
      endDate: new UntypedFormControl(),
    });

    if (this.disabled) {
      this.formGroup.disable();
    }
  }

  #showRelevantFormFields(): void {
    const calculator = this.selectedCalculator;

    let showEndDatePicker = false;
    let showStartDatePicker = false;

    switch (calculator?.type) {
      case SkyDateRangeCalculatorType.Before:
        showEndDatePicker = true;
        break;

      case SkyDateRangeCalculatorType.After:
        showStartDatePicker = true;
        break;

      case SkyDateRangeCalculatorType.Range:
        showEndDatePicker = true;
        showStartDatePicker = true;
        break;

      default:
        break;
    }

    this.showEndDatePicker = showEndDatePicker;
    this.showStartDatePicker = showStartDatePicker;
    this.#changeDetector.markForCheck();
  }

  #resetFormGroupValue(value?: SkyDateRangeCalculation): void {
    this.formGroup?.reset(value || this.#valueOrDefault);
  }

  #addEventListeners(): void {
    // Watch for selected calculator change.
    this.#calculatorIdControl?.valueChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        if (value !== this.#valueOrDefault?.calculatorId) {
          const id = parseInt(value, 10);
          // if the component is disabled during form creation, null is passed
          // as the value of the calculator id control
          // only handle the value changes if the calculator id is a number
          /* istanbul ignore else */
          if (!isNaN(id)) {
            const calculator = this.#getCalculatorById(id);
            const newValue = calculator?.getValue();

            this.#setValue(newValue);
            this.#resetFormGroupValue(newValue);
            this.#showRelevantFormFields();
          }
        }
      });

    // Watch for start date value changes.
    this.#startDateControl?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((startDate) => {
        this.#patchValue({ startDate });
      });

    // Watch for end date value changes.
    this.#endDateControl?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((endDate) => {
        this.#patchValue({ endDate });
      });

    // Safety check
    /* istanbul ignore else */
    if (this.#startDateControl && this.#endDateControl) {
      // Detect errors from the date inputs and update ng- classes on picker.
      combineLatest([
        this.#startDateControl.statusChanges,
        this.#endDateControl.statusChanges,
      ])
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateBasedOnControls();
        });
    } else if (this.#startDateControl) {
      this.#startDateControl.statusChanges
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateBasedOnControls();
        });
    } else if (this.#endDateControl) {
      this.#endDateControl.statusChanges
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateBasedOnControls();
        });
    }
  }

  #updateBasedOnControls(): void {
    this.#changeDetector.markForCheck();

    // Wait for initial validation to complete.
    this.#ngZone.onStable.pipe(first()).subscribe(() => {
      this.#control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  #updateCalculators(): Promise<void> {
    return this.#dateRangeService
      .getCalculators(this.calculatorIds)
      .then((calculators) => {
        this.calculators = calculators;
        // Ensure that any previously set value is used to determine the selected calculator
        this.#updateSelectedCalculator();
        this.#changeDetector.markForCheck();
      });
  }

  #getCalculatorById(
    id: SkyDateRangeCalculatorId
  ): SkyDateRangeCalculator | undefined {
    return this.calculators.find((calculator) => {
      return calculator.calculatorId === id;
    });
  }

  #dateRangesEqual(
    rangeA: SkyDateRangeCalculation | undefined,
    rangeB: SkyDateRangeCalculation | undefined
  ): boolean {
    return (
      !!rangeA && !!rangeB && JSON.stringify(rangeA) === JSON.stringify(rangeB)
    );
  }

  #updateSelectedCalculator(): void {
    this.selectedCalculator = this.#valueOrDefault
      ? this.#getCalculatorById(this.#valueOrDefault.calculatorId)
      : undefined;
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  #onChange = (_: SkyDateRangeCalculation | undefined): void => {};
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onTouched = (): void => {};
}

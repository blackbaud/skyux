import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  combineLatest,
  Subject
} from 'rxjs';

import {
  distinctUntilChanged,
  first,
  takeUntil
} from 'rxjs/operators';

import {
  SkyDateFormatter
} from '../datepicker/date-formatter';

import {
  SkyDateRangeCalculation
} from './types/date-range-calculation';

import {
  SkyDateRangeCalculatorId
} from './types/date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './types/date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from './types/date-range-calculator';

import {
  SkyDateRangeService
} from './date-range.service';

/* tslint:disable:no-forward-ref no-use-before-declare */
const SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true
};

const SKY_DATE_RANGE_PICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true
};
/* tslint:enable */

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
    SKY_DATE_RANGE_PICKER_VALIDATOR
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDateRangePickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {

  /**
   * Specifies IDs for the date range options to include in the picker's dropdown.
   * The options specify calculator objects that return two `Date` objects to represent date ranges.
   * By default, this property includes all `SkyDateRangeCalculatorId` values.
   */
  @Input()
  public set calculatorIds(value: SkyDateRangeCalculatorId[]) {
    this._calculatorIds = value;
  }

  public get calculatorIds(): SkyDateRangeCalculatorId[] {
    return this._calculatorIds || [
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
      SkyDateRangeCalculatorId.NextFiscalYear
    ];
  }

  /**
   * Specifies a date format for
   * [the `sky-datepicker` components](https://developer.blackbaud.com/skyux/components/datepicker)
   * that make up the date range picker. The text input is a composite component of
   * up to two `sky-datepicker` components.
   * @default MM/DD/YYYY
   */
  @Input()
  public set dateFormat(value: string) {
    this._dateFormat = value;
  }

  public get dateFormat(): string {
    return this._dateFormat || this.preferredShortDateFormat;
  }

  /**
   * Indicates whether to disable the date range picker.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;

    if (this.formGroup) {
      if (this._disabled) {
        this.formGroup.disable();
      } else {
        this.formGroup.enable();
      }
    }

    this.changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Specifies a label for the date range picker.
   * @required
   */
  @Input()
  public label: string;

  /**
   * Indicates whether to require users to specify a start date.
   * @default false
   */
  @Input()
  public startDateRequired: boolean = false;

  /**
   * Indicates whether to require users to specify a end date.
   * @default false
   */
  @Input()
  public endDateRequired: boolean = false;

  public get startDateLabelResourceKey(): string {
    if (this.selectedCalculator.type === SkyDateRangeCalculatorType.Range) {
      return 'skyux_date_range_picker_start_date_label';
    }

    return 'skyux_date_range_picker_after_date_label';
  }

  public get endDateLabelResourceKey(): string {
    if (this.selectedCalculator.type === SkyDateRangeCalculatorType.Range) {
      return 'skyux_date_range_picker_end_date_label';
    }

    return 'skyux_date_range_picker_before_date_label';
  }

  public get selectedCalculator(): SkyDateRangeCalculator {
    return this.getCalculatorById(this.value.calculatorId);
  }

  public readonly dateRangePickerId = `sky-date-range-picker-${uniqueId++}`;

  public calculators: SkyDateRangeCalculator[];
  public formGroup: FormGroup;
  public isReady = false;
  public showEndDatePicker = false;
  public showStartDatePicker = false;

  private get calculatorIdControl(): AbstractControl {
    return this.formGroup.get('calculatorId');
  }

  private get defaultCalculator(): SkyDateRangeCalculator {
    return this.calculators[0];
  }

  private get defaultValue(): SkyDateRangeCalculation {
    return this.defaultCalculator.getValue();
  }

  private get endDateControl(): AbstractControl {
    return this.formGroup.get('endDate');
  }

  private get startDateControl(): AbstractControl {
    return this.formGroup.get('startDate');
  }

  private get value(): SkyDateRangeCalculation {
    if (
      this._value &&
      this._value.calculatorId !== undefined
    ) {
      return this._value;
    }

    return this.defaultValue;
  }

  private control: AbstractControl;
  private preferredShortDateFormat: string;
  private ngUnsubscribe = new Subject<void>();

  private _calculatorIds: SkyDateRangeCalculatorId[];
  private _dateFormat: string;
  private _disabled = false;
  private _value: SkyDateRangeCalculation;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dateRangeService: SkyDateRangeService,
    private formBuilder: FormBuilder,
    private localeProvider: SkyAppLocaleProvider,
    private windowRef: SkyAppWindowRef,
    @Optional() themeSvc?: SkyThemeService
  ) {
    this.localeProvider.getLocaleInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((localeInfo) => {
        SkyDateFormatter.setLocale(localeInfo.locale);
        this.preferredShortDateFormat = SkyDateFormatter.getPreferredShortDateFormat();
      });

    // Update icons when theme changes.
    /* istanbul ignore next */
    themeSvc?.settingsChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeDetector.markForCheck();
      });
  }

  public ngOnInit(): void {
    this.createForm();

    this.updateCalculators().then(() => {
      this.addEventListeners();

      this.isReady = true;

      this.resetFormGroupValue();
      this.showRelevantFormFields();

      // Fill in any unprovided values after the calculators have been initialized.
      // For example, if the control is initialized with only the `calculatorId`,
      // allow the calculator to fill in the missing start and end dates.
      const { startDate, endDate } = this.value;
      const defaultValue = this.selectedCalculator.getValue(startDate, endDate);
      const newValue = Object.assign({}, defaultValue, this.value);

      this.setValue(newValue, false);

      // This is needed to address a bug in Angular 4.
      // When a control value is set intially, its value is not represented on the view.
      // See: https://github.com/angular/angular/issues/13792
      /* istanbul ignore else */
      if (this.control) {
        this.control.setValue(this.value, {
          emitEvent: false
        });
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.calculatorIds &&
      changes.calculatorIds.firstChange === false
    ) {
      this.updateCalculators().then(() => {
        const id = this.calculatorIdControl.value;

        // Maintain the currently selected values if the calculators change after
        // a value has been chosen.
        const found = this.calculators.find((calculator) => {
          return (calculator.calculatorId === id);
        });

        /* istanbul ignore else */
        if (!found) {
          const newValue = this.defaultCalculator.getValue();
          this.setValue(newValue);
          this.resetFormGroupValue(newValue);
          this.showRelevantFormFields();
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onFieldBlur(): void {
    this.onTouched();
  }

  public writeValue(value: SkyDateRangeCalculation): void {

    // Only update the underlying controls when the calculators are ready.
    const notifyChange = false;

    // (We still need to save the initial value set by the consumer's form, however.)
    this.setValue(value, notifyChange);

    if (this.isReady) {

      // When the control's value is set to `null`,
      // set it to the default value.
      if (!value) {
        this.onChange(this.defaultValue);
      }

      this.resetFormGroupValue();
      this.showRelevantFormFields();
    }
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    if (!this.isReady) {
      return;
    }

    const value = control.value;
    const idControl = this.calculatorIdControl;
    const result = this.selectedCalculator.validate(value);

    let errors: ValidationErrors;

    if (result) {
      errors = {
        skyDateRange: {
          calculatorId: idControl.value,
          errors: result
        }
      };
    } else {
      errors = this.startDateControl.errors || this.endDateControl.errors;
    }

    if (!errors) {
      // Clear any errors on the calculator select.
      // tslint:disable-next-line:no-null-keyword
      idControl.setErrors(null);
      return;
    }

    idControl.setErrors(errors);
    idControl.markAsTouched();
    idControl.markAsDirty();

    // Need to mark the control as touched for the error messages to appear.
    this.control.markAsTouched();

    // Notify the view to display any errors.
    this.changeDetector.markForCheck();

    return errors;
  }

  public registerOnChange(fn: (value: SkyDateRangeCalculation) => SkyDateRangeCalculation): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => SkyDateRangeCalculation): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  private setValue(value: SkyDateRangeCalculation, notifyChange = true): void {
    const isNewValue = !this.dateRangesEqual(this._value, value);

    if (isNewValue) {
      this._value = value;

      if (notifyChange) {
        this.onChange(this.value);
      }
    }
  }

  private patchValue(value: any): void {
    const newValue = Object.assign({}, this.value, value);

    this.setValue(newValue);
  }

  private createForm(): void {
    this.formGroup = this.formBuilder.group({
      calculatorId: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl()
    });

    if (this.disabled) {
      this.formGroup.disable();
    }
  }

  private showRelevantFormFields(): void {
    const calculator = this.selectedCalculator;

    let showEndDatePicker = false;
    let showStartDatePicker = false;

    switch (calculator.type) {
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
    this.changeDetector.markForCheck();
  }

  private resetFormGroupValue(value?: SkyDateRangeCalculation): void {
    // Do not emit a value change event on the underlying form group
    // because we're already watching for changes that are triggered by the end user.
    // For example, if we change the value of the form group internally, we don't want the event
    // listeners to be triggered, as those are reserved for user interactions.
    // (See the event listeners listed below.)
    this.formGroup.reset(
      value || this.value,
      {
        emitEvent: false
      }
    );
  }

  private addEventListeners(): void {
    // Detect errors from the date pickers
    // when control is initialized with a value.
      combineLatest([
        this.startDateControl.statusChanges,
        this.endDateControl.statusChanges
      ])
      .pipe(first())
      .subscribe((status: string[]) => {
        if (status.indexOf('INVALID') > -1) {
          // Wait for initial validation to complete.
          this.windowRef.nativeWindow.setTimeout(() => {
            this.onValidatorChange();
          });
        }
      });

    // Watch for selected calculator change.
    this.calculatorIdControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        const id = parseInt(value, 10);
        // if the component is disabled during form creation, null is passed
        // as the value of the calculator id control
        // only handle the value changes if the calculator id is a number
        /* istanbul ignore else */
        if (!isNaN(id)) {
          const calculator = this.getCalculatorById(id);
          const newValue = calculator.getValue();

          this.setValue(newValue);
          this.resetFormGroupValue(newValue);
          this.showRelevantFormFields();
        }
      });

    // Watch for start date value changes.
    this.startDateControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((startDate) => {
        this.patchValue({ startDate });
      });

    // Watch for end date value changes.
    this.endDateControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((endDate) => {
        this.patchValue({ endDate });
      });

      // Detect errors from the date inputs and update ng- classes on picker.
      combineLatest([
        this.startDateControl.statusChanges,
        this.endDateControl.statusChanges
      ])
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.changeDetector.markForCheck();
      });
  }

  private updateCalculators(): Promise<void> {
    return this.dateRangeService
      .getCalculators(this.calculatorIds)
      .then((calculators) => {
        this.calculators = calculators;
        this.changeDetector.markForCheck();
      });
  }

  private getCalculatorById(id: SkyDateRangeCalculatorId): SkyDateRangeCalculator {
    return this.calculators.find((calculator) => {
      return calculator.calculatorId === id;
    });
  }

  private dateRangesEqual(
    rangeA: SkyDateRangeCalculation,
    rangeB: SkyDateRangeCalculation
  ): boolean {
    return (JSON.stringify(rangeA) === JSON.stringify(rangeB));
  }

  /* istanbul ignore next */
  private onChange = (_: SkyDateRangeCalculation) => { };
  /* istanbul ignore next */
  private onTouched = () => { };
  /* istanbul ignore next */
  private onValidatorChange = () => { };
}

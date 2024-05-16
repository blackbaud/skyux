import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  HostBinding,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  booleanAttribute,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {
  SkyFormFieldLabelTextRequiredService,
  SkyInputBoxModule,
} from '@skyux/forms';

import { Subject, distinctUntilChanged, merge, takeUntil } from 'rxjs';

import { SkyDatepickerModule } from '../datepicker/datepicker.module';
import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangePickerEndDateResourceKeyPipe } from './date-range-picker-end-date-resource-key.pipe';
import { SkyDateRangePickerStartDateResourceKeyPipe } from './date-range-picker-start-date-resource-key.pipe';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';
import { SKY_DEFAULT_CALCULATOR_IDS } from './types/date-range-default-calculator-configs';

type DateValue = Date | string | null | undefined;

function areDatesEqual(a: DateValue, b: DateValue): boolean {
  if (typeof a !== typeof b) {
    return false;
  }

  if (!a && !b) {
    return true;
  }

  if (typeof a === 'string' && a === b) {
    return true;
  }

  return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
}

function areDateRangesEqual(
  rangeA: SkyDateRangeCalculation | undefined,
  rangeB: SkyDateRangeCalculation | undefined,
): boolean {
  return (
    !!rangeA &&
    !!rangeB &&
    rangeA.calculatorId === rangeB.calculatorId &&
    areDatesEqual(rangeA.startDate, rangeB.startDate) &&
    areDatesEqual(rangeA.endDate, rangeB.endDate)
  );
}

function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === undefined || value === null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyDateRangePickerEndDateResourceKeyPipe,
    SkyDateRangePickerStartDateResourceKeyPipe,
    SkyDatetimeResourcesModule,
    SkyInputBoxModule,
  ],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SkyDateRangePickerComponent,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SkyDateRangePickerComponent,
      multi: true,
    },
  ],
  selector: 'sky-date-range-picker',
  standalone: true,
  styleUrl: './date-range-picker.component.scss',
  templateUrl: './date-range-picker.component.html',
})
export class SkyDateRangePickerComponent
  implements
    AfterViewInit,
    ControlValueAccessor,
    DoCheck,
    OnDestroy,
    OnInit,
    Validator
{
  /**
   * IDs for the date range options to include in the picker's dropdown.
   * The options specify calculator objects that return two `Date` objects to represent date ranges.
   * By default, this property includes all `SkyDateRangeCalculatorId` values.
   */
  @Input()
  public set calculatorIds(
    calculatorIds: SkyDateRangeCalculatorId[] | undefined,
  ) {
    const currentCalculatorId = this.#getValue().calculatorId;

    this.#_calculatorIds = calculatorIds ?? SKY_DEFAULT_CALCULATOR_IDS;
    this.calculators = this.#dateRangeSvc.filterCalculators(
      this.#_calculatorIds,
    );

    // If the currently selected calculator isn't available anymore,
    // select the first calculator in the new array.
    if (!this.#_calculatorIds.includes(currentCalculatorId)) {
      this.#setValue({ calculatorId: this.calculatorIds[0] });
      this.#notifyChange?.(this.#getValue());
    }
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
  public dateFormat: string | undefined;

  /**
   * Whether to disable the date range picker on template-driven forms. Don't use
   * this input on reactive forms because they may overwrite the input or leave
   * the control out of sync. To set the disabled state on reactive forms,
   * use the `FormControl` instead.
   * @default false
   */
  @Input({ transform: booleanAttribute })
  public set disabled(value: boolean) {
    if (value) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  /**
   * Whether to require users to specify a end date.
   * @deprecated Use the `required` directive or Angular's `Validators.required`
   * on the form control to mark the date range picker as required.
   */
  @Input({ transform: booleanAttribute })
  public endDateRequired = false;

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to date range picker. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   * @preview
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   * @preview
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   * @preview
   */
  @Input()
  public hintText: string | undefined;

  /**
   * The label for the date range picker.
   * @required
   */
  @Input()
  public label: string | undefined;

  /**
   * Whether the date range picker requires a value.
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  /**
   * Whether the date range picker is stacked on another form component. When specified, the appropriate
   * vertical spacing is automatically added to the date range picker.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-margin-stacked-lg')
  public stacked = false;

  /**
   * Whether to require users to specify a start date.
   * @deprecated Use the `required` directive or Angular's `Validators.required`
   * on the form control to mark the date range picker as required.
   */
  @Input({ transform: booleanAttribute })
  public startDateRequired = false;

  @HostBinding('style.display')
  protected display: string | undefined;

  protected calculators: SkyDateRangeCalculator[] = [];
  protected formGroup: FormGroup;
  protected hasErrors = false;
  protected selectedCalculator: SkyDateRangeCalculator;
  protected showEndDatePicker = false;
  protected showStartDatePicker = false;

  get #endDateControl(): AbstractControl<DateValue> {
    return this.formGroup.get('endDate') as AbstractControl<DateValue>;
  }

  get #startDateControl(): AbstractControl<DateValue> {
    return this.formGroup.get('startDate') as AbstractControl<DateValue>;
  }

  #_calculatorIds = SKY_DEFAULT_CALCULATOR_IDS;
  #control: AbstractControl | null | undefined;
  #ngUnsubscribe = new Subject<void>();
  #notifyChange: ((_: SkyDateRangeCalculation) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dateRangeSvc = inject(SkyDateRangeService);
  readonly #injector = inject(Injector);
  readonly #labelTextRequiredSvc = inject(
    SkyFormFieldLabelTextRequiredService,
    {
      optional: true,
    },
  );

  constructor() {
    this.calculators = this.#dateRangeSvc.calculators;
    this.selectedCalculator = this.calculators[0];

    const initialValue = this.#getDefaultValue(this.selectedCalculator);

    this.formGroup = inject(FormBuilder).group({
      calculatorId: new FormControl<number>(initialValue.calculatorId),
      startDate: new FormControl<DateValue>(initialValue.startDate),
      endDate: new FormControl<DateValue>(initialValue.endDate),
    });
  }

  public ngOnInit(): void {
    if (this.#labelTextRequiredSvc) {
      this.#labelTextRequiredSvc.validateLabelText(this.label);

      if (!this.label) {
        this.display = 'none';
      }
    }
  }

  public ngAfterViewInit(): void {
    this.#control = this.#injector.get(NgControl, null, {
      optional: true,
      self: true,
    })?.control;

    // Set a default value on the control if undefined on init.
    // We need to use setTimeout to avoid interfering with the first
    // validation check.
    if (!this.#control?.value) {
      setTimeout(() => {
        this.#control?.setValue(this.#getValue(), {
          emitEvent: false,
        });
      });
    }

    // Update the view when required or disabled states are changed.
    this.#control?.statusChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });

    // If the datepickers' statuses change, we want to retrigger the parent
    // control's validation so that the child errors are passed to the parent.
    merge(
      this.#startDateControl.statusChanges,
      this.#endDateControl.statusChanges,
    )
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        // Use a setTimeout to avoid an ExpressionChangedAfterChecked error,
        // since multiple calls to updateValueAndValidity in the same
        // validation cycle may collide with one another.
        setTimeout(() => {
          this.#control?.updateValueAndValidity({
            emitEvent: false,
            onlySelf: true,
          });

          // this.#changeDetector.markForCheck();
        });
      });

    this.#updatePickerVisibility(this.selectedCalculator);
  }

  /**
   * Check for touched status in ngDoCheck since Angular does not (currently)
   * have an API to respond to touched status changes from the host control.
   * @see https://github.com/angular/angular/issues/17736#issuecomment-310812368
   * TODO: Angular 18 introduces a new API to respond to these statuses.
   * @see https://github.com/angular/angular/issues/10887#issuecomment-2035267400
   */
  public ngDoCheck(): void {
    const control = this.#control;
    const touched = this.formGroup.touched;

    if (control) {
      if (control.touched && !touched) {
        this.formGroup.markAllAsTouched();
        this.#changeDetector.markForCheck();
      } else if (control.untouched && touched) {
        this.formGroup.markAsUntouched();
        this.#changeDetector.markForCheck();
      }

      this.hasErrors = !!control.errors && (control.touched || control.dirty);
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  // Implemented as part of ControlValueAccessor.
  public registerOnChange(fn: (_: unknown) => void): void {
    this.#notifyChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Implemented as part of Validator.
  public validate(control: AbstractControl): ValidationErrors | null {
    let errors: ValidationErrors | null = null;

    const calculatorErrors = this.selectedCalculator.validate(control.value);
    const startDateErrors = this.#startDateControl.errors;
    const endDateErrors = this.#endDateControl.errors;

    if (calculatorErrors) {
      errors = {
        skyDateRange: {
          calculatorId: this.#getValue().calculatorId,
          errors: calculatorErrors,
        },
      };
    }

    if (this.showStartDatePicker && startDateErrors) {
      errors ||= {};
      errors = { ...errors, ...startDateErrors };
    }

    if (this.showEndDatePicker && endDateErrors) {
      errors ||= {};
      errors = { ...errors, ...endDateErrors };
    }

    return errors;
  }

  // Implemented as part of ControlValueAccessor.
  // The date range picker always has a value, so if the consumer passes in a
  // partial value (via `patchValue`) or null, we need to update the host control's
  // value with the complete value after it's been modified.
  public writeValue(value: Partial<SkyDateRangeCalculation> | undefined): void {
    this.#patchValue(value);

    // Checks if the value is null or the calculatorId is undefined or the
    // value is incomplete (e.g. the consumer used `patchValue`).
    const doUpdateHostControl =
      !value ||
      isNullOrUndefined(value.calculatorId) ||
      !('endDate' in value) ||
      !('startDate' in value);

    if (doUpdateHostControl) {
      this.#control?.setValue(this.#getValue(), {
        emitEvent: false,
      });
    }
  }

  protected isRequired(): boolean {
    return !!(
      this.required || this.#control?.hasValidator(Validators.required)
    );
  }

  protected onBlur(): void {
    this.#notifyTouched?.();
  }

  /**
   * When chosen from the HTML select, the calculatorId comes through as a
   * string, but it needs to be a number.
   */
  protected onCalculatorIdSelectChange(evt: Event): void {
    const calculatorId = +(evt.target as HTMLSelectElement).value;
    this.#setValue({ calculatorId });
    this.#notifyChange?.(this.#getValue());
  }

  /**
   * Notify the host control when the user changes the date in the picker.
   * A setTimeout is needed because the form control's value is updated after
   * this event fires.
   */
  protected onDateChange(): void {
    setTimeout(() => {
      this.#notifyChange?.(this.#getValue());
    });
  }

  #getCalculator(calculatorId: number): SkyDateRangeCalculator {
    const found = this.calculators.find((c) => c.calculatorId === calculatorId);

    /*safety check: should not happen*/
    /*istanbul ignore if*/
    if (!found) {
      throw new Error(
        `A date range calculator with ID (${calculatorId}) could not be found.`,
      );
    }

    return found;
  }

  #getDefaultValue(
    calculator: SkyDateRangeCalculator,
  ): SkyDateRangeCalculation {
    return calculator.getValue();
  }

  #getValue(): SkyDateRangeCalculation {
    return this.formGroup.value;
  }

  #patchValue(
    partialValue: Partial<SkyDateRangeCalculation> | null | undefined,
  ): void {
    this.#setValue(
      isNullOrUndefined(partialValue)
        ? null
        : { ...this.#getValue(), ...partialValue },
    );
  }

  /**
   * Sets the value of this component's form control.
   */
  #setValue(value: SkyDateRangeCalculation | null | undefined): void {
    const oldValue = this.#getValue();

    const valueOrDefault =
      !value || isNullOrUndefined(value.calculatorId)
        ? this.#getDefaultValue(this.calculators[0])
        : {
            ...this.#getDefaultValue(this.#getCalculator(value.calculatorId)),
            ...value,
          };

    if (!areDateRangesEqual(oldValue, valueOrDefault)) {
      this.formGroup.setValue(valueOrDefault, {
        emitEvent: false,
        onlySelf: true,
      });

      this.selectedCalculator = this.#getCalculator(
        valueOrDefault.calculatorId,
      );

      if (oldValue.calculatorId !== valueOrDefault.calculatorId) {
        this.#updatePickerVisibility(this.selectedCalculator);
      }
    }
  }

  #updatePickerVisibility(calculator: SkyDateRangeCalculator): void {
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
    this.#changeDetector.markForCheck();
  }
}

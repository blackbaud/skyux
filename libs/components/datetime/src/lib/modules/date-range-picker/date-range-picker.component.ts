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
import { SkyLogService } from '@skyux/core';
import {
  SKY_FORM_ERRORS_ENABLED,
  SkyFormErrorsModule,
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

function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === undefined || value === null;
}

function isPartialValue(
  value: Partial<SkyDateRangeCalculation> | null | undefined,
): value is Partial<SkyDateRangeCalculation> | null | undefined {
  return (
    isNullOrUndefined(value) ||
    isNullOrUndefined(value.calculatorId) ||
    !('endDate' in value) ||
    !('startDate' in value)
  );
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
    SkyFormErrorsModule,
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
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
  ],
  selector: 'sky-date-range-picker',
  standalone: true,
  styleUrl: './date-range-picker.component.scss',
  templateUrl: './date-range-picker.component.html',
})
export class SkyDateRangePickerComponent
  implements AfterViewInit, ControlValueAccessor, DoCheck, OnDestroy, Validator
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
      this.#setValue(
        { calculatorId: this.calculatorIds[0] },
        { emitEvent: true },
      );
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
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   */
  @Input()
  public hintText: string | undefined;

  /**
   * The label for the date range picker.
   * @deprecated Use the `labelText` input instead.
   */
  @Input()
  public set label(value: string | undefined) {
    this.#_label = value;

    if (value) {
      this.#logger.deprecated('SkyDateRangePickerComponent.label', {
        deprecationMajorVersion: 10,
        replacementRecommendation: 'Use the `labelText` input instead.',
      });
    }
  }

  public get label(): string | undefined {
    return this.#_label;
  }

  /**
   * The text to display as the date range picker's label.
   */
  @Input()
  public labelText: string | undefined;

  /**
   * Whether the date range picker requires a value.
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  /**
   * Whether the date range picker is stacked on another form component. When specified, the appropriate
   * vertical spacing is automatically added to the date range picker.
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

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the date range picker label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application.
   */
  @Input()
  public helpKey: string | undefined;

  protected calculators: SkyDateRangeCalculator[] = [];
  protected formGroup: FormGroup;
  protected hasErrors = false;
  protected hostControl: AbstractControl | null | undefined;
  protected selectedCalculator: SkyDateRangeCalculator;
  protected showEndDatePicker = false;
  protected showStartDatePicker = false;

  get #calculatorIdControl(): AbstractControl<SkyDateRangeCalculatorId> {
    return this.formGroup.get(
      'calculatorId',
    ) as AbstractControl<SkyDateRangeCalculatorId>;
  }

  get #endDateControl(): AbstractControl<DateValue> {
    return this.formGroup.get('endDate') as AbstractControl<DateValue>;
  }

  get #startDateControl(): AbstractControl<DateValue> {
    return this.formGroup.get('startDate') as AbstractControl<DateValue>;
  }

  #_calculatorIds = SKY_DEFAULT_CALCULATOR_IDS;
  #_label: string | undefined;
  #_value: SkyDateRangeCalculation;
  #ngUnsubscribe = new Subject<void>();
  #notifyChange: ((_: SkyDateRangeCalculation) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dateRangeSvc = inject(SkyDateRangeService);
  readonly #injector = inject(Injector);
  readonly #logger = inject(SkyLogService);

  constructor() {
    this.calculators = this.#dateRangeSvc.calculators;
    this.selectedCalculator = this.calculators[0];

    const initialValue = this.#getDefaultValue(this.selectedCalculator);
    this.#_value = initialValue;

    this.formGroup = inject(FormBuilder).group({
      calculatorId: new FormControl<number>(initialValue.calculatorId),
      startDate: new FormControl<DateValue>(initialValue.startDate),
      endDate: new FormControl<DateValue>(initialValue.endDate),
    });
  }

  public ngAfterViewInit(): void {
    this.hostControl = this.#injector.get(NgControl, null, {
      optional: true,
      self: true,
    })?.control;

    // Set a default value on the control if it's undefined on init.
    // We need to use setTimeout to avoid interfering with the first
    // validation cycle.
    if (isPartialValue(this.hostControl?.value)) {
      setTimeout(() => {
        this.hostControl?.setValue(this.#getValue(), {
          emitEvent: false,
          onlySelf: true,
        });
      });
    }

    // Update the view when "required" or "disabled" states are changed on the
    // host control.
    this.hostControl?.statusChanges
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });

    // Start listening for changes after the first change detection cycle.
    setTimeout(() => {
      this.formGroup.valueChanges
        .pipe(
          distinctUntilChanged(areDateRangesEqual),
          takeUntil(this.#ngUnsubscribe),
        )
        .subscribe((value) => {
          if (!isNullOrUndefined(value?.calculatorId)) {
            // The select element sets the calculator ID to a string, but we
            // need it to be a number.
            value.calculatorId = +value.calculatorId;

            // If the calculator ID is changed, we need to reset the start and
            // end date values and wait until the next valueChanges event to
            // notify the host control.
            if (value.calculatorId !== this.#getValue().calculatorId) {
              this.#setValue(
                { calculatorId: value.calculatorId },
                { emitEvent: true },
              );

              return;
            }
          }

          this.#setValue(value, { emitEvent: false });
          const newValue = this.#getValue();

          // Update the host control if the value is different.
          if (!areDateRangesEqual(this.hostControl?.value, newValue)) {
            this.#notifyChange?.(newValue);
          }
        });
    });

    // If the datepickers' statuses change, we want to retrigger the host
    // control's validation so that their errors are reflected back to the host.
    merge(
      this.#startDateControl.statusChanges,
      this.#endDateControl.statusChanges,
    )
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        // Use a setTimeout to avoid an ExpressionChangedAfterChecked error,
        // since multiple calls to updateValueAndValidity in the same
        // cycle may collide with one another.
        setTimeout(() => {
          this.hostControl?.updateValueAndValidity({
            emitEvent: false,
            onlySelf: true,
          });
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
    const control = this.hostControl;
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

    // Set errors on the calculator select so that they appear beneath it.
    this.#calculatorIdControl.setErrors(errors);
    this.#changeDetector.markForCheck();

    return errors;
  }

  // Implemented as part of ControlValueAccessor.
  // The date range picker always has a value, so if the consumer passes in a
  // partial value (via `patchValue`) or null, we need to update the host control's
  // value with the complete value after it's been modified.
  public writeValue(value: Partial<SkyDateRangeCalculation> | undefined): void {
    this.#patchValue(value);

    // Update the host control if it is set to a partial or null value.
    if (isPartialValue(value)) {
      this.hostControl?.setValue(this.#getValue(), {
        emitEvent: false,
        onlySelf: true,
      });
    }
  }

  protected isRequired(): boolean {
    return !!(
      this.required || this.hostControl?.hasValidator(Validators.required)
    );
  }

  protected onBlur(): void {
    this.#notifyTouched?.();
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
    return this.#_value;
  }

  #patchValue(
    partialValue: Partial<SkyDateRangeCalculation> | null | undefined,
  ): void {
    this.#setValue(
      isNullOrUndefined(partialValue)
        ? null
        : { ...this.#getValue(), ...partialValue },
      { emitEvent: true },
    );
  }

  /**
   * Sets the value to be used by the date range picker form control.
   */
  #setValue(
    value: SkyDateRangeCalculation | null | undefined,
    options: { emitEvent: boolean },
  ): void {
    const oldValue = this.#getValue();

    const valueOrDefault =
      !value || isNullOrUndefined(value.calculatorId)
        ? this.#getDefaultValue(this.calculators[0])
        : {
            ...this.#getDefaultValue(this.#getCalculator(value.calculatorId)),
            ...value,
          };

    // Ensure falsy values are set to null.
    valueOrDefault.endDate = valueOrDefault.endDate || null;
    valueOrDefault.startDate = valueOrDefault.startDate || null;

    if (!areDateRangesEqual(oldValue, valueOrDefault)) {
      this.#_value = valueOrDefault;

      this.selectedCalculator = this.#getCalculator(
        valueOrDefault.calculatorId,
      );

      if (oldValue.calculatorId !== valueOrDefault.calculatorId) {
        this.#updatePickerVisibility(this.selectedCalculator);
      }

      if (options?.emitEvent) {
        this.formGroup.patchValue(valueOrDefault);
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

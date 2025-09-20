import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  Signal,
  TemplateRef,
  booleanAttribute,
  computed,
  inject,
  runInInjectionContext,
  signal,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  StatusChangeEvent,
  TouchedChangeEvent,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SkyLogService } from '@skyux/core';
import {
  SKY_FORM_ERRORS_ENABLED,
  SkyFormErrorsModule,
  SkyInputBoxModule,
} from '@skyux/forms';

import { distinctUntilChanged, filter, map } from 'rxjs';

import { SkyDatepickerComponent } from '../datepicker/datepicker.component';
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
  host: {
    '(focusout)': 'onFocusout($event)',
  },
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
  styleUrl: './date-range-picker.component.scss',
  templateUrl: './date-range-picker.component.html',
})
export class SkyDateRangePickerComponent
  implements AfterViewInit, ControlValueAccessor, Validator
{
  readonly #dateRangeSvc = inject(SkyDateRangeService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #elementRef = inject(ElementRef);
  readonly #injector = inject(Injector);
  readonly #logger = inject(SkyLogService);

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
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to date range picker. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `labelText` is also specified.
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
   * Whether the date range picker is stacked on another form component. When specified, the appropriate
   * vertical spacing is automatically added to the date range picker.
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-form-field-stacked')
  public stacked = false;

  /**
   * A help key that identifies the global help content to display. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the date range picker label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  protected calculators = this.#dateRangeSvc.calculators;
  protected datepickers = viewChildren(SkyDatepickerComponent);
  protected hostControl: AbstractControl | null | undefined;
  protected selectedCalculator = this.calculators[0];
  protected showEndDatePicker = signal<boolean>(false);
  protected showStartDatePicker = signal<boolean>(false);

  #_calculatorIds = SKY_DEFAULT_CALCULATOR_IDS;
  #_label: string | undefined;
  #_value = this.selectedCalculator.getValue();

  #hostHasCustomError: Signal<boolean | undefined> | undefined;
  #notifyChange: ((_: SkyDateRangeCalculation) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  #calculatorIdControl = new FormControl<number>(
    this.#getValue().calculatorId,
    { nonNullable: true },
  );
  #calculatorIdInvalid = this.#createStatusChangeSignal(
    this.#calculatorIdControl,
  );
  #calculatorIdTouched = this.#createTouchedChangeSignal(
    this.#calculatorIdControl,
  );

  #endDateControl = new FormControl<DateValue>(this.#getValue().endDate);
  #endDateInvalid = this.#createStatusChangeSignal(this.#endDateControl);
  #endDateTouched = this.#createTouchedChangeSignal(this.#endDateControl);

  #startDateControl = new FormControl<DateValue>(this.#getValue().startDate);
  #startDateInvalid = this.#createStatusChangeSignal(this.#startDateControl);
  #startDateTouched = this.#createTouchedChangeSignal(this.#startDateControl);

  protected formGroup = inject(FormBuilder).group({
    calculatorId: this.#calculatorIdControl,
    startDate: this.#startDateControl,
    endDate: this.#endDateControl,
  });

  protected readonly calculatorIdHasErrors = computed(() => {
    const touched = this.#calculatorIdTouched();
    const invalid = this.#calculatorIdInvalid() || this.#hostHasCustomError?.();
    return touched && invalid;
  });

  protected readonly endDateHasErrors = computed(() => {
    const calculatorIdHasErrors = this.calculatorIdHasErrors();
    const touched = this.#endDateTouched();
    const invalid = this.#endDateInvalid();

    return calculatorIdHasErrors || (touched && invalid);
  });

  protected readonly startDateHasErrors = computed(() => {
    const calculatorIdHasErrors = this.calculatorIdHasErrors();
    const touched = this.#startDateTouched();
    const invalid = this.#startDateInvalid();

    return calculatorIdHasErrors || (touched && invalid);
  });

  public ngAfterViewInit(): void {
    this.hostControl = this.#injector.get(NgControl, null, {
      optional: true,
      self: true,
    })?.control;

    runInInjectionContext(this.#injector, () => {
      if (this.hostControl) {
        this.#hostHasCustomError = this.#createHostCustomErrorChangeSignal(
          this.hostControl,
        );
      }
    });

    // Set a default value on the control if it's undefined on init.
    // We need to use setTimeout to avoid interfering with the first
    // validation cycle.
    if (isPartialValue(this.hostControl?.value)) {
      setTimeout(() => {
        this.hostControl?.setValue(this.#getValue(), {
          emitEvent: false,
        });
      });
    }

    // If the datepickers' statuses change, we want to retrigger the host
    // control's validation so that their errors are reflected back to the host.
    this.formGroup.events
      .pipe(
        filter((evt) => evt instanceof StatusChangeEvent),
        map((evt: StatusChangeEvent) => evt.status),
        distinctUntilChanged(),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.hostControl?.updateValueAndValidity({
          emitEvent: false,
          onlySelf: true,
        });
      });

    // Mark all fields as touched if the host control is touched.
    this.hostControl?.events
      .pipe(
        filter((evt) => evt instanceof TouchedChangeEvent),
        map((evt: TouchedChangeEvent) => evt.touched),
        distinctUntilChanged(),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.formGroup.markAllAsTouched();
      });
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

    // Set calculator errors on the select so that they appear beneath it.
    this.#calculatorIdControl.setErrors(errors);

    if (this.showStartDatePicker() && startDateErrors) {
      errors ||= {};
      errors = { ...errors, ...startDateErrors };
    }

    if (this.showEndDatePicker() && endDateErrors) {
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

    // Update the host control if it is set to a partial or null value.
    if (isPartialValue(value)) {
      this.hostControl?.setValue(this.#getValue(), {
        emitEvent: false,
        onlySelf: true,
      });
    }
  }

  /**
   * Fires when a user changes the selected calculator ID.
   */
  protected onCalculatorIdChange(): void {
    // Reset the value when the calculator ID changes.
    this.#setValue({ calculatorId: +this.#calculatorIdControl.value });
    this.onDateChange();
  }

  /**
   * Fires when a user interacts with a date range picker.
   */
  protected onDateChange(): void {
    // Wait until the form control is updated before retrieving its value.
    setTimeout(() => {
      this.#notifyChange?.(
        this.formGroup.getRawValue() as SkyDateRangeCalculation,
      );
    });
  }

  /**
   * Fires when the date range picker loses focus.
   */
  protected onFocusout({ relatedTarget }: FocusEvent): void {
    if (
      relatedTarget &&
      !this.#elementRef.nativeElement.contains(relatedTarget) &&
      !this.datepickers().some((picker) => picker.containsTarget(relatedTarget))
    ) {
      this.#notifyTouched?.();
    }
  }

  #getCalculator(calculatorId: number): SkyDateRangeCalculator {
    const found = this.calculators.find((c) => c.calculatorId === calculatorId);

    /*istanbul ignore if: safety check*/
    if (!found) {
      throw new Error(
        `A date range calculator with ID (${calculatorId}) could not be found.`,
      );
    }

    return found;
  }

  #getValue(): SkyDateRangeCalculation {
    // Important! Return a clone to avoid changing the properties by reference.
    return { ...this.#_value };
  }

  #patchValue(
    partialValue: Partial<SkyDateRangeCalculation> | null | undefined,
  ): void {
    if (isNullOrUndefined(partialValue)) {
      this.#setValue(null);
      return;
    }

    const oldValue = this.#getValue();

    // If the new ID is distinct, erase the old start and end dates because
    // they're no longer applicable.
    if (
      !isNullOrUndefined(partialValue.calculatorId) &&
      oldValue.calculatorId !== partialValue.calculatorId
    ) {
      delete oldValue.endDate;
      delete oldValue.startDate;
    }

    const value = {
      ...oldValue,
      ...partialValue,
    };

    this.#setValue(value);
  }

  /**
   * Sets the value to be used by the date range picker form control.
   */
  #setValue(value: SkyDateRangeCalculation | null | undefined): void {
    const oldValue = this.#getValue();

    const isValueEmpty = !value || isNullOrUndefined(value.calculatorId);
    const valueOrDefault = isValueEmpty
      ? this.calculators[0].getValue()
      : {
          ...this.#getCalculator(value.calculatorId).getValue(),
          ...value,
        };

    // Ensure falsy values are set to null.
    valueOrDefault.endDate = valueOrDefault.endDate || null;
    valueOrDefault.startDate = valueOrDefault.startDate || null;

    if (!areDateRangesEqual(oldValue, valueOrDefault)) {
      this.#_value = valueOrDefault;

      if (oldValue.calculatorId !== valueOrDefault.calculatorId) {
        this.selectedCalculator = this.#getCalculator(
          valueOrDefault.calculatorId,
        );

        this.#updatePickerVisibility(this.selectedCalculator);
      }

      this.formGroup.patchValue(valueOrDefault);
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

    this.showEndDatePicker.set(showEndDatePicker);
    this.showStartDatePicker.set(showStartDatePicker);
  }

  #createHostCustomErrorChangeSignal(
    control: AbstractControl,
  ): Signal<boolean | undefined> {
    return toSignal(
      control.events.pipe(
        filter((evt) => evt instanceof StatusChangeEvent),
        map((evt: StatusChangeEvent) => {
          const errors = evt.source.errors ?? [];
          const knownErrors = ['required', 'skyDate'];

          return Object.keys(errors).some((error) => {
            return !knownErrors.includes(error);
          });
        }),
      ),
    );
  }

  #createStatusChangeSignal(control: FormControl): Signal<boolean | undefined> {
    return toSignal(
      control.events.pipe(
        filter((evt) => evt instanceof StatusChangeEvent),
        map((evt: StatusChangeEvent) => evt.status === 'INVALID'),
        takeUntilDestroyed(this.#destroyRef),
      ),
    );
  }

  #createTouchedChangeSignal(
    control: FormControl,
  ): Signal<boolean | undefined> {
    return toSignal(
      control.events.pipe(
        filter((evt) => evt instanceof TouchedChangeEvent),
        map((evt: TouchedChangeEvent) => evt.touched),
        takeUntilDestroyed(this.#destroyRef),
      ),
    );
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  DoCheck,
  HostBinding,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  forwardRef,
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
  NgModel,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  SkyFormFieldLabelTextRequiredService,
  SkyInputBoxModule,
} from '@skyux/forms';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import {
  Subject,
  combineLatest,
  distinctUntilChanged,
  forkJoin,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { SkyDateFormatter } from '../datepicker/date-formatter';
import { SkyDatepickerModule } from '../datepicker/datepicker.module';
import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangePickerEndDateResourceKeyPipe } from './date-range-picker-end-date-resource-key.pipe';
import { SkyDateRangePickerStartDateResourceKeyPipe } from './date-range-picker-start-date-resource-key.pipe';
import { SkyDateRangePickerService } from './date-range-picker.service';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';
import { SKY_DEFAULT_CALCULATOR_CONFIGS } from './types/date-range-default-calculator-configs';

const DEFAULT_CALCULATOR_IDS: SkyDateRangeCalculatorId[] = [
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
  template: `<div
    class="sky-date-range-picker"
    [formGroup]="formGroup"
    (focusout)="onBlur()"
  >
    <div
      class="sky-date-range-picker-form-group"
      [ngClass]="{
        'sky-date-range-picker-last-input':
          !showStartDatePicker && !showEndDatePicker
      }"
    >
      <sky-input-box
        [hasErrors]="hasErrors"
        [helpPopoverContent]="helpPopoverContent"
        [helpPopoverTitle]="helpPopoverTitle"
        [hintText]="hintText"
        [labelText]="
          label || ('skyux_date_range_picker_default_label' | skyLibResources)
        "
      >
        <select formControlName="calculatorId" [required]="isRequired()">
          <option
            *ngFor="let calculator of calculators"
            [value]="calculator.calculatorId"
          >
            <ng-container
              *ngIf="
                calculator.shortDescriptionResourceKey;
                else shortDescription
              "
              >{{
                calculator.shortDescriptionResourceKey | skyLibResources
              }}</ng-container
            >
            <ng-template #shortDescription>{{
              calculator.shortDescription
            }}</ng-template>
          </option>
        </select>
      </sky-input-box>
    </div>
    <div
      class="sky-date-range-picker-form-group"
      [hidden]="!showStartDatePicker"
      [ngClass]="{
        'sky-date-range-picker-last-input':
          showStartDatePicker && !showEndDatePicker
      }"
    >
      <sky-input-box
        [hasErrors]="hasErrors"
        [labelText]="
          selectedCalculator.type
            | skyDateRangePickerStartDateResourceKey
            | skyLibResources
        "
      >
        <sky-datepicker>
          <input
            formControlName="startDate"
            skyDatepickerInput
            type="text"
            [attr.aria-label]="
              label
                ? ('skyux_date_range_picker_default_aria_label'
                  | skyLibResources
                    : (selectedCalculator.type
                        | skyDateRangePickerStartDateResourceKey
                        | skyLibResources)
                    : label)
                : (selectedCalculator.type
                  | skyDateRangePickerStartDateResourceKey
                  | skyLibResources)
            "
            [dateFormat]="dateFormat"
            [required]="isRequired()"
          />
        </sky-datepicker>
      </sky-input-box>
    </div>
    <div
      class="sky-date-range-picker-form-group"
      [hidden]="!showEndDatePicker"
      [ngClass]="{ 'sky-date-range-picker-last-input': showEndDatePicker }"
    >
      <sky-input-box
        [hasErrors]="hasErrors"
        [labelText]="
          selectedCalculator.type
            | skyDateRangePickerEndDateResourceKey
            | skyLibResources
        "
      >
        <sky-datepicker>
          <input
            formControlName="endDate"
            skyDatepickerInput
            type="text"
            [attr.aria-label]="
              label
                ? ('skyux_date_range_picker_default_aria_label'
                  | skyLibResources
                    : (selectedCalculator.type
                        | skyDateRangePickerEndDateResourceKey
                        | skyLibResources)
                    : label)
                : (selectedCalculator.type
                  | skyDateRangePickerEndDateResourceKey
                  | skyLibResources)
            "
            [dateFormat]="dateFormat"
            [required]="isRequired()"
          />
        </sky-datepicker>
      </sky-input-box>
    </div>
  </div>`,
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
  public set calculatorIds(value: SkyDateRangeCalculatorId[] | undefined) {
    console.log('set calculatorIds', value);
    this.#_calculatorIds = value ?? DEFAULT_CALCULATOR_IDS;

    this.calculators = this.#dateRangeSvc.filterCalculators(
      this.#_calculatorIds,
    );

    if (!this.#_calculatorIds.includes(this.value.calculatorId)) {
      this.value = this.#getDefaultValue();
      this.#updatePickerVisibility();
      this.#notifyChange?.(this.value);
    }
  }

  public get calculatorIds(): SkyDateRangeCalculatorId[] {
    return this.#_calculatorIds;
  }

  /**
   * The date format for
   * [the `sky-datepicker` components](https://developer.blackbaud.com/skyux/components/datepicker)
   * that make up the date range picker.
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
  public disabled = false;

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

  @HostBinding('style.display')
  protected display: string | undefined;

  // @ViewChild('startDateControl', { read: NgModel })
  // protected startDateControl: NgModel | undefined;

  // @ViewChild('endDateControl', { read: NgModel })
  // protected endDateControl: NgModel | undefined;

  // protected get hasErrors(): boolean {
  //   return !!(
  //     this.#control?.errors &&
  //     (this.#control?.touched || this.#control?.dirty)
  //   );
  // }

  protected set value(value: SkyDateRangeCalculation | null | undefined) {
    this.#_value = value ?? this.#getDefaultValue();
    this.selectedCalculator = this.#getSelectedCalculator();

    this.#_value.endDate ||= null;
    this.#_value.startDate ||= null;

    if (!value) {
      this.#setDefaultValueOnControl();
    }
  }

  protected get value(): SkyDateRangeCalculation {
    return this.#_value;
  }

  protected calculators: SkyDateRangeCalculator[] = [];
  protected formGroup: FormGroup;
  protected hasErrors = false;
  protected selectedCalculator: SkyDateRangeCalculator;
  protected showEndDatePicker = false;
  protected showStartDatePicker = false;

  #_calculatorIds = DEFAULT_CALCULATOR_IDS;
  #_value: SkyDateRangeCalculation;
  #control: AbstractControl | undefined;
  #isInitialized = false;
  #ngUnsubscribe = new Subject<void>();
  #notifyChange: ((_: SkyDateRangeCalculation) => void) | undefined;
  #notifyTouched: (() => void) | undefined;
  #notifyValidatorChange: (() => void) | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dateRangeSvc = inject(SkyDateRangePickerService);
  readonly #labelTextRequiredSvc = inject(
    SkyFormFieldLabelTextRequiredService,
    {
      optional: true,
    },
  );

  constructor() {
    this.calculators = this.#dateRangeSvc.calculators;
    this.selectedCalculator = this.calculators[0];
    this.#_value = this.#getDefaultValue();

    this.formGroup = inject(FormBuilder).group({
      calculatorId: new FormControl(this.value.calculatorId),
      endDate: new FormControl<Date | undefined>(undefined),
      startDate: new FormControl<Date | undefined>(undefined),
    });

    // const ngZone = inject(NgZone);

    this.formGroup.valueChanges.subscribe((value) => {
      console.log('formGroup value change', value);
      this.#control?.setValue(value, { emitEvent: false });
    });

    this.formGroup.statusChanges.subscribe((status) => {
      console.log('formGroup status change', status, this.#control?.status);

      // If child fields' statuses change, we want to retrigger the parent control's validation so that the child errors are passed to the parent.
      // Use a setTimeout to avoid an ExpressionChangedAfterChecked error, since the calls to updateValueAndValidity may collide with one another.
      setTimeout(() => {
        this.#notifyValidatorChange?.();
        // this.#control?.updateValueAndValidity({
        //   onlySelf: true,
        //   emitEvent: false,
        // });
      });
      // }

      // this.#changeDetector.markForCheck();

      // yield to current tick's validation change before triggering validation again. ?keep
      // setTimeout(() => {
      // this.#notifyValidatorChange?.();
      // this.#control?.updateValueAndValidity({
      //   onlySelf: true,
      //   emitEvent: false,
      // });
      // });

      // this.formGroup.updateValueAndValidity({
      //   onlySelf: true,
      //   emitEvent: false,
      // });
    });

    // this.formGroup.valueChanges.subscribe((x) => {
    //   console.log('formGroup value changes:', x);
    // });

    // this.formGroup.get('startDate')?.statusChanges.subscribe((x) => {
    //   console.log('start date status:', x);
    // });
  }

  public ngAfterViewInit(): void {
    console.log('ngAfterViewInit()');

    if (this.#labelTextRequiredSvc) {
      this.#labelTextRequiredSvc.validateLabelText(this.label);

      if (!this.label) {
        this.display = 'none';
      }
    }

    this.#control?.valueChanges.subscribe((value) => {
      console.log('#control value change', value);
    });

    this.#control?.statusChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((x) => {
        console.log('#control status change', x);
        // Needed to show required states.
        this.#changeDetector.markForCheck();
      });

    // this.endDateControl?.statusChanges?.subscribe((x) => {
    //   console.log('endDateControl.statusChanges', x);
    // });

    // this.startDateControl?.statusChanges?.subscribe((x) => {
    //   console.log('startDateControl.statusChanges', x);
    // });

    this.#isInitialized = true;
    this.#updatePickerVisibility();
  }

  // We have to do this so we can respond to the parent control being marked as dirty/touched.
  // @see https://github.com/angular/angular/issues/17736#issuecomment-310812368
  // TODO: Angular 18 will introduce a new API to respond to status changes.
  // @see https://github.com/angular/angular/issues/10887#issuecomment-2035267400
  public ngDoCheck(): void {
    console.log('ngDoCheck()');

    const touched = this.formGroup.touched;
    if (this.#control?.touched && !touched) {
      this.formGroup.markAllAsTouched();
      this.#changeDetector.markForCheck();
    } else if (this.#control?.untouched && touched) {
      this.formGroup.markAsUntouched();
      this.#changeDetector.markForCheck();
    }

    this.hasErrors =
      !!this.#control?.errors &&
      (this.#control?.touched || this.#control?.dirty);
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

  // Implemented as part of Validator.
  public registerOnValidatorChange(fn: () => void): void {
    this.#notifyValidatorChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Implemented as part of Validator.
  public validate(control: AbstractControl): ValidationErrors | null {
    this.#control ||= control;

    // Set a default value on init.
    // This is the first time we can safely set the control's default value
    // if it's undefined to avoid changed after checked error or the circular DI error.
    if (!this.#isInitialized && !control.value) {
      this.#setDefaultValueOnControl();
      return null;
    }

    const value = this.value;
    const result = this.selectedCalculator.validate(control.value);

    console.log(
      'validate',
      result,
      this.formGroup.get('startDate')?.errors,
      this.formGroup.get('endDate')?.errors,
    );

    return {
      ...(result
        ? {
            skyDateRange: {
              calculatorId: value.calculatorId,
              errors: result,
            },
          }
        : {}),
      ...(this.formGroup.get('startDate')?.errors ?? {}),
      ...(this.formGroup.get('endDate')?.errors ?? {}),
    };
  }

  // Implemented as part of ControlValueAccessor.
  public writeValue(value: SkyDateRangeCalculation | undefined): void {
    console.log('writeValue()', value);

    const oldValue = this.value;

    this.value = value;

    // TODO: Why am I doing this?
    this.formGroup.setValue(this.value, { emitEvent: false });

    if (oldValue !== value) {
      this.#updatePickerVisibility();
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

  // TODO: why not do this stuff in the valueChange event?
  // protected onCalculatorChange(evt: Event): void {
  //   this.value = {
  //     calculatorId: +(evt.target as HTMLSelectElement).value,
  //   };

  //   console.log('onCalculatorChange()');
  //   this.selectedCalculator = this.#getSelectedCalculator();
  //   this.#updatePickerVisibility();
  //   this.#control?.updateValueAndValidity();
  // }

  // protected onDatepickerBlur(): void {
  //   // this.#control?.updateValueAndValidity();
  // }

  // TODO: why not do this stuff in the valueChange event?
  // protected onEndDateChange(change: Date | undefined): void {
  //   console.log('onEndDateChange()');
  //   this.value.endDate = change;
  //   this.#notifyValidatorChange?.();
  // }

  // // TODO: why not do this stuff in the valueChange event?
  // protected onStartDateChange(change: Date | undefined): void {
  //   console.log('onStartDateChange()');
  //   this.value.startDate = change;
  //   this.#notifyValidatorChange?.();
  // }

  #getDefaultValue(): SkyDateRangeCalculation {
    return {
      calculatorId: this.calculatorIds[0],
    };
  }

  #getSelectedCalculator(): SkyDateRangeCalculator {
    const found = this.calculators.find(
      (c) => c.calculatorId === this.value.calculatorId,
    );

    /*safety check: should not happen*/
    /*istanbul ignore if*/
    if (!found) {
      throw new Error(
        'A selected date range calculator could not be determined.',
      );
    }

    return found;
  }

  #setDefaultValueOnControl(): void {
    this.#control?.setValue(this.value, { emitEvent: false, onlySelf: true });
  }

  #updatePickerVisibility(): void {
    if (this.#isInitialized) {
      let showEndDatePicker = false;
      let showStartDatePicker = false;

      switch (this.selectedCalculator.type) {
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
    }
  }
}

/**
 * TODO:
 * - reset validators when calculators change.
 * - respond to date pickers errors.
 * - setting a value programmatically makes all three fields fire change events.
 * - show error styles: what determines hasErrors?
 *
 *
 */

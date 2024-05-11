/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  HostBinding,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  booleanAttribute,
  forwardRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangePickerService } from './date-range-picker.service';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
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
  styles: `
    :host {
      display: block;
    }
  `,
  template: `<div class="sky-date-range-picker" (focusout)="onBlur()">
    <div class="sky-date-range-picker-form-group">
      <sky-input-box
        [helpPopoverContent]="helpPopoverContent"
        [helpPopoverTitle]="helpPopoverTitle"
        [hintText]="hintText"
        [labelText]="
          label || ('skyux_date_range_picker_default_label' | skyLibResources)
        "
      >
        <select
          [disabled]="disabled"
          [required]="isRequired()"
          [(ngModel)]="value.calculatorId"
          (change)="onCalculatorSelected()"
        >
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
    <div class="sky-date-range-picker-form-group"></div>
    <div class="sky-date-range-picker-form-group"></div>
  </div>`,
})
export class SkyDateRangePickerComponent
  implements AfterViewInit, ControlValueAccessor, OnInit, Validator
{
  @Input()
  public set calculatorIds(value: SkyDateRangeCalculatorId[] | undefined) {
    this.#_calculatorIds = value ?? DEFAULT_CALCULATOR_IDS;
    // this.calculators = this.#dateRangeSvc.filterCalculators(
    //   this.#_calculatorIds,
    // );
    // this.value = this.#getDefaultValue();
    // this.#changeDetector.markForCheck();
  }

  public get calculatorIds(): SkyDateRangeCalculatorId[] {
    return this.#_calculatorIds;
  }

  @Input({ transform: booleanAttribute })
  public disabled = false;

  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  @Input()
  public helpPopoverTitle: string | undefined;

  @Input()
  public hintText: string | undefined;

  @Input()
  public label: string | undefined;

  @Input({ transform: booleanAttribute })
  public required = false;

  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-margin-stacked-lg')
  public stacked = false;

  protected set value(value: SkyDateRangeCalculation | null | undefined) {
    this.#_value = value ?? this.#getDefaultValue();

    if (!value) {
      console.log('set default value in setter');
      this.#setDefaultValue();
    }
  }

  protected get value(): SkyDateRangeCalculation {
    return this.#_value;
  }

  protected calculators: SkyDateRangeCalculator[] = [];

  #_calculatorIds = DEFAULT_CALCULATOR_IDS;
  #_value: SkyDateRangeCalculation;
  #isInitialized = false;
  #notifyChange: ((_: SkyDateRangeCalculation) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dateRangeSvc = inject(SkyDateRangePickerService);

  #control: AbstractControl | undefined;

  constructor() {
    this.#_value = this.#getDefaultValue();
    this.calculators = this.#dateRangeSvc.calculators;
  }

  public ngOnInit(): void {
    console.log('ngOnInit()');
  }

  public ngAfterViewInit(): void {
    this.#isInitialized = true;

    this.#control?.statusChanges.subscribe(() => {
      this.#changeDetector.markForCheck();
    });
  }

  // TODO: how to set the default value of the control on init?
  // Should we be doing that?
  // What if we set the default only if it's undefined when the form is submitted?
  // How is Paul doing it for UIModel?
  // writeValue is getting called twice when the value changes. Why?

  public registerOnChange(fn: (_: unknown) => void): void {
    this.#notifyChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    console.log('validate()');

    this.#control ||= control;

    // Set a default value on init.
    if (!this.#isInitialized && !control.value) {
      console.log('set default value on init');
      this.#setDefaultValue();
      return null;
    }

    return null;
  }

  public writeValue(value: SkyDateRangeCalculation | undefined): void {
    console.log('writeValue() value/control:', value, this.#control);
    this.value = value;

    // this.#changeDetector.markForCheck();
  }

  protected isRequired(): boolean {
    return !!(
      this.required || this.#control?.hasValidator(Validators.required)
    );
  }

  protected onBlur(): void {
    this.#notifyTouched?.();
  }

  protected onCalculatorSelected(): void {
    console.log('onCalculatorSelected()');
    const value = this.value;
    value.calculatorId = +value.calculatorId;

    this.#notifyChange?.(value);
  }

  #getDefaultValue(): SkyDateRangeCalculation {
    return {
      calculatorId: this.calculatorIds[0],
    };
  }

  #setDefaultValue(): void {
    this.#control?.setValue(this.value, { emitEvent: false, onlySelf: true });
  }

  // async #updateCalculators(): Promise<void> {
  //   this.calculators = await this.#dateRangeSvc.getCalculators(
  //     this.calculatorIds,
  //   );

  //   this.#changeDetector.markForCheck();
  // }
}

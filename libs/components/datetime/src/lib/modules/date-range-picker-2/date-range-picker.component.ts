/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  booleanAttribute,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';

const DEFAULT_CALCULATORS: SkyDateRangeCalculatorId[] = [
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
  template: `<div class="sky-date-range-picker" (focusout)="onBlur()">
    <div class="sky-date-range-picker-form-group">
      <sky-input-box
        [labelText]="
          label || ('skyux_date_range_picker_default_label' | skyLibResources)
        "
      >
        <select
          [disabled]="disabled"
          [required]="isRequired()"
          [(ngModel)]="model.calculatorId"
          (change)="onCalculatorSelected()"
        >
          <option
            *ngFor="let calculator of calculators"
            [value]="calculator.calculatorId"
          >
            {{ calculator.shortDescription }}
          </option>
        </select>
      </sky-input-box>
    </div>
    <div class="sky-date-range-picker-form-group"></div>
    <div class="sky-date-range-picker-form-group"></div>
  </div>`,
})
export class SkyDateRangePickerComponent
  implements ControlValueAccessor, OnInit, Validator
{
  @Input()
  public set calculatorIds(value: SkyDateRangeCalculatorId[] | undefined) {
    this.#_calculatorIds = value ?? DEFAULT_CALCULATORS;
    this.#updateCalculators();
  }

  public get calculatorIds(): SkyDateRangeCalculatorId[] {
    return this.#_calculatorIds;
  }

  @Input({ transform: booleanAttribute })
  public disabled = false;

  @Input()
  public label: string | undefined;

  @Input({ transform: booleanAttribute })
  public required = false;

  protected calculators: SkyDateRangeCalculator[] = [];
  protected model: SkyDateRangeCalculation;

  #_calculatorIds = DEFAULT_CALCULATORS;
  #control: AbstractControl | undefined;
  #notifyChange: ((_: SkyDateRangeCalculation) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  readonly #dateRangeSvc = inject(SkyDateRangeService);

  constructor() {
    this.model = {
      calculatorId: this.calculatorIds[0],
    };
  }

  public async ngOnInit(): Promise<void> {
    await this.#updateCalculators();

    if (!this.#control?.value) {
      this.#control?.setValue(this.model, { emitEvent: false });
    }
  }

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
    this.#control ||= control;

    return null;
  }

  public writeValue(value: SkyDateRangeCalculation | undefined): void {
    // Only update the model if the value is defined.
    if (value) {
      // Update the model.
      this.model = value;
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

  protected onCalculatorSelected(): void {
    this.model.calculatorId = +this.model.calculatorId;
    this.#notifyChange?.(this.model);
  }

  async #updateCalculators(): Promise<void> {
    this.calculators = await this.#dateRangeSvc.getCalculators(
      this.calculatorIds,
    );
  }
}

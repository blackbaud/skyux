import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculator,
  SkyDateRangeCalculatorId,
  SkyDateRangeCalculatorType,
  SkyDateRangePickerModule,
  SkyDateRangeService,
} from '@skyux/datetime';

/**
 * @title Date range picker with custom calculator
 */
@Component({
  selector: 'app-datetime-date-range-picker-custom-calculator-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDateRangePickerModule,
  ],
})
export class DatetimeDateRangePickerCustomCalculatorExampleComponent {
  readonly #dateRangeSvc = inject(SkyDateRangeService);

  protected customCalculators: SkyDateRangeCalculatorId[] | undefined;
  protected disabled = false;
  protected hintText =
    'Donations received today are updated at the top of each hour.';
  protected labelText = 'Last donation';

  protected lastDonation = new FormControl<SkyDateRangeCalculation>(
    {
      value: {
        calculatorId: SkyDateRangeCalculatorId.AnyTime,
      },
      disabled: this.disabled,
    },
    { nonNullable: true },
  );

  protected formGroup = inject(FormBuilder).group({
    lastDonation: this.lastDonation,
  });

  protected selectedCalculator = signal<SkyDateRangeCalculator | undefined>(
    this.#getCalculatorById(SkyDateRangeCalculatorId.AnyTime),
  );

  constructor() {
    const since1999Calculator = this.#dateRangeSvc.createCalculator({
      shortDescription: 'Since 1999',
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => {
        return {
          startDate: new Date('1/1/1999'),
          endDate: new Date(),
        };
      },
    });

    const dateBeforeToday = this.#dateRangeSvc.createCalculator({
      shortDescription: 'Date before today',
      type: SkyDateRangeCalculatorType.Before,
      validate: (value): ValidationErrors | null => {
        if (value?.endDate && value.endDate > new Date()) {
          return {
            dateIsAfterToday: true,
          };
        }

        return null;
      },
      getValue: () => {
        return {
          endDate: new Date(),
        };
      },
    });

    this.customCalculators = [
      SkyDateRangeCalculatorId.SpecificRange,
      SkyDateRangeCalculatorId.LastFiscalYear,
      since1999Calculator.calculatorId,
      dateBeforeToday.calculatorId,
      SkyDateRangeCalculatorId.AnyTime,
    ];

    this.lastDonation.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const selectedCalculator = this.#getCalculatorById(value?.calculatorId);

        this.selectedCalculator.set(selectedCalculator);
      });
  }

  #getCalculatorById(id: SkyDateRangeCalculatorId): SkyDateRangeCalculator {
    return this.#dateRangeSvc.filterCalculators([id])[0];
  }
}

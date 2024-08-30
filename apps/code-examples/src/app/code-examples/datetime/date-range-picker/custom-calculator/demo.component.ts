import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyDateRangeCalculatorId,
  SkyDateRangeCalculatorType,
  SkyDateRangePickerModule,
  SkyDateRangeService,
} from '@skyux/datetime';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyDateRangePickerModule],
})
export class DemoComponent {
  protected customCalculators: SkyDateRangeCalculatorId[] | undefined;
  protected dateFormat: string | undefined;
  protected disabled = false;
  protected formGroup: FormGroup;
  protected lastDonation: FormControl;
  protected hintText =
    'Donations received today are updated at the top of each hour.';
  protected labelText = 'Last donation';
  protected required = true;

  readonly #dateRangeSvc = inject(SkyDateRangeService);

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

    this.lastDonation = new FormControl({ value: '', disabled: this.disabled });

    this.formGroup = inject(FormBuilder).group({
      lastDonation: this.lastDonation,
    });
  }
}

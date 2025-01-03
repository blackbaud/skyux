import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
  SkyDateRangePickerModule,
  SkyDatepickerModule,
} from '@skyux/datetime';

function dateRangeExcludesWeekend(
  control: AbstractControl,
): ValidationErrors | null {
  const startDate = control.value.startDate;
  const endDate = control.value.endDate;

  const isWeekend = (value: unknown): boolean => {
    return (
      value instanceof Date && (value.getDay() === 6 || value.getDay() === 0)
    );
  };

  if (isWeekend(startDate) || isWeekend(endDate)) {
    return { dateWeekend: true };
  }

  return null;
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  // NOTE: `SkyDatepickerModule` is imported to address a stackblitz error.
  // Consumers DO NOT need to import `SkyDatepickerModule` when using `sky-date-ranger-picker`
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyDateRangePickerModule,
    SkyDatepickerModule,
  ],
})
export class DemoComponent {
  protected dateFormat: string | undefined;
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
    {
      nonNullable: true,
      validators: [dateRangeExcludesWeekend],
    },
  );

  protected formGroup = inject(FormBuilder).group({
    lastDonation: this.lastDonation,
  });
}

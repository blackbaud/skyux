import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { SkyDateRangePickerModule } from '@skyux/datetime';

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
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyDateRangePickerModule],
})
export class DemoComponent {
  protected get reactiveRange(): AbstractControl | null {
    return this.formGroup.get('lastDonation');
  }

  protected dateFormat: string | undefined;
  protected disabled = false;
  protected formGroup: FormGroup;
  protected hintText =
    'Donations received today are updated at the top of each hour.';
  protected labelText = 'Last donation';
  protected lastDonation: FormControl<string | null>;
  protected required = true;

  constructor() {
    this.lastDonation = new FormControl<string | null>(
      { value: '', disabled: this.disabled },
      [dateRangeExcludesWeekend],
    );
    this.formGroup = inject(FormBuilder).group({
      lastDonation: this.lastDonation,
    });
  }
}

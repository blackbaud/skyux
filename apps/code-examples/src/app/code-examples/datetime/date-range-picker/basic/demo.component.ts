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

import { isDate } from 'moment';

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
    this.lastDonation = new FormControl('', {
      validators: [
        (control): ValidationErrors | null => {
          const startDate = control.value.startDate;
          if (isDate(startDate)) {
            return startDate.getDay() === 6 || startDate.getDay() === 0
              ? { startDateWeekend: true }
              : null;
          }
          return null;
        },
        (control): ValidationErrors | null => {
          const endDate = control.value.endDate;
          if (isDate(endDate)) {
            return endDate.getDay() === 6 || endDate.getDay() === 0
              ? { endDateWeekend: true }
              : null;
          }
          return null;
        },
      ],
    });
    if (this.disabled) {
      this.lastDonation.disable();
    }
    this.formGroup = inject(FormBuilder).group({
      lastDonation: this.lastDonation,
    });
  }
}

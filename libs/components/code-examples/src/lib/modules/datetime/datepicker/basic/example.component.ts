import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

interface DemoForm {
  startDate: FormControl<Date | null | string>;
}

function validateDate(
  control: AbstractControl<Date | null | string>,
): ValidationErrors | null {
  const date = control.value;
  if (date instanceof Date) {
    const day = date?.getDay();

    return day !== undefined && (day === 0 || day === 6)
      ? {
          invalidWeekend: true,
        }
      : null;
  }
  return null;
}

/**
 * @title Datepicker with basic setup
 */
@Component({
  selector: 'app-datetime-datepicker-basic-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
  ],
})
export class DatetimeDatepickerBasicExampleComponent {
  protected formGroup: FormGroup<DemoForm>;
  protected startDate: FormControl<Date | null | string>;
  protected hintText = 'Must be before your 1 year anniversary.';

  public helpPopoverContent =
    'If you need help with registration, choose a date at least 8 business days after you arrive. The process takes up to 7 business days from the start date.';

  constructor() {
    this.startDate = new FormControl<Date | null | string>(
      new Date('10/12/2001'),
      {
        validators: [Validators.required, validateDate],
      },
    );

    this.formGroup = inject(FormBuilder).group<DemoForm>({
      startDate: this.startDate,
    });
  }
}

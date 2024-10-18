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
  startDate: FormControl<Date | null>;
}

function validateDate(
  control: AbstractControl<Date | null>,
): ValidationErrors | null {
  const date = control.value;
  const day = date?.getDay();

  return day !== undefined && (day === 0 || day === 6)
    ? {
        invalidWeekend: true,
      }
    : null;
}

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
  ],
})
export class DemoComponent {
  protected formGroup: FormGroup<DemoForm>;
  protected startDate: FormControl<Date | null>;
  protected hintText = 'Must be before your 1 year anniversary.';

  public helpPopoverContent =
    'If you need help with registration, choose a date at least 8 business days after you arrive. The process takes up to 7 business days from the start date.';

  constructor() {
    this.startDate = new FormControl<Date | null>(new Date('10/12/2001'), {
      validators: [Validators.required, validateDate],
    });

    this.formGroup = inject(FormBuilder).group<DemoForm>({
      startDate: this.startDate,
    });
  }
}

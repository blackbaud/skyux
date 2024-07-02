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
  protected formGroup: FormGroup;

  protected helpPopoverContent =
    'If you need help with registration, choose a date at least 8 business days after you arrive. The process takes up to 7 business days from the start date.';

  protected hintText = 'Must be before your 1 year anniversary.';

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      startDate: new FormControl<Date | null>(null, {
        validators: [Validators.required, validateDate],
      }),
    });
  }
}

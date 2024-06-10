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
  protected startDate: FormControl;
  protected helpPopoverContent =
    'If you need help with registration, choose a date at least 8 business days after you arrive. The process takes up to 7 business days from the start date.';
  protected hintText = 'Must be before your 1 year anniversary.';

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.startDate = this.#formBuilder.control(undefined, {
      validators: [Validators.required, this.#validateDate],
    });
    this.formGroup = inject(FormBuilder).group({
      startDate: this.startDate,
    });
  }

  #validateDate(control: AbstractControl): ValidationErrors | null {
    const date: Date = control.value;
    const day = date?.getDay();
    if (day !== undefined && (day === 0 || day === 6)) {
      return {
        invalidWeekend: true,
      };
    }
    return null;
  }
}

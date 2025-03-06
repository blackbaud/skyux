import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

/**
 * @title Fuzzy datepicker
 */
@Component({
  selector: 'app-datetime-datepicker-fuzzy-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
  ],
})
export class DatetimeDatepickerFuzzyExampleComponent {
  protected formGroup: FormGroup;
  protected hintText =
    "Include a partial date if you don't have the exact date.";
  public helpPopoverContent =
    'Your date of birth ensures that your benefits include the supplemental at-home services for your age group.';

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      dob: new FormControl(new Date(1955, 10, 5), {
        validators: Validators.required,
      }),
    });
  }

  protected get getFuzzyDateForDisplay(): string {
    return JSON.stringify(this.formGroup.get('dob')?.value);
  }
}

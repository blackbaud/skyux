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
import { SkyTimepickerModule, SkyTimepickerTimeOutput } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

interface DemoForm {
  time: FormControl<SkyTimepickerTimeOutput | string>;
}

function isTimepickerOutput(value: unknown): value is SkyTimepickerTimeOutput {
  return !!(value && typeof value === 'object' && 'minute' in value);
}

function validateTime(
  control: AbstractControl<SkyTimepickerTimeOutput | string>,
): ValidationErrors | null {
  const minute = isTimepickerOutput(control.value)
    ? control.value.minute
    : undefined;

  return minute && minute % 15 !== 0 ? { invalidMinute: true } : null;
}

/**
 * @title Timepicker with basic setup
 */
@Component({
  selector: 'app-datetime-timepicker-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyTimepickerModule,
  ],
})
export class DatetimeTimepickerBasicExampleComponent {
  protected formGroup: FormGroup<DemoForm>;
  protected time: FormControl<SkyTimepickerTimeOutput | string>;

  protected hintText = 'Choose a time that allows for late arrivals.';

  public helpPopoverContent =
    'Allow time to complete all activities that your team signed up for. All activities take about 30 minutes, except the ropes course, which takes 60 minutes.';

  constructor() {
    this.time = new FormControl('2:45', {
      nonNullable: true,
      validators: [Validators.required, validateTime],
    });

    this.formGroup = inject(FormBuilder).group<DemoForm>({ time: this.time });
  }
}

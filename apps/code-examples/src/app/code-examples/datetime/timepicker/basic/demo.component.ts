import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyTimepickerModule,
  ],
})
export class DemoComponent {
  protected formGroup: FormGroup;
  protected time: FormControl;
  protected hintText = 'Choose a time that allows for late arrivals.';
  protected helpPopoverContent =
    'Allow time to complete all activities that your team signed up for. All activities take about 30 minutes, except the ropes course, which takes 60 minutes.';

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.time = this.#formBuilder.control('2:45', {
      validators: [Validators.required, this.#validateTime],
    });
    this.formGroup = this.#formBuilder.group({
      time: this.time,
    });
  }

  #validateTime(control: AbstractControl): ValidationErrors | null {
    const minute = control.value?.minute;
    if (minute && minute % 15 !== 0) {
      return { invalidMinute: true };
    }
    return null;
  }
}

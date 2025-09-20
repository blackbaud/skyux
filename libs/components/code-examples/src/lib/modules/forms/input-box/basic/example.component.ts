import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyValidators } from '@skyux/validation';

function validateColor(control: AbstractControl): ValidationErrors | null {
  if (control.value === 'invalid') {
    return { invalid: true };
  }

  return null;
}

/**
 * @title Input box
 */
@Component({
  selector: 'app-forms-input-box-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
})
export class FormsInputBoxBasicExampleComponent {
  protected favoriteColor = new FormControl('none', {
    validators: [validateColor],
  });

  protected formGroup = inject(FormBuilder).group({
    firstName: new FormControl(''),
    lastName: new FormControl('', Validators.required),
    bio: new FormControl(''),
    email: new FormControl('', [Validators.required, SkyValidators.email]),
    dob: new FormControl('', Validators.required),
    favoriteColor: this.favoriteColor,
  });
}

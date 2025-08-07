import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

function validateColor(control: AbstractControl): ValidationErrors | null {
  if (control.value === 'invalid') {
    return { invalid: true };
  }

  return null;
}

/**
 * @title Input box with custom errors
 */
@Component({
  selector: 'app-forms-input-box-basic-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyInputBoxModule],
})
export class FormsInputBoxWithCustomFormErrorsExampleComponent {
  protected favoriteColor = new FormControl('none', {
    validators: [validateColor],
  });

  protected formGroup = inject(FormBuilder).group({
    favoriteColor: this.favoriteColor,
  });
}

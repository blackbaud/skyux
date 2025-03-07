import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyValidators } from '@skyux/validation';

/**
 * @title Email validation on reactive form controls
 */
@Component({
  selector: 'app-validation-email-validation-control-validator-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyInputBoxModule],
})
export class ValidationEmailValidationControlValidatorExampleComponent {
  protected get emailControl(): AbstractControl | null {
    return this.formGroup.get('email');
  }

  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      email: new FormControl(undefined, [
        Validators.required,
        SkyValidators.email,
      ]),
    });
  }
}

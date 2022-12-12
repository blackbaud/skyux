import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-email-validation-demo',
  templateUrl: './email-validation-demo.component.html',
})
export class EmailValidationDemoComponent {
  public get emailControl(): AbstractControl | null {
    return this.formGroup.get('email');
  }

  public formGroup: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      email: new UntypedFormControl(undefined, [
        Validators.required,
        SkyValidators.email,
      ]),
    });
  }
}

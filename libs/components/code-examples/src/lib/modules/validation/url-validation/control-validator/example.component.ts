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
 * @title URL validation on reactive form controls
 */
@Component({
  selector: 'app-validation-url-validation-control-validator-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyInputBoxModule],
})
export class ValidationUrlValidationControlValidatorExampleComponent {
  protected get urlControl(): AbstractControl | null {
    return this.formGroup.get('url');
  }

  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      url: new FormControl(undefined, [
        Validators.required,
        SkyValidators.url({
          rulesetVersion: 2,
        }),
      ]),
    });
  }
}

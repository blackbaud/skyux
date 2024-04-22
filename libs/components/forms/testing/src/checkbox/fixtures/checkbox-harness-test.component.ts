import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'test-checkbox-harness',
  templateUrl: './checkbox-harness-test.component.html',
})
export class CheckboxHarnessTestComponent {
  public myForm: UntypedFormGroup;
  public hideEmailLabel = false;
  public mailControl: UntypedFormControl;
  public hidePhoneLabel = false;
  public hideGroupLabel = false;
  public phoneHintText: string | undefined;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;

    this.mailControl = new UntypedFormControl(false, [
      (control: AbstractControl): ValidationErrors | null => {
        if (control.value) {
          return { requiredFalse: true };
        }

        return null;
      },
    ]);

    this.myForm = this.#formBuilder.group({
      email: new UntypedFormControl(false),
      phone: new UntypedFormControl(false),
      mail: this.mailControl,
    });

    this.myForm.setValidators(
      (control: AbstractControl): ValidationErrors | null => {
        const group = control as UntypedFormGroup;
        const email = group.controls['email'];
        const phone = group.controls['phone'];
        const mail = group.controls['mail'];

        if (!email.value && !phone.value && !mail.value) {
          return { contactMethodRequired: true };
        } else {
          return null;
        }
      },
    );
  }

  public disableForm(): void {
    this.myForm.disable();
  }
}

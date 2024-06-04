import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyCheckboxGroupHeadingLevel,
  SkyCheckboxGroupHeadingStyle,
} from '@skyux/forms';

@Component({
  selector: 'test-checkbox-harness',
  templateUrl: './checkbox-harness-test.component.html',
})
export class CheckboxHarnessTestComponent {
  public class = '';
  public headingLevel: SkyCheckboxGroupHeadingLevel | undefined = 3;
  public headingStyle: SkyCheckboxGroupHeadingStyle = 3;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hideEmailLabel = false;
  public hideGroupHeading = false;
  public hidePhoneLabel = false;
  public hintText: string | undefined;
  public phoneHintText: string | undefined;
  public mailControl: UntypedFormControl;
  public myForm: UntypedFormGroup;
  public stacked = false;

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

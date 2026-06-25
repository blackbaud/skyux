import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyCheckboxGroupHeadingLevel,
  SkyCheckboxGroupHeadingStyle,
  SkyCheckboxModule,
} from '@skyux/forms';

@Component({
  selector: 'test-checkbox-harness',
  templateUrl: './checkbox-harness-test.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyCheckboxModule],
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
  public myCheckboxGroup: UntypedFormGroup;
  public myForm: UntypedFormGroup;
  public required = false;
  public stacked = false;

  #formBuilder = inject(UntypedFormBuilder);

  constructor() {
    this.mailControl = new UntypedFormControl(false, [
      (control: AbstractControl): ValidationErrors | null => {
        if (control.value) {
          return { requiredFalse: true };
        }

        return null;
      },
    ]);

    this.myCheckboxGroup = this.#formBuilder.group({
      email: new UntypedFormControl(false),
      phone: new UntypedFormControl(false),
      mail: this.mailControl,
    });

    this.myForm = this.#formBuilder.group({
      group: this.myCheckboxGroup,
      stacked: new UntypedFormControl(false),
    });

    this.myForm.setValidators(
      (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control as UntypedFormGroup;
        const group = formGroup.controls['group'] as UntypedFormGroup;
        const email = group.controls['email'];
        const phone = group.controls['phone'];
        const mail = group.controls['mail'];

        if (email.value && !phone.value && !mail.value) {
          return { emailOnly: true };
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

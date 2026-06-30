import { Component, inject, model } from '@angular/core';
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
  public class = model('');
  public headingLevel = model<SkyCheckboxGroupHeadingLevel | undefined>(3);
  public headingStyle = model<SkyCheckboxGroupHeadingStyle>(3);
  public helpKey = model<string | undefined>(undefined);
  public helpPopoverContent = model<string | undefined>(undefined);
  public helpPopoverTitle = model<string | undefined>(undefined);
  public hideEmailLabel = model(false);
  public hideGroupHeading = model(false);
  public hidePhoneLabel = model(false);
  public hintText = model<string | undefined>(undefined);
  public phoneHintText = model<string | undefined>(undefined);
  public mailControl: UntypedFormControl;
  public myCheckboxGroup: UntypedFormGroup;
  public myForm: UntypedFormGroup;
  public required = model(false);
  public stacked = model(false);

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

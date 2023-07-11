import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
})
export class PhoneFieldComponent {
  public phoneControl: UntypedFormControl;
  public phoneControlError: UntypedFormControl;
  public phoneControlInput: UntypedFormControl;

  public phoneForm: UntypedFormGroup;
  public phoneFormError: UntypedFormGroup;
  public phoneFormInput: UntypedFormGroup;

  constructor() {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });

    this.phoneControlError = new UntypedFormControl();
    this.phoneFormError = new UntypedFormGroup({
      phoneControlError: this.phoneControlError,
    });
    this.phoneControlError.setValue('bbb');

    this.phoneControlInput = new UntypedFormControl();
    this.phoneFormInput = new UntypedFormGroup({
      phoneControlInput: this.phoneControlInput,
    });
    this.phoneControlInput.setValue('2015550123');
  }
}

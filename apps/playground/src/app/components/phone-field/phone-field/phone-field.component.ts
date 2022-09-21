import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
})
export class PhoneFieldComponent implements OnInit {
  public phoneNumber: string;

  public phoneNumberInputBox: string;

  public phoneForm: UntypedFormGroup;

  public phoneControl: UntypedFormControl;

  public ngOnInit() {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });
  }
}

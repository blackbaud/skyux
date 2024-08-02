import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
})
export class PhoneFieldComponent implements OnInit {
  public phoneNumber: string;

  public phoneNumberInputBox: string;

  public phoneNumberInputBoxEasy = '2 9250 7111';

  public phoneForm: UntypedFormGroup;

  public phoneControl: UntypedFormControl;

  public country = { iso2: 'us' };

  public ngOnInit(): void {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });
  }

  public setCountry(): void {
    this.country = { iso2: 'au' };
  }
}

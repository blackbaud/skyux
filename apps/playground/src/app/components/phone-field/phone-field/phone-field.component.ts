import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  standalone: false,
})
export class PhoneFieldComponent implements OnInit {
  public phoneNumber: string;

  public phoneNumberInputBox: string;

  public phoneForm: UntypedFormGroup;

  public phoneControl: UntypedFormControl;

  public selectedCountry = {
    iso2: 'US',
  };

  public ngOnInit(): void {
    this.phoneControl = new UntypedFormControl('733 05 92 50');
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });
    this.phoneControl.valueChanges.subscribe((change) => console.log(change));
  }

  public switchToAustralia(): void {
    this.selectedCountry = {
      iso2: 'au',
    };
  }
}

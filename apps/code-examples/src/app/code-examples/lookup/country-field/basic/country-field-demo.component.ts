import { Component } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-country-field-demo',
  templateUrl: './country-field-demo.component.html',
})
export class CountryFieldDemoComponent {
  public countryControl: UntypedFormControl;

  public countryForm: UntypedFormGroup;

  constructor() {
    this.countryControl = new UntypedFormControl();
    this.countryControl.setValue({
      name: 'Australia',
      iso2: 'au',
    });
    this.countryForm = new UntypedFormGroup({
      countryControl: this.countryControl,
    });

    this.countryControl.setValidators([Validators.required]);
  }
}

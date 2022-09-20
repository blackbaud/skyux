import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SkyCountryFieldCountry } from '@skyux/lookup';

@Component({
  selector: 'app-country-field-demo',
  templateUrl: './country-field-demo.component.html',
})
export class CountryFieldDemoComponent implements OnInit {
  public countryControl: UntypedFormControl;

  public countryData: SkyCountryFieldCountry;

  public countryForm: UntypedFormGroup;

  public ngOnInit(): void {
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

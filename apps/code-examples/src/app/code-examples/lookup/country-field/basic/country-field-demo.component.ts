import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SkyCountryFieldCountry } from 'projects/lookup/src/public-api';

@Component({
  selector: 'app-country-field-demo',
  templateUrl: './country-field-demo.component.html',
})
export class CountryFieldDemoComponent implements OnInit {
  public countryControl: FormControl;

  public countryData: SkyCountryFieldCountry;

  public countryForm: FormGroup;

  constructor() {}

  public ngOnInit(): void {
    this.countryControl = new FormControl();
    this.countryControl.setValue({
      name: 'Australia',
      iso2: 'au',
    });
    this.countryForm = new FormGroup({
      countryControl: this.countryControl,
    });

    this.countryControl.setValidators([Validators.required]);
  }
}

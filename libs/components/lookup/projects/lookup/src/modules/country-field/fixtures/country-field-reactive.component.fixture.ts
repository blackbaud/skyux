import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SkyCountryFieldComponent } from '../country-field.component';

import { SkyCountryFieldCountry } from '../types/country';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './country-field-reactive.component.fixture.html',
})
export class CountryFieldReactiveTestComponent implements OnInit {
  @ViewChild(SkyCountryFieldComponent, {
    static: true,
  })
  public countryFieldComponent: SkyCountryFieldComponent;

  public countryForm: FormGroup;

  public countryControl: FormControl;

  public initialValue: SkyCountryFieldCountry;

  public initiallizeToUndefined: boolean = false;

  public supportedCountryISOs: string[];

  public set isDisabled(value: boolean) {
    this._isDisabled = value;

    if (this._isDisabled) {
      this.countryControl.disable();
    } else {
      this.countryControl.enable();
    }
  }

  public get isDisabled(): boolean {
    return this._isDisabled;
  }

  public set isRequired(value: boolean) {
    this._isRequired = value;

    if (this._isRequired) {
      this.countryControl.setValidators([Validators.required]);
    } else {
      this.countryControl.setValidators([]);
    }
  }

  public get isRequired(): boolean {
    return this._isRequired;
  }

  public defaultCountry: string;

  private _isDisabled: boolean = false;

  private _isRequired: boolean = false;

  public ngOnInit(): void {
    this.countryControl = new FormControl();

    if (this.initialValue || this.initiallizeToUndefined) {
      this.countryControl.setValue(this.initialValue);
    }

    this.countryForm = new FormGroup({
      countryControl: this.countryControl,
    });

    this.countryControl.valueChanges.subscribe((value) =>
      this.formValueChanged(value)
    );
  }

  public countryChanged(country: SkyCountryFieldCountry): void {
    return;
  }

  public formValueChanged(country: SkyCountryFieldCountry): void {
    return;
  }

  public setValue(country: SkyCountryFieldCountry): void {
    this.countryControl.setValue(country);
  }
}

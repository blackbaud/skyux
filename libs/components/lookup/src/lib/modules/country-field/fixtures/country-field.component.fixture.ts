import { Component, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

import { SkyCountryFieldComponent } from '../country-field.component';
import { SkyCountryFieldCountry } from '../types/country';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './country-field.component.fixture.html',
  standalone: false,
})
export class CountryFieldTestComponent {
  public autocompleteAttribute: string | undefined;

  @ViewChild(SkyCountryFieldComponent, {
    static: true,
  })
  public countryFieldComponent!: SkyCountryFieldComponent;

  @ViewChild(NgModel)
  public ngModel!: NgModel;

  public defaultCountry: string | undefined;

  public isDisabled = false;

  public isRequired = false;

  public modelValue: SkyCountryFieldCountry | undefined;

  public supportedCountryISOs: string[] | undefined;

  public countryChanged(country: SkyCountryFieldCountry): void {
    return;
  }

  public focusLeftCountryField(e: FocusEvent): void {
    return;
  }
}

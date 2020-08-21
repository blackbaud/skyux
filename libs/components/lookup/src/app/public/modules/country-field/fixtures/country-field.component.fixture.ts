import {
  Component,
  ViewChild
} from '@angular/core';

import {
  NgModel
} from '@angular/forms';

import {
  SkyCountryFieldComponent
} from '../country-field.component';

import {
  SkyCountryFieldCountry
} from '../types/country';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './country-field.component.fixture.html'
})
export class CountryFieldTestComponent {

  public autocompleteAttribute: string;

  @ViewChild(SkyCountryFieldComponent, {
    static: true
  })
  public countryFieldComponent: SkyCountryFieldComponent;

  @ViewChild(NgModel)
  public ngModel: NgModel;

  public defaultCountry: string;

  public isDisabled: boolean = false;

  public isRequired: boolean = false;

  public modelValue: SkyCountryFieldCountry;

  public supportedCountryISOs: string[];

  public countryChanged(country: SkyCountryFieldCountry): void {
    return;
  }

}

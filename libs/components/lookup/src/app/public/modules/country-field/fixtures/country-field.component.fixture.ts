import {
  Component,
  ViewChild
} from '@angular/core';

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

  @ViewChild(SkyCountryFieldComponent)
  public countryFieldComponent: SkyCountryFieldComponent;

  public defaultCountry: string;

  public isDisabled: boolean = false;

  public isRequired: boolean = false;

  public modelValue: SkyCountryFieldCountry;

}

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
  templateUrl: './country-field-no-form.component.fixture.html'
})
export class CountryFieldNoFormTestComponent {

  @ViewChild(SkyCountryFieldComponent)
  public countryFieldComponent: SkyCountryFieldComponent;

  public defaultCountry: string;

  public isDisabled: boolean = false;

  public isRequired: boolean = false;

  public countryChanged(country: SkyCountryFieldCountry): void {
    return;
  }

}

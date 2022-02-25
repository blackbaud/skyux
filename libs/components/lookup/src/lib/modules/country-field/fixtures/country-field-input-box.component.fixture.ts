import { Component } from '@angular/core';

import { SkyCountryFieldCountry } from '../types/country';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './country-field-input-box.component.fixture.html',
})
export class CountryFieldInputBoxTestComponent {
  public modelValue: SkyCountryFieldCountry;
}

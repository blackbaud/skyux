import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyCountryFieldModule } from '../country-field.module';
import { SkyCountryFieldCountry } from '../types/country';

@Component({
  selector: 'sky-test-cmp',
  imports: [FormsModule, SkyCountryFieldModule, SkyInputBoxModule],
  templateUrl: './country-field-input-box.component.fixture.html',
})
export class CountryFieldInputBoxTestComponent {
  public hintText: string | undefined;
  public modelValue: SkyCountryFieldCountry | undefined;

  public countryChanged(country: SkyCountryFieldCountry): void {
    return;
  }
}

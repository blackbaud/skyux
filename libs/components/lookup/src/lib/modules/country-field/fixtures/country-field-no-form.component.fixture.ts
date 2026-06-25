import { Component, ViewChild } from '@angular/core';

import { SkyCountryFieldComponent } from '../country-field.component';
import { SkyCountryFieldCountry } from '../types/country';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './country-field-no-form.component.fixture.html',
  standalone: false,
})
export class CountryFieldNoFormTestComponent {
  @ViewChild(SkyCountryFieldComponent, {
    static: true,
  })
  public countryFieldComponent!: SkyCountryFieldComponent;

  public defaultCountry: string | undefined;

  public isDisabled = false;

  public isRequired = false;

  public supportedCountryISOs: string[] = [];

  public countryChanged(country: SkyCountryFieldCountry): void {
    return;
  }
}

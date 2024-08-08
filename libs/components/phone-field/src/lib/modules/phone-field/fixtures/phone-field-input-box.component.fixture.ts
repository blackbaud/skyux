import { Component } from '@angular/core';

import { SkyPhoneFieldCountry } from '../types/country';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field-input-box.component.fixture.html',
})
export class PhoneFieldInputBoxTestComponent {
  public hintText: string | undefined;
  public modelValue: string | undefined;
  public selectedCountry: SkyPhoneFieldCountry | undefined;
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyPhoneFieldModule } from '../phone-field.module';
import { SkyPhoneFieldCountry } from '../types/country';

@Component({
  imports: [FormsModule, SkyInputBoxModule, SkyPhoneFieldModule],
  selector: 'sky-test-cmp',
  templateUrl: './phone-field-input-box.component.fixture.html',
})
export class PhoneFieldInputBoxTestComponent {
  public hintText: string | undefined;
  public modelValue: string | undefined;
  public selectedCountry: SkyPhoneFieldCountry | undefined;
}

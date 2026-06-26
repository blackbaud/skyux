import { Component, ViewChild, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyPhoneFieldInputDirective } from '../phone-field-input.directive';
import { SkyPhoneFieldComponent } from '../phone-field.component';
import { SkyPhoneFieldModule } from '../phone-field.module';
import { SkyPhoneFieldCountry } from '../types/country';
import { SkyPhoneFieldNumberReturnFormat } from '../types/number-return-format';

@Component({
  imports: [FormsModule, SkyPhoneFieldModule],
  selector: 'sky-test-cmp',
  templateUrl: './phone-field.component.fixture.html',
})
export class PhoneFieldTestComponent {
  public allowExtensions = input<boolean>(true);

  public defaultCountry = input<string | undefined>(undefined);

  public isDisabled = false;

  public modelValue = model<string | undefined>(undefined);

  public noValidate = false;

  public returnFormat: SkyPhoneFieldNumberReturnFormat | undefined;

  public selectedCountry = model<SkyPhoneFieldCountry | undefined>(undefined);

  public showInvalidDirective = false;

  public supportedCountryISOs: string[] | undefined;

  @ViewChild(SkyPhoneFieldInputDirective, {
    read: SkyPhoneFieldInputDirective,
    static: false,
  })
  public inputDirective: SkyPhoneFieldInputDirective | undefined;

  @ViewChild(SkyPhoneFieldComponent, {
    read: SkyPhoneFieldComponent,
    static: false,
  })
  public phoneFieldComponent: SkyPhoneFieldComponent | undefined;
}

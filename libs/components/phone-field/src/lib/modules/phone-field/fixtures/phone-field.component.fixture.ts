import { Component, ViewChild } from '@angular/core';

import { SkyPhoneFieldInputDirective } from '../phone-field-input.directive';
import { SkyPhoneFieldComponent } from '../phone-field.component';
import { SkyPhoneFieldCountry } from '../types/country';
import { SkyPhoneFieldNumberReturnFormat } from '../types/number-return-format';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field.component.fixture.html',
})
export class PhoneFieldTestComponent {
  public allowExtensions = true;

  public defaultCountry: string;

  public isDisabled = false;

  public modelValue: string;

  public noValidate = false;

  public returnFormat: SkyPhoneFieldNumberReturnFormat;

  public selectedCountry: SkyPhoneFieldCountry;

  public showInvalidDirective = false;

  public supportedCountryISOs: string[];

  @ViewChild(SkyPhoneFieldInputDirective, {
    read: SkyPhoneFieldInputDirective,
    static: false,
  })
  public inputDirective: SkyPhoneFieldInputDirective;

  @ViewChild(SkyPhoneFieldComponent, {
    read: SkyPhoneFieldComponent,
    static: false,
  })
  public phoneFieldComponent: SkyPhoneFieldComponent;
}

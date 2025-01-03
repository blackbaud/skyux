import { Component, ViewChild } from '@angular/core';

import { SkyPhoneFieldInputDirective } from '../phone-field-input.directive';
import { SkyPhoneFieldComponent } from '../phone-field.component';
import { SkyPhoneFieldCountry } from '../types/country';
import { SkyPhoneFieldNumberReturnFormat } from '../types/number-return-format';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field.component.fixture.html',
  standalone: false,
})
export class PhoneFieldTestComponent {
  public allowExtensions = true;

  public defaultCountry: string | undefined;

  public isDisabled = false;

  public modelValue: string | undefined;

  public noValidate = false;

  public returnFormat: SkyPhoneFieldNumberReturnFormat | undefined;

  public selectedCountry: SkyPhoneFieldCountry | undefined;

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

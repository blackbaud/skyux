import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyPhoneFieldComponent
} from '../phone-field.component';

import {
  SkyPhoneFieldInputDirective
} from '../phone-field-input.directive';

import {
  SkyPhoneFieldCountry
} from '../types/country';

import {
  SkyPhoneFieldNumberReturnFormat
} from '../types/number-return-format';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field.component.fixture.html'
})
export class PhoneFieldTestComponent {

  public allowExtensions: boolean = true;

  public defaultCountry: string;

  public isDisabled: boolean = false;

  public modelValue: string;

  public noValidate: boolean = false;

  public returnFormat: SkyPhoneFieldNumberReturnFormat;

  public selectedCountry: SkyPhoneFieldCountry;

  public showInvalidDirective: boolean = false;

  public supportedCountryISOs: string[];

  @ViewChild(SkyPhoneFieldInputDirective, {
    read: SkyPhoneFieldInputDirective,
    static: false
  })
  public inputDirective: SkyPhoneFieldInputDirective;

  @ViewChild(SkyPhoneFieldComponent, {
    read: SkyPhoneFieldComponent,
    static: false
  })
  public phoneFieldComponent: SkyPhoneFieldComponent;

}

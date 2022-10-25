import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { SkyPhoneFieldInputDirective } from '../phone-field-input.directive';
import { SkyPhoneFieldComponent } from '../phone-field.component';
import { SkyPhoneFieldCountry } from '../types/country';
import { SkyPhoneFieldNumberReturnFormat } from '../types/number-return-format';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field-reactive.component.fixture.html',
})
export class PhoneFieldReactiveTestComponent {
  public allowExtensions = true;

  public defaultCountry: string | undefined;

  public selectedCountry: SkyPhoneFieldCountry | undefined;

  public supportedCountryISOs: string[] | undefined;

  public initialValue: Date | string | undefined;

  public noValidate = false;

  public phoneControl: UntypedFormControl;

  public phoneForm: UntypedFormGroup;

  public returnFormat: SkyPhoneFieldNumberReturnFormat | undefined;

  public showInvalidDirective = false;

  public showPhoneField = true;

  public showSecondaryPhoneField = false;

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

  constructor() {
    this.phoneControl = new UntypedFormControl(this.initialValue);
    this.phoneForm = new UntypedFormGroup({
      phone: this.phoneControl,
    });
  }

  public setValue(value: string): void {
    this.phoneControl?.setValue(value);
  }
}

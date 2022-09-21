import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { SkyPhoneFieldInputDirective } from '../phone-field-input.directive';
import { SkyPhoneFieldComponent } from '../phone-field.component';
import { SkyPhoneFieldCountry } from '../types/country';
import { SkyPhoneFieldNumberReturnFormat } from '../types/number-return-format';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field-reactive.component.fixture.html',
})
export class PhoneFieldReactiveTestComponent implements OnInit {
  public allowExtensions = true;

  public defaultCountry: string;

  public selectedCountry: SkyPhoneFieldCountry;

  public supportedCountryISOs: string[];

  public initialValue: Date | string;

  public noValidate = false;

  public phoneControl: UntypedFormControl;

  public phoneForm: UntypedFormGroup;

  public returnFormat: SkyPhoneFieldNumberReturnFormat;

  public showInvalidDirective = false;

  public showPhoneField = true;

  public showSecondaryPhoneField = false;

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

  public ngOnInit(): void {
    this.phoneControl = new UntypedFormControl(this.initialValue);
    this.phoneForm = new UntypedFormGroup({
      phone: this.phoneControl,
    });
  }

  public setValue(value: string) {
    this.phoneControl.setValue(value);
  }
}

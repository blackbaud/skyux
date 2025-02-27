import { Component, Input, inject } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SKY_COUNTRY_FIELD_CONTEXT } from '@skyux/lookup';
import { FontLoadingService } from '@skyux/storybook/font-loading';

let countryFieldPhoneInfo = false;

@Component({
  selector: 'app-country-field',
  templateUrl: './country-field.component.html',
  styleUrls: ['./country-field.component.scss'],
  standalone: false,
  providers: [
    {
      provide: SKY_COUNTRY_FIELD_CONTEXT,
      useValue: { showPlaceholderText: countryFieldPhoneInfo },
    },
  ],
})
export class CountryFieldComponent {
  @Input()
  public set phoneInfoFlag(value: boolean) {
    countryFieldPhoneInfo = value;
  }

  @Input()
  public set prePopulatedFlag(value: boolean) {
    if (value) {
      this.countryControl.setValue({
        name: 'Australia',
        iso2: 'au',
      });
    }
  }

  @Input()
  public set disabledFlag(value: boolean) {
    this.#_disabledFlag = value;
    if (value) {
      this.countryForm.disable();
    } else {
      this.countryForm.enable();
    }
  }

  public get disabledFlag(): boolean {
    return this.#_disabledFlag;
  }

  #_disabledFlag = false;

  public countryControl: UntypedFormControl;

  public countryForm: UntypedFormGroup;

  public readonly ready$ = inject(FontLoadingService).ready();

  constructor() {
    this.countryControl = new UntypedFormControl();
    this.countryForm = new UntypedFormGroup({
      countryControl: this.countryControl,
    });

    this.countryControl.setValidators([Validators.required]);
  }
}

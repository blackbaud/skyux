import { Component, Input, inject } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FontLoadingService } from '@skyux/storybook/font-loading';

@Component({
  selector: 'app-country-field',
  templateUrl: './country-field.component.html',
  styleUrls: ['./country-field.component.scss'],
  standalone: false,
})
export class CountryFieldComponent {
  @Input()
  public phoneInfoFlag = false;

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
  public hideCountryFlag = false;

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

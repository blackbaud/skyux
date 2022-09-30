import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NgModel,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyAutonumericOptions } from '../autonumeric-options';
import { SkyAutonumericDirective } from '../autonumeric.directive';

@Component({
  selector: 'sky-autonumeric-directive-test',
  templateUrl: './autonumeric.component.fixture.html',
})
export class AutonumericFixtureComponent {
  @ViewChild(SkyAutonumericDirective)
  public autonumericDirective: SkyAutonumericDirective | undefined;

  @ViewChild('templateNgModel', { read: NgModel })
  public templateNgModel!: NgModel;

  public autonumericOptions: SkyAutonumericOptions | undefined;

  public formGroup: UntypedFormGroup;

  public formControl: AbstractControl;

  public templateDrivenDonationAmount: string | number = 1000;

  public required = false;

  public setUnformatted = false;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;

    this.formControl = new FormControl('donationAmount');

    this.formGroup = this.#formBuilder.group(this.formControl);
  }
}

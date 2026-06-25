import { Component, ViewChild, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
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
  standalone: false,
})
export class AutonumericFixtureComponent {
  @ViewChild(SkyAutonumericDirective)
  public autonumericDirective: SkyAutonumericDirective | undefined;

  @ViewChild('templateNgModel', { read: NgModel })
  public templateNgModel!: NgModel;

  public autonumericOptions: SkyAutonumericOptions | undefined;

  public formGroup: UntypedFormGroup;

  public formControl: AbstractControl;

  public templateDrivenDonationAmount = signal<string | number>(1000);

  public required = false;

  public setUnformatted = input<boolean | undefined>(false);

  readonly #formBuilder = inject(UntypedFormBuilder);

  constructor() {
    this.formControl = new UntypedFormControl();

    this.formGroup = this.#formBuilder.group({
      donationAmount: this.formControl,
    });
  }
}

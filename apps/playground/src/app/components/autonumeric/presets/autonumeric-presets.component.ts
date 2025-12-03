import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SkyAutonumericModule,
  SkyAutonumericOptions,
} from '@skyux/autonumeric';
import { SkyInputBoxModule } from '@skyux/forms';

/**
 * @title Predefined options
 */
@Component({
  selector: 'app-autonumeric-preset',
  templateUrl: './autonumeric-presets.component.html',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    SkyAutonumericModule,
    SkyInputBoxModule,
  ],
})
export class AutonumericPresetsComponent {
  protected autonumericOptions: SkyAutonumericOptions = 'Chinese';

  protected formGroup: FormGroup;
  protected donationAmount = new FormControl(1234.5678, [Validators.required]);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      donationAmount: this.donationAmount,
    });
  }
}

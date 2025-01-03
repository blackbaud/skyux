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
  SkyAutonumericOptionsProvider,
} from '@skyux/autonumeric';
import { SkyInputBoxModule } from '@skyux/forms';

import { DemoAutonumericOptionsProvider } from './options-provider';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  providers: [
    {
      provide: SkyAutonumericOptionsProvider,
      useClass: DemoAutonumericOptionsProvider,
    },
  ],
  imports: [ReactiveFormsModule, SkyAutonumericModule, SkyInputBoxModule],
})
export class DemoComponent {
  protected donationOptions: SkyAutonumericOptions = {};

  protected formGroup: FormGroup;

  protected pledgeOptions: SkyAutonumericOptions = {
    decimalPlaces: 0,
  };

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      donationAmount: new FormControl(1234.5678, [Validators.required]),
      pledgeAmount: new FormControl(2345.6789, [Validators.required]),
    });
  }
}

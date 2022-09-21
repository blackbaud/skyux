import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyAutonumericOptions } from '@skyux/autonumeric';
import { SkyAutonumericOptionsProvider } from '@skyux/autonumeric';

import { AutonumericDemoOptionsProvider } from './autonumeric-demo-options-provider';

@Component({
  selector: 'app-autonumeric-demo',
  templateUrl: './autonumeric-demo.component.html',
  providers: [
    {
      provide: SkyAutonumericOptionsProvider,
      useClass: AutonumericDemoOptionsProvider,
    },
  ],
})
export class AutonumericDemoComponent implements OnInit {
  public donationOptions: SkyAutonumericOptions = {};

  public formGroup: UntypedFormGroup;

  public pledgeOptions: SkyAutonumericOptions = {
    decimalPlaces: 0,
  };

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      donationAmount: new UntypedFormControl(1234.5678, [Validators.required]),
      pledgeAmount: new UntypedFormControl(2345.6789, [Validators.required]),
    });
  }
}

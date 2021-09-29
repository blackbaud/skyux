import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  SkyAutonumericOptions
} from 'projects/sky-autonumeric/src/public-api';

import {
  SkyAutonumericOptionsProvider
} from 'projects/sky-autonumeric/src/public-api';

import {
  AutonumericDemoOptionsProvider
} from './autonumeric-demo-options-provider';

@Component({
  selector: 'app-autonumeric-demo',
  templateUrl: './autonumeric-demo.component.html',
  providers: [
    {
      provide: SkyAutonumericOptionsProvider,
      useClass: AutonumericDemoOptionsProvider
    }
  ]
})
export class AutonumericDemoComponent implements OnInit {

  public donationOptions: SkyAutonumericOptions = {};

  public formGroup: FormGroup;

  public pledgeOptions: SkyAutonumericOptions = {
    decimalPlaces: 0
  };

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      donationAmount: new FormControl(1234.5678, [Validators.required]),
      pledgeAmount: new FormControl(2345.6789, [Validators.required])
    });
  }
}

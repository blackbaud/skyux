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

@Component({
  selector: 'app-autonumeric-demo',
  templateUrl: './autonumeric-demo.component.html'
})
export class AutonumericDemoComponent implements OnInit {

  public autonumericOptions: SkyAutonumericOptions;

  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      donationAmount: new FormControl(1234.5678, [Validators.required])
    });

    this.autonumericOptions = {
      decimalCharacter: ',',
      decimalPlaces: 4,
      digitGroupSeparator: ''
    };
  }
}

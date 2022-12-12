import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyAutonumericOptions } from '@skyux/autonumeric';

@Component({
  selector: 'app-autonumeric-demo',
  templateUrl: './autonumeric-demo.component.html',
})
export class AutonumericDemoComponent implements OnInit {
  public autonumericOptions: SkyAutonumericOptions | undefined;

  public formGroup: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      donationAmount: new UntypedFormControl(1234.5678, [Validators.required]),
    });
  }

  public ngOnInit(): void {
    this.autonumericOptions = {
      decimalCharacter: ',',
      decimalPlaces: 4,
      digitGroupSeparator: '',
    };
  }
}

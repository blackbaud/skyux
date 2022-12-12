import { Component } from '@angular/core';
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
export class AutonumericDemoComponent {
  public autonumericOptions: SkyAutonumericOptions = 'Chinese';

  public formGroup: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      donationAmount: new UntypedFormControl(1234.5678, [Validators.required]),
    });
  }
}

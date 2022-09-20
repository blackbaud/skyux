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
  public autonumericOptions: SkyAutonumericOptions;

  public formGroup: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      donationAmount: new UntypedFormControl(1234.5678, [Validators.required]),
    });

    this.autonumericOptions = {
      currencySymbol: ' €',
      currencySymbolPlacement: 's',
      decimalPlaces: 2,
      decimalCharacter: ',',
      digitGroupSeparator: '',
    };
  }
}

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
 * @title Currency
 */
@Component({
  selector: 'app-autonumeric-currency-example',
  templateUrl: './example.component.html',
  imports: [ReactiveFormsModule, SkyAutonumericModule, SkyInputBoxModule],
})
export class AutonumericCurrencyExampleComponent {
  protected autonumericOptions: SkyAutonumericOptions | undefined;

  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      donationAmount: new FormControl(1234.5678, [Validators.required]),
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

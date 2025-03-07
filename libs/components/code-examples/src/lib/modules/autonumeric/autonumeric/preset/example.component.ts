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
  selector: 'app-autonumeric-preset-example',
  templateUrl: './example.component.html',
  imports: [ReactiveFormsModule, SkyAutonumericModule, SkyInputBoxModule],
})
export class AutonumericPresetExampleComponent {
  protected autonumericOptions: SkyAutonumericOptions = 'Chinese';

  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      donationAmount: new FormControl(1234.5678, [Validators.required]),
    });
  }
}

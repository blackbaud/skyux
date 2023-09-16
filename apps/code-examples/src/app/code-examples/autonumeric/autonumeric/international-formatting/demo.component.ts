import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import {
  SkyAutonumericModule,
  SkyAutonumericOptions,
} from '@skyux/autonumeric';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [ReactiveFormsModule, SkyAutonumericModule, SkyInputBoxModule],
})
export class DemoComponent {
  protected autonumericOptions: SkyAutonumericOptions | undefined;

  protected formGroup: FormGroup;

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      donationAmount: new UntypedFormControl(1234.5678, [Validators.required]),
    });

    this.autonumericOptions = {
      decimalCharacter: ',',
      decimalPlaces: 4,
      digitGroupSeparator: '',
    };
  }
}

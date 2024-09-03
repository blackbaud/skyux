import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyCountryFieldCountry, SkyCountryFieldModule } from '@skyux/lookup';

interface DemoForm {
  country: FormControl<SkyCountryFieldCountry | undefined>;
}

function validateCountry(
  control: AbstractControl<SkyCountryFieldCountry | undefined>,
): ValidationErrors | null {
  return control.value?.name === 'Mexico' ? { invalidCountry: true } : null;
}

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
  ],
})
export class DemoComponent {
  protected countryControl: FormControl<SkyCountryFieldCountry | undefined>;
  protected countryForm: FormGroup<DemoForm>;

  protected helpPopoverContent =
    'We use the country to validate your passport within 10 business days. You can update it at any time.';

  constructor() {
    this.countryControl = new FormControl(
      {
        name: 'Australia',
        iso2: 'au',
      },
      {
        nonNullable: true,
        validators: [validateCountry, Validators.required],
      },
    );

    this.countryForm = new FormGroup({
      country: this.countryControl,
    });
  }
}

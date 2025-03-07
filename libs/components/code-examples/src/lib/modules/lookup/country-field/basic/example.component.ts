import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
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

/**
 * @title Country field with basic setup
 */
@Component({
  selector: 'app-lookup-country-field-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
  ],
})
export class LookupCountryFieldBasicExampleComponent {
  protected countryControl: FormControl<SkyCountryFieldCountry | undefined>;
  public countryForm: FormGroup<DemoForm>;

  protected helpPopoverContent =
    'We use the country to validate your passport within 10 business days. You can update it at any time.';

  #formBuilder = inject(FormBuilder);

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

    this.countryForm = this.#formBuilder.group({
      country: this.countryControl,
    });
  }
}

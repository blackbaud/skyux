import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyCountryFieldModule } from '@skyux/lookup';

@Component({
  selector: 'sky-country-field-fixture',
  templateUrl: './country-field-harness-test.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
  ],
})
export class CountryFieldHarnessTestComponent {
  public myForm: UntypedFormGroup;

  #formBuilder = inject(UntypedFormBuilder);

  constructor() {
    this.myForm = this.#formBuilder.group({
      countryControl: new UntypedFormControl(),
    });
  }

  public disableForm(): void {
    this.myForm.disable();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
  public selectedCountryChange(event: any): void {}
}

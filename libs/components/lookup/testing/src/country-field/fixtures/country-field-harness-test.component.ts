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
  standalone: true,
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
  public autocompleteAttribute: string | undefined;
  public hideSelectedCountryFlag: boolean | undefined;
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

  public selectedCountryChange(event: any): void {}
}

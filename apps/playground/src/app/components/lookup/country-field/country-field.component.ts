import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyCountryFieldModule } from '@skyux/lookup';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
  ],
  templateUrl: './country-field.component.html',
})
export default class CountryFieldDemoComponent {
  public countryForm = inject(FormBuilder).group({
    countryControl: [
      {
        name: 'Australia',
        iso2: 'au',
      },
      [Validators.required],
    ],
  });

  public countryControl = this.countryForm.controls['countryControl'];
}

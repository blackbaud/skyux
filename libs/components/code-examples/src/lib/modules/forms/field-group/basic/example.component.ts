import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyFieldGroupModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';

/**
 * @title Field group with basic setup
 */
@Component({
  selector: 'app-forms-field-group-basic-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyFieldGroupModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
  ],
})
export class FormsFieldGroupBasicExampleComponent {
  #formBuilder: FormBuilder = inject(FormBuilder);

  protected formGroup: FormGroup;
  protected helpPopoverContent =
    'We use your address to validate your application with regulatory agencies and to send correspondence related to your application.';

  protected states = [
    'AK',
    'AZ',
    'AL',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  constructor() {
    this.formGroup = this.#formBuilder.group({
      streetAddress: this.#formBuilder.control(undefined),
      city: this.#formBuilder.control(undefined),
      state: this.#formBuilder.control(undefined),
      zipCode: this.#formBuilder.control(undefined),
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyAutocompleteModule,
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionResponse,
} from '@skyux/lookup';

import { Ocean } from './ocean';

/**
 * @title Autocomplete with custom search
 */
@Component({
  selector: 'app-lookup-autocomplete-custom-search-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIconModule,
    SkyInputBoxModule,
  ],
})
export class LookupAutocompleteCustomSearchExampleComponent {
  protected formGroup: FormGroup;
  protected largestOcean: FormControl;

  protected oceans: Ocean[] = [
    { title: 'Arctic', id: 1 },
    { title: 'Atlantic', id: 2 },
    { title: 'Indian', id: 3 },
    { title: 'Pacific', id: 4 },
  ];

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.largestOcean = this.#formBuilder.control({ title: 'Arctic', id: 1 });
    this.formGroup = this.#formBuilder.group({
      largestOcean: this.largestOcean,
    });
  }

  protected getOceanSearchFunction(): SkyAutocompleteSearchFunction {
    const searchFunction = (
      searchText: string,
      oceans: Ocean[],
    ): SkyAutocompleteSearchFunctionResponse => {
      return new Promise((resolve) => {
        const searchTextLower = searchText.toLowerCase();

        const results = oceans.filter((ocean: Ocean) => {
          const val = ocean.title;
          return !!val?.toString().toLowerCase().includes(searchTextLower);
        });

        // Simulate an async request.
        setTimeout(() => {
          resolve(results);
        }, 500);
      });
    };

    return searchFunction;
  }
}

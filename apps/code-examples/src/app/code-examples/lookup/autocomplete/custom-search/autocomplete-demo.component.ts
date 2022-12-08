import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionResponse,
} from '@skyux/lookup';

import { Ocean } from './ocean';

@Component({
  selector: 'app-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
  public myForm: UntypedFormGroup;

  public largestOcean: UntypedFormControl;

  public oceans: Ocean[] = [
    { title: 'Arctic', id: 1 },
    { title: 'Atlantic', id: 2 },
    { title: 'Indian', id: 3 },
    { title: 'Pacific', id: 4 },
  ];

  constructor(private formBuilder: UntypedFormBuilder) {
    this.largestOcean = this.formBuilder.control({ title: 'Arctic', id: 1 });
    this.myForm = this.formBuilder.group({
      largestOcean: this.largestOcean,
    });
  }

  public getOceanSearchFunction(): SkyAutocompleteSearchFunction {
    const searchFunction = (
      searchText: string,
      oceans: Ocean[]
    ): SkyAutocompleteSearchFunctionResponse => {
      return new Promise((resolve) => {
        const searchTextLower = searchText.toLowerCase();

        const results = oceans.filter((ocean: Ocean) => {
          const val = ocean.title;
          const isMatch =
            val && val.toString().toLowerCase().indexOf(searchTextLower) > -1;
          return isMatch;
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

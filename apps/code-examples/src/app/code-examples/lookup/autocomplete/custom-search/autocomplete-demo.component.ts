import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionResponse,
} from '@skyux/lookup';

@Component({
  selector: 'app-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent implements OnInit {
  public myForm: UntypedFormGroup;

  public largestOcean: any;

  public oceans: any[] = [
    { title: 'Arctic', id: 1 },
    { title: 'Atlantic', id: 2 },
    { title: 'Indian', id: 3 },
    { title: 'Pacific', id: 4 },
  ];

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public getOceanSearchFunction(): SkyAutocompleteSearchFunction {
    const searchFunction = (
      searchText: string,
      oceans: any[]
    ): SkyAutocompleteSearchFunctionResponse => {
      return new Promise((resolve) => {
        const searchTextLower = searchText.toLowerCase();

        const results = oceans.filter((ocean: any) => {
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

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      largestOcean: { title: 'Arctic', id: 1 },
    });
  }
}

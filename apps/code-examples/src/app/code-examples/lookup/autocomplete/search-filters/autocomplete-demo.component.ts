import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SkyAutocompleteSearchFunctionFilter } from '@skyux/lookup';

@Component({
  selector: 'app-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
  public colors: { name: string }[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
  ];

  public myForm: UntypedFormGroup;

  public searchFilters: SkyAutocompleteSearchFunctionFilter[] = [
    (searchText: string, item: { name: string }): boolean => {
      return item.name !== 'Red';
    },
  ];

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      favoriteColor: undefined,
    });
  }
}
